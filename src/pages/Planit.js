import { useState } from "react";

export default function Planit() {
  const [formData, setFormData] = useState({
    venueName: "",
    address: "",
    maxCapacity: "",
    availability: 1,
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
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to create event: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Event created successfully:", data);
        alert("Event and Venue created successfully!");
        setFormData({
          venueName: "",
          address: "",
          maxCapacity: "",
          availability: 1,
          eventName: "",
          eventDate: "",
          startTime: "",
          endTime: "",
          guestCount: "",
          details: "",
        });
      })
      .catch((err) => {
        console.error("Error:", err);
        alert("Failed to create event. Please try again.");
      });
  };

  return (
    <div>
      <h1>Create Event</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Venue Name:
          <input
            type="text"
            name="venueName"
            value={formData.venueName}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Address:
          <input
            type="text"
            name="address"
            value={formData.address}
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
          Event Date:
          <input
            type="date"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Start Time:
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
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
            required
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
            required
          />
        </label>
        <br />
        <label>
          Details:
          <textarea
            name="details"
            value={formData.details}
            onChange={handleChange}
          ></textarea>
        </label>
        <br />
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
}
