import { useState, useEffect } from "react";
import { useAuth } from "react-oidc-context";

export default function Profile() {
  const auth = useAuth(); // Authentication state from Cognito
  const [userData, setUserData] = useState(null); // User profile data
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    dob: "",
  });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const apiUrl = "https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/rds-connector-function";

  const email = auth.user?.profile?.email; // Get email from Cognito

  // Fetch or check for user profile when authenticated and email changes
  useEffect(() => {
    if (auth.isAuthenticated && email) {
      // Fetch user profile from the database
      fetch(`${apiUrl}?email=${email}`)
        .then((response) => {
          if (!response.ok) {
            if (response.status === 404) {
              // No profile found; user needs to create one
              setUserData(null);
              return null;
            }
            throw new Error(`Failed to fetch profile: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data && data.data) {
            setUserData(data.data); // Populate profile data
            setFormData({
              first_name: data.data.first_name || "",
              last_name: data.data.last_name || "",
              phone: data.data.phone || "",
              dob: data.data.dob || "",
            });
          }
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
          setError(err.message);
        });
    }
  }, [auth.isAuthenticated, email, apiUrl]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle creating or updating the user profile
  const handleSubmit = () => {
    if (!email) {
      setError("Unable to fetch email from Cognito.");
      return;
    }

    const method = userData ? "PUT" : "POST"; // Use POST to create and PUT to update
    const url = userData ? `${apiUrl}?email=${email}` : apiUrl;

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email, // Automatically include Cognito email
        phone: formData.phone,
        dob: formData.dob,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to ${method === "POST" ? "create" : "update"} profile: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setMessage(`Profile ${method === "POST" ? "created" : "updated"} successfully!`);
        setUserData({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email,
          phone: formData.phone,
          dob: formData.dob,
        });
      })
      .catch((err) => {
        setError(`Error ${method === "POST" ? "creating" : "updating"} profile: ${err.message}`);
        console.error(err);
      });
  };

  // Render the profile or authentication message
  if (!auth.isAuthenticated) {
    return <p style={{ color: "red" }}>You must log in to view your profile.</p>;
  }

  return (
    <div>
      <h1>Profile</h1>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {userData ? (
        <div>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>First Name:</strong> {userData.first_name}</p>
          <p><strong>Last Name:</strong> {userData.last_name}</p>
          <p><strong>Phone:</strong> {userData.phone}</p>
          <p><strong>Date of Birth:</strong> {userData.dob}</p>
          <h3>Edit Profile</h3>
        </div>
      ) : (
        <p>Creating a new profile for email: {email}</p>
      )}

      <form>
        <label>
          First Name:
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="Enter your first name"
            required
          />
        </label>
        <br />
        <label>
          Last Name:
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Enter your last name"
            required
          />
        </label>
        <br />
        <label>
          Phone:
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            required
          />
        </label>
        <br />
        <label>
          Date of Birth:
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <button type="button" onClick={handleSubmit}>
          {userData ? "Update Profile" : "Create Profile"}
        </button>
      </form>
    </div>
  );
}
