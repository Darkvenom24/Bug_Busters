from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.models.user import User
from app.schemas.auth import UserCreate, UserResponse, Token
from datetime import timedelta
from app.core.config import settings

router = APIRouter()

@router.get("/next-employee-id")
def get_next_employee_id(db: Session = Depends(get_db)):
    # Count total users to determine next sequence
    count = db.query(User).count()
    next_id = count + 1
    return {"employee_id": f"EMP-{next_id}"}

@router.post("/register", response_model=UserResponse)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    
    # Generate employee ID sequence based on current count
    count = db.query(User).count()
    next_emp_id = f"EMP-{count + 1}"
    
    # Hash password
    hashed_pass = get_password_hash(user_in.password)
    
    # Create the user without employee_id yet
    new_user = User(
        full_name=user_in.full_name,
        email=user_in.email,
        production_unit=user_in.production_unit,
        role=user_in.role,
        password_hash=hashed_pass,
    )
    
    db.add(new_user)
    db.flush() # Flush to get the ID
    
    # Generate employee_id if not provided
    if user_in.employee_id and user_in.employee_id.strip() != "":
        new_user.employee_id = user_in.employee_id
    else:
        new_user.employee_id = next_emp_id
        
    db.commit()
    db.refresh(new_user)
    
    return new_user

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
        
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role}, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": user
    }
