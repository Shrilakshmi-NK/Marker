import re
import requests
from typing import Optional, Dict


def parse_iso8601_duration(duration_str: str) -> int:
    """
    Parse ISO 8601 duration format to total seconds.
    
    Example: PT1H23M45S -> 5025 seconds
    """
    if not duration_str or not isinstance(duration_str, str):
        return 0
    
    pattern = r'P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?'
    match = re.match(pattern, duration_str)
    
    if not match:
        return 0
    
    groups = match.groups()
    years, months, weeks, days, hours, minutes, seconds = groups
    
    total_seconds = 0
    if hours:
        total_seconds += int(hours) * 3600
    if minutes:
        total_seconds += int(minutes) * 60
    if seconds:
        total_seconds += int(float(seconds))
    if days:
        total_seconds += int(days) * 86400
    
    return total_seconds


def fetch_video_metadata(video_id: str, api_key: Optional[str] = None) -> Optional[Dict]:
    """
    Fetch video metadata from YouTube Data API v3.
    
    Returns a dict with keys: title, thumbnail_url, duration_seconds, channel_title
    Returns None if API key is missing, request fails, or video not found.
    """
    if not api_key:
        return None
    
    if not video_id or len(video_id) != 11:
        return None
    
    try:
        url = "https://www.googleapis.com/youtube/v3/videos"
        params = {
            "part": "snippet,contentDetails",
            "id": video_id,
            "key": api_key,
        }
        
        response = requests.get(url, params=params, timeout=5)
        response.raise_for_status()
        
        data = response.json()
        
        if not data.get("items") or len(data["items"]) == 0:
            return None
        
        item = data["items"][0]
        snippet = item.get("snippet", {})
        content_details = item.get("contentDetails", {})
        
        thumbnail_url = ""
        thumbnails = snippet.get("thumbnails", {})
        if "maxres" in thumbnails:
            thumbnail_url = thumbnails["maxres"].get("url", "")
        elif "high" in thumbnails:
            thumbnail_url = thumbnails["high"].get("url", "")
        elif "default" in thumbnails:
            thumbnail_url = thumbnails["default"].get("url", "")
        
        duration_str = content_details.get("duration", "")
        duration_seconds = parse_iso8601_duration(duration_str)
        
        return {
            "title": snippet.get("title", ""),
            "thumbnail_url": thumbnail_url,
            "duration_seconds": duration_seconds,
            "channel_title": snippet.get("channelTitle", ""),
        }
    
    except requests.exceptions.RequestException:
        return None
    except (KeyError, ValueError, TypeError):
        return None
