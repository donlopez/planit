import { useState, useEffect } from "react";
import { useAuth } from "react-oidc-context"; // For Cognito authentication

export default function Profile() {
  const auth = useAuth(); // Get authentication context
  const [userData, setUserData] = useState(null); // Holds user data fetched from API
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error message
  const [isEditing, setIsEditing] = useState(false); // Toggles edit mode
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  }); // Tracks form data for updates

  // Fetch user profile data when component mounts
  useEffect(() => {
    if (auth.isAuthenticated) {
      const apiUrl =
        "https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/rds-connector-function";
      const userId = auth.user?.profile?.sub; // Get user ID from Cognito

      fetch(`${apiUrl}?userId=${userId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `Failed to fetch profile: ${response.statusText} (status: ${response.status})`
            );
          }
          return response.json();
        })
        .then((data) => {
          setUserData(data.data); // Save fetched user data
          setFormData(data.data); // Prepopulate form data
          setLoading(false); // Stop loading
        })
        .catch((err) => {
          console.error("Error fetching profile data:", err);
          setError(`Error fetching profile: ${err.message}`);
          setLoading(false);
        });
    }
  }, [auth.isAuthenticated, auth.user]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit updated profile data
  const handleSubmit = (e) => {
    e.preventDefault();
    const apiUrl = `https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/rds-connector-function?userId=${userData.id}`;

    fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to update profile: ${response.statusText} (status: ${response.status})`
          );
        }
        return response.json();
      })
      .then((data) => {
        setUserData(data.data); // Update displayed data
        setIsEditing(false); // Exit edit mode
        alert("Profile updated successfully!");
      })
      .catch((err) => {
        console.error("Error updating profile:", err);
        alert(`Error updating profile: ${err.message}`);
      });
  };

  // Render the Profile page
  return (
    <div>
      <h1>Profile</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && (
        <div>
          {isEditing ? (
            // Edit Profile Form
            <form onSubmit={handleSubmit}>
              <div>
                <label>First Name:</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Last Name:</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Phone:</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit">Save Changes</button>
              <button
                type="button"
                onClick={() => {
                  setFormData(userData); // Reset changes
                  setIsEditing(false); // Exit edit mode
                }}
              >
                Cancel
              </button>
            </form>
          ) : (
            // Display Profile Information
            <div>
              <p>
                <strong>First Name:</strong> {userData.first_name}
              </p>
              <p>
                <strong>Last Name:</strong> {userData.last_name}
              </p>
              <p>
                <strong>Email:</strong> {userData.email}
              </p>
              <p>
                <strong>Phone:</strong> {userData.phone}
              </p>
              <button onClick={() => setIsEditing(true)}>Edit Profile</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
