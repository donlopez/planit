import { useState, useEffect } from "react";
import { useAuth } from "react-oidc-context";

export default function Profile() {
  const auth = useAuth(); // Get authentication details
  const [userData, setUserData] = useState(null); // Holds the user data from the database
  const [error, setError] = useState(null); // Holds any errors during the API call

  const apiUrl = "https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/rds-connector-function";

  const email = auth.user?.profile?.email; // Get email from Cognito

  useEffect(() => {
    if (auth.isAuthenticated && email) {
      // Fetch user profile from the database
      fetch(`${apiUrl}?email=${email}`)
        .then((response) => {
          if (!response.ok) {
            if (response.status === 404) {
              // No profile found for this email
              setUserData(null);
              return null;
            }
            throw new Error(`Failed to fetch profile: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data && data.data) {
            setUserData(data.data); // Set the retrieved user data
          }
        })
        .catch((err) => {
          console.error("Error fetching profile:", err);
          setError(err.message);
        });
    }
  }, [auth.isAuthenticated, email]);

  if (!auth.isAuthenticated) {
    return <p style={{ color: "red" }}>You must log in to view your profile.</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>Error: {error}</p>;
  }

  if (!email) {
    return <p>Loading...</p>;
  }

  if (!userData) {
    return (
      <div>
        <h1>Profile</h1>
        <p>No profile found for email: {email}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Profile</h1>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>First Name:</strong> {userData.first_name}</p>
      <p><strong>Last Name:</strong> {userData.last_name}</p>
      <p><strong>Phone:</strong> {userData.phone}</p>
      <p><strong>Date of Birth:</strong> {userData.dob}</p>
    </div>
  );
}
