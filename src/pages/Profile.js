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
      const apiUrl = "https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/data"; // Updated API URL
      const userId = auth.user?.profile?.sub;  // Get user ID from the authentication context

      fetch(`${apiUrl}?userId=${userId}`)  // Use this line to make the GET request
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
          }
          return response.json(); // If successful, parse the response as JSON
        })
        .then((data) => {
          setUserData(data);  // If successful, store the data
          setLoading(false);   // No more loading needed once data is fetched
        })
        .catch((err) => {
          setError(`Fetch error: ${err.message}`); // Handle any errors that occurred during fetch
          setLoading(false); // Even if there's an error, stop the loading state
        });
    }
  }, [auth.isAuthenticated, auth.user]);  // Trigger re-fetching when auth status or user changes

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
    const apiUrl = `https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/data/${userData.id}`;
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
