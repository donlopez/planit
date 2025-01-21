import { useAuth } from "react-oidc-context";
import { useEffect, useState } from "react";

export default function Profile() {
    const auth = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        phone: "",
        dob: "",
    });

    useEffect(() => {
        if (auth.isAuthenticated) {
            const apiUrl = "https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/rds-connector-function";
            const userEmail = auth.user?.profile?.email;

            fetch(`${apiUrl}?email=${userEmail}`)
                .then((response) => {
                    if (!response.ok) {
                        if (response.status === 404) {
                            setLoading(false);
                            setError("Profile not found. Please complete your profile.");
                        }
                        throw new Error(`Failed to fetch user data: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    if (data) {
                        setUserData(data.data);
                        setFormData(data.data); // Populate the form with user data
                    }
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Error fetching user data:", err.message);
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

    const handleSave = () => {
        const apiUrl = "https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/rds-connector-function";
        const userEmail = auth.user?.profile?.email;

        fetch(`${apiUrl}?email=${userEmail}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                first_name: formData.first_name,
                last_name: formData.last_name,
                phone: formData.phone,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to update profile: ${response.status}`);
                }
                return response.json();
            })
            .then(() => {
                setUserData((prev) => ({
                    ...prev,
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    phone: formData.phone,
                }));
                setIsEditing(false);
            })
            .catch((err) => {
                console.error("Error updating profile:", err.message);
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
                    {isEditing ? (
                        <div>
                            <label>
                                First Name:
                                <input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleInputChange}
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
                                />
                            </label>
                            <br />
                            <button type="button" onClick={handleSave}>
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    setFormData(userData); // Reset the form data to original values
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <div>
                            <p><strong>First Name:</strong> {userData.first_name}</p>
                            <p><strong>Last Name:</strong> {userData.last_name}</p>
                            <p><strong>Phone:</strong> {userData.phone}</p>
                            <button type="button" onClick={() => setIsEditing(true)}>
                                Edit Profile
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
