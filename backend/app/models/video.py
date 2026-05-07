from datetime import datetime
from bson import ObjectId


class Video:
    """MongoDB document model for video bookmarks."""
    
    def __init__(
        self,
        title: str,
        youtube_url: str,
        video_id: str,
        thumbnail_url: str = "",
        duration_seconds: int = 0,
        last_timestamp_seconds: int = 0,
        status: str = "not_started",
        folder_id: str = None,
        notes: str = "",
        channel_title: str = "",
        _id: ObjectId = None,
        created_at: datetime = None,
        updated_at: datetime = None,
    ):
        self._id = _id or ObjectId()
        self.title = title
        self.youtube_url = youtube_url
        self.video_id = video_id
        self.thumbnail_url = thumbnail_url
        self.duration_seconds = duration_seconds
        self.last_timestamp_seconds = last_timestamp_seconds
        self.status = status
        self.folder_id = folder_id
        self.notes = notes
        self.channel_title = channel_title
        self.created_at = created_at or datetime.utcnow()
        self.updated_at = updated_at or datetime.utcnow()
    
    def to_dict(self):
        """Convert to dictionary for MongoDB storage."""
        return {
            "_id": self._id,
            "title": self.title,
            "youtube_url": self.youtube_url,
            "video_id": self.video_id,
            "thumbnail_url": self.thumbnail_url,
            "duration_seconds": self.duration_seconds,
            "last_timestamp_seconds": self.last_timestamp_seconds,
            "status": self.status,
            "folder_id": self.folder_id,
            "notes": self.notes,
            "channel_title": self.channel_title,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }
    
    def to_response_dict(self):
        """Convert to dictionary for API response (with string ID)."""
        return {
            "id": str(self._id),
            "title": self.title,
            "youtube_url": self.youtube_url,
            "video_id": self.video_id,
            "thumbnail_url": self.thumbnail_url,
            "duration_seconds": self.duration_seconds,
            "last_timestamp_seconds": self.last_timestamp_seconds,
            "status": self.status,
            "folder_id": self.folder_id,
            "notes": self.notes,
            "channel_title": self.channel_title,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }
    
    @staticmethod
    def from_dict(data):
        """Create Video object from MongoDB document."""
        return Video(
            title=data.get("title"),
            youtube_url=data.get("youtube_url"),
            video_id=data.get("video_id"),
            thumbnail_url=data.get("thumbnail_url", ""),
            duration_seconds=data.get("duration_seconds", 0),
            last_timestamp_seconds=data.get("last_timestamp_seconds", 0),
            status=data.get("status", "not_started"),
            folder_id=data.get("folder_id"),
            notes=data.get("notes", ""),
            channel_title=data.get("channel_title", ""),
            _id=data.get("_id"),
            created_at=data.get("created_at"),
            updated_at=data.get("updated_at"),
        )
