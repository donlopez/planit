import { useAuth } from "react-oidc-context"; 
import { useEffect, useState } from "react";  // Import useState and useEffect for data fetching

export default function Profile() {
    const auth = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Only fetch if authenticated
        if (auth.isAuthenticated) {
            const apiUrl = 'https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/data'; // Your API Gateway URL
            const userId = auth.user?.profile?.sub;  // Use the user's sub (ID) to query the database

            // Fetch user profile from API Gateway
            fetch(`${apiUrl}?userId=${userId}`)
                .then((response) => response.json())
                .then((data) => {
                    setUserData(data);
                    setLoading(false);
                })
                .catch((err) => {
                    setError(err.message);
                    setLoading(false);
                });
        }
    }, [auth.isAuthenticated, auth.user]);

    // Handle loading, error, and display the data
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Profile</h1>
            {userData ? (
                <div>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Name:</strong> {userData.first_name} {userData.last_name}</p>
                    {/* Display more fields as per your database */}
                </div>
            ) : (
                <p>No profile information available.</p>
            )}
        </div>
    );
}
