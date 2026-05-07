# Marker Backend - File Guide & Quick Navigation

## 📖 Start Here

### First Time? Read These in Order:
1. **QUICKSTART.md** ← Start here (5 minutes)
2. **TESTING.md** ← Learn how to test
3. **README.md** ← Full documentation
4. **API_REFERENCE.md** ← Deep dive into features

## 📁 File Directory

### Core Application Files

#### `app/main.py`
**What**: FastAPI application entry point
**When to read**: Never - just start the server
**Purpose**: Initializes FastAPI app, CORS, database connections
**Key line**: `python -m uvicorn app.main:app --reload`

#### `app/config.py`
**What**: Settings and environment variables
**When to read**: When configuring database or ports
**Purpose**: Centralized configuration management
**Key setup**: Copy `.env.example` to `.env` and edit

#### `app/utils.py`
**What**: Helper functions for YouTube operations
**When to read**: When understanding URL parsing
**Functions**:
- `extract_youtube_video_id()` - Extract ID from URLs
- `generate_resume_url()` - Create resume links
- `format_duration()` - Convert seconds to HH:MM:SS
- `parse_timestamp()` - Convert HH:MM:SS to seconds

#### `app/routes/videos.py`
**What**: All API endpoints
**When to read**: When understanding how requests work
**Endpoints** (7 total):
- POST `/api/videos` - Create
- GET `/api/videos` - List with filters
- GET `/api/videos/{id}` - Get one
- PATCH `/api/videos/{id}` - Update
- DELETE `/api/videos/{id}` - Delete
- GET `/api/videos/resume/{id}` - Resume URL

#### `app/schemas/video.py`
**What**: Request/response validation rules
**When to read**: When checking field requirements
**Key classes**:
- `VideoCreate` - What to send when creating
- `VideoUpdate` - What to send when updating
- `VideoResponse` - What you get back

#### `app/models/video.py`
**What**: MongoDB document structure
**When to read**: When understanding the database
**Key methods**:
- `to_dict()` - Convert to MongoDB format
- `to_response_dict()` - Convert to API response
- `from_dict()` - Create from MongoDB document

#### `app/services/video_service.py`
**What**: Business logic layer
**When to read**: When understanding how operations work
**Key methods** (8 total):
- `create_video()` - Save new bookmark
- `get_video()` - Fetch by ID
- `get_all_videos()` - List with pagination
- `get_videos_by_status()` - Filter by status
- `get_videos_by_folder()` - Filter by folder
- `update_video()` - Modify bookmark
- `delete_video()` - Remove bookmark
- `search_videos()` - Search by text

#### `app/db/connection.py`
**What**: MongoDB connection manager
**When to read**: When troubleshooting database issues
**Key**: Handles connection pool and lifecycle

### Configuration Files

#### `requirements.txt`
**What**: Python dependencies
**When to update**: When adding new packages
**Current packages**: FastAPI, Uvicorn, Pydantic, PyMongo, python-dotenv
**Install**: `pip install -r requirements.txt`

#### `.env.example`
**What**: Template for environment variables
**When to use**: Copy to `.env` for local configuration
**Variables**:
- `MONGODB_URL` - Database connection string
- `DATABASE_NAME` - Database name (default: marker)
- `API_HOST` - Server host (default: 0.0.0.0)
- `API_PORT` - Server port (default: 8000)
- `DEBUG` - Debug mode (default: True)

### Documentation Files

#### `QUICKSTART.md` ⭐ START HERE
**What**: 5-minute setup guide
**When to read**: First time setup
**Contains**:
- Prerequisites checklist
- Step-by-step installation
- Verification commands
- Troubleshooting
- Read time: 5 minutes

#### `TESTING.md` ⭐ THEN READ THIS
**What**: Complete testing guide
**When to read**: After starting server
**Contains**:
- Health check test
- Full endpoint examples (all 7)
- curl commands for each endpoint
- Status code explanations
- Test scenarios
- Postman instructions
- Read time: 20 minutes

#### `README.md`
**What**: Full project documentation
**When to read**: When understanding architecture
**Contains**:
- Setup instructions
- Project structure
- API endpoints summary
- Data model explanation
- Features list
- Troubleshooting
- Development notes
- Read time: 15 minutes

#### `API_REFERENCE.md`
**What**: Complete API documentation
**When to read**: When integrating or building frontend
**Contains**:
- Overview of features
- Technology stack
- Data model details
- Field validation rules
- Common use cases
- Performance tips
- Security notes
- Read time: 25 minutes

#### `PHASE1_SUMMARY.md`
**What**: What was built and how to use it
**When to read**: After initial setup
**Contains**:
- Feature checklist
- Complete file structure
- Implemented features
- File descriptions
- Special features explained
- Read time: 10 minutes

### Testing & Tools

#### `test_api.ps1` (Windows)
**What**: PowerShell test script
**When to use**: After starting server
**Does**:
- Tests all 11 key scenarios
- Creates sample videos
- Tests filters and search
- Tests delete and verify
- Colored output for clarity
**Run**: `.\test_api.ps1`

#### `test_api.sh` (Linux/macOS)
**What**: Bash test script
**When to use**: After starting server
**Does**: Same as PowerShell version but for Unix
**Run**: `bash test_api.sh`

#### `postman_collection.json`
**What**: Postman import file
**When to use**: For GUI-based API testing
**Contains**:
- 20+ prepared requests
- All endpoints covered
- Query parameter examples
- Error scenarios
**How to use**: Import into Postman app

---

## 🚀 Reading Guide by Use Case

### "I just cloned the project"
1. QUICKSTART.md (5 min)
2. Run `.\test_api.ps1` (2 min)
3. Visit http://localhost:8000/docs (5 min)

### "I want to understand the API"
1. README.md (15 min)
2. TESTING.md - curl examples (10 min)
3. Interactive docs at /docs (10 min)

### "I'm building the frontend"
1. README.md - endpoints section (5 min)
2. TESTING.md - response examples (10 min)
3. API_REFERENCE.md - data model (10 min)

### "I need to debug an issue"
1. QUICKSTART.md - troubleshooting (5 min)
2. README.md - troubleshooting (5 min)
3. Check .env configuration (5 min)

### "I want to test an endpoint"
1. TESTING.md - endpoint examples (5 min)
2. Copy curl command and run (1 min)
3. Or use interactive docs at /docs (2 min)

### "I want to understand the code"
1. PHASE1_SUMMARY.md - overview (10 min)
2. API_REFERENCE.md - architecture (10 min)
3. Read source files in order:
   - app/main.py
   - app/config.py
   - app/routes/videos.py
   - app/services/video_service.py
   - app/models/video.py
   - app/schemas/video.py
   - app/db/connection.py

---

## 📚 Documentation Index

| File | Purpose | Read Time | Audience |
|------|---------|-----------|----------|
| QUICKSTART.md | 5-min setup | 5 min | Everyone - Start here! |
| TESTING.md | How to test | 20 min | QA, testers, users |
| README.md | Full docs | 15 min | Developers |
| API_REFERENCE.md | Deep dive | 25 min | Integrators, builders |
| PHASE1_SUMMARY.md | What was built | 10 min | Project managers |
| This file (INDEX.md) | Navigation guide | 10 min | You are here |

---

## 🔑 Key Concepts Quick Reference

### Authentication
**Status**: Not implemented in Phase 1
**When**: Phase 4
**Location**: Will be in middleware after implemented

### Folders
**Status**: Prepared but not functional
**Field**: `folder_id` in video model
**When**: Phase 3
**Implementation**: Folder CRUD endpoints in Phase 3

### Resume URLs
**Function**: `generate_resume_url()` in `app/utils.py`
**Endpoint**: `GET /api/videos/resume/{id}`
**Returns**: YouTube URL with timestamp parameter

### Video ID Extraction
**Function**: `extract_youtube_video_id()` in `app/utils.py`
**Supports**: 4 URL formats
**Validation**: Automatic on create/update

### Status States
**Values**: `not_started`, `watching`, `completed`
**Usage**: Filter, track progress
**Default**: `not_started`

### Error Codes
- 201 = Created successfully
- 400 = Bad request (validation failed)
- 404 = Not found
- 409 = Already bookmarked
- 204 = Deleted successfully

---

## 🛠️ Common Commands

### Start Server
```bash
python -m uvicorn app.main:app --reload
```

### Run Tests
```bash
.\test_api.ps1  # Windows
bash test_api.sh  # Linux/macOS
```

### Open Interactive Docs
```
http://localhost:8000/docs
```

### Create First Bookmark
```bash
curl -X POST http://localhost:8000/api/videos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Video",
    "youtube_url": "https://youtu.be/jS4aFq5-91o",
    "video_id": "jS4aFq5-91o"
  }'
```

---

## 📋 File Checklist

- ✅ app/main.py - FastAPI app
- ✅ app/config.py - Settings
- ✅ app/utils.py - Helpers
- ✅ app/routes/videos.py - Endpoints
- ✅ app/schemas/video.py - Validation
- ✅ app/models/video.py - Database models
- ✅ app/services/video_service.py - Business logic
- ✅ app/db/connection.py - Database manager
- ✅ requirements.txt - Dependencies
- ✅ .env.example - Environment template
- ✅ QUICKSTART.md - Quick setup
- ✅ TESTING.md - Testing guide
- ✅ README.md - Full documentation
- ✅ API_REFERENCE.md - API details
- ✅ PHASE1_SUMMARY.md - What was built
- ✅ test_api.ps1 - Windows tests
- ✅ test_api.sh - Unix tests
- ✅ postman_collection.json - Postman import
- ✅ INDEX.md - This file

---

## 🎯 Quick Start Path

```
1. Read QUICKSTART.md (5 min)
   ↓
2. Run `.\test_api.ps1` (2 min)
   ↓
3. Visit http://localhost:8000/docs (5 min)
   ↓
4. Read TESTING.md for examples (20 min)
   ↓
5. Start building frontend!
```

---

## 💡 Tips

1. **Use interactive docs** - More intuitive than curl
2. **Test everything** - Scripts provided do thorough testing
3. **Check errors carefully** - They tell you exactly what's wrong
4. **Use Postman** - Better than curl for complex requests
5. **Read TESTING.md** - Has all the examples you need

---

## 🔗 Navigation

**Just starting?** → QUICKSTART.md
**Want examples?** → TESTING.md
**Need full docs?** → README.md or API_REFERENCE.md
**Understanding code?** → PHASE1_SUMMARY.md then source files
**Need help?** → README.md troubleshooting section

---

**You're all set!** Start with QUICKSTART.md 👉 [QUICKSTART.md](./QUICKSTART.md)
