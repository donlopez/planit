import { Link, useMatch, useResolvedPath } from "react-router-dom";

export default function Navbar({ auth }) {
  // Sign-out redirection
  const signOutRedirect = () => {
    const clientId = "55b82psg55qubr8q6dmbrliq2u"; // Your Client ID from Cognito
    const logoutUri = "https://eventplanner.lopezbio.com"; // The URI to redirect to after logout (make sure it's in Cognito's settings)
    const cognitoDomain = "https://us-east-1m61qxqqmo.auth.us-east-1.amazoncognito.com"; // Your Cognito User Pool domain
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
        {/* Conditionally render sign-in or sign-out button as links */}
        {auth.isAuthenticated ? (
          <li>
            {/* Use signOutRedirect on click */}
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
