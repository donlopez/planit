import { useState, useEffect, useCallback } from "react";
import { useAuth } from "react-oidc-context";
import "./styles.css";

export default function Planit() {
    const auth = useAuth();
    const [formData, setFormData] = useState({
        name: "",
        event_date: "",
        start_time: "",
        end_time: "",
        guest_count: "",
        details: "",
        venue_name: "",
        address: "",
        max_capacity: "",
        created_by: "", // Will be set dynamically based on the authenticated user
    });

    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Handle input changes and update the form data
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Memoize the fetchEvents function to avoid unnecessary re-creations
    const fetchEvents = useCallback(async () => {
        try {
            const email = auth.user?.profile?.email; // Get the user's email from auth
            if (!email) {
                setError("User is not authenticated or email is missing.");
                return;
            }

            const response = await fetch(
                `https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/rds-connector-function?created_by=${email}`
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch events: ${response.status}`);
            }

            const result = await response.json();
            if (result?.data) {
                setEvents(result.data);
            } else {
                setError("No events available.");
            }
            setError(null);
        } catch (err) {
            setError(err.message);
        }
    }, [auth.user?.profile?.email]); // Add email to the dependency array

    // Fetch events when the component loads or when authentication state changes
    useEffect(() => {
        if (auth.isAuthenticated) {
            fetchEvents(); // Fetch events when the component is mounted
        }
    }, [auth.isAuthenticated, fetchEvents]); // Add fetchEvents as a dependency

    // Handle form submission
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // Check if required fields are filled
        if (!formData.name || !formData.venue_name) {
            setError("Event Name and Venue Name are required.");
            return;
        }

        if (auth.isAuthenticated) {
            // Dynamically set created_by to the authenticated user's ID (Cognito's sub or email)
            formData.created_by = auth.user?.profile?.sub || auth.user?.profile?.email;
        } else {
            setError("User is not authenticated.");
            return;
        }

        try {
            // Send a POST request to Lambda to create an event
            const response = await fetch(
                "https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/rds-connector-function", 
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                }
            );

            if (response.ok) {
                setSuccess("Event created successfully!");
                setError(null); // Clear any error messages
                setFormData({
                    name: "",
                    event_date: "",
                    start_time: "",
                    end_time: "",
                    guest_count: "",
                    details: "",
                    venue_name: "",
                    address: "",
                    max_capacity: "",
                    created_by: "", // Reset created_by field
                });

                // Re-fetch events after creating a new one
                fetchEvents();
            } else {
                throw new Error(`Failed to create event: ${response.status}`);
            }
        } catch (err) {
            setError(err.message);
            setSuccess(null); // Clear success message if an error occurs
        }
    };

    return (
        <div>
            <h1>Create a New Event</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}

            {/* Event Creation Form */}
            <form onSubmit={handleFormSubmit}>
                <div>
                    <label>
                        Event Name:
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Event Date:
                        <input
                            type="date"
                            name="event_date"
                            value={formData.event_date}
                            onChange={handleInputChange}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Start Time:
                        <input
                            type="time"
                            name="start_time"
                            value={formData.start_time}
                            onChange={handleInputChange}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        End Time:
                        <input
                            type="time"
                            name="end_time"
                            value={formData.end_time}
                            onChange={handleInputChange}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Guest Count:
                        <input
                            type="number"
                            name="guest_count"
                            value={formData.guest_count}
                            onChange={handleInputChange}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Event Details:
                        <textarea
                            name="details"
                            value={formData.details}
                            onChange={handleInputChange}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Venue Name:
                        <input
                            type="text"
                            name="venue_name"
                            value={formData.venue_name}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Venue Address:
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Max Capacity:
                        <input
                            type="number"
                            name="max_capacity"
                            value={formData.max_capacity}
                            onChange={handleInputChange}
                        />
                    </label>
                </div>
                <button type="submit">Add Event</button>
            </form>

            <h2>Your Events</h2>
            {events.length > 0 ? (
                <ul>
                    {events.map((event) => (
                        <li key={event.eventId}>
                            <p>
                                <strong>Name:</strong> {event.eventName}
                            </p>
                            <p>
                                <strong>Date:</strong>{" "}
                                {new Date(event.event_date).toLocaleDateString()}
                            </p>
                            <p>
                                <strong>Details:</strong> {event.details}
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
