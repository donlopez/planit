import { Link, useMatch, useResolvedPath } from "react-router-dom";

export default function Navbar({ auth }) {
  // Sign-out redirection
  const signOutRedirect = () => {
    const clientId = "55b82psg55qubr8q6dmbrliq2u"; // Your Client ID from Cognito
    const logoutUri = "https://eventplanner.lopezbio.com"; // Correct logout URL
    const cognitoDomain = "https://us-east-1m61qxqqmo.auth.us-east-1.amazoncognito.com"; // Your Cognito User Pool domain
    
    // Remove the user session before redirecting
    auth.removeUser();
    
    // Redirect to Cognito logout
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  return (
    <nav className="nav">
      <Link to="/" className="site-title">
        Eventro
      </Link>
      <ul>
        <CustomLink to="/planit">Planit</CustomLink>
        <CustomLink to="/profile">Profile</CustomLink>
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

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
}
