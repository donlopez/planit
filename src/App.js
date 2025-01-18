import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function App() {
  const auth = useAuth();
  const navigate = useNavigate(); // Initialize navigate

  // Sign-out redirection
  const signOutRedirect = () => {
    const clientId = "55b82psg55qubr8q6dmbrliq2u"; // Your Client ID from Cognito
    const logoutUri = "https://main.d27hasdhmsk331.amplifyapp.com/"; // The URI to redirect to after logout
    const cognitoDomain = "https://us-east-1m61qxqqmo.auth.us-east-1.amazoncognito.com"; // Your Cognito User Pool domain
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  // Loading state
  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  // Error handling
  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  // When the user is authenticated
  if (auth.isAuthenticated) {
    // Navigate to home page after authentication
    navigate("/home");

    return (
      <div>
        <h2>Welcome, {auth.user?.profile?.email}!</h2>
        <button onClick={() => auth.removeUser()}>Sign out</button>
      </div>
    );
  }

  // When the user is not authenticated
  return (
    <div>
      <button onClick={() => auth.signinRedirect()}>Sign in</button>
      <button onClick={() => signOutRedirect()}>Sign out (Redirect)</button>
    </div>
  );
}

export default App;
