from sqlalchemy import Column, String, Integer, Float, ForeignKey
from app.core.database import Base

class FPOProfile(Base):
    __tablename__ = "fpos"

    id = Column(String(50), primary_key=True, index=True)
    user_id = Column(String(50), ForeignKey("users.id"), unique=True, index=True)
    fpo_name = Column(String(200), nullable=False)
    registration_number = Column(String(100), unique=True)
    member_farmer_count = Column(Integer, default=0)
    central_hub_location = Column(String(200), nullable=False)
    storage_capacity_tons = Column(Float, default=500.0)
    primary_crops = Column(String(255), default="Tomato, Onion, Banana, Potato")
