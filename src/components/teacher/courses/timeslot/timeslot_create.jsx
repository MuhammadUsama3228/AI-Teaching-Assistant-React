import React, { useState } from 'react';
import {
    TextField,
    Button,
    Typography,
    Container,
    Box,
    CircularProgress,
    ThemeProvider,
    MenuItem,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import theme from '../../../Theme';
import api from '../../../../api';

const daysOfWeek = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' },
];

const TimeSlotForm = () => {
    const { id } = useParams(); // Assuming `id` is the course ID
    const [formData, setFormData] = useState({
        day: '', // Change from Choose_day to day
        start_time: '',
        end_time: '',
        room_link: '',
        timezone: 'UTC',
        course: id || '', // Add the course ID to formData
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (success) setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess('');

        try {
            // Send formData to the API
            await api.post(`/api/courses/slots/`, formData);
            setSuccess('Time slot created successfully!');
            setFormData({
                day: '', // Resetting to initial values
                start_time: '',
                end_time: '',
                room_link: '',
                timezone: 'UTC',
                course: id || '', // Resetting course ID
            });
        } catch (error) {
            console.error('Error creating time slot:', error.response?.data || error);
            alert('Failed to create time slot. Please check your input and try again.'); // Notify the user
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="sm" sx={{ mt: 5 }}>
                <Box
                    sx={{
                        p: 3,
                        boxShadow: 3,
                        borderRadius: 2,
                        backgroundColor: 'background.paper',
                    }}
                >
                    <Typography variant="h4" gutterBottom>
                        Create Time Slot
                    </Typography>

                    {success && (
                        <Typography color="primary" gutterBottom>
                            {success}
                        </Typography>
                    )}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            select
                            label="Day"
                            name="day" // Change name to day
                            value={formData.day}
                            onChange={handleInputChange}
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
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />

                        <TextField
                            label="End Time"
                            name="end_time"
                            type="time"
                            value={formData.end_time}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />

                        <TextField
                            label="Room Link"
                            name="room_link"
                            value={formData.room_link}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />

                        <TextField
                            label="Time Zone"
                            name="timezone"
                            value={formData.timezone}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{ mt: 3 }}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    Submitting
                                    <CircularProgress size={20} sx={{ ml: 2 }} />
                                </>
                            ) : (
                                'Create Time Slot'
                            )}
                        </Button>
                    </form>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default TimeSlotForm;
