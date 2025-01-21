import { useState } from "react";

export default function Planit() {
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
    });

    const [message, setMessage] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleEventCreation = () => {
        const apiUrl = "https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/rds-connector-function/events";
        fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to create event: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setMessage("Event created successfully!");
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
                });
            })
            .catch((err) => {
                setMessage(err.message);
            });
    };

    return (
        <div>
            <h1>Plan Your Event</h1>
            <form>
                <label>
                    Event Name:
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <label>
                    Event Date:
                    <input
                        type="date"
                        name="event_date"
                        value={formData.event_date}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <label>
                    Start Time:
                    <input
                        type="time"
                        name="start_time"
                        value={formData.start_time}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <label>
                    End Time:
                    <input
                        type="time"
                        name="end_time"
                        value={formData.end_time}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <label>
                    Guest Count:
                    <input
                        type="number"
                        name="guest_count"
                        value={formData.guest_count}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <label>
                    Details:
                    <textarea
                        name="details"
                        value={formData.details}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <label>
                    Venue Name:
                    <input
                        type="text"
                        name="venue_name"
                        value={formData.venue_name}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <label>
                    Address:
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <label>
                    Max Capacity:
                    <input
                        type="number"
                        name="max_capacity"
                        value={formData.max_capacity}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <button type="button" onClick={handleEventCreation}>
                    Create Event
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}
