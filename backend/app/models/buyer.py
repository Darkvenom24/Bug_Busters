from sqlalchemy import Column, String, Float, ForeignKey
from app.core.database import Base

class BuyerProfile(Base):
    __tablename__ = "buyers"

    id = Column(String(50), primary_key=True, index=True)
    user_id = Column(String(50), ForeignKey("users.id"), unique=True, index=True)
    business_name = Column(String(200), nullable=False)
    buyer_type = Column(String(50), default="Restaurant") # Restaurant, Hotel, Retailer, Supermarket, Food Processor, Consumer
    gst_number = Column(String(50), nullable=True)
    delivery_address = Column(String(255), nullable=False)
    credit_limit = Column(Float, default=100000.0)
