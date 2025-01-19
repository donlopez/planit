import { useState, useEffect } from "react";

export default function Profile() {
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
    // Simulate getting email from Cognito
    const email = "juliolopez9260@gmail.com";

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
          dob: data.data.dob || "", // Populate if `dob` exists
        });
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
        setError(err.message);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const email = userData.email; // Assuming the email stays constant
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

  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!userData) return <p>Loading...</p>;

  return (
    <div>
      <h1>Profile</h1>
      {message && <p style={{ color: "green" }}>{message}</p>}
      <p>
        <strong>Email:</strong> {userData.email}
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
              <span> {userData.dob}</span> // Display the existing DOB
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
