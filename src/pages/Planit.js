import { useState } from "react";
import { useAuth } from "react-oidc-context";

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
        created_by: "", // Initially empty, will be set dynamically
    });

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Handle input changes and update the form data
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // Check if required fields are filled
        if (!formData.name || !formData.venue_name) {
            setError("Event Name and Venue Name are required.");
            return;
        }

        if (auth.isAuthenticated) {
            // Set the created_by field to the authenticated user's ID
            formData.created_by = auth.user?.profile?.sub || auth.user?.profile?.email;

            try {
                // Send a POST request to Lambda to create an event
                const response = await fetch(
                    "https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/rds-connector-function", // Correct API URL
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(formData),
                    }
                );

                // Check if the response was successful
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
                        created_by: "", // Reset the created_by field
                    });
                } else {
                    throw new Error(`Failed to create event: ${response.status}`);
                }
            } catch (err) {
                setError(err.message);
                setSuccess(null); // Clear success message if an error occurs
            }
        } else {
            setError("User is not authenticated.");
        }
    };

    return (
        <div>
            <h1>Create a New Event</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
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
        </div>
    );
}
