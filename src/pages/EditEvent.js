import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "react-oidc-context";

export default function EditEvent() {
  const { eventId } = useParams(); // Get the event ID from URL params
  const auth = useAuth();
  const [eventData, setEventData] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Log eventId to ensure it's being passed correctly
  console.log("Fetching event with ID:", eventId);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // Ensure the eventId is correct
        console.log("Event ID for API call:", eventId);

        const response = await fetch(
          `https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/rds-connector-function?eventId=${eventId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch event.");
        }

        const result = await response.json();
        console.log("Event data received:", result); // Log the response data

        if (result?.data) {
          setEventData(result.data);
          setFormData(result.data);
        } else {
          setError("Event not found.");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchEvent();
  }, [eventId]); // Re-run the effect if eventId changes

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();

    if (auth.isAuthenticated) {
      try {
        const response = await fetch(
          "https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/rds-connector-function",
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...formData, eventId }), // Ensure eventId is passed
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update event.");
        }

        navigate("/dashboard"); // Navigate back to the dashboard after successful update
      } catch (err) {
        setError(err.message);
      }
    } else {
      setError("User is not authenticated.");
    }
  };

  return (
    <div>
      <h1>Edit Event</h1>
      {error && <p style={{ color: "red" }}>{error}</p>} {/* Display error message */}

      {eventData ? (
        <form onSubmit={handleUpdateEvent}>
          <div>
            <label>Event Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Event Date:</label>
            <input
              type="date"
              name="event_date"
              value={formData.event_date}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Start Time:</label>
            <input
              type="time"
              name="start_time"
              value={formData.start_time}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>End Time:</label>
            <input
              type="time"
              name="end_time"
              value={formData.end_time}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Guest Count:</label>
            <input
              type="number"
              name="guest_count"
              value={formData.guest_count}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Event Details:</label>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit">Save Changes</button>
        </form>
      ) : (
        <p>Loading event...</p> // Display loading message if event data is not yet available
      )}
    </div>
  );
}
