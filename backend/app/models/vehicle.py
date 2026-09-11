from sqlalchemy import Column, String, Float, Integer, Boolean
from app.core.database import Base

class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(String(50), primary_key=True, index=True)
    registration_number = Column(String(50), unique=True, index=True)
    driver_name = Column(String(100), nullable=False)
    driver_phone = Column(String(20), nullable=False)
    capacity_kg = Column(Float, nullable=False)
    current_load_kg = Column(Float, default=0.0)
    is_available = Column(Boolean, default=True)
    current_location = Column(String(150), nullable=True)
