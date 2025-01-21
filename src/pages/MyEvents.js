import { useEffect, useState, useCallback } from "react";
import { useAuth } from "react-oidc-context"; // To get authenticated user ID

export default function MyEvents() {
    const auth = useAuth();
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);

    // Memoize the fetchEvents function to avoid unnecessary re-creations
    const fetchEvents = useCallback(async () => {
        try {
            const email = auth.user?.profile?.email;

            // Check if email is available
            if (!email) {
                setError("User is not authenticated or email is missing.");
                return;
            }

            // Construct the API URL
            const apiUrl = `https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/rds-connector-function?created_by=${email}`;
            console.log("Fetching events from API:", apiUrl); // Debugging log

            const response = await fetch(apiUrl); // Fetch events

            if (!response.ok) {
                throw new Error(`Failed to fetch events: ${response.status}`);
            }

            const result = await response.json();
            console.log("API Response:", result); // Debugging log

            if (result?.data) {
                setEvents(result.data);
            } else {
                setError("No events available.");
            }
            setError(null);
        } catch (err) {
            console.error("Error fetching events:", err); // Debugging log
            setError(err.message);
        }
    }, [auth.user?.profile?.email]);

    // Fetch events on page load and whenever user is authenticated
    useEffect(() => {
        if (auth.isAuthenticated) {
            fetchEvents(); // Fetch events when the component is mounted
        }
    }, [auth.isAuthenticated, fetchEvents]);

    return (
        <div>
            <h1>My Events</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {events.length > 0 ? (
                <ul>
                    {events.map((event) => (
                        <li key={event.eventId}>
                            <p><strong>Name:</strong> {event.eventName}</p>
                            <p><strong>Date:</strong> {event.event_date}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No events available.</p>
            )}
        </div>
    );
}
