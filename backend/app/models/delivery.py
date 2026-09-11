from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey, Boolean
from datetime import datetime
from app.core.database import Base

class Delivery(Base):
    __tablename__ = "deliveries"

    id = Column(String(50), primary_key=True, index=True)
    order_id = Column(String(50), ForeignKey("orders.id"), index=True)
    vehicle_id = Column(String(50), nullable=True)
    route_id = Column(String(50), nullable=True)
    current_status = Column(String(50), default="Pickup")
    departure_time = Column(DateTime, nullable=True)
    estimated_arrival = Column(DateTime, nullable=True)
    completed = Column(Boolean, default=False)
