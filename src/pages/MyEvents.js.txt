import React, { useEffect, useState } from "react";

export default function MyEvents() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Replace with your API endpoint
    const apiUrl = "https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/rds-connector-function";
    const userEmail = "user@example.com"; // Replace with dynamic user email from authentication context

    const fetchEvents = async () => {
      try {
        const response = await fetch(`${apiUrl}?email=${userEmail}`);
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const result = await response.json();
        if (result.data && Array.isArray(result.data)) {
          setEvents(result.data);
        } else {
          setEvents([]);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setError(error.message);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <h1>My Events</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {events.length > 0 ? (
        <ul>
          {events.map((event) => (
            <li key={event.id}>
              <strong>{event.name}</strong> - {event.event_date} ({event.start_time} to {event.end_time})
              <p>{event.details}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No events found.</p>
      )}
    </div>
  );
}
