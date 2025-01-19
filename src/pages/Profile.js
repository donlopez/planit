import { useState, useEffect } from "react";
import { useAuth } from "react-oidc-context"; // Assuming you're using OIDC for auth

export default function Profile() {
  const auth = useAuth();
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    dob: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiUrl =
    "https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/rds-connector-function";

  // Fetch user data on component mount
  useEffect(() => {
    if (!auth.isAuthenticated) {
      // If the user is not authenticated, do not attempt to fetch data
      return;
    }

    const email = auth.user?.profile?.email;
    if (!email) {
      setError("Unable to retrieve email from authentication.");
      setLoading(false);
      return;
    }

    setLoading(true); // Start loading
    fetch(`${apiUrl}?email=${email}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched user data:", data);
        setUserData(data.data); // Populate user data
        setFormData({
          first_name: data.data.first_name || "",
          last_name: data.data.last_name || "",
          phone: data.data.phone || "",
          dob: data.data.dob || "",
        });
        setLoading(false); // Stop loading
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError("Failed to fetch user data.");
        setLoading(false); // Stop loading
      });
  }, [auth.isAuthenticated, auth.user]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission to update user data
  const handleSubmit = (e) => {
    e.preventDefault();
    const email = auth.user?.profile?.email;

    if (!email) {
      setError("Unable to retrieve email from authentication.");
      return;
    }

    fetch(`${apiUrl}?email=${email}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to update: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Updated user data:", data);
        alert("Profile updated successfully!");
        setUserData({ ...userData, ...formData }); // Update displayed user data
      })
      .catch((err) => {
        console.error("Error updating profile:", err);
        setError("Failed to update profile.");
      });
  };

  if (!auth.isAuthenticated) {
    return <p style={{ color: "red" }}>You need to log in to view this page.</p>;
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div>
      <h1>Profile</h1>
      {userData ? (
        <div>
          <p>
            <strong>Email:</strong> {userData.email}
          </p>
          <form onSubmit={handleSubmit}>
            <label>
              First Name:
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Enter your first name"
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
              />
            </label>
            <br />
            <label>
              Phone:
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
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
                placeholder="mm/dd/yyyy"
              />
            </label>
            <br />
            <button type="submit">Update Profile</button>
          </form>
        </div>
      ) : (
        <p>No user data found.</p>
      )}
    </div>
  );
}
