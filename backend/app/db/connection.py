from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError
from app.config import settings


class DatabaseConnection:
    """MongoDB connection manager."""
    
    client = None
    db = None
    
    @classmethod
    def connect(cls):
        """Establish connection to MongoDB."""
        try:
            cls.client = MongoClient(settings.MONGODB_URL, serverSelectionTimeoutMS=5000)
            # Verify connection
            cls.client.admin.command('ping')
            cls.db = cls.client[settings.DATABASE_NAME]
            print("✓ Connected to MongoDB")
        except ServerSelectionTimeoutError as e:
            print(f"✗ Failed to connect to MongoDB: {e}")
            raise
        except Exception as e:
            print(f"✗ MongoDB connection error: {e}")
            raise
    
    @classmethod
    def disconnect(cls):
        """Close MongoDB connection."""
        if cls.client:
            cls.client.close()
            print("✓ Disconnected from MongoDB")
    
    @classmethod
    def get_db(cls):
        """Get database instance (auto-connect if needed)."""
        if cls.db is None:
            cls.connect()
        return cls.db


def get_db():
    """Dependency injection function for getting database."""
    return DatabaseConnection.get_db()
