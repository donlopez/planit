import React, { useState } from "react";

export default function Planit() {
    const [formData, setFormData] = useState({
        name: "",
        venue_name: "",
        event_date: "",
        start_time: "",
        end_time: "",
        guest_count: "",
        details: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCreateEvent = () => {
        const apiUrl = "https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/rds-connector-function";

        const payload = {
            name: formData.name,
            venue_name: formData.venue_name,
            created_by: 27, // Replace with user ID from authentication
            event_date: formData.event_date,
            start_time: formData.start_time,
            end_time: formData.end_time,
            guest_count: formData.guest_count,
            details: formData.details,
        };

        fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
            .then((response) => response.json())
            .then((data) => console.log("Event created:", data))
            .catch((error) => console.error("Error creating event:", error));
    };

    return (
        <div>
            <h1>Create Event</h1>
            <form>
                <label>
                    Event Name:
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                </label>
                <label>
                    Venue Name:
                    <input type="text" name="venue_name" value={formData.venue_name} onChange={handleInputChange} required />
                </label>
                {/* Add optional fields */}
                <button type="button" onClick={handleCreateEvent}>
                    Create Event
                </button>
            </form>
        </div>
    );
}
