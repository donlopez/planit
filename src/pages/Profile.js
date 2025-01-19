import { useState, useEffect } from "react";
import { useAuth } from "react-oidc-context";

export default function Profile() {
  const auth = useAuth();
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user profile data
  useEffect(() => {
    if (auth.isAuthenticated) {
      const apiUrl = "https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/rds-connector-function";
      const userId = auth.user?.profile?.sub;

      fetch(`${apiUrl}?userId=${userId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText} (status ${response.status})`);
          }
          return response.json();
        })
        .then((data) => {
          setUserData(data.data); // Assume API response format includes a `data` object
          setFormData({
            first_name: data.data.first_name,
            last_name: data.data.last_name,
            email: data.data.email,
            phone: data.data.phone,
            username: data.data.username,
            password: "", // Do not prepopulate password
          });
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching profile data:", err);
          setError(err.message);
          setLoading(false);
        });
    }
  }, [auth.isAuthenticated, auth.user]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle profile update
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
          throw new Error(`Failed to update profile: ${response.statusText} (status ${response.status})`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Profile updated successfully:", data);
        alert("Profile updated successfully!");
      })
      .catch((err) => {
        console.error("Error updating profile:", err);
        alert(`Failed to update profile: ${err.message}`);
      });
  };

  // Render the component
  return (
    <div>
      <h1>Profile</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {userData && formData && (
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
