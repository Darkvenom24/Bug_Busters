from pydantic import BaseModel
from typing import Optional

class OrderCreate(BaseModel):
    produce_id: str
    quantity_kg: float
    delivery_location: str

class OrderOut(BaseModel):
    id: str
    buyer_id: str
    buyer_name: str
    farmer_id: str
    farmer_name: str
    produce_id: str
    crop: str
    quantity_kg: float
    price_per_kg: float
    total_price: float
    status: str
    status_step: int
    eta: Optional[str] = None
    pickup_location: str
    delivery_location: str
    transit_progress: int

    class Config:
        from_attributes = True
