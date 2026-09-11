from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.produce import Produce
from app.schemas.produce import ProduceOut, ProduceCreate
from app.ai.pricing.predict import predict_fair_price

router = APIRouter(prefix="/produce", tags=["Produce Marketplace"])

@router.get("/", response_model=List[ProduceOut])
def get_all_produce(
    crop: Optional[str] = None,
    category: Optional[str] = None,
    grade: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Produce)
    if crop:
        query = query.filter(Produce.crop.ilike(f"%{crop}%"))
    if category and category != "All":
        query = query.filter(Produce.category == category)
    if grade and grade != "All":
        query = query.filter(Produce.quality_grade == grade)
    return query.all()

@router.post("/", response_model=ProduceOut)
def create_produce(produce_in: ProduceCreate, farmer_id: str = "farmer-1", farmer_name: str = "Ramesh Patel", db: Session = Depends(get_db)):
    price_rec = predict_fair_price(produce_in.crop, produce_in.price_per_kg, produce_in.quality_grade, produce_in.organic)

    item = Produce(
        id=f"prod-{db.query(Produce).count() + 101}",
        farmer_id=farmer_id,
        farmer_name=farmer_name,
        crop=produce_in.crop,
        variety=produce_in.variety,
        category=produce_in.category,
        quantity_kg=produce_in.quantity_kg,
        quality_grade=produce_in.quality_grade,
        price_per_kg=produce_in.price_per_kg,
        suggested_price_min=price_rec["recommended_min"],
        suggested_price_max=price_rec["recommended_max"],
        available_date=produce_in.available_date,
        location=produce_in.location,
        organic=produce_in.organic,
        freshness_priority=produce_in.freshness_priority,
        image_url=produce_in.image_url
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.get("/price-recommendation")
def get_price_recommendation(crop: str = "Tomato", mandi_ref: float = 28.0, grade: str = "Grade A", organic: bool = False):
    return predict_fair_price(crop, mandi_ref, grade, organic)
