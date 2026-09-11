from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.order import Order
from app.models.produce import Produce
from app.schemas.order import OrderOut, OrderCreate

router = APIRouter(prefix="/orders", tags=["Orders"])

LIFECYCLE_STEPS = [
    "Order Placed",
    "Farmer/FPO Confirmed",
    "Produce Prepared",
    "Pickup",
    "In Transit",
    "Delivered",
    "Payment / Completion"
]

@router.get("/", response_model=List[OrderOut])
def get_orders(db: Session = Depends(get_db)):
    return db.query(Order).all()

@router.post("/", response_model=OrderOut)
def create_order(order_in: OrderCreate, buyer_id: str = "buyer-1", buyer_name: str = "GreenLeaf Grand Restaurant", db: Session = Depends(get_db)):
    produce = db.query(Produce).filter(Produce.id == order_in.produce_id).first()
    if not produce:
        raise HTTPException(status_code=404, detail="Produce item not found")

    total_price = order_in.quantity_kg * produce.price_per_kg

    order = Order(
        id=f"ORD-{db.query(Order).count() + 8825}",
        buyer_id=buyer_id,
        buyer_name=buyer_name,
        farmer_id=produce.farmer_id,
        farmer_name=produce.farmer_name,
        produce_id=produce.id,
        crop=produce.crop,
        quantity_kg=order_in.quantity_kg,
        price_per_kg=produce.price_per_kg,
        total_price=total_price,
        status="Order Placed",
        status_step=1,
        eta="Tomorrow Morning",
        pickup_location=produce.location,
        delivery_location=order_in.delivery_location,
        transit_progress=10,
        vehicle_id="GJ-03-BX-4921"
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    return order

@router.post("/{order_id}/advance", response_model=OrderOut)
def advance_order(order_id: str, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if order.status_step < len(LIFECYCLE_STEPS) - 1:
        order.status_step += 1
        order.status = LIFECYCLE_STEPS[order.status_step]
        order.transit_progress = min(100, int((order.status_step / 6) * 100))
        db.commit()
        db.refresh(order)

    return order
