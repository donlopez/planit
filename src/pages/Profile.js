import { useState, useEffect } from "react";
import { useAuth } from "react-oidc-context";

export default function Profile() {
  const auth = useAuth();
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    dob: "",
  });
  const [isNewUser, setIsNewUser] = useState(false); // Flag to track if the user is new
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const apiUrl = "https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/rds-connector-function";

  useEffect(() => {
    if (!auth.isAuthenticated) {
      setError("You must be logged in to view your profile.");
      return;
    }

    const email = auth.user?.profile?.email;
    if (!email) {
      setError("Unable to fetch email. Please log in again.");
      return;
    }

    fetch(`${apiUrl}?email=${email}`)
      .then((response) => {
        if (response.status === 404) {
          // Email not found in database, treat as a new user
          setIsNewUser(true);
          return null;
        }
        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          setUserData(data.data);
          setFormData({
            first_name: data.data.first_name || "",
            last_name: data.data.last_name || "",
            phone: data.data.phone || "",
            dob: data.data.dob ? formatDOB(data.data.dob) : "", // Format DOB
          });
        }
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
        setError(err.message);
      });
  }, [auth.isAuthenticated, auth.user?.profile?.email]);

  const formatDOB = (dob) => {
    const date = new Date(dob);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateProfile = (e) => {
    e.preventDefault();

    if (!auth.isAuthenticated) {
      setError("You must be logged in to create your profile.");
      return;
    }

    const email = auth.user?.profile?.email;
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...formData, email }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to create profile: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setMessage("Profile created successfully!");
        setIsNewUser(false);
        setUserData(formData); // Update userData to reflect the newly created profile
      })
      .catch((err) => {
        console.error("Error creating profile:", err);
        setError(err.message);
      });
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();

    if (!auth.isAuthenticated) {
      setError("You must be logged in to update your profile.");
      return;
    }

    const email = auth.user?.profile?.email;
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
      })
      .catch((err) => {
        console.error("Error updating profile:", err);
        setError(err.message);
      });
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!auth.isAuthenticated) return <p>Please log in to view your profile.</p>;
  if (!userData && !isNewUser) return <p>Loading...</p>;

  return (
    <div>
      <h1>Profile</h1>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {isNewUser ? (
        <form onSubmit={handleCreateProfile}>
          <p>
            <strong>Creating a new profile for email:</strong> {auth.user?.profile?.email}
          </p>
          <p>
            <label>
              First Name:
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
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
                required
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
                required
              />
            </label>
          </p>
          <p>
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
          </p>
          <button type="submit">Create Profile</button>
        </form>
      ) : (
        <form onSubmit={handleUpdateProfile}>
          <p>
            <strong>Email:</strong> {auth.user?.profile?.email}
          </p>
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
            <strong>Date of Birth:</strong>{" "}
            {userData.dob ? formatDOB(userData.dob) : (
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />
            )}
          </p>
          <button type="submit">Update Profile</button>
        </form>
      )}
    </div>
  );
}
