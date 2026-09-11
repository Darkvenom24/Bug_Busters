import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "FarmSetu"
    APP_ENV: str = "development"
    DEBUG: bool = True
    PORT: int = 8000
    FRONTEND_URL: str = "http://localhost:5173"

    # Database
    DATABASE_URL: str = "sqlite:///./farmsetu.db"

    # Security
    SECRET_KEY: str = "farmsetu_super_secret_jwt_key_agritech_2026_change_in_prod"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # AI & External APIs
    GEMINI_API_KEY: str = ""
    WEATHER_API_KEY: str = ""
    GOOGLE_MAPS_API_KEY: str = ""

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
