import { useState, useCallback } from "react";
import { api } from "../../../utils/api";

export const useVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchVideos = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (filters.status) {
        data = await api.videos.getByStatus(filters.status, filters.skip, filters.limit);
      } else if (filters.folderId) {
        data = await api.videos.getByFolder(filters.folderId, filters.skip, filters.limit);
      } else {
        data = await api.videos.getAll(filters.skip, filters.limit);
      }
      setVideos(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const createVideo = useCallback(async (videoData) => {
    setLoading(true);
    setError(null);
    try {
      const newVideo = await api.videos.create(videoData);
      setVideos((prev) => [newVideo, ...prev]);
      return newVideo;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const updateVideoItem = useCallback(async (videoId, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await api.videos.update(videoId, updateData);
      setVideos((prev) =>
        prev.map((v) => (v.id === videoId || v._id === videoId ? updated : v))
      );
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const deleteVideoItem = useCallback(async (videoId) => {
    setLoading(true);
    setError(null);
    try {
      await api.videos.delete(videoId);
      setVideos((prev) => prev.filter((v) => v.id !== videoId && v._id !== videoId));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const searchVideos = useCallback(async (query) => {
    setLoading(true);
    setError(null);
    try {
      const results = await api.videos.search(query);
      setVideos(results);
      return results;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    videos,
    loading,
    error,
    fetchVideos,
    createVideo,
    updateVideoItem,
    deleteVideoItem,
    searchVideos,
  };
};
