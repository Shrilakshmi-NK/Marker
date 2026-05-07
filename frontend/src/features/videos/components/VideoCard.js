import React, { useState } from "react";
import "./VideoCard.css";
import { videoService } from "../services/videoService";

const VideoCard = ({ video, onUpdate, onDelete, onOpen }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editStatus, setEditStatus] = useState(video.status);
  const [editNotes, setEditNotes] = useState(video.notes);
  
  const handleStatusChange = (e) => {
    setEditStatus(e.target.value);
  };
  
  const handleNotesChange = (e) => {
    setEditNotes(e.target.value);
  };
  
  const handleSave = async () => {
    await onUpdate(video.id || video._id, {
      status: editStatus,
      notes: editNotes,
    });
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditStatus(video.status);
    setEditNotes(video.notes);
    setIsEditing(false);
  };
  
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      await onDelete(video.id || video._id);
    }
  };
  
  return (
    <div className="video-card">
      <div className="video-card-thumbnail">
        <img
          src={video.thumbnail_url || "https://via.placeholder.com/320x180?text=No+Thumbnail"}
          alt={video.title}
        />
        <div className="video-card-overlay">
          <button
            className="video-card-button play-button"
            onClick={() => onOpen(video)}
          >
            ▶ Watch
          </button>
        </div>
      </div>
      
      <div className="video-card-content">
        <h3 className="video-card-title">{video.title}</h3>
        
        {!isEditing && (
          <>
            <div className="video-card-meta">
              <span className={`status-badge status-${video.status.replace(/\s+/g, "-").toLowerCase()}`}>
                {video.status}
              </span>
              {video.last_watched_timestamp > 0 && (
                <span className="timestamp-badge">
                  {videoService.formatTimestamp(video.last_watched_timestamp)}
                </span>
              )}
            </div>
            
            {video.notes && (
              <p className="video-card-notes">{video.notes}</p>
            )}
            
            <div className="video-card-actions">
              <button
                className="video-card-button edit-button"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
              <button
                className="video-card-button delete-button"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </>
        )}
        
        {isEditing && (
          <div className="video-card-edit">
            <div className="edit-group">
              <label htmlFor={`status-${video.id}`}>Status:</label>
              <select
                id={`status-${video.id}`}
                value={editStatus}
                onChange={handleStatusChange}
              >
                <option value="Not Started">Not Started</option>
                <option value="Watching">Watching</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            
            <div className="edit-group">
              <label htmlFor={`notes-${video.id}`}>Notes:</label>
              <textarea
                id={`notes-${video.id}`}
                value={editNotes}
                onChange={handleNotesChange}
                rows={2}
              />
            </div>
            
            <div className="edit-actions">
              <button
                className="video-card-button save-button"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="video-card-button cancel-button"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCard;
