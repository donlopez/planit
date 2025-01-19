import { useState, useEffect } from "react";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  const apiUrl = "https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/rds-connector-function";

  useEffect(() => {
    // Replace with a hardcoded userId for testing
    const userId = 1;

    fetch(`${apiUrl}?userId=${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched data:", data);
        setUserData(data.data);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError(err.message);
      });
  }, []);

  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!userData) return <p>Loading...</p>;

  return (
    <div>
      <h1>Profile</h1>
      <p><strong>First Name:</strong> {userData.first_name}</p>
      <p><strong>Last Name:</strong> {userData.last_name}</p>
      <p><strong>Email:</strong> {userData.email}</p>
      <p><strong>Phone:</strong> {userData.phone}</p>
    </div>
  );
}
