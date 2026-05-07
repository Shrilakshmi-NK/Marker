# Marker Extension

Chrome extension for YouTube bookmark manager (Manifest V3).

## Setup (Not Yet Implemented - Scaffold Only)

This folder contains the structure for the Chrome extension. Implementation will be done in the next phase.

### Current Structure

- `manifest.json` - Extension configuration
- `background.js` - Service worker (background script)
- `content.js` - Content script for YouTube pages
- `popup.html` - Extension popup UI
- `popup.css` - Popup styles
- `popup.js` - Popup logic
- `icons/` - Extension icons

### Features (To Be Implemented)

- 🔄 Quick save YouTube videos from the extension popup
- 🎯 Automatically extract video title and URL
- 📝 Add notes directly from the extension
- 🔗 One-click access to saved videos

### Installation

(Coming in next phase)

1. Build the extension
2. Go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select this folder

### Development

The extension communicates with the backend API at `http://localhost:8000/api`.
