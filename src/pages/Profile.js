import { useAuth } from "react-oidc-context";
import { useEffect, useState } from "react";

export default function Profile() {
    const auth = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isNewUser, setIsNewUser] = useState(false);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        phone: "",
        dob: "",
    });

    useEffect(() => {
        if (auth.isAuthenticated) {
            console.log("User authenticated, fetching profile...");
            const apiUrl = "https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/rds-connector-function";
            const userEmail = auth.user?.profile?.email;
            const cognitoUsername = auth.user?.profile?.preferred_username || userEmail.split("@")[0];

            console.log("Cognito Username:", cognitoUsername);

            fetch(`${apiUrl}?email=${userEmail}`)
                .then((response) => {
                    if (response.status === 404) {
                        console.log("User not found in database. Marking as new user.");
                        setIsNewUser(true);
                        setFormData((prev) => ({ ...prev, username: cognitoUsername }));
                        setLoading(false);
                    } else if (!response.ok) {
                        throw new Error(`Failed to fetch user data: ${response.status}`);
                    } else {
                        return response.json();
                    }
                })
                .then((data) => {
                    if (data) {
                        console.log("Fetched User Data:", data.data);

                        const dbUsername = data.data.username;
                        if (!dbUsername || dbUsername !== cognitoUsername) {
                            console.log("Updating username in database...");
                            fetch(`${apiUrl}?email=${userEmail}`, {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ username: cognitoUsername }),
                            })
                                .then((updateResponse) => {
                                    if (!updateResponse.ok) {
                                        console.error("Failed to update username in the database.");
                                    } else {
                                        setUserData({ ...data.data, username: cognitoUsername });
                                    }
                                })
                                .catch((err) => console.error("Error updating username:", err));
                        } else {
                            setUserData(data.data);
                        }
                    }
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Error fetching user data:", err.message);
                    setError(err.message);
                    setLoading(false);
                });
        } else {
            console.log("User not authenticated.");
            setLoading(false);
        }
    }, [auth.isAuthenticated, auth.user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleProfileCreation = () => {
        const apiUrl = "https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/rds-connector-function";
        const userEmail = auth.user?.profile?.email;

        console.log("Creating profile for:", { ...formData, email: userEmail });

        fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...formData, email: userEmail }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to create profile: ${response.status}`);
                }
                return response.json();
            })
            .then(() => {
                setIsNewUser(false);
                setUserData({ ...formData, email: userEmail });
                setError(null);
            })
            .catch((err) => {
                console.error("Error creating profile:", err.message);
                setError(err.message);
            });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

    return (
        <div>
            <h1>Profile</h1>
            {isNewUser ? (
                <div>
                    <p>Welcome! Please complete your profile:</p>
                    <form>
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
                        <label>
                            Date of Birth:
                            <input
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleInputChange}
                            />
                        </label>
                        <br />
                        <button type="button" onClick={handleProfileCreation}>
                            Create Profile
                        </button>
                    </form>
                </div>
            ) : (
                userData && (
                    <div>
                        <p><strong>Email:</strong> {userData.email}</p>
                        <p><strong>Username:</strong> {userData.username || "Not set"}</p>
                        <p><strong>First Name:</strong> {userData.first_name}</p>
                        <p><strong>Last Name:</strong> {userData.last_name}</p>
                        <p><strong>Phone:</strong> {userData.phone}</p>
                        <p><strong>Date of Birth:</strong> {userData.dob ? new Date(userData.dob).toLocaleDateString() : "Not set"}</p>
                    </div>
                )
            )}
        </div>
    );
}
