import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { useAuth } from "react-oidc-context";

export default function Navbar() {
  const auth = useAuth();

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
            <button onClick={() => auth.signOut()}>Logout</button>
          </li>
        ) : (
          <li>
            <button onClick={() => auth.signIn()}>Login</button>
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
