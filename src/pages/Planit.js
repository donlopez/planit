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
            <form onSubmit={handleFormSubmit}>
                {/* Form fields here */}
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
                {/* Add the rest of the fields here */}
                <button type="submit">Add Event</button>
            </form>
        </div>
    );
}
