from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, ForeignKey
from datetime import datetime
from app.core.database import Base

class Produce(Base):
    __tablename__ = "produce"

    id = Column(String(50), primary_key=True, index=True)
    farmer_id = Column(String(50), ForeignKey("users.id"), index=True)
    farmer_name = Column(String(100), nullable=False)
    fpo_id = Column(String(50), nullable=True)
    fpo_name = Column(String(100), nullable=True)
    crop = Column(String(100), nullable=False, index=True)
    variety = Column(String(100), nullable=True)
    category = Column(String(50), nullable=False)
    quantity_kg = Column(Float, nullable=False)
    quality_grade = Column(String(20), nullable=False) # Grade A, Grade B, Grade C
    price_per_kg = Column(Float, nullable=False)
    suggested_price_min = Column(Float, nullable=True)
    suggested_price_max = Column(Float, nullable=True)
    available_date = Column(String(100), nullable=False)
    location = Column(String(150), nullable=False)
    latitude = Column(Float, default=22.3039)
    longitude = Column(Float, default=70.8022)
    organic = Column(Boolean, default=False)
    freshness_priority = Column(String(30), default="High")
    image_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
