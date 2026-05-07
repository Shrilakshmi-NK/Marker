import api from '../../../shared/utils/api';

export const getVideos = async (skip = 0, limit = 100) => {
  try {
    const response = await api.get(`/videos?skip=${skip}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createVideo = async (videoData) => {
  try {
    const response = await api.post('/videos', videoData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateVideo = async (id, videoData) => {
  try {
    const response = await api.patch(`/videos/${id}`, videoData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getResumeUrl = async (id) => {
  try {
    const response = await api.get(`/videos/resume/${id}`);
    return response.data.resume_url;
  } catch (error) {
    throw error;
  }
};

export const deleteVideo = async (id) => {
  try {
    await api.delete(`/videos/${id}`);
  } catch (error) {
    throw error;
  }
};
