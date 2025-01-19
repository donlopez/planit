import { useState, useEffect } from "react";
import { useAuth } from "react-oidc-context";

export default function Profile() {
  const auth = useAuth();
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
  });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const apiUrl = "https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/rds-connector-function";

  // Fetch user data on load
  useEffect(() => {
    if (auth.isAuthenticated) {
      const userId = 1; // Replace with dynamic userId if needed
      fetch(`${apiUrl}?userId=${userId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setUserData(data.data);
          setFormData({
            first_name: data.data?.first_name || "",
            last_name: data.data?.last_name || "",
            phone: data.data?.phone || "",
          });
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

  // Create a new user
  const handleCreateUser = () => {
    const email = auth.user?.profile?.email; // Get email from Cognito
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email,
        phone: formData.phone,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setMessage("User created successfully!");
        console.log("User created:", data);
      })
      .catch((err) => {
        setError("Error creating user.");
        console.error(err);
      });
  };

  // Update an existing user
  const handleUpdateUser = () => {
    const email = auth.user?.profile?.email; // Get email from Cognito
    const userId = 1; // Replace with dynamic userId if needed
    fetch(`${apiUrl}?userId=${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email,
        phone: formData.phone,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setMessage("User updated successfully!");
        console.log("User updated:", data);
      })
      .catch((err) => {
        setError("Error updating user.");
        console.error(err);
      });
  };

  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!userData && !formData.first_name) return <p>Loading...</p>;

  return (
    <div>
      <h1>Profile</h1>
      {message && <p style={{ color: "green" }}>{message}</p>}
      <form>
        <label>
          First Name:
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
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
          />
        </label>
        <br />
        <button
          type="button"
          onClick={handleCreateUser}
          style={{ marginRight: "10px" }}
        >
          Create User
        </button>
        <button type="button" onClick={handleUpdateUser}>
          Update User
        </button>
      </form>
    </div>
  );
}
