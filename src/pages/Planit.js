import { useState } from "react";

export default function Planit() {
    const [formData, setFormData] = useState({
        venueName: "",
        address: "",
        maxCapacity: "",
        eventName: "",
        eventDate: "",
        startTime: "",
        endTime: "",
        guestCount: "",
        details: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/rds-connector-function", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...formData, userEmail: "user@example.com" }), // Replace with logged-in user email
        })
            .then((response) => response.json())
            .then((data) => {
                alert("Event created successfully!");
                setFormData({
                    venueName: "",
                    address: "",
                    maxCapacity: "",
                    eventName: "",
                    eventDate: "",
                    startTime: "",
                    endTime: "",
                    guestCount: "",
                    details: "",
                });
            })
            .catch((err) => alert("Error creating event"));
    };

    return (
        <div>
            <h1>Create Event</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="venueName" placeholder="Venue Name" value={formData.venueName} onChange={handleChange} required />
                <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
                <input type="number" name="maxCapacity" placeholder="Max Capacity" value={formData.maxCapacity} onChange={handleChange} />
                <input type="text" name="eventName" placeholder="Event Name" value={formData.eventName} onChange={handleChange} required />
                <input type="date" name="eventDate" value={formData.eventDate} onChange={handleChange} required />
                <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required />
                <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required />
                <input type="number" name="guestCount" placeholder="Guest Count" value={formData.guestCount} onChange={handleChange} required />
                <textarea name="details" placeholder="Event Details" value={formData.details} onChange={handleChange}></textarea>
                <button type="submit">Create Event</button>
            </form>
        </div>
    );
}
