import React, { useEffect, useState } from "react";

export default function MyEvents() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const apiUrl = "https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/rds-connector-function";

        fetch(`${apiUrl}?created_by=27`) // Replace with dynamic user ID
            .then((response) => response.json())
            .then((data) => setEvents(data.data))
            .catch((error) => console.error("Error fetching events:", error));
    }, []);

    return (
        <div>
            <h1>My Events</h1>
            <ul>
                {events.map((event) => (
                    <li key={event.eventId}>
                        {event.eventName} at {event.venueName || "Unknown Venue"}
                    </li>
                ))}
            </ul>
        </div>
    );
}
