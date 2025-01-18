import { Link, useMatch, useResolvedPath } from "react-router-dom";

export default function Navbar({ auth }) {
  const signOutRedirect = () => {
    const clientId = "55b82psg55qubr8q6dmbrliq2u"; // Your Client ID from Cognito
    const logoutUri = "https://main.d27hasdhmsk331.amplifyapp.com/"; // The URI to redirect to after logout
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
            <Link to="#" onClick={() => auth.removeUser()} className="nav-link">Sign out</Link>
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
