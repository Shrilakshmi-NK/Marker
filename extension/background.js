chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getVideoData") {
    // Extract video data from the page
    const url = new URL(sender.url);
    const videoId = url.searchParams.get("v");
    
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      chrome.tabs.sendMessage(tab.id, { action: "getVideoInfo" }, (response) => {
        if (response && response.title) {
          sendResponse({
            youtube_id: videoId,
            url: tab.url,
            title: response.title,
          });
        }
      });
    });
    
    return true;
  }
});

chrome.action.onClicked.addListener((tab) => {
  if (tab.url && (tab.url.includes("youtube.com") || tab.url.includes("youtu.be"))) {
    chrome.action.setPopup({ popup: "popup.html" });
  }
});
