import React, { createContext, useContext, useState, useCallback } from "react";

const VideoContext = createContext();

export const VideoProvider = ({ children }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const addVideo = useCallback((video) => {
    setVideos((prev) => [video, ...prev]);
  }, []);
  
  const updateVideo = useCallback((videoId, updates) => {
    setVideos((prev) =>
      prev.map((v) => (v.id === videoId || v._id === videoId ? { ...v, ...updates } : v))
    );
  }, []);
  
  const removeVideo = useCallback((videoId) => {
    setVideos((prev) => prev.filter((v) => v.id !== videoId && v._id !== videoId));
  }, []);
  
  const setAllVideos = useCallback((videoList) => {
    setVideos(videoList);
  }, []);
  
  const value = {
    videos,
    loading,
    error,
    addVideo,
    updateVideo,
    removeVideo,
    setAllVideos,
    setLoading,
    setError,
  };
  
  return (
    <VideoContext.Provider value={value}>{children}</VideoContext.Provider>
  );
};

export const useVideoContext = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error("useVideoContext must be used within VideoProvider");
  }
  return context;
};
