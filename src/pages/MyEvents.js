import { useEffect, useState } from "react";

export default function MyEvents() {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const apiUrl = "https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/rds-connector-function/events";

        fetch(apiUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch events: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setEvents(data.events);
            })
            .catch((err) => {
                setError(err.message);
            });
    }, []);

    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>My Events</h1>
            {events.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Event Name</th>
                            <th>Date</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Guest Count</th>
                            <th>Details</th>
                            <th>Venue Name</th>
                            <th>Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((event) => (
                            <tr key={event.id}>
                                <td>{event.name}</td>
                                <td>{event.event_date}</td>
                                <td>{event.start_time}</td>
                                <td>{event.end_time}</td>
                                <td>{event.guest_count}</td>
                                <td>{event.details}</td>
                                <td>{event.venue_name}</td>
                                <td>{event.address}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No events found.</p>
            )}
        </div>
    );
}
