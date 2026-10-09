from datetime import datetime, timezone
from sqlalchemy import Column, BigInteger, String, Boolean, DateTime, Text
from app.core.database import Base
import enum

class UserRole(str, enum.Enum):
    admin = "Admin"
    operator = "Operator"

class User(Base):
    __tablename__ = "users"

    id = Column(BigInteger, primary_key=True, index=True)
    full_name = Column(String(120), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    employee_id = Column(String(50), nullable=True)
    production_unit = Column(String(150), nullable=True)
    role = Column(String(20), nullable=False)
    password_hash = Column(Text, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
