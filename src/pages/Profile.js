import { useState, useEffect } from "react";
import { useAuth } from "react-oidc-context";

export default function Profile() {
  const auth = useAuth();
  const [userData, setUserData] = useState(null); // Holds user data fetched from API
  const [loading, setLoading] = useState(true); // Tracks loading state
  const [error, setError] = useState(null); // Holds error messages
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    username: "",
    password: "",
  }); // Tracks form data for updates

  // Fetch user profile data from the API
  useEffect(() => {
    if (auth.isAuthenticated) {
      const apiUrl =
        "https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/rds-connector-function";
      const userId = auth.user?.profile?.sub; // User ID from authentication context

      // Fetch data from the API
      fetch(`${apiUrl}?userId=${userId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `Network response was not ok: ${response.statusText} (status code: ${response.status})`
            );
          }
          return response.json();
        })
        .then((data) => {
          setUserData(data.data); // Set fetched user data
          setFormData({ ...data.data, password: "" }); // Populate form data, excluding password
          setLoading(false); // Stop loading
        })
        .catch((err) => {
          console.error("Error fetching profile data:", err);
          setError(`Error: ${err.message}`);
          setLoading(false);
        });
    }
  }, [auth.isAuthenticated, auth.user]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Submit updated profile data to the API
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
            `Failed to update profile: ${response.statusText} (status code: ${response.status})`
          );
        }
        return response.json();
      })
      .then((data) => {
        console.log("Profile updated successfully:", data);
        alert("Profile updated successfully!");
      })
      .catch((err) => {
        console.error("Error updating profile:", err);
        alert(`Error: ${err.message}`);
      });
  };

  // Render the Profile page
  return (
    <div>
      <h1>Profile</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {userData && (
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
          <div>
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Update Profile</button>
        </form>
      )}
    </div>
  );
}
