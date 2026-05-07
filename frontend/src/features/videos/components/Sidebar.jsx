import React from 'react';
import './Sidebar.css';

const Sidebar = ({ selectedFolder, onSelectFolder }) => {
  const folders = ['All Videos', 'Unsorted'];

  return (
    <div className="sidebar">
      <h2>Folders</h2>
      <ul>
        {folders.map(folder => (
          <li
            key={folder}
            className={selectedFolder === folder ? 'active' : ''}
            onClick={() => onSelectFolder(folder)}
          >
            {folder}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;