from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.produce import Produce
from app.models.order import Order
from app.ai.demand.predict import predict_demand
from app.ai.assistant.gemini_service import parse_farmer_intent

router = APIRouter(prefix="/farmers", tags=["Farmers"])

@router.get("/{farmer_id}/dashboard")
def get_farmer_dashboard(farmer_id: str, db: Session = Depends(get_db)):
    produce = db.query(Produce).filter(Produce.farmer_id == farmer_id).all()
    orders = db.query(Order).filter(Order.farmer_id == farmer_id).all()
    demand = predict_demand("Tomato", 1200.0, 190)

    return {
        "farmer_id": farmer_id,
        "active_produce_count": len(produce),
        "total_stock_kg": sum(p.quantity_kg for p in produce),
        "total_earnings": sum(o.total_price for o in orders),
        "active_orders_count": len([o for o in orders if o.status_step < 5]),
        "demand_forecast": demand
    }

@router.post("/assistant")
def voice_assistant(query: dict):
    text = query.get("transcript", "")
    return parse_farmer_intent(text)
