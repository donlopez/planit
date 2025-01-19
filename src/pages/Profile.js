import { useState } from "react";
import { useAuth } from "react-oidc-context";

export default function Profile() {
  const auth = useAuth(); // Get authentication context
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
  });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const apiUrl = "https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/rds-connector-function";

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle creating a new user
  const handleCreateUser = () => {
    const email = auth.user?.profile?.email; // Get email from Cognito
    if (!email) {
      setError("Unable to fetch email from Cognito.");
      return;
    }

    // Send POST request to create a new user
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email, // Automatically include Cognito email
        phone: formData.phone,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to create user: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setMessage("User created successfully!");
        console.log("User created:", data);
        // Reset form fields
        setFormData({
          first_name: "",
          last_name: "",
          phone: "",
        });
      })
      .catch((err) => {
        setError(`Error creating user: ${err.message}`);
        console.error(err);
      });
  };

  return (
    <div>
      <h1>Create Your Profile</h1>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
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
        <button type="button" onClick={handleCreateUser}>
          Create Profile
        </button>
      </form>
    </div>
  );
}
