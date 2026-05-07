import React, { useEffect, useState } from "react";
import "./HomePage.css";
import VideoForm from "../components/VideoForm";
import VideoCard from "../components/VideoCard";
import { useVideos } from "../hooks/useVideos";
import { videoService } from "../services/videoService";

const HomePage = () => {
  const { videos, loading, error, fetchVideos, createVideo, updateVideoItem, deleteVideoItem, searchVideos } = useVideos();
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  
  useEffect(() => {
    loadVideos();
  }, [filterStatus]);
  
  const loadVideos = async () => {
    try {
      if (filterStatus === "All") {
        await fetchVideos();
      } else {
        await fetchVideos({ status: filterStatus });
      }
    } catch (err) {
      console.error("Failed to load videos:", err);
    }
  };
  
  const handleAddVideo = async (videoData) => {
    try {
      await createVideo(videoData);
    } catch (err) {
      console.error("Failed to add video:", err);
    }
  };
  
  const handleUpdateVideo = async (videoId, updates) => {
    try {
      await updateVideoItem(videoId, updates);
    } catch (err) {
      console.error("Failed to update video:", err);
    }
  };
  
  const handleDeleteVideo = async (videoId) => {
    try {
      await deleteVideoItem(videoId);
    } catch (err) {
      console.error("Failed to delete video:", err);
    }
  };
  
  const handleOpenVideo = (video) => {
    const url = videoService.getYoutubeUrl(video.youtube_id, video.last_watched_timestamp);
    window.open(url, "_blank");
  };
  
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      loadVideos();
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    try {
      await searchVideos(searchQuery);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };
  
  const handleClearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
    loadVideos();
  };
  
  return (
    <div className="home-page">
      <header className="header">
        <h1>📌 Marker</h1>
        <p className="subtitle">YouTube Bookmark Manager for Study</p>
      </header>
      
      <div className="container">
        <aside className="sidebar">
          <div className="filter-section">
            <h3>Filter</h3>
            <div className="filter-buttons">
              {["All", "Not Started", "Watching", "Completed"].map((status) => (
                <button
                  key={status}
                  className={`filter-button ${filterStatus === status ? "active" : ""}`}
                  onClick={() => setFilterStatus(status)}
                  disabled={loading}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </aside>
        
        <main className="main-content">
          <div className="search-section">
            <form className="search-form" onSubmit={handleSearch}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search videos..."
                className="search-input"
              />
              <button type="submit" className="search-button" disabled={loading}>
                🔍
              </button>
              {isSearching && (
                <button type="button" className="clear-search-button" onClick={handleClearSearch}>
                  ✕
                </button>
              )}
            </form>
          </div>
          
          <section className="add-video-section">
            <h2>Add New Video</h2>
            <VideoForm onSubmit={handleAddVideo} isLoading={loading} />
          </section>
          
          {error && <div className="error-message">{error}</div>}
          
          <section className="videos-section">
            <h2>{isSearching ? "Search Results" : `Videos (${filterStatus})`}</h2>
            
            {loading && !videos.length ? (
              <div className="loading-message">Loading videos...</div>
            ) : videos.length === 0 ? (
              <div className="empty-message">
                {isSearching
                  ? "No videos found matching your search."
                  : "No videos yet. Add one to get started!"}
              </div>
            ) : (
              <div className="videos-grid">
                {videos.map((video) => (
                  <VideoCard
                    key={video.id || video._id}
                    video={video}
                    onUpdate={handleUpdateVideo}
                    onDelete={handleDeleteVideo}
                    onOpen={handleOpenVideo}
                  />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
