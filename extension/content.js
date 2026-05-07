chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getVideoInfo") {
    const title = document.querySelector("h1.title yt-formatted-string")?.textContent ||
                  document.querySelector("h1 yt-formatted-string")?.textContent ||
                  document.title;
    
    const videoId = new URL(window.location.href).searchParams.get("v");
    
    sendResponse({
      title: title || "Untitled Video",
      youtube_id: videoId,
    });
  }
});
