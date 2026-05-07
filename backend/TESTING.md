# Testing Guide - Marker API

Complete guide for testing the Phase 1 API with curl, Postman, or your REST client.

## Prerequisites

1. **MongoDB Running**
   ```bash
   # Windows (if installed via chocolatey)
   mongod
   
   # Or use MongoDB Atlas connection string in .env
   ```

2. **Backend Running**
   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate
   pip install -r requirements.txt
   python -m uvicorn app.main:app --reload
   ```

   Backend will be at: `http://localhost:8000`
   Swagger UI: `http://localhost:8000/docs`

## Base URL
```
http://localhost:8000
```

## API Endpoints

### 1. Health Check
```bash
curl -X GET http://localhost:8000/health
```

Response:
```json
{
  "status": "ok",
  "version": "0.1.0"
}
```

---

### 2. Create Video Bookmark

**Endpoint:** `POST /api/videos`

**Headers:**
```
Content-Type: application/json
```

**Example 1: Long YouTube URL**
```bash
curl -X POST http://localhost:8000/api/videos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "JavaScript Fundamentals",
    "youtube_url": "https://www.youtube.com/watch?v=jS4aFq5-91o&t=120s",
    "video_id": "jS4aFq5-91o",
    "thumbnail_url": "https://img.youtube.com/vi/jS4aFq5-91o/0.jpg",
    "duration_seconds": 3600,
    "last_timestamp_seconds": 0,
    "status": "not_started",
    "notes": "Core concepts of JavaScript"
  }'
```

**Example 2: Short YouTube URL**
```bash
curl -X POST http://localhost:8000/api/videos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "React Hooks Tutorial",
    "youtube_url": "https://youtu.be/dQw4w9WgXcQ",
    "video_id": "dQw4w9WgXcQ",
    "thumbnail_url": "https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg",
    "duration_seconds": 1800,
    "status": "not_started",
    "notes": "Learn modern React"
  }'
```

**Response (201 Created):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "title": "JavaScript Fundamentals",
  "youtube_url": "https://www.youtube.com/watch?v=jS4aFq5-91o&t=120s",
  "video_id": "jS4aFq5-91o",
  "thumbnail_url": "https://img.youtube.com/vi/jS4aFq5-91o/0.jpg",
  "duration_seconds": 3600,
  "last_timestamp_seconds": 0,
  "status": "not_started",
  "folder_id": null,
  "notes": "Core concepts of JavaScript",
  "created_at": "2024-01-15T10:30:00.000000",
  "updated_at": "2024-01-15T10:30:00.000000"
}
```

**Error (400 - Invalid URL):**
```json
{
  "detail": "Invalid YouTube URL: Could not extract video ID from URL: https://example.com"
}
```

**Error (409 - Already Exists):**
```json
{
  "detail": "This video is already bookmarked"
}
```

---

### 3. Get All Videos

**Endpoint:** `GET /api/videos`

**Basic Request:**
```bash
curl -X GET http://localhost:8000/api/videos
```

**With Pagination:**
```bash
curl -X GET "http://localhost:8000/api/videos?skip=0&limit=10"
```

**Filter by Status:**
```bash
curl -X GET "http://localhost:8000/api/videos?status=watching"
```

Status options: `not_started`, `watching`, `completed`

**Filter by Folder:**
```bash
curl -X GET "http://localhost:8000/api/videos?folder_id=507f1f77bcf86cd799439012"
```

**Search Videos:**
```bash
curl -X GET "http://localhost:8000/api/videos?search=javascript"
```

**Response (200 OK):**
```json
{
  "total": 2,
  "videos": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "JavaScript Fundamentals",
      "youtube_url": "https://www.youtube.com/watch?v=jS4aFq5-91o",
      "video_id": "jS4aFq5-91o",
      "thumbnail_url": "https://img.youtube.com/vi/jS4aFq5-91o/0.jpg",
      "duration_seconds": 3600,
      "last_timestamp_seconds": 0,
      "status": "not_started",
      "folder_id": null,
      "notes": "Core concepts",
      "created_at": "2024-01-15T10:30:00.000000",
      "updated_at": "2024-01-15T10:30:00.000000"
    }
  ],
  "skip": 0,
  "limit": 100
}
```

---

### 4. Get Single Video

**Endpoint:** `GET /api/videos/{video_id}`

```bash
curl -X GET http://localhost:8000/api/videos/507f1f77bcf86cd799439011
```

**Response (200 OK):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "title": "JavaScript Fundamentals",
  "youtube_url": "https://www.youtube.com/watch?v=jS4aFq5-91o",
  "video_id": "jS4aFq5-91o",
  "thumbnail_url": "https://img.youtube.com/vi/jS4aFq5-91o/0.jpg",
  "duration_seconds": 3600,
  "last_timestamp_seconds": 0,
  "status": "not_started",
  "folder_id": null,
  "notes": "Core concepts",
  "created_at": "2024-01-15T10:30:00.000000",
  "updated_at": "2024-01-15T10:30:00.000000"
}
```

**Error (404 Not Found):**
```json
{
  "detail": "Video not found"
}
```

---

### 5. Update Video

**Endpoint:** `PATCH /api/videos/{video_id}`

**Update Status:**
```bash
curl -X PATCH http://localhost:8000/api/videos/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "watching"
  }'
```

**Update Progress (Last Timestamp):**
```bash
curl -X PATCH http://localhost:8000/api/videos/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "last_timestamp_seconds": 1850
  }'
```

**Update Notes:**
```bash
curl -X PATCH http://localhost:8000/api/videos/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Completed the basics, now understand closures"
  }'
```

**Update Multiple Fields:**
```bash
curl -X PATCH http://localhost:8000/api/videos/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed",
    "last_timestamp_seconds": 3600,
    "notes": "Finished the course!"
  }'
```

**Response (200 OK):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "title": "JavaScript Fundamentals",
  "youtube_url": "https://www.youtube.com/watch?v=jS4aFq5-91o",
  "video_id": "jS4aFq5-91o",
  "thumbnail_url": "https://img.youtube.com/vi/jS4aFq5-91o/0.jpg",
  "duration_seconds": 3600,
  "last_timestamp_seconds": 1850,
  "status": "watching",
  "folder_id": null,
  "notes": "Core concepts of JavaScript",
  "created_at": "2024-01-15T10:30:00.000000",
  "updated_at": "2024-01-15T11:00:00.000000"
}
```

---

### 6. Delete Video

**Endpoint:** `DELETE /api/videos/{video_id}`

```bash
curl -X DELETE http://localhost:8000/api/videos/507f1f77bcf86cd799439011
```

**Response (204 No Content):**
```
(No response body)
```

**Error (404 Not Found):**
```json
{
  "detail": "Video not found"
}
```

---

### 7. Get Resume URL

**Endpoint:** `GET /api/videos/resume/{video_id}`

```bash
curl -X GET http://localhost:8000/api/videos/resume/507f1f77bcf86cd799439011
```

**Response (200 OK):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "resume_url": "https://www.youtube.com/watch?v=jS4aFq5-91o&t=1850s",
  "video_id": "jS4aFq5-91o",
  "last_timestamp_seconds": 1850
}
```

This URL can be opened directly to resume from the last watched position.

---

## Postman Collection

Create a new Postman collection with these requests:

```json
{
  "info": {
    "name": "Marker API - Phase 1",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "http://localhost:8000/health"
      }
    },
    {
      "name": "Create Video",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "url": "http://localhost:8000/api/videos",
        "body": {
          "mode": "raw",
          "raw": "{\"title\":\"Test Video\",\"youtube_url\":\"https://www.youtube.com/watch?v=jS4aFq5-91o\",\"video_id\":\"jS4aFq5-91o\",\"thumbnail_url\":\"https://img.youtube.com/vi/jS4aFq5-91o/0.jpg\",\"duration_seconds\":3600,\"status\":\"not_started\",\"notes\":\"\"}"
        }
      }
    },
    {
      "name": "List Videos",
      "request": {
        "method": "GET",
        "url": "http://localhost:8000/api/videos"
      }
    },
    {
      "name": "Get Video by ID",
      "request": {
        "method": "GET",
        "url": "http://localhost:8000/api/videos/{{video_id}}"
      }
    },
    {
      "name": "Update Video",
      "request": {
        "method": "PATCH",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "url": "http://localhost:8000/api/videos/{{video_id}}",
        "body": {
          "mode": "raw",
          "raw": "{\"status\":\"watching\",\"last_timestamp_seconds\":600,\"notes\":\"Updated notes\"}"
        }
      }
    },
    {
      "name": "Delete Video",
      "request": {
        "method": "DELETE",
        "url": "http://localhost:8000/api/videos/{{video_id}}"
      }
    },
    {
      "name": "Get Resume URL",
      "request": {
        "method": "GET",
        "url": "http://localhost:8000/api/videos/resume/{{video_id}}"
      }
    }
  ]
}
```

---

## Field Validation Rules

### title
- Required
- Min length: 1, Max length: 500 characters
- Examples: "JavaScript Fundamentals", "Python Web Dev with Django"

### youtube_url
- Required
- Min length: 5, Max length: 1000 characters
- Supported formats:
  - `https://www.youtube.com/watch?v=VIDEO_ID`
  - `https://youtu.be/VIDEO_ID`
  - `youtube.com/watch?v=VIDEO_ID` (without https)
  - With timestamps: `https://www.youtube.com/watch?v=VIDEO_ID&t=120s`

### video_id
- Required
- Exactly 11 characters (YouTube video IDs are always 11 chars)
- Must match the ID in youtube_url
- Examples: "jS4aFq5-91o", "dQw4w9WgXcQ"

### thumbnail_url
- Optional
- Max length: 1000 characters
- Default: Empty string
- Expected format: `https://img.youtube.com/vi/{video_id}/0.jpg`

### duration_seconds
- Optional
- Must be >= 0
- Default: 0
- Examples: 3600 (1 hour), 1800 (30 minutes)

### last_timestamp_seconds
- Optional
- Must be >= 0
- Default: 0
- Represents where the user stopped watching

### status
- Optional
- Valid values: `not_started`, `watching`, `completed`
- Default: `not_started`
- Case-sensitive, lowercase only

### folder_id
- Optional
- Can be null
- Should be a valid MongoDB ObjectId if provided
- Used for organizing videos into folders (Phase 3)

### notes
- Optional
- Max length: 5000 characters
- Default: Empty string
- User's personal notes about the video

---

## Common Error Responses

### 400 Bad Request
```json
{
  "detail": "Invalid YouTube URL: Could not extract video ID from URL: ..."
}
```

### 404 Not Found
```json
{
  "detail": "Video not found"
}
```

### 409 Conflict
```json
{
  "detail": "This video is already bookmarked"
}
```

---

## Test Scenarios

### Scenario 1: Complete Workflow
1. Create a video
2. Get all videos
3. Update status to "watching"
4. Update last timestamp
5. Get resume URL
6. Delete video

### Scenario 2: Search and Filter
1. Create 5 videos with different statuses
2. Filter by status "not_started"
3. Filter by status "watching"
4. Search for keyword in title

### Scenario 3: Duplicate Prevention
1. Create a video
2. Try to create the same video again (should get 409 error)
3. Verify only one exists

### Scenario 4: URL Format Handling
1. Test with long YouTube URL
2. Test with short youtu.be URL
3. Test with URL containing timestamp
4. Test with invalid URL (should get 400 error)

---

## Rate Limits

Currently none implemented. Will be added in later phases.

## Authentication

Currently no authentication. Will be added in Phase 4.
