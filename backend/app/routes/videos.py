from fastapi import APIRouter, HTTPException, Query, status
from typing import Optional
from app.schemas.video import VideoCreate, VideoUpdate, VideoResponse, VideoListResponse
from app.services.video_service import VideoService
from app.utils import extract_youtube_video_id, generate_resume_url

router = APIRouter(prefix="/api/videos", tags=["videos"])
service = VideoService()


@router.post("", response_model=VideoResponse, status_code=status.HTTP_201_CREATED)
def create_video(video: VideoCreate):
    """Create a new video bookmark."""
    try:
        # Validate YouTube URL and extract video ID
        try:
            extracted_id = extract_youtube_video_id(video.youtube_url)
            if extracted_id != video.video_id:
                raise ValueError("Video ID in URL does not match provided video_id")
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid YouTube URL: {str(e)}"
            )
        
        # Check if video already exists
        existing = service.get_video_by_video_id(video.video_id)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="This video is already bookmarked"
            )
        
        created_video = service.create_video(video.dict())
        return created_video.to_response_dict()
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to create video: {str(e)}"
        )


@router.get("/resume/{video_id}")
def get_resume_url(video_id: str):
    """
    Get a resume URL for a video with the last watched timestamp.
    Returns a URL that will start playback at the last watched position.
    """
    video = service.get_video(video_id)
    if not video:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Video not found"
        )

    resume_url = generate_resume_url(video.video_id, video.last_timestamp_seconds)
    return {
        "id": str(video._id),
        "resume_url": resume_url,
        "video_id": video.video_id,
        "last_timestamp_seconds": video.last_timestamp_seconds,
    }


@router.get("/{video_id}", response_model=VideoResponse)
def get_video(video_id: str):
    """Get a single video bookmark by ID."""
    video = service.get_video(video_id)
    if not video:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Video not found"
        )
    return video.to_response_dict()


@router.get("", response_model=VideoListResponse)
def list_videos(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    status: Optional[str] = Query(None, regex="^(not_started|watching|completed)$"),
    folder_id: Optional[str] = None,
    search: Optional[str] = Query(None, min_length=1),
):
    """
    Get video bookmarks with optional filtering and search.
    
    Query parameters:
    - skip: Number of items to skip (default: 0)
    - limit: Number of items to return (default: 100, max: 1000)
    - status: Filter by status (not_started, watching, completed)
    - folder_id: Filter by folder ID
    - search: Search in title and notes
    """
    try:
        if search:
            videos, total = service.search_videos(search, skip, limit)
        elif status:
            videos, total = service.get_videos_by_status(status, skip, limit)
        elif folder_id:
            videos, total = service.get_videos_by_folder(folder_id, skip, limit)
        else:
            videos, total = service.get_all_videos(skip, limit)
        
        return {
            "total": total,
            "videos": [v.to_response_dict() for v in videos],
            "skip": skip,
            "limit": limit,
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to fetch videos: {str(e)}"
        )


@router.patch("/{video_id}", response_model=VideoResponse)
def update_video(video_id: str, video_update: VideoUpdate):
    """Update a video bookmark."""
    try:
        # Validate video exists
        existing = service.get_video(video_id)
        if not existing:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Video not found"
            )
        
        # If updating youtube_url, validate and extract new video_id
        update_dict = video_update.dict(exclude_unset=True)
        if "youtube_url" in update_dict:
            try:
                new_video_id = extract_youtube_video_id(update_dict["youtube_url"])
                update_dict["video_id"] = new_video_id
            except ValueError as e:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid YouTube URL: {str(e)}"
                )
        
        updated_video = service.update_video(video_id, update_dict)
        if not updated_video:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to update video"
            )
        return updated_video.to_response_dict()
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to update video: {str(e)}"
        )


@router.delete("/{video_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_video(video_id: str):
    """Delete a video bookmark."""
    try:
        # Verify video exists
        existing = service.get_video(video_id)
        if not existing:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Video not found"
            )
        
        success = service.delete_video(video_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to delete video"
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to delete video: {str(e)}"
        )


