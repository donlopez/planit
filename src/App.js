import { useAuth } from "react-oidc-context";
import { useNavigate, Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";
import Planit from "./pages/Planit";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

function App() {
  const auth = useAuth();
  const navigate = useNavigate(); 

  const signOutRedirect = () => {
    const clientId = "55b82psg55qubr8q6dmbrliq2u"; // Your Client ID from Cognito
    const logoutUri = "https://main.d27hasdhmsk331.amplifyapp.com/"; // The URI to redirect to after logout
    const cognitoDomain = "https://us-east-1m61qxqqmo.auth.us-east-1.amazoncognito.com"; // Your Cognito User Pool domain
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  // Redirect to Home after successful authentication
  if (auth.isAuthenticated) {
    navigate("/home", { replace: true });
  }

  // Loading state
  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  // Error handling
  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  return (
    <>
      <Navbar />  {/* Keep Navbar visible on all pages */}
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/planit" element={<Planit />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        {/* Use signinRedirect for initiating login */}
        <button onClick={() => auth.signinRedirect()}>Sign in</button>
        <button onClick={signOutRedirect}>Sign out</button> {/* Sign out button */}
      </div>
    </>
  );
}

export default App;
