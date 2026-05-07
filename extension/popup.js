const API_URL = "http://localhost:8000/api";

document.getElementById("videoForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const messageEl = document.getElementById("message");
  messageEl.classList.add("hidden");
  
  try {
    // Get current tab info
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab.url.includes("youtube.com") && !tab.url.includes("youtu.be")) {
      showMessage("This extension only works on YouTube", "error");
      return;
    }
    
    // Extract video ID from URL
    const url = new URL(tab.url);
    const videoId = url.searchParams.get("v");
    
    if (!videoId) {
      showMessage("Could not find video ID", "error");
      return;
    }
    
    // Get form data
    const title = document.getElementById("videoTitle").value.trim();
    const notes = document.getElementById("videoNotes").value.trim();
    
    if (!title) {
      showMessage("Please enter a title", "error");
      return;
    }
    
    // Send to backend
    const response = await fetch(`${API_URL}/videos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        youtube_id: videoId,
        title: title,
        url: tab.url,
        notes: notes,
        thumbnail_url: `https://img.youtube.com/vi/${videoId}/0.jpg`,
      }),
    });
    
    if (!response.ok) {
      throw new Error("Failed to save video");
    }
    
    showMessage("✓ Video saved successfully!", "success");
    document.getElementById("videoForm").reset();
    
  } catch (error) {
    showMessage("Error: " + error.message, "error");
  }
});

function showMessage(text, type) {
  const messageEl = document.getElementById("message");
  messageEl.textContent = text;
  messageEl.className = `message ${type}`;
}

// Load current video info when popup opens
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tab = tabs[0];
  
  if (tab.url.includes("youtube.com") || tab.url.includes("youtu.be")) {
    const url = new URL(tab.url);
    const videoId = url.searchParams.get("v");
    
    if (videoId) {
      // Try to get title from page
      chrome.tabs.sendMessage(
        tab.id,
        { action: "getVideoInfo" },
        (response) => {
          if (response && response.title) {
            document.getElementById("videoTitle").value = response.title;
          }
        }
      );
    }
  }
});
