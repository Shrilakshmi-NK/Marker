import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "marker")
    COLLECTION_VIDEOS: str = "videos"
    
    API_HOST: str = os.getenv("API_HOST", "0.0.0.0")
    API_PORT: int = int(os.getenv("API_PORT", 8000))
    
    YOUTUBE_API_KEY: str = os.getenv("YOUTUBE_API_KEY", "")
    
    DEBUG: bool = os.getenv("DEBUG", "True") == "True"

settings = Settings()
