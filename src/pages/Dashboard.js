import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";

export default function Dashboard() {
  const auth = useAuth();
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const userId = auth.user?.profile?.sub; // Get the user's ID from auth
        if (!userId) {
          setError("User is not authenticated.");
          return;
        }

        const response = await fetch(
          `https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/rds-connector-function?created_by=${userId}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch events: ${response.status}`);
        }

        const result = await response.json();
        if (result?.data) {
          setEvents(result.data);
        } else {
          setError("No events found.");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    if (auth.isAuthenticated) {
      fetchEvents(); // Fetch events after successful authentication
    }
  }, [auth.isAuthenticated, auth.user]);

  const handleEditEvent = (eventId) => {
    navigate(`/edit-event/${eventId}`);
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await fetch(
        `https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/rds-connector-function?eventId=${eventId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete event.");
      }

      setEvents(events.filter((event) => event.eventId !== eventId)); // Remove deleted event from state
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Your Events</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {events.length > 0 ? (
          events.map((event) => (
            <li key={event.eventId}>
              <p>
                <strong>Name:</strong> {event.eventName}
              </p>
              <p>
                <strong>Date:</strong> {new Date(event.event_date).toLocaleDateString()}
              </p>
              <button onClick={() => handleEditEvent(event.eventId)}>Edit</button>
              <button onClick={() => handleDeleteEvent(event.eventId)}>Delete</button>
            </li>
          ))
        ) : (
          <p>No events available.</p>
        )}
      </ul>
    </div>
  );
}
