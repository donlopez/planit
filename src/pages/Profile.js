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
            const apiUrl = "https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/rds-connector-function";
            const userEmail = auth.user?.profile?.email;

            fetch(`${apiUrl}?email=${userEmail}`)
                .then((response) => {
                    if (response.status === 404) {
                        setIsNewUser(true);
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

    const handleProfileCreation = () => {
        const apiUrl = "https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/rds-connector-function";
        const userEmail = auth.user?.profile?.email;
    
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
            .then((data) => {
                setIsNewUser(false);
                setUserData(data);
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
            {isNewUser ? (
                <div>
                    <p>It seems you're new here! Please complete your profile:</p>
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
