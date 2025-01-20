import { useAuth } from "react-oidc-context";
import { useEffect, useState } from "react";

export default function Profile() {
    const auth = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Only fetch if authenticated
        if (auth.isAuthenticated) {
            const apiUrl = "https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/rds-connector-function";
            const userEmail = auth.user?.profile?.email;

            if (!userEmail) {
                setError("No email found in authentication data.");
                setLoading(false);
                return;
            }

            // Fetch user profile from API Gateway
            fetch(`${apiUrl}?email=${userEmail}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Failed to fetch user data: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    if (data.message === "User fetched successfully") {
                        setUserData(data.data);
                    } else {
                        setError(data.message || "Unknown error.");
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

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

    return (
        <div>
            <h1>Profile</h1>
            {userData ? (
                <div>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>First Name:</strong> {userData.first_name}</p>
                    <p><strong>Last Name:</strong> {userData.last_name}</p>
                    <p><strong>Phone:</strong> {userData.phone}</p>
                    <p><strong>Date of Birth:</strong> {userData.dob ? new Date(userData.dob).toLocaleDateString() : "Not set"}</p>
                </div>
            ) : (
                <p>No profile information available.</p>
            )}
        </div>
    );
}
