import React, { useState, useEffect } from "react";
import {
    Container,
    TextField,
    Button,
    MenuItem,
    Typography,
    Box,
    CircularProgress,
} from "@mui/material";
import api from "../../../../api"; // Adjust import path as needed

const daysOfWeek = [
    { value: "monday", label: "Monday" },
    { value: "tuesday", label: "Tuesday" },
    { value: "wednesday", label: "Wednesday" },
    { value: "thursday", label: "Thursday" },
    { value: "friday", label: "Friday" },
    { value: "saturday", label: "Saturday" },
];

const timezones = [
    "UTC", "America/New_York", "Europe/London", "Asia/Karachi", "Asia/Tokyo"
];

function TimeSlotForm() {
    const [formData, setFormData] = useState({
        course: "",
        day: "",
        start_time: "",
        end_time: "",
        room_link: "",
        timezone: "UTC",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await api.get("/api/courses/course/");
                setCourses(response.data);
            } catch (err) {
                console.error("Error fetching courses:", err);
                setError("Failed to load courses.");
            }
        };

        fetchCourses();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
        setSuccess("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post("/api/courses/slots/", formData, {
                headers: { "Content-Type": "application/json" },
            });

            if (response.status === 201) {
                setSuccess("Time slot created successfully!");
                setFormData({ course: "", day: "", start_time: "", end_time: "", room_link: "", timezone: "UTC" });
            }
        } catch (err) {
            console.error("Error creating time slot:", err);
            setError(err.response?.data?.error || "Failed to create time slot.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ p: 3, boxShadow: 3, borderRadius: 2, backgroundColor: "background.paper", mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Create Time Slot
                </Typography>

                {success && <Typography color="primary">{success}</Typography>}
                {error && <Typography color="error">{error}</Typography>}

                <form onSubmit={handleSubmit}>
                    {/* Course Dropdown */}
                    <TextField
                        select
                        label="Course"
                        name="course"
                        value={formData.course}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    >
                        {courses.map((course) => (
                            <MenuItem key={course.id} value={course.id}>
                                {course.course_title}
                            </MenuItem>
                        ))}
                    </TextField>

                    {/* Day Dropdown */}
                    <TextField
                        select
                        label="Day"
                        name="day"
                        value={formData.day}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    >
                        {daysOfWeek.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="Start Time"
                        name="start_time"
                        type="time"
                        value={formData.start_time}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                        InputLabelProps={{ shrink: true }}
                    />

                    <TextField
                        label="End Time"
                        name="end_time"
                        type="time"
                        value={formData.end_time}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                        InputLabelProps={{ shrink: true }}
                    />

                    <TextField
                        label="Room Link (Optional)"
                        name="room_link"
                        value={formData.room_link}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />

                    <TextField
                        select
                        label="Timezone"
                        name="timezone"
                        value={formData.timezone}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    >
                        {timezones.map((tz) => (
                            <MenuItem key={tz} value={tz}>
                                {tz}
                            </MenuItem>
                        ))}
                    </TextField>

                    <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }} disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : "Create Time Slot"}
                    </Button>
                </form>
            </Box>
        </Container>
    );
}

export default TimeSlotForm;
