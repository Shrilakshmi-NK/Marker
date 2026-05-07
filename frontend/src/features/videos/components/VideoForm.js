import React, { useState } from "react";
import "./VideoForm.css";
import { videoService } from "../services/videoService";

const VideoForm = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    url: "",
    title: "",
  });
  const [error, setError] = useState("");
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!formData.url.trim()) {
      setError("YouTube URL is required");
      return;
    }
    
    const youtubeId = videoService.extractYoutubeId(formData.url);
    if (!youtubeId) {
      setError("Invalid YouTube URL");
      return;
    }
    
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }
    
    try {
      const videoData = {
        youtube_id: youtubeId,
        url: formData.url,
        title: formData.title.trim(),
        thumbnail_url: videoService.getYoutubeThumbnail(youtubeId),
        status: "Not Started",
        last_watched_timestamp: 0,
        notes: "",
      };
      
      await onSubmit(videoData);
      setFormData({ url: "", title: "" });
    } catch (err) {
      setError(err.message);
    }
  };
  
  return (
    <form className="video-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="url">YouTube URL</label>
        <input
          id="url"
          type="text"
          name="url"
          value={formData.url}
          onChange={handleChange}
          placeholder="https://www.youtube.com/watch?v=..."
          disabled={isLoading}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="title">Video Title</label>
        <input
          id="title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter video title"
          disabled={isLoading}
        />
      </div>
      
      {error && <div className="form-error">{error}</div>}
      
      <button type="submit" className="form-submit" disabled={isLoading}>
        {isLoading ? "Adding..." : "Add Video"}
      </button>
    </form>
  );
};

export default VideoForm;
