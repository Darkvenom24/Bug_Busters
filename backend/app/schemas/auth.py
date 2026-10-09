from pydantic import BaseModel, EmailStr
from typing import Optional
from app.models.user import UserRole

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    employee_id: Optional[str] = None
    production_unit: Optional[str] = None
    role: str
    password: str

class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    employee_id: Optional[str] = None
    production_unit: Optional[str] = None
    role: str
    is_active: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse
