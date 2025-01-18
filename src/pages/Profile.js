import { useState, useEffect } from "react";  // Import useEffect here
import { useAuth } from "react-oidc-context";

export default function Profile() {
  const auth = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    username: "",
    password: "",
  });

  // Handle profile data fetch
  useEffect(() => {
    if (auth.isAuthenticated) {
      const apiUrl = "https://<api_id>.execute-api.us-east-1.amazonaws.com/data";
      const userId = auth.user?.profile?.sub;
  
      fetch(`${apiUrl}?userId=${userId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText} (status code: ${response.status})`);
          }
          return response.json();
        })
        .then((data) => {
          setUserData(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Fetch error:", err);  // This will give more details about the error in the console
          setError(`Fetch error: ${err.message}`);
          setLoading(false);
        });
    }
  }, [auth.isAuthenticated, auth.user]);    // Trigger re-fetching when auth status or user changes

  // Handle form data change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission to update profile
  const handleSubmit = (e) => {
    e.preventDefault();
    const apiUrl = `https://<api_id>.execute-api.us-east-1.amazonaws.com/data${userData.id}`;
    fetch(apiUrl, {
      method: "PUT",  // PUT request for updating the profile
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),  // Send the updated form data as JSON
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Profile updated:", data);
      })
      .catch((err) => {
        console.error("Error updating profile:", err);
      });
  };

  // Render loading, error, and profile data
  return (
    <div>
      <h1>Profile</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {userData && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="first_name"
            value={formData.first_name || userData.first_name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="last_name"
            value={formData.last_name || userData.last_name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            value={formData.email || userData.email}
            onChange={handleChange}
          />
          <input
            type="phone"
            name="phone"
            value={formData.phone || userData.phone}
            onChange={handleChange}
          />
          <input
            type="text"
            name="username"
            value={formData.username || userData.username}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <button type="submit">Update Profile</button>
        </form>
      )}
    </div>
  );
}
