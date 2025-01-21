import { useEffect, useState } from "react";

export default function MyEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const apiUrl = "https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/events";

        fetch(apiUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch events: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setEvents(data.events);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

    return (
        <div>
            <h1>My Events</h1>
            {events.length > 0 ? (
                <ul>
                    {events.map((event) => (
                        <li key={event.id}>
                            <h3>{event.name}</h3>
                            <p><strong>Date:</strong> {event.event_date}</p>
                            <p><strong>Location:</strong> {event.venue_name || "Not specified"}</p>
                            <p><strong>Description:</strong> {event.details}</p>
                            <p><strong>Start Time:</strong> {event.start_time}</p>
                            <p><strong>End Time:</strong> {event.end_time}</p>
                            <p><strong>Guest Count:</strong> {event.guest_count}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No events found.</p>
            )}
        </div>
    );
}
