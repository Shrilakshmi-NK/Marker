import React from 'react';
import './TopBar.css';

const TopBar = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortChange,
  onAddVideo
}) => {
  return (
    <div className="top-bar">
      <input
        type="text"
        placeholder="Search videos..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-input"
      />
      <select value={statusFilter} onChange={(e) => onStatusFilterChange(e.target.value)}>
        <option value="all">All Status</option>
        <option value="watching">Watching</option>
        <option value="watched">Watched</option>
        <option value="to-watch">To Watch</option>
      </select>
      <select value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
        <option value="recently-updated">Recently Updated</option>
        <option value="recently-added">Recently Added</option>
        <option value="title-a-z">Title A-Z</option>
      </select>
      <button onClick={onAddVideo} className="add-button">Add Video</button>
    </div>
  );
};

export default TopBar;