import { useEffect, useState } from "react";

export default function MyEvents() {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch(
                    " https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/rds-connector-function?created_by=27"
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

    const deleteEvent = async (eventId) => {
        try {
            const response = await fetch(
                ` https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/rds-connector-function?eventId=${eventId}`,
                { method: "DELETE" }
            );
            if (response.ok) {
                setEvents(events.filter(event => event.eventId !== eventId)); // Remove from state
            } else {
                throw new Error(`Failed to delete event: ${response.status}`);
            }
        } catch (err) {
            setError(err.message);
        }
    };

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
                            <button onClick={() => deleteEvent(event.eventId)}>Delete</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No events available.</p>
            )}
        </div>
    );
}
