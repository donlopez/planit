import { useState, useEffect } from "react";
import { useAuth } from "react-oidc-context";

export default function Profile() {
  const auth = useAuth(); // Get authentication context
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = "https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/rds-connector-function";

  useEffect(() => {
    if (auth.isAuthenticated) {
      const userId = auth.user?.profile?.sub; // Get userId from Cognito
      console.log("User ID:", userId);

      fetch(`${apiUrl}?userId=${userId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch profile: ${response.statusText}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Fetched data:", data);
          setUserData(data.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
          setError(err.message);
          setLoading(false);
        });
    }
  }, [auth.isAuthenticated]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div>
      <h1>Profile</h1>
      {userData ? (
        <div>
          <p><strong>First Name:</strong> {userData.first_name}</p>
          <p><strong>Last Name:</strong> {userData.last_name}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Phone:</strong> {userData.phone}</p>
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
}
