import { useState, useEffect } from "react";
import { useAuth } from "react-oidc-context"; // Assuming you're using this for authentication

export default function Profile() {
  const auth = useAuth(); // Fetch authentication state
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    dob: "",
  });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const apiUrl = "https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/rds-connector-function";

  useEffect(() => {
    if (!auth.isAuthenticated) {
      setError("You must be logged in to view your profile.");
      return;
    }

    const email = auth.user?.profile?.email; // Fetch email dynamically from authentication
    if (!email) {
      setError("Unable to fetch email. Please log in again.");
      return;
    }

    fetch(`${apiUrl}?email=${email}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setUserData(data.data);
        setFormData({
          first_name: data.data.first_name || "",
          last_name: data.data.last_name || "",
          phone: data.data.phone || "",
          dob: data.data.dob || "",
        });
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
        setError(err.message);
      });
  }, [auth.isAuthenticated, auth.user?.profile?.email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!auth.isAuthenticated) {
      setError("You must be logged in to update your profile.");
      return;
    }

    const email = auth.user?.profile?.email; // Use email dynamically
    fetch(`${apiUrl}?email=${email}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to update profile: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setMessage("Profile updated successfully!");
        console.log("Profile updated:", data);
      })
      .catch((err) => {
        console.error("Error updating profile:", err);
        setError(err.message);
      });
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!auth.isAuthenticated) return <p>Please log in to view your profile.</p>;
  if (!userData) return <p>Loading...</p>;

  return (
    <div>
      <h1>Profile</h1>
      {message && <p style={{ color: "green" }}>{message}</p>}
      <p>
        <strong>Email:</strong> {auth.user?.profile?.email}
      </p>
      <form onSubmit={handleSubmit}>
        <p>
          <label>
            First Name:
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
            />
          </label>
        </p>
        <p>
          <label>
            Last Name:
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
            />
          </label>
        </p>
        <p>
          <label>
            Phone:
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </label>
        </p>
        <p>
          <label>
            Date of Birth:
            {userData.dob ? (
              <span> {userData.dob}</span> // Show existing DOB
            ) : (
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />
            )}
          </label>
        </p>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}
