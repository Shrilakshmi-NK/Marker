from bson import ObjectId
from datetime import datetime
from app.db.connection import get_db
from app.models.video import Video
from app.config import settings
from app.services.youtube_service import fetch_video_metadata


class VideoService:
    """Service layer for video bookmark operations."""
    
    def __init__(self):
        self.db = get_db()
        self.collection = self.db[settings.COLLECTION_VIDEOS]
    
    def create_video(self, video_data: dict) -> Video:
        """Create a new video bookmark with optional metadata fetching."""
        video_id = video_data.get("video_id")
        
        metadata = None
        if video_id and settings.YOUTUBE_API_KEY:
            metadata = fetch_video_metadata(video_id, settings.YOUTUBE_API_KEY)
        
        merged_data = {
            "title": video_data.get("title"),
            "youtube_url": video_data.get("youtube_url"),
            "video_id": video_id,
            "thumbnail_url": video_data.get("thumbnail_url", ""),
            "duration_seconds": video_data.get("duration_seconds", 0),
            "last_timestamp_seconds": video_data.get("last_timestamp_seconds", 0),
            "status": video_data.get("status", "not_started"),
            "folder_id": video_data.get("folder_id"),
            "notes": video_data.get("notes", ""),
            "channel_title": video_data.get("channel_title", ""),
        }
        
        if metadata:
            if not merged_data.get("title"):
                merged_data["title"] = metadata.get("title", "")
            if not merged_data.get("thumbnail_url"):
                merged_data["thumbnail_url"] = metadata.get("thumbnail_url", "")
            if merged_data.get("duration_seconds") == 0:
                merged_data["duration_seconds"] = metadata.get("duration_seconds", 0)
            if not merged_data.get("channel_title"):
                merged_data["channel_title"] = metadata.get("channel_title", "")
        
        video = Video(
            title=merged_data.get("title"),
            youtube_url=merged_data.get("youtube_url"),
            video_id=merged_data.get("video_id"),
            thumbnail_url=merged_data.get("thumbnail_url", ""),
            duration_seconds=merged_data.get("duration_seconds", 0),
            last_timestamp_seconds=merged_data.get("last_timestamp_seconds", 0),
            status=merged_data.get("status", "not_started"),
            folder_id=merged_data.get("folder_id"),
            notes=merged_data.get("notes", ""),
            channel_title=merged_data.get("channel_title", ""),
        )
        result = self.collection.insert_one(video.to_dict())
        video._id = result.inserted_id
        return video
    
    def get_video(self, video_id: str) -> Video:
        """Get a single video by ID."""
        try:
            doc = self.collection.find_one({"_id": ObjectId(video_id)})
            if doc:
                return Video.from_dict(doc)
        except Exception:
            pass
        return None
    
    def get_all_videos(self, skip: int = 0, limit: int = 100) -> tuple[list[Video], int]:
        """Get all videos with pagination."""
        cursor = self.collection.find().skip(skip).limit(limit)
        videos = [Video.from_dict(doc) for doc in cursor]
        total = self.collection.count_documents({})
        return videos, total
    
    def get_videos_by_status(
        self, status: str, skip: int = 0, limit: int = 100
    ) -> tuple[list[Video], int]:
        """Get videos filtered by status."""
        cursor = self.collection.find({"status": status}).skip(skip).limit(limit)
        videos = [Video.from_dict(doc) for doc in cursor]
        total = self.collection.count_documents({"status": status})
        return videos, total
    
    def get_videos_by_folder(
        self, folder_id: str, skip: int = 0, limit: int = 100
    ) -> tuple[list[Video], int]:
        """Get videos filtered by folder."""
        cursor = self.collection.find({"folder_id": folder_id}).skip(skip).limit(limit)
        videos = [Video.from_dict(doc) for doc in cursor]
        total = self.collection.count_documents({"folder_id": folder_id})
        return videos, total
    
    def update_video(self, video_id: str, update_data: dict) -> Video:
        """Update a video bookmark."""
        try:
            update_data["updated_at"] = datetime.utcnow()
            result = self.collection.find_one_and_update(
                {"_id": ObjectId(video_id)},
                {"$set": update_data},
                return_document=True
            )
            if result:
                return Video.from_dict(result)
        except Exception:
            pass
        return None
    
    def delete_video(self, video_id: str) -> bool:
        """Delete a video bookmark."""
        try:
            result = self.collection.delete_one({"_id": ObjectId(video_id)})
            return result.deleted_count > 0
        except Exception:
            return False
    
    def search_videos(
        self, query: str, skip: int = 0, limit: int = 100
    ) -> tuple[list[Video], int]:
        """Search videos by title or notes (case-insensitive)."""
        search_filter = {
            "$or": [
                {"title": {"$regex": query, "$options": "i"}},
                {"notes": {"$regex": query, "$options": "i"}},
            ]
        }
        cursor = self.collection.find(search_filter).skip(skip).limit(limit)
        videos = [Video.from_dict(doc) for doc in cursor]
        total = self.collection.count_documents(search_filter)
        return videos, total
    
    def get_video_by_video_id(self, video_id: str) -> Video:
        """Get a video by YouTube video ID."""
        doc = self.collection.find_one({"video_id": video_id})
        if doc:
            return Video.from_dict(doc)
        return None
