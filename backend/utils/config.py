from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    # Existing fields (keep yours)
    MONGO_URI: str
    SECRET_KEY: str
    ALGORITHM: str
    JWT_SECRET: str
    MONGO_DB_NAME: str

    # ✅ ADD THESE (the missing ones causing your crash)
    GEMINI_API_CHAT_KEY: str
    GEMINI_API_DOC_KEY: str
    PINECONE_API_KEY: str
    PINECONE_INDEX: str

    # Optional but useful
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    class Config:
        env_file = ".env"
        extra = "ignore"   # 👈 prevents future drama


settings = Settings()