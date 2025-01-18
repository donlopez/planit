import { useAuth } from "react-oidc-context"; 

export default function Home() {
    const auth = useAuth();

    if (auth.isAuthenticated) {
      // Display the user's email instead of the name, in case name is not available
      const userName = auth.user?.profile?.email || "User"; // Use email as a fallback
      return <h1>Welcome, {userName}!</h1>;
    }
    
    return <h1>Please log in to continue.</h1>;
}

