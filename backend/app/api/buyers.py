from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.produce import Produce
from app.ai.matching.matcher import match_farmers_for_requirement
from app.schemas.buyer_requirement import BuyerRequirementCreate

router = APIRouter(prefix="/buyers", tags=["Buyers"])

@router.post("/match")
def match_requirement(req: BuyerRequirementCreate, db: Session = Depends(get_db)):
    produce_db = db.query(Produce).all()
    produce_list = [
        {
            "id": p.id,
            "farmer_id": p.farmer_id,
            "farmer_name": p.farmer_name,
            "crop": p.crop,
            "price_per_kg": p.price_per_kg,
            "quantity_kg": p.quantity_kg,
            "quality_grade": p.quality_grade,
            "location": p.location,
            "distance_km": 25.0
        }
        for p in produce_db
    ]

    # Fallback to demo items if DB empty
    if not produce_list:
        produce_list = [
            {"id": "prod-101", "farmer_id": "f-1", "farmer_name": "Ramesh Patel", "crop": req.crop, "price_per_kg": 31, "quantity_kg": 500, "quality_grade": "Grade A", "location": "Rajkot", "distance_km": 20},
            {"id": "prod-102", "farmer_id": "f-2", "farmer_name": "Kishore Vala", "crop": req.crop, "price_per_kg": 32, "quantity_kg": 300, "quality_grade": "Grade A", "location": "Lodhika", "distance_km": 28},
            {"id": "prod-103", "farmer_id": "f-3", "farmer_name": "Savita Devi", "crop": req.crop, "price_per_kg": 33, "quantity_kg": 400, "quality_grade": "Grade B", "location": "Gondal", "distance_km": 38},
        ]

    matches = match_farmers_for_requirement(req.dict(), produce_list)
    return {"matches": matches}
