import { useAuth } from "react-oidc-context"; // Import useAuth from react-oidc-context

export default function Profile() {
    const auth = useAuth();

    if (!auth.isAuthenticated) {
      return <h1>Please log in to see your profile.</h1>;
    }

    // Extract user profile details
    const { email, sub } = auth.user?.profile || {};

    return (
      <div>
        <h1>Profile</h1>
        {email ? (
          <div>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>User ID:</strong> {sub}</p>
            {/* You can display other specific profile details as needed */}
          </div>
        ) : (
          <p>No profile information available.</p>
        )}
      </div>
    );
}
