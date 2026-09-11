from pydantic import BaseModel
from typing import Optional

class UserBase(BaseModel):
    name: str
    phone: str
    email: str
    role: str = "farmer" # farmer, fpo, buyer, admin
    location: str
    avatar: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    phone_or_email: str
    password: str

class UserOut(UserBase):
    id: str
    verified: bool
    rating: float

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut
