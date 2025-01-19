import { useState, useEffect } from "react";
import { useAuth } from "react-oidc-context"; // For Cognito authentication

export default function Profile() {
  const auth = useAuth(); // Authentication context
  const [userData, setUserData] = useState(null); // Holds user profile data
  const [formData, setFormData] = useState({}); // Tracks form input values for updates
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  const apiUrl = "https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/rds-connector-function"; // API endpoint

  useEffect(() => {
    if (auth.isAuthenticated) {
      const userId = auth.user?.profile?.sub; // User ID from Cognito

      fetch(`${apiUrl}?userId=${userId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          const cognitoEmail = auth.user?.profile?.email; // Email from Cognito
          setUserData({ ...data.data, email: cognitoEmail }); // Override email with Cognito email
          setFormData({ ...data.data, email: cognitoEmail }); // Prepopulate form data
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
          setError(err.message);
          setLoading(false);
        });
    }
  }, [auth.isAuthenticated, auth.user?.profile?.sub, auth.user?.profile?.email]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit updated name to the database
  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${apiUrl}?userId=${userData.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: formData.first_name,
        last_name: formData.last_name,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to update: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setUserData(data.data); // Update displayed profile
        alert("Profile updated successfully!");
      })
      .catch((err) => {
        console.error("Error updating profile:", err);
        alert(`Error updating profile: ${err.message}`);
      });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h1>Profile</h1>
      <form onSubmit={handleSubmit}>
        <label>
          First Name:
          <input
            type="text"
            name="first_name"
            value={formData.first_name || ""}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Last Name:
          <input
            type="text"
            name="last_name"
            value={formData.last_name || ""}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Email (from Cognito):
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            readOnly
          />
        </label>
        <br />
        <button type="submit">Update Name</button>
      </form>
    </div>
  );
}

