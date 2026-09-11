from pydantic import BaseModel
from typing import Optional

class BuyerRequirementCreate(BaseModel):
    crop: str
    quantity_kg: float
    max_price_per_kg: float
    delivery_date: str
    delivery_location: str
    max_distance_km: float = 50.0
    quality_grade: str = "Grade A"

class BuyerRequirementOut(BuyerRequirementCreate):
    id: str
    buyer_id: str
    buyer_name: str
    status: str = "Open"
