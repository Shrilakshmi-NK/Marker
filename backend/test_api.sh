#!/bin/bash
# Quick test script for Marker API
# Run this to test all Phase 1 endpoints

API_URL="http://localhost:8000"

echo "🧪 Testing Marker API Phase 1"
echo "=============================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test 1: Health Check
echo -e "${BLUE}1. Health Check${NC}"
curl -X GET $API_URL/health
echo ""
echo ""

# Test 2: Create Video
echo -e "${BLUE}2. Create Video${NC}"
VIDEO_RESPONSE=$(curl -s -X POST $API_URL/api/videos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "JavaScript Fundamentals",
    "youtube_url": "https://www.youtube.com/watch?v=jS4aFq5-91o",
    "video_id": "jS4aFq5-91o",
    "thumbnail_url": "https://img.youtube.com/vi/jS4aFq5-91o/0.jpg",
    "duration_seconds": 3600,
    "status": "not_started",
    "notes": "Core JavaScript concepts"
  }')
echo $VIDEO_RESPONSE | jq .
VIDEO_ID=$(echo $VIDEO_RESPONSE | jq -r '.id')
echo ""

# Test 3: Get All Videos
echo -e "${BLUE}3. Get All Videos${NC}"
curl -s -X GET "$API_URL/api/videos?limit=10" | jq .
echo ""
echo ""

# Test 4: Get Single Video
echo -e "${BLUE}4. Get Single Video${NC}"
curl -s -X GET "$API_URL/api/videos/$VIDEO_ID" | jq .
echo ""
echo ""

# Test 5: Update Video
echo -e "${BLUE}5. Update Video (Change Status to Watching)${NC}"
curl -s -X PATCH "$API_URL/api/videos/$VIDEO_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "watching",
    "last_timestamp_seconds": 600,
    "notes": "Updated: Now on closures section"
  }' | jq .
echo ""
echo ""

# Test 6: Get Resume URL
echo -e "${BLUE}6. Get Resume URL${NC}"
curl -s -X GET "$API_URL/api/videos/resume/$VIDEO_ID" | jq .
echo ""
echo ""

# Test 7: Create Another Video
echo -e "${BLUE}7. Create Another Video (Different Status)${NC}"
VIDEO_RESPONSE2=$(curl -s -X POST $API_URL/api/videos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "React Hooks Tutorial",
    "youtube_url": "https://youtu.be/dQw4w9WgXcQ",
    "video_id": "dQw4w9WgXcQ",
    "duration_seconds": 1800,
    "status": "completed",
    "notes": "Finished!"
  }')
echo $VIDEO_RESPONSE2 | jq .
VIDEO_ID2=$(echo $VIDEO_RESPONSE2 | jq -r '.id')
echo ""
echo ""

# Test 8: Filter by Status
echo -e "${BLUE}8. Filter Videos by Status (watching)${NC}"
curl -s -X GET "$API_URL/api/videos?status=watching" | jq .
echo ""
echo ""

# Test 9: Search Videos
echo -e "${BLUE}9. Search Videos${NC}"
curl -s -X GET "$API_URL/api/videos?search=javascript" | jq .
echo ""
echo ""

# Test 10: Delete Video
echo -e "${BLUE}10. Delete Video${NC}"
curl -s -X DELETE "$API_URL/api/videos/$VIDEO_ID2" -w "\nStatus: %{http_code}\n"
echo ""
echo ""

# Test 11: Verify Deletion
echo -e "${BLUE}11. Verify Deletion (Should get 404)${NC}"
curl -s -X GET "$API_URL/api/videos/$VIDEO_ID2" -w "\nStatus: %{http_code}\n" | jq .
echo ""
echo ""

echo -e "${GREEN}✓ All tests completed!${NC}"
echo "First video ID: $VIDEO_ID"
echo "Second video ID: $VIDEO_ID2"
