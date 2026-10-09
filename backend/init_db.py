import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Import models
from app.models import User, UserRole
from app.core.database import Base
from app.core.config import settings

# Since passlib and python-jose might not be installed yet, we'll use a basic hash for now
# or we can just require the user to pip install -r requirements.txt before running this.
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def init_db():
    print(f"Connecting to database: {settings.DATABASE_URL}")
    engine = create_engine(settings.DATABASE_URL)
    
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    
    Session = sessionmaker(bind=engine)
    db = Session()
    
    admin_email = "admin@defectiq.com"
    operator_email = "operator@defectiq.com"
    
    admin = db.query(User).filter(User.email == admin_email).first()
    if not admin:
        print(f"Creating admin user: {admin_email} / admin123")
        admin = User(
            email=admin_email,
            full_name="System Administrator",
            hashed_password=pwd_context.hash("admin123"),
            role=UserRole.admin
        )
        db.add(admin)
        
    operator = db.query(User).filter(User.email == operator_email).first()
    if not operator:
        print(f"Creating operator user: {operator_email} / operator123")
        operator = User(
            email=operator_email,
            full_name="Factory Operator",
            hashed_password=pwd_context.hash("operator123"),
            role=UserRole.operator
        )
        db.add(operator)
        
    db.commit()
    db.close()
    print("Database initialization complete.")

if __name__ == "__main__":
    init_db()
