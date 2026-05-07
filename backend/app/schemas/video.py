from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class VideoBase(BaseModel):
    """Base video schema with common fields."""
    title: str = Field(..., min_length=1, max_length=500)
    youtube_url: str = Field(..., min_length=5, max_length=1000)
    video_id: str = Field(..., min_length=11, max_length=11)
    thumbnail_url: Optional[str] = Field("", max_length=1000)
    duration_seconds: Optional[int] = Field(0, ge=0)
    last_timestamp_seconds: Optional[int] = Field(0, ge=0)
    status: Optional[str] = Field(
        "not_started",
        pattern="^(not_started|watching|completed)$"
    )
    folder_id: Optional[str] = None
    notes: Optional[str] = Field("", max_length=5000)
    channel_title: Optional[str] = Field("", max_length=500)


class VideoCreate(VideoBase):
    """Schema for creating a new video bookmark."""
    pass


class VideoUpdate(BaseModel):
    """Schema for updating a video bookmark (all fields optional)."""
    title: Optional[str] = Field(None, min_length=1, max_length=500)
    youtube_url: Optional[str] = Field(None, min_length=5, max_length=1000)
    thumbnail_url: Optional[str] = Field(None, max_length=1000)
    duration_seconds: Optional[int] = Field(None, ge=0)
    last_timestamp_seconds: Optional[int] = Field(None, ge=0)
    status: Optional[str] = Field(None, pattern="^(not_started|watching|completed)$")
    folder_id: Optional[str] = None
    notes: Optional[str] = Field(None, max_length=5000)
    channel_title: Optional[str] = Field(None, max_length=500)


class VideoResponse(VideoBase):
    """Schema for API responses."""
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        populate_by_name = True


class VideoListResponse(BaseModel):
    """Schema for list responses."""
    total: int
    videos: list[VideoResponse]
    skip: int
    limit: int
