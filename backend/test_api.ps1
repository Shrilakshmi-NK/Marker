# Quick test script for Marker API (Windows PowerShell)
# Run this to test all Phase 1 endpoints

$ApiUrl = "http://localhost:8000"

Write-Host "🧪 Testing Marker API Phase 1" -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Green
Write-Host ""

# Test 1: Health Check
Write-Host "1. Health Check" -ForegroundColor Blue
$response = Invoke-RestMethod -Uri "$ApiUrl/health" -Method Get
$response | ConvertTo-Json | Write-Host
Write-Host ""

# Test 2: Create Video
Write-Host "2. Create Video" -ForegroundColor Blue
$body = @{
    title = "JavaScript Fundamentals"
    youtube_url = "https://www.youtube.com/watch?v=jS4aFq5-91o"
    video_id = "jS4aFq5-91o"
    thumbnail_url = "https://img.youtube.com/vi/jS4aFq5-91o/0.jpg"
    duration_seconds = 3600
    status = "not_started"
    notes = "Core JavaScript concepts"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "$ApiUrl/api/videos" -Method Post `
    -ContentType "application/json" -Body $body
$response | ConvertTo-Json | Write-Host
$videoId = $response.id
Write-Host ""

# Test 3: Get All Videos
Write-Host "3. Get All Videos" -ForegroundColor Blue
$response = Invoke-RestMethod -Uri "$ApiUrl/api/videos?limit=10" -Method Get
$response | ConvertTo-Json | Write-Host
Write-Host ""

# Test 4: Get Single Video
Write-Host "4. Get Single Video" -ForegroundColor Blue
$response = Invoke-RestMethod -Uri "$ApiUrl/api/videos/$videoId" -Method Get
$response | ConvertTo-Json | Write-Host
Write-Host ""

# Test 5: Update Video
Write-Host "5. Update Video (Change Status to Watching)" -ForegroundColor Blue
$body = @{
    status = "watching"
    last_timestamp_seconds = 600
    notes = "Updated: Now on closures section"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "$ApiUrl/api/videos/$videoId" -Method Patch `
    -ContentType "application/json" -Body $body
$response | ConvertTo-Json | Write-Host
Write-Host ""

# Test 6: Get Resume URL
Write-Host "6. Get Resume URL" -ForegroundColor Blue
$response = Invoke-RestMethod -Uri "$ApiUrl/api/videos/resume/$videoId" -Method Get
$response | ConvertTo-Json | Write-Host
Write-Host ""

# Test 7: Create Another Video
Write-Host "7. Create Another Video (Different Status)" -ForegroundColor Blue
$body = @{
    title = "React Hooks Tutorial"
    youtube_url = "https://youtu.be/dQw4w9WgXcQ"
    video_id = "dQw4w9WgXcQ"
    duration_seconds = 1800
    status = "completed"
    notes = "Finished!"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "$ApiUrl/api/videos" -Method Post `
    -ContentType "application/json" -Body $body
$response | ConvertTo-Json | Write-Host
$videoId2 = $response.id
Write-Host ""

# Test 8: Filter by Status
Write-Host "8. Filter Videos by Status (watching)" -ForegroundColor Blue
$response = Invoke-RestMethod -Uri "$ApiUrl/api/videos?status=watching" -Method Get
$response | ConvertTo-Json | Write-Host
Write-Host ""

# Test 9: Search Videos
Write-Host "9. Search Videos" -ForegroundColor Blue
$response = Invoke-RestMethod -Uri "$ApiUrl/api/videos?search=javascript" -Method Get
$response | ConvertTo-Json | Write-Host
Write-Host ""

# Test 10: Delete Video
Write-Host "10. Delete Video" -ForegroundColor Blue
try {
    $response = Invoke-RestMethod -Uri "$ApiUrl/api/videos/$videoId2" -Method Delete
    Write-Host "✓ Deleted successfully" -ForegroundColor Green
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""

# Test 11: Verify Deletion
Write-Host "11. Verify Deletion (Should get 404)" -ForegroundColor Blue
try {
    $response = Invoke-RestMethod -Uri "$ApiUrl/api/videos/$videoId2" -Method Get
    Write-Host "ERROR: Video still exists!" -ForegroundColor Red
} catch {
    Write-Host "✓ Video correctly deleted (404 error)" -ForegroundColor Green
}
Write-Host ""

Write-Host "✓ All tests completed!" -ForegroundColor Green
Write-Host "First video ID: $videoId"
Write-Host "Second video ID: $videoId2"
