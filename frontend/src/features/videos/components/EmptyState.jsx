import React from 'react';
import './EmptyState.css';

const EmptyState = ({ onAddVideo }) => {
  return (
    <div className="empty-state">
      <h2>No videos found</h2>
      <p>Start by adding your first video bookmark.</p>
      <button onClick={onAddVideo} className="add-first-button">Add Your First Video</button>
    </div>
  );
};

export default EmptyState;