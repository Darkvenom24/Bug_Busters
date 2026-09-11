from sqlalchemy import Column, String, Float, Integer, ForeignKey
from app.core.database import Base

class FarmerProfile(Base):
    __tablename__ = "farmers"

    id = Column(String(50), primary_key=True, index=True)
    user_id = Column(String(50), ForeignKey("users.id"), unique=True, index=True)
    farm_name = Column(String(150), nullable=True)
    land_area_acres = Column(Float, default=5.0)
    primary_crops = Column(String(200), default="Tomato, Onion, Chilli")
    village = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)
    state = Column(String(100), default="Gujarat")
    fpo_member_id = Column(String(50), nullable=True)
    total_sales_amount = Column(Float, default=0.0)
