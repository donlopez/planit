import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import the Link component
import Sidebar from './sidebar'; // Import the Sidebar component

export default function Navbar({ auth }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const signOutRedirect = () => {
    const clientId = "55b82psg55qubr8q6dmbrliq2u"; // Your Client ID from Cognito
    const logoutUri = "https://eventplanner.lopezbio.com"; // Correct logout URL
    const cognitoDomain = "https://us-east-1m61qxqqmo.auth.us-east-1.amazoncognito.com"; // Your Cognito User Pool domain

    auth.removeUser();
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <nav className="nav">
      <Link to="/" className="site-title">Eventro</Link>
      <button className="hamburger" onClick={toggleSidebar}>
        &#9776; {/* Hamburger icon */}
      </button>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <ul>
        {auth.isAuthenticated ? (
          <li>
            <Link to="#" onClick={signOutRedirect} className="nav-link">Sign out</Link>
          </li>
        ) : (
          <li>
            <Link to="#" onClick={() => auth.signinRedirect()} className="nav-link">Sign in</Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
