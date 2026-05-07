# Quick Start Guide - Marker Backend Phase 1

## ⚡ 5-Minute Setup

### Step 1: Clone and Navigate
```bash
cd Marker/backend
```

### Step 2: Create Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Configure Database
```bash
cp .env.example .env
```

**If using local MongoDB:**
- Ensure MongoDB is running: `mongod`
- Keep default: `MONGODB_URL=mongodb://localhost:27017`

**If using MongoDB Atlas (Cloud):**
- Get your connection string from Atlas
- Update: `MONGODB_URL=mongodb+srv://user:password@cluster.mongodb.net/?retryWrites=true&w=majority`

### Step 5: Start Server
```bash
python -m uvicorn app.main:app --reload
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     ✓ Connected to MongoDB
```

## ✅ Verify Installation

### Test 1: Health Check
```bash
curl http://localhost:8000/health
```

Expected response:
```json
{"status":"ok","version":"0.1.0"}
```

### Test 2: Open Interactive Docs
Visit: http://localhost:8000/docs

You should see all endpoints with "Try it out" buttons.

### Test 3: Run Full Test Suite
```bash
# Windows PowerShell
.\test_api.ps1

# Linux/macOS Bash
bash test_api.sh
```

## 📚 Common Tasks

### Create a Bookmark
```bash
curl -X POST http://localhost:8000/api/videos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Learn Python",
    "youtube_url": "https://www.youtube.com/watch?v=kqtD5dpn9C0",
    "video_id": "kqtD5dpn9C0",
    "duration_seconds": 4320,
    "status": "not_started"
  }'
```

### Get All Bookmarks
```bash
curl http://localhost:8000/api/videos
```

### Update Bookmark Status
```bash
# Replace VIDEO_ID with actual ID from creation response
curl -X PATCH http://localhost:8000/api/videos/VIDEO_ID \
  -H "Content-Type: application/json" \
  -d '{
    "status": "watching",
    "last_timestamp_seconds": 600
  }'
```

### Delete Bookmark
```bash
curl -X DELETE http://localhost:8000/api/videos/VIDEO_ID
```

## 🐛 Troubleshooting

### "MongoDB connection refused"
```
✗ Failed to connect to MongoDB
```

**Solution:** Start MongoDB
```bash
# Windows (if installed via chocolatey)
mongod

# Or use MongoDB Atlas connection string in .env
```

### "Address already in use"
```
Address already in use (':8000')
```

**Solution:** Use different port
```bash
python -m uvicorn app.main:app --reload --port 8001
```

### "Module not found"
```
ModuleNotFoundError: No module named 'fastapi'
```

**Solution:** Ensure virtual environment is activated
```bash
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

## 📖 Documentation

- **Full Testing Guide**: See `TESTING.md`
- **API Docs (Interactive)**: http://localhost:8000/docs
- **API Schema**: http://localhost:8000/openapi.json

## 🎯 Next Steps

1. **Test the API** using provided test scripts
2. **Review TESTING.md** for detailed examples
3. **Explore Interactive Docs** at `/docs` endpoint
4. **Connect Frontend** (frontend runs on port 3000)
5. **Build Phase 2** - Extension implementation

## 📝 Field Reference

### Required Fields
- `title` - Video title (1-500 chars)
- `youtube_url` - Full YouTube URL
- `video_id` - 11-character YouTube video ID

### Optional Fields
- `thumbnail_url` - Video thumbnail URL
- `duration_seconds` - Video length in seconds (default: 0)
- `last_timestamp_seconds` - Last watched position (default: 0)
- `status` - "not_started" | "watching" | "completed" (default: "not_started")
- `folder_id` - For organizing (null by default)
- `notes` - User notes (empty string by default)

## 🚀 Status Codes

- **201** - Created successfully
- **200** - Success
- **204** - Deleted successfully
- **400** - Bad request (validation error)
- **404** - Not found
- **409** - Conflict (e.g., duplicate video)

## 💡 Tips

1. **Use interactive docs** at `/docs` for easy testing
2. **Copy video IDs** from YouTube URLs (11 alphanumeric characters)
3. **Search requires** exact substring match (case-insensitive)
4. **Pagination** use `skip` and `limit` parameters
5. **Filter** by status using `status=watching` query parameter

## 🔗 API Base URL
```
http://localhost:8000
```

All endpoints start with `/api/videos`

Example: `POST http://localhost:8000/api/videos`

---

**Ready to test?** Run the test script:
```bash
# Windows
.\test_api.ps1

# Linux/macOS
bash test_api.sh
```

Or visit: http://localhost:8000/docs
