from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.connection import DatabaseConnection
from app.routes import videos
from app.config import settings

app = FastAPI(
    title="Marker API",
    description="YouTube Video Bookmark Manager API",
    version="0.1.0"
)

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """Initialize database connection on startup."""
    DatabaseConnection.connect()

@app.on_event("shutdown")
async def shutdown_event():
    """Close database connection on shutdown."""
    DatabaseConnection.disconnect()

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "ok",
        "version": "0.1.0",
    }

# Include routers
app.include_router(videos.router)
