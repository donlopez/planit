import { useState, useEffect } from "react";
import { useAuth } from "react-oidc-context"; // Import useAuth for authentication

export default function Profile() {
  const auth = useAuth(); // Get authentication context
  const [userData, setUserData] = useState(null); // Holds user profile data
  const [loading, setLoading] = useState(true); // Tracks loading state
  const [error, setError] = useState(null); // Tracks error state
  const [isEditing, setIsEditing] = useState(false); // Toggles edit mode
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  }); // Tracks form input values

  const apiUrl =
    "https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/rds-connector-function"; // Replace with your API endpoint

  useEffect(() => {
    if (auth.isAuthenticated) {
      const userId = auth.user?.profile?.sub; // Get the user ID from Cognito

      // Fetch user data from the API
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
          setUserData(data.data); // Save user data
          setFormData(data.data); // Prepopulate form data for editing
          setLoading(false); // Stop loading
        })
        .catch((err) => {
          console.error("Error fetching profile:", err);
          setError(err.message);
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

  // Submit updated profile data to the API
  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${apiUrl}?userId=${userData.id}`, {
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
        setUserData(data.data); // Update displayed profile
        setIsEditing(false); // Exit edit mode
        alert("Profile updated successfully!");
      })
      .catch((err) => {
        console.error("Error updating profile:", err);
        alert(`Error: ${err.message}`);
      });
  };

  return (
    <div>
      <h1>Profile</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && (
        <div>
          {isEditing ? (
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
                  setFormData(userData); // Revert changes
                  setIsEditing(false); // Exit edit mode
                }}
              >
                Cancel
              </button>
            </form>
          ) : (
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
