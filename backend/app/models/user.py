from sqlalchemy import Column, String, Boolean, Float, Integer, DateTime
from datetime import datetime
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    phone = Column(String(20), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, default="farmer") # farmer, fpo, buyer, admin
    location = Column(String(150), nullable=False)
    verified = Column(Boolean, default=False)
    rating = Column(Float, default=5.0)
    avatar = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
