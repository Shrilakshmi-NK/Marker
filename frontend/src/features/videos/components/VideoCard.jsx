import React from 'react';
import { formatSeconds, formatDate } from '../utils/formatters';
import './VideoCard.css';

const VideoCard = ({ video, onResume, onEdit, onDelete }) => {
  const handleOpenYouTube = () => {
    window.open(video.youtube_url, '_blank');
  };

  return (
    <div className="video-card">
      <img src={video.thumbnail || 'https://via.placeholder.com/300x200'} alt={video.title} className="video-thumbnail" />
      <div className="video-info">
        <h3 className="video-title">{video.title}</h3>
        <span className={`status-badge status-${video.status}`}>{video.status}</span>
        <p>Last saved: {formatSeconds(video.last_timestamp_seconds)}</p>
        <p>Updated: {formatDate(video.updated_at)}</p>
        {video.folder && <p>Folder: {video.folder}</p>}
        <div className="video-actions">
          <button onClick={onResume} className="btn-resume">Resume</button>
          <button onClick={handleOpenYouTube} className="btn-youtube">YouTube</button>
          <button onClick={onEdit} className="btn-edit">Edit</button>
          <button onClick={onDelete} className="btn-delete">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;