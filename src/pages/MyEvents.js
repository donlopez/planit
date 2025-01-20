import { useEffect, useState } from "react";

export default function MyEvents() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch events from the database for the authenticated user
    fetch("https://your-api-endpoint/events") // Replace with your endpoint
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch events: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setEvents(data.events))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h1>My Events</h1>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul>
          {events.map((event, index) => (
            <li key={index}>
              <h3>{event.name}</h3>
              <p>Date: {event.date}</p>
              <p>Location: {event.location}</p>
              <p>Description: {event.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
