import React from 'react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="close-btn" onClick={toggleSidebar}>×</button>
      <ul>
        <li><a href="/profile">Profile</a></li>
        {/* Add more tabs as needed */}
      </ul>
    </div>
  );
};

export default Sidebar;

