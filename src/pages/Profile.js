import { useState, useEffect } from "react";
import { useAuth } from "react-oidc-context";

export default function Profile() {
  const auth = useAuth(); // Authentication context
  const [userData, setUserData] = useState(null); // User data
  const [formData, setFormData] = useState({}); // Form data for updates
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const apiUrl =
    "https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/rds-connector-function"; // API endpoint

  // Fetch user data
  useEffect(() => {
    if (auth.isAuthenticated) {
      const userId = auth.user?.profile?.sub;

      fetch(`${apiUrl}?userId=${userId}`)
        .then((response) => {
          if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
          return response.json();
        })
        .then((data) => {
          setUserData(data.data);
          setFormData(data.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError(err.message);
          setLoading(false);
        });
    }
  }, [auth.isAuthenticated, auth.user?.profile?.sub]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Submit updated data
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${apiUrl}?userId=${userData.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to update: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        setUserData(data.data);
        alert("Profile updated successfully!");
      })
      .catch((err) => {
        console.error(err);
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
          Email:
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            required
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
