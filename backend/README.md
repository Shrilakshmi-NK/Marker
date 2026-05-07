# Marker Backend

FastAPI backend for YouTube video bookmark manager.

## Phase 1 Features

✅ Create video bookmarks with full metadata
✅ Retrieve all or individual bookmarks
✅ Update bookmark status, timestamp, and notes
✅ Delete bookmarks
✅ Filter by status or folder
✅ Search videos by title or notes
✅ Resume URL generation for continuing from last watched position
✅ YouTube URL validation and video ID extraction
✅ Comprehensive error handling with proper HTTP status codes
✅ MongoDB integration

## Setup

### Prerequisites
- Python 3.9+
- MongoDB 4.0+ (local or Atlas connection string)

### Installation

1. **Create virtual environment:**
```bash
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your MongoDB connection details
```

4. **Run server:**
```bash
python -m uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`
- Interactive API docs: `http://localhost:8000/docs`
- Alternative docs: `http://localhost:8000/redoc`

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app entry point
│   ├── config.py               # Configuration settings
│   ├── utils.py                # Utility functions
│   ├── routes/
│   │   ├── __init__.py
│   │   └── videos.py           # Video endpoints (GET, POST, PATCH, DELETE)
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── video.py            # Pydantic validation models
│   ├── models/
│   │   ├── __init__.py
│   │   └── video.py            # MongoDB document models
│   ├── services/
│   │   ├── __init__.py
│   │   └── video_service.py    # Business logic layer
│   └── db/
│       ├── __init__.py
│       └── connection.py       # MongoDB connection manager
├── requirements.txt            # Python dependencies
├── .env.example               # Environment variables template
├── README.md                  # This file
├── TESTING.md                 # Comprehensive testing guide
├── test_api.sh               # Linux/macOS test script
└── test_api.ps1              # Windows PowerShell test script
```

## API Endpoints

### Base URL
```
http://localhost:8000
```

### Health Check
```
GET /health
```

### Video Bookmarks

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/videos` | Create a new bookmark |
| GET | `/api/videos` | List all bookmarks (with filters) |
| GET | `/api/videos/{id}` | Get single bookmark |
| PATCH | `/api/videos/{id}` | Update bookmark |
| DELETE | `/api/videos/{id}` | Delete bookmark |
| GET | `/api/videos/resume/{id}` | Get resume URL |

### Query Parameters

**List Videos:** `/api/videos`
- `skip` (int, default: 0) - Pagination offset
- `limit` (int, default: 100, max: 1000) - Items per page
- `status` (string) - Filter by status: `not_started`, `watching`, `completed`
- `folder_id` (string) - Filter by folder (Phase 3)
- `search` (string) - Search in title and notes

## Data Model

### Video Bookmark
```javascript
{
  "id": "507f1f77bcf86cd799439011",           // MongoDB ObjectId
  "title": "JavaScript Fundamentals",          // Video title (required)
  "youtube_url": "https://www.youtube.com/...", // Full URL (required)
  "video_id": "jS4aFq5-91o",                   // 11-char YouTube ID (required)
  "thumbnail_url": "https://img.youtube.com/...", // Thumbnail URL
  "duration_seconds": 3600,                    // Video duration in seconds
  "last_timestamp_seconds": 1850,              // Last watched position
  "status": "watching",                        // not_started|watching|completed
  "folder_id": null,                           // For organizing videos (Phase 3)
  "notes": "Core JavaScript concepts",         // User notes
  "created_at": "2024-01-15T10:30:00.000000", // ISO 8601 timestamp
  "updated_at": "2024-01-15T11:00:00.000000"  // ISO 8601 timestamp
}
```

## Example Usage

### Create a Bookmark
```bash
curl -X POST http://localhost:8000/api/videos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "JavaScript Fundamentals",
    "youtube_url": "https://www.youtube.com/watch?v=jS4aFq5-91o",
    "video_id": "jS4aFq5-91o",
    "thumbnail_url": "https://img.youtube.com/vi/jS4aFq5-91o/0.jpg",
    "duration_seconds": 3600,
    "status": "not_started",
    "notes": "Core concepts"
  }'
```

### Get All Bookmarks
```bash
curl http://localhost:8000/api/videos
```

### Filter by Status
```bash
curl "http://localhost:8000/api/videos?status=watching"
```

### Update Progress
```bash
curl -X PATCH http://localhost:8000/api/videos/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "watching",
    "last_timestamp_seconds": 1850
  }'
```

### Get Resume URL
```bash
curl http://localhost:8000/api/videos/resume/507f1f77bcf86cd799439011
```

Returns: `https://www.youtube.com/watch?v=jS4aFq5-91o&t=1850s`

## Testing

See [TESTING.md](TESTING.md) for comprehensive testing guide including:
- Complete curl examples for all endpoints
- Postman collection
- PowerShell script (`test_api.ps1`)
- Bash script (`test_api.sh`)
- Field validation rules
- Common error responses
- Test scenarios

### Quick Test (Windows)
```powershell
.\test_api.ps1
```

### Quick Test (Linux/macOS)
```bash
bash test_api.sh
```

## Features

### URL Validation
Supports multiple YouTube URL formats:
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `youtube.com/watch?v=VIDEO_ID`
- URLs with timestamps: `https://www.youtube.com/watch?v=VIDEO_ID&t=120s`

### Status Tracking
- `not_started` - Haven't watched yet
- `watching` - Currently watching
- `completed` - Finished watching

### Resume Feature
Generate YouTube URLs that resume from last watched position:
```
https://www.youtube.com/watch?v=VIDEO_ID&t=SECONDSs
```

### Search & Filter
- Search by title or notes (case-insensitive)
- Filter by status
- Filter by folder (Phase 3)
- Pagination support

### Error Handling
- 201 Created - Successful creation
- 204 No Content - Successful deletion
- 400 Bad Request - Invalid input
- 404 Not Found - Resource not found
- 409 Conflict - Duplicate video

## Validation Rules

### title
- Required, 1-500 characters
- Example: "JavaScript Fundamentals"

### youtube_url
- Required, 5-1000 characters
- Must be valid YouTube URL
- Video ID automatically extracted and validated

### video_id
- Required, exactly 11 characters
- Must match the ID in youtube_url
- Alphanumeric + underscore/hyphen

### duration_seconds, last_timestamp_seconds
- Must be >= 0
- Represented in seconds (not HH:MM:SS)

### status
- Must be: `not_started`, `watching`, or `completed`
- Case-sensitive, lowercase only
- Default: `not_started`

### notes
- Optional, 0-5000 characters
- Markdown-compatible

## Environment Variables

Create `.env` file from `.env.example`:

```env
# MongoDB connection string
MONGODB_URL=mongodb://localhost:27017

# Database name
DATABASE_NAME=marker

# API server settings
API_HOST=0.0.0.0
API_PORT=8000

# Debug mode
DEBUG=True
```

### MongoDB Atlas Example
```env
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
DATABASE_NAME=marker
```

## Database Schema

### videos collection
```mongodb
{
  "_id": ObjectId,
  "title": String,
  "youtube_url": String,
  "video_id": String,
  "thumbnail_url": String,
  "duration_seconds": Number,
  "last_timestamp_seconds": Number,
  "status": String,  // not_started, watching, completed
  "folder_id": String (nullable),
  "notes": String,
  "created_at": ISODate,
  "updated_at": ISODate
}
```

### Recommended Indexes
```mongodb
db.videos.createIndex({ "video_id": 1 }, { unique: true })
db.videos.createIndex({ "status": 1 })
db.videos.createIndex({ "folder_id": 1 })
db.videos.createIndex({ "title": "text", "notes": "text" })
```

## Performance Notes

- Pagination: Use `skip` and `limit` for large datasets
- Search: Text index improves search performance
- Filtering: Single status/folder filters are fast
- Timestamps: UTC timestamps for consistency across timezones

## Next Phases

**Phase 2:** Chrome Extension Implementation
- Quick save from YouTube pages
- Background service worker

**Phase 3:** Folder Management
- Create/update/delete folders
- Organize videos into folders

**Phase 4:** Advanced Features
- User authentication
- Collections and playlists
- Tags and categories

**Phase 5:** Polish & Deployment
- TypeScript migration
- Advanced filtering/sorting
- Performance optimization
- Cloud deployment (AWS/Azure)

## Dependencies

See `requirements.txt` for full list:
- fastapi - Web framework
- uvicorn - ASGI server
- pydantic - Data validation
- pymongo - MongoDB driver
- python-dotenv - Environment variables

## Troubleshooting

### MongoDB Connection Error
```
✗ Failed to connect to MongoDB
```
Solution: Ensure MongoDB is running and connection string is correct.

```bash
# Test MongoDB
mongosh "mongodb://localhost:27017"
```

### Port Already in Use
```
Address already in use (port 8000)
```
Solution: Use a different port or kill the process using port 8000.

```bash
# Check what's using port 8000
lsof -i :8000  # Linux/macOS
netstat -ano | findstr :8000  # Windows
```

### Import Errors
Ensure you're in the virtual environment:
```bash
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate     # Windows
```

## Development

### Running Tests
```bash
# Using PowerShell (Windows)
.\test_api.ps1

# Using Bash (Linux/macOS)
bash test_api.sh
```

### Hot Reload
The `--reload` flag enables auto-reload on file changes:
```bash
python -m uvicorn app.main:app --reload
```

### Database Management
```bash
# Connect to MongoDB
mongosh

# List databases
show dbs

# Use marker database
use marker

# List collections
show collections

# View videos
db.videos.find()
```

## Support

For issues or questions:
1. Check TESTING.md for examples
2. Review interactive docs at http://localhost:8000/docs
3. Check error messages and status codes
4. Verify MongoDB connection

## License

MIT

