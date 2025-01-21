import { useState, useEffect } from "react";
import { useAuth } from "react-oidc-context"; // To get authenticated user ID

export default function Profile() {
    const auth = useAuth();
    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        phone: "",
        username: "",
        email: "",
        dob: "",
    });
    const [error, setError] = useState(null);
    const [isEditable, setIsEditable] = useState(false);

    // Fetch user profile when the user is authenticated
    useEffect(() => {
        if (auth.isAuthenticated && auth.user?.profile?.email) {
            const fetchUserData = async () => {
                try {
                    const email = auth.user?.profile?.email;

                    if (!email) {
                        setError("Email is missing.");
                        return;
                    }

                    const apiUrl = `https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/rds-connector-function?email=${email}`;
                    console.log("Fetching profile from API:", apiUrl); // Debugging log

                    const response = await fetch(apiUrl);

                    if (!response.ok) {
                        throw new Error("Failed to fetch user data");
                    }

                    const result = await response.json();
                    console.log("API Profile Response:", result); // Debugging log

                    if (result?.data) {
                        setUserData(result.data);
                        setFormData({
                            first_name: result.data.first_name,
                            last_name: result.data.last_name,
                            phone: result.data.phone,
                            username: result.data.username,
                            email: result.data.email,
                            dob: result.data.dob || "Not set",
                        });
                    } else {
                        setError("No user data found.");
                    }
                } catch (err) {
                    console.error("Error fetching user data:", err); // Debugging log
                    setError(err.message);
                }
            };

            fetchUserData();
        }
    }, [auth.isAuthenticated, auth.user?.profile?.email]); // Add auth.user?.profile?.email to the dependency array

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle profile update
    const handleProfileUpdate = async () => {
        if (auth.isAuthenticated) {
            try {
                const response = await fetch(
                    `https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/rds-connector-function?email=${auth.user?.profile?.email}`,
                    {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(formData),
                    }
                );

                if (response.ok) {
                    setIsEditable(false); // Disable edit mode
                    setError(null);
                    alert("Profile updated successfully!");
                } else {
                    throw new Error("Failed to update profile");
                }
            } catch (err) {
                setError(err.message);
            }
        } else {
            setError("User is not authenticated");
        }
    };

    return (
        <div>
            <h1>Profile</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {userData ? (
                <div>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Date of Birth:</strong> {formData.dob}</p>

                    <label>
                        First Name:
                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            disabled={!isEditable}
                        />
                    </label>
                    <br />
                    <label>
                        Last Name:
                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                            disabled={!isEditable}
                        />
                    </label>
                    <br />
                    <label>
                        Phone:
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            disabled={!isEditable}
                        />
                    </label>
                    <br />
                    <label>
                        Username:
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            disabled={!isEditable}
                        />
                    </label>
                    <br />
                    {!isEditable ? (
                        <button onClick={() => setIsEditable(true)}>Edit Profile</button>
                    ) : (
                        <button onClick={handleProfileUpdate}>Save Changes</button>
                    )}
                </div>
            ) : (
                <div>Loading profile...</div>
            )}
        </div>
    );
}
