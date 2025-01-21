import { useEffect, useState } from "react";

export default function MyEvents() {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch(
                    "https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/rds-connector-function?created_by=27"
                );

                if (!response.ok) {
                    throw new Error(`Failed to fetch events: ${response.status}`);
                }

                const result = await response.json();
                if (result?.data) {
                    setEvents(result.data);
                }
                setError(null);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchEvents();
    }, []);

    if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

    return (
        <div>
            <h1>My Events</h1>
            {events.length > 0 ? (
                <ul>
                    {events.map((event) => (
                        <li key={event.eventId}>
                            <p>
                                <strong>Name:</strong> {event.eventName}
                            </p>
                            <p>
                                <strong>Date:</strong>{" "}
                                {event.event_date
                                    ? new Date(event.event_date).toLocaleDateString()
                                    : "Not set"}
                            </p>
                            <p>
                                <strong>Start Time:</strong> {event.start_time || "Not set"}
                            </p>
                            <p>
                                <strong>End Time:</strong> {event.end_time || "Not set"}
                            </p>
                            <p>
                                <strong>Details:</strong> {event.details || "Not set"}
                            </p>
                            <p>
                                <strong>Venue:</strong> {event.venueName || "Not set"}
                            </p>
                            <p>
                                <strong>Address:</strong> {event.venueAddress || "Not set"}
                            </p>
                            <p>
                                <strong>Max Capacity:</strong>{" "}
                                {event.max_capacity || "Not set"}
                            </p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No events available.</p>
            )}
        </div>
    );
}
