import { useAuth } from "react-oidc-context"; // Add this import

export default function Profile() {
    const auth = useAuth();
  
    if (!auth.isAuthenticated) {
      return <h1>Please log in to see your profile.</h1>;
    }
  
    return (
      <div>
        <h1>Profile</h1>
        <pre>{JSON.stringify(auth.user?.profile, null, 2)}</pre>
      </div>
    );
  }
  