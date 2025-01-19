import { useState, useEffect } from "react";
import { useAuth } from "react-oidc-context"; // Import Cognito authentication context

export default function Profile() {
  const auth = useAuth(); // Access Cognito user details
  const [userData, setUserData] = useState(null); // Stores fetched user data
  const [formData, setFormData] = useState({}); // Tracks form input values for updates
  const [error, setError] = useState(null); // Tracks error state
  const [loading, setLoading] = useState(true); // Tracks loading state

  const apiUrl = "https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/rds-connector-function";

  // Fetch user profile on component mount
  useEffect(() => {
    const userId = 1; // Hardcoded for now, replace with `auth.user?.profile?.sub` when ready

    fetch(`${apiUrl}?userId=${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const cognitoEmail = auth.user?.profile?.email; // Email from Cognito
        const updatedUserData = { ...data.data, email: cognitoEmail }; // Add Cognito email to data
        setUserData(updatedUserData); // Set fetched data
        setFormData(updatedUserData); // Pre-fill form for editing
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [auth.user]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Submit updated data to the database
  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${apiUrl}?userId=${userData.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to update: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Profile updated:", data);
        setUserData(formData); // Update local state with the new profile data
        alert("Profile updated successfully!");
      })
      .catch((err) => {
        console.error("Error updating profile:", err);
        alert(`Error: ${err.message}`);
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
            readOnly // Cognito email is read-only
          />
        </label>
        <br />
        <label>
          Phone:
          <input
            type="tel"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}
