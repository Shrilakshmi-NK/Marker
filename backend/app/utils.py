import re
from urllib.parse import urlparse, parse_qs


def extract_youtube_video_id(url: str) -> str:
    """
    Extract YouTube video ID from various YouTube URL formats.
    
    Supports:
    - https://www.youtube.com/watch?v=VIDEO_ID
    - https://youtu.be/VIDEO_ID
    - https://www.youtube.com/watch?v=VIDEO_ID&t=TIMESTAMP
    - youtube.com/watch?v=VIDEO_ID
    - youtu.be/VIDEO_ID
    
    Returns the video ID or raises ValueError if not found.
    """
    if not url:
        raise ValueError("URL cannot be empty")
    
    # Pattern for youtube.com/watch?v=ID
    match = re.search(r'(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})', url)
    if match:
        return match.group(1)
    
    # Fallback: try parsing as URL
    try:
        parsed = urlparse(url)
        if 'youtube.com' in parsed.netloc:
            query_params = parse_qs(parsed.query)
            video_id = query_params.get('v')
            if video_id and len(video_id[0]) == 11:
                return video_id[0]
        elif 'youtu.be' in parsed.netloc:
            video_id = parsed.path.lstrip('/')
            if len(video_id) == 11:
                return video_id
    except Exception:
        pass
    
    raise ValueError(f"Could not extract video ID from URL: {url}")


def generate_resume_url(video_id: str, timestamp_seconds: int = 0) -> str:
    """
    Generate a YouTube URL with resume timestamp.
    
    Args:
        video_id: YouTube video ID
        timestamp_seconds: Position to resume from (in seconds)
    
    Returns:
        YouTube URL with timestamp parameter if provided
    """
    base_url = f"https://www.youtube.com/watch?v={video_id}"
    if timestamp_seconds > 0:
        return f"{base_url}&t={int(timestamp_seconds)}s"
    return base_url


def format_duration(seconds: int) -> str:
    """Format seconds to HH:MM:SS format."""
    if not isinstance(seconds, int) or seconds < 0:
        return "0:00"
    
    hours = seconds // 3600
    minutes = (seconds % 3600) // 60
    secs = seconds % 60
    
    if hours > 0:
        return f"{hours}:{minutes:02d}:{secs:02d}"
    return f"{minutes}:{secs:02d}"


def parse_timestamp(time_string: str) -> int:
    """
    Parse time string to seconds.
    
    Supports: HH:MM:SS, MM:SS, or just SS
    """
    if not time_string:
        return 0
    
    try:
        parts = [int(p) for p in time_string.split(':')]
        
        if len(parts) == 1:
            return parts[0]
        elif len(parts) == 2:
            return parts[0] * 60 + parts[1]
        elif len(parts) == 3:
            return parts[0] * 3600 + parts[1] * 60 + parts[2]
    except (ValueError, IndexError):
        pass
    
    return 0
