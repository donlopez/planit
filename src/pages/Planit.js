import { useState } from "react";

export default function Planit() {
    const [formData, setFormData] = useState({
        eventName: "",
        eventDate: "",
        location: "",
        description: "",
        startTime: "",
        endTime: "",
        guestCount: "",
        maxCapacity: "",
    });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const apiUrl = "https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/events";

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
            .then(() => {
                setMessage("Event created successfully!");
                setFormData({
                    eventName: "",
                    eventDate: "",
                    location: "",
                    description: "",
                    startTime: "",
                    endTime: "",
                    guestCount: "",
                    maxCapacity: "",
                });
            })
            .catch((err) => {
                setMessage(`Error: ${err.message}`);
            });
    };

    return (
        <div>
            <h1>Create Event</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Event Name:
                    <input
                        type="text"
                        name="eventName"
                        value={formData.eventName}
                        onChange={handleChange}
                        required
                    />
                </label>
                <br />
                <label>
                    Date:
                    <input
                        type="date"
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Location:
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Description:
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    ></textarea>
                </label>
                <br />
                <label>
                    Start Time:
                    <input
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    End Time:
                    <input
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Guest Count:
                    <input
                        type="number"
                        name="guestCount"
                        value={formData.guestCount}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Max Capacity:
                    <input
                        type="number"
                        name="maxCapacity"
                        value={formData.maxCapacity}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <button type="submit">Create Event</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}
