import { useState, useEffect } from "react";
import { useAuth } from "react-oidc-context";

export default function Profile() {
  const auth = useAuth(); // Get authentication state from Cognito
  const [userData, setUserData] = useState(null); // Stores user profile data
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    dob: "",
  });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const apiUrl = "https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/rds-connector-function";

  useEffect(() => {
    if (auth.isAuthenticated) {
      const email = auth.user?.profile?.email; // Get email from Cognito
      fetch(`${apiUrl}?email=${email}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data.data) {
            setUserData(data.data);
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
  }, [auth.isAuthenticated]);

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
    const email = auth.user?.profile?.email; // Get email from Cognito
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
          throw new Error(`Failed to ${method === "POST" ? "create" : "update"} user: ${response.status}`);
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

  // Render the profile form
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
        <p>Creating a new profile for email: {auth.user?.profile?.email}</p>
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
