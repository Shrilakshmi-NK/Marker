# Marker Frontend

React frontend for YouTube video bookmark manager.

## Setup

### Prerequisites
- Node.js 16+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm start
```

Frontend will be available at `http://localhost:3000`

## Project Structure

- `src/`
  - `features/videos/` - Videos feature
    - `pages/` - Page components (HomePage)
    - `components/` - Reusable components (VideoCard, VideoForm)
    - `services/` - Business logic (videoService)
    - `hooks/` - Custom hooks (useVideos)
    - `context/` - React Context (VideoContext)
  - `utils/` - Utility functions (api.js)
  - `styles/` - Global styles (variables.css)
  - `App.js` - Root component
  - `index.js` - Entry point

## Features

- ✅ Add YouTube videos with URL
- ✅ View saved videos with thumbnails
- ✅ Update video status (Not Started, Watching, Completed)
- ✅ Add notes to videos
- ✅ Delete videos
- ✅ Filter videos by status
- ✅ Search videos
- ✅ Responsive design

## Environment Variables

The frontend connects to the backend at `http://localhost:8000` by default.
To change this, set `REACT_APP_API_URL` in your environment.

```bash
REACT_APP_API_URL=http://your-api-url
```
