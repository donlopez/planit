import { useAuth } from "react-oidc-context"; 

export default function Home() {
    const auth = useAuth();

    if (auth.isAuthenticated) {
      return <h1>Welcome, {auth.user?.profile?.name}!</h1>;
    }
    
    return <h1>Please log in to continue.</h1>;
}
