import React, { useState, useEffect } from 'react';
import './VideoForm.css';

const VideoForm = ({ video, onSubmit }) => {
  const [formData, setFormData] = useState({
    youtube_url: '',
    title: '',
    status: 'to-watch',
    last_timestamp_seconds: 0,
    notes: '',
    folder: ''
  });

  useEffect(() => {
    if (video) {
      setFormData({
        youtube_url: video.youtube_url || '',
        title: video.title || '',
        status: video.status || 'to-watch',
        last_timestamp_seconds: video.last_timestamp_seconds || 0,
        notes: video.notes || '',
        folder: video.folder || ''
      });
    }
  }, [video]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'last_timestamp_seconds' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="video-form">
      <h2>{video ? 'Edit Video' : 'Add Video'}</h2>
      <div className="form-group">
        <label>YouTube URL:</label>
        <input
          type="url"
          name="youtube_url"
          value={formData.youtube_url}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Status:</label>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="to-watch">To Watch</option>
          <option value="watching">Watching</option>
          <option value="watched">Watched</option>
        </select>
      </div>
      <div className="form-group">
        <label>Last Timestamp (seconds):</label>
        <input
          type="number"
          name="last_timestamp_seconds"
          value={formData.last_timestamp_seconds}
          onChange={handleChange}
          min="0"
        />
      </div>
      <div className="form-group">
        <label>Notes:</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Folder:</label>
        <input
          type="text"
          name="folder"
          value={formData.folder}
          onChange={handleChange}
        />
      </div>
      <button type="submit" className="submit-button">
        {video ? 'Update Video' : 'Add Video'}
      </button>
    </form>
  );
};

export default VideoForm;