const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

export const api = {
  videos: {
    create: async (videoData) => {
      const res = await fetch(`${API_BASE_URL}/videos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(videoData),
      });
      if (!res.ok) throw new Error("Failed to create video");
      return res.json();
    },
    
    getAll: async (skip = 0, limit = 100) => {
      const res = await fetch(`${API_BASE_URL}/videos?skip=${skip}&limit=${limit}`);
      if (!res.ok) throw new Error("Failed to fetch videos");
      return res.json();
    },
    
    getById: async (videoId) => {
      const res = await fetch(`${API_BASE_URL}/videos/${videoId}`);
      if (!res.ok) throw new Error("Failed to fetch video");
      return res.json();
    },
    
    update: async (videoId, updateData) => {
      const res = await fetch(`${API_BASE_URL}/videos/${videoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      if (!res.ok) throw new Error("Failed to update video");
      return res.json();
    },
    
    delete: async (videoId) => {
      const res = await fetch(`${API_BASE_URL}/videos/${videoId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete video");
      return res.json();
    },
    
    getByStatus: async (status, skip = 0, limit = 100) => {
      const res = await fetch(`${API_BASE_URL}/videos?status=${status}&skip=${skip}&limit=${limit}`);
      if (!res.ok) throw new Error("Failed to fetch videos by status");
      return res.json();
    },
    
    getByFolder: async (folderId, skip = 0, limit = 100) => {
      const res = await fetch(`${API_BASE_URL}/videos?folder_id=${folderId}&skip=${skip}&limit=${limit}`);
      if (!res.ok) throw new Error("Failed to fetch videos by folder");
      return res.json();
    },
    
    search: async (query, skip = 0, limit = 100) => {
      const res = await fetch(`${API_BASE_URL}/videos/search/${encodeURIComponent(query)}?skip=${skip}&limit=${limit}`);
      if (!res.ok) throw new Error("Failed to search videos");
      return res.json();
    },
  },
};
