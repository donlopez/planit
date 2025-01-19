import { useState, useEffect } from "react";
import { useAuth } from "react-oidc-context"; // Assuming you're using OIDC for auth

export default function Profile() {
  const auth = useAuth();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiUrl =
    "https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/rds-connector-function";

  // Fetch user data on component mount
  useEffect(() => {
    if (!auth.isAuthenticated) {
      // User is not logged in, do nothing
      return;
    }

    const email = auth.user?.profile?.email;
    if (!email) {
      setError("Unable to retrieve email from authentication.");
      setLoading(false);
      return;
    }

    setLoading(true); // Start loading
    fetch(`${apiUrl}?email=${email}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setUserData(data.data); // Populate user data
        setLoading(false); // Stop loading
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError("Failed to fetch user data.");
        setLoading(false); // Stop loading
      });
  }, [auth.isAuthenticated, auth.user]);

  if (!auth.isAuthenticated) {
    return <p style={{ color: "red" }}>You need to log in to view this page.</p>;
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div>
      <h1>Profile</h1>
      {userData ? (
        <div>
          <p>
            <strong>Email:</strong> {userData.email}
          </p>
          <p>
            <strong>First Name:</strong> {userData.first_name || "Not set"}
          </p>
          <p>
            <strong>Last Name:</strong> {userData.last_name || "Not set"}
          </p>
          <p>
            <strong>Phone:</strong> {userData.phone || "Not set"}
          </p>
          <p>
            <strong>Date of Birth:</strong> {userData.dob || "Not set"}
          </p>
        </div>
      ) : (
        <p>No user data found.</p>
      )}
    </div>
  );
}
