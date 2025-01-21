import { useAuth } from "react-oidc-context";
import { useEffect, useState } from "react";

export default function Profile() {
    const auth = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditable, setIsEditable] = useState(false);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        phone: "",
        username: "",
    });

    useEffect(() => {
        if (auth.isAuthenticated) {
            const apiUrl = "https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/rds-connector-function";
            const userEmail = auth.user?.profile?.email;

            fetch(`${apiUrl}?email=${userEmail}`)
                .then((response) => {
                    if (response.status === 404) {
                        setError("User not found");
                        setLoading(false);
                    } else if (!response.ok) {
                        throw new Error(`Failed to fetch user data: ${response.status}`);
                    } else {
                        return response.json();
                    }
                })
                .then((data) => {
                    if (data) {
                        setUserData(data.data);
                        setFormData({
                            first_name: data.data.first_name,
                            last_name: data.data.last_name,
                            phone: data.data.phone,
                            username: data.data.username,
                        });
                    }
                    setLoading(false);
                })
                .catch((err) => {
                    setError(err.message);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [auth.isAuthenticated, auth.user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleProfileUpdate = () => {
        const apiUrl = "https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/rds-connector-function";
        const userEmail = auth.user?.profile?.email;

        fetch(`${apiUrl}?email=${userEmail}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to update profile: ${response.status}`);
                }
                return response.json();
            })
            .then(() => {
                setIsEditable(false);
                setUserData({ ...userData, ...formData });
                setError(null);
            })
            .catch((err) => {
                setError(err.message);
            });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

    return (
        <div>
            <h1>Profile</h1>
            {userData && (
                <div>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Date of Birth:</strong> {userData.dob ? new Date(userData.dob).toLocaleDateString() : "Not set"}</p>
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
            )}
        </div>
    );
}
