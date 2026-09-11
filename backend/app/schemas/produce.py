from pydantic import BaseModel
from typing import Optional

class ProduceBase(BaseModel):
    crop: str
    variety: Optional[str] = None
    category: str = "Vegetable"
    quantity_kg: float
    quality_grade: str = "Grade A"
    price_per_kg: float
    available_date: str
    location: str
    organic: bool = False
    freshness_priority: str = "High"
    image_url: Optional[str] = None

class ProduceCreate(ProduceBase):
    pass

class ProduceOut(ProduceBase):
    id: str
    farmer_id: str
    farmer_name: str
    suggested_price_min: Optional[float] = None
    suggested_price_max: Optional[float] = None

    class Config:
        from_attributes = True
