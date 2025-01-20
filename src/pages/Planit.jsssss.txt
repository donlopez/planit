import React, { useState } from "react";

export default function Planit() {
  const [formData, setFormData] = useState({
    venue: "",
    address: "",
    max_capacity: "",
    event_name: "",
    event_date: "",
    start_time: "",
    end_time: "",
    guest_count: "",
    details: "",
  });

  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Replace with your API endpoint
    const apiUrl = "https://7h9fkp906h.execute-api.us-east-1.amazonaws.com/dev/rds-connector-function";

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          venue: formData.venue,
          address: formData.address,
          max_capacity: formData.max_capacity,
          event_name: formData.event_name,
          event_date: formData.event_date,
          start_time: formData.start_time,
          end_time: formData.end_time,
          guest_count: formData.guest_count,
          details: formData.details,
          email: "user@example.com", // Replace with dynamic user email from authentication context
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create event");
      }

      const result = await response.json();
      alert(result.message);
      setFormData({
        venue: "",
        address: "",
        max_capacity: "",
        event_name: "",
        event_date: "",
        start_time: "",
        end_time: "",
        guest_count: "",
        details: "",
      });
    } catch (error) {
      console.error("Error creating event:", error);
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>Create Event</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="venue"
          placeholder="Venue Name"
          value={formData.venue}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Venue Address"
          value={formData.address}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="max_capacity"
          placeholder="Max Capacity"
          value={formData.max_capacity}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="event_name"
          placeholder="Event Name"
          value={formData.event_name}
          onChange={handleInputChange}
          required
        />
        <input
          type="date"
          name="event_date"
          value={formData.event_date}
          onChange={handleInputChange}
          required
        />
        <input
          type="time"
          name="start_time"
          value={formData.start_time}
          onChange={handleInputChange}
          required
        />
        <input
          type="time"
          name="end_time"
          value={formData.end_time}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="guest_count"
          placeholder="Guest Count"
          value={formData.guest_count}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="details"
          placeholder="Event Details"
          value={formData.details}
          onChange={handleInputChange}
          required
        ></textarea>
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
}
