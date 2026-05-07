# Marker - YouTube Bookmark Manager

A comprehensive YouTube video bookmark manager with web and extension interfaces for study use.

## 🎯 Project Overview

Marker helps you organize YouTube educational videos with:
- Save videos with timestamps
- Track watching progress (Not Started → Watching → Completed)
- Add personal notes
- Organize into folders (coming soon)
- Search and filter capabilities
- Quick access via Chrome extension

## 📁 Project Structure

```
Marker/
├── backend/          # FastAPI backend
├── frontend/         # React web app
├── extension/        # Chrome extension (Manifest V3)
└── README.md         # This file
```

## 🚀 Quick Start

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux

pip install -r requirements.txt

cp .env.example .env
# Edit .env with your MongoDB connection

uvicorn app.main:app --reload
```

Backend will run on `http://localhost:8000`

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend will run on `http://localhost:3000`

### Extension Setup

```bash
cd extension
# Not yet implemented - scaffold ready for development
```

## 🏗️ Architecture

### Backend (FastAPI + MongoDB)
- **Routes** (`app/routes/`) - API endpoints
- **Schemas** (`app/schemas/`) - Pydantic models for request/response validation
- **Models** (`app/models/`) - Database models
- **Services** (`app/services/`) - Business logic layer
- **DB** (`app/db/`) - Database connection management

### Frontend (React + Context API)
- **Features** (`src/features/videos/`) - Feature-based organization
  - `pages/` - Full page components
  - `components/` - Reusable UI components
  - `services/` - API and utility services
  - `hooks/` - Custom React hooks
  - `context/` - Global state with Context API
- **Utils** (`src/utils/`) - Shared utilities
- **Styles** (`src/styles/`) - Global CSS variables

### Extension (Manifest V3)
- Background service worker
- Content script for YouTube
- Popup interface

## 📚 Current Features

✅ **Backend**
- CRUD operations for videos
- Filter by status
- Filter by folder
- Full-text search
- MongoDB integration

✅ **Frontend**
- Add videos from YouTube URL
- View video grid with thumbnails
- Update video status and notes
- Delete videos
- Filter videos by status
- Search videos
- Responsive design

🔄 **Extension**
- Structure ready (implementation pending)

## 🔨 What's Next

### Phase 2: Extension Implementation
- [ ] Complete popup interface
- [ ] Background service worker logic
- [ ] Content script integration
- [ ] Test on YouTube pages

### Phase 3: Folder Management
- [ ] Create folder endpoints
- [ ] Folder CRUD in frontend
- [ ] Organize videos into folders
- [ ] Folder filtering

### Phase 4: Enhanced Features
- [ ] User authentication
- [ ] Video collections/playlists
- [ ] Tags and categories
- [ ] Share collections
- [ ] Analytics (watch time, completion rate)

### Phase 5: Polish
- [ ] TypeScript migration
- [ ] Component library
- [ ] Advanced filtering/sorting
- [ ] Performance optimization
- [ ] Accessibility improvements

## 🛠️ Tech Stack

- **Frontend**: React 18, CSS3, Context API
- **Backend**: FastAPI, Pydantic, PyMongo
- **Database**: MongoDB
- **Extension**: Manifest V3 (JavaScript)
- **Deployment**: (planned for later phases)

## 📝 Notes

- No authentication yet (frontend only for now)
- Using plain JavaScript (no TypeScript yet)
- Using Context API instead of Redux for state management
- MongoDB running locally
- CORS enabled for localhost:3000

## 🤝 Contributing

This is a learning project structure. Feel free to extend and modify!

## 📄 License

MIT
