import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for routing

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="close-btn" onClick={toggleSidebar}>×</button>
      <ul>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/planit">Planit</Link></li> {/* Added Planit tab */}
        <li><Link to="/dashboard">Dashboard</Link></li> {/* Added Dashboard tab */}
      </ul>
    </div>
  );
};

export default Sidebar;