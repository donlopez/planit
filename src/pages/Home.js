import { useAuth } from "react-oidc-context";

export default function Home() {
  const auth = useAuth();

  if (auth.isAuthenticated) {
    const userName = auth.user?.profile?.email || "User";
    return <h1>Welcome, {userName}!</h1>;
  }

  return (
    <div>
      <h1>Welcome to Event Planner!</h1>
      <p>
        Event Planner is your one-stop solution to manage, plan, and track all
        your events. Log in to get started!
      </p>
    </div>
  );
}
