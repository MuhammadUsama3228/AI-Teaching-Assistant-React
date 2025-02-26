import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Typography,
    Container,
    Box,
    CircularProgress,
    ThemeProvider,
} from '@mui/material';
import theme from '../../Theme';
import api from '../../../api';

function CreatePenaltyForm({ assignmentId }) {
    const [formData, setFormData] = useState({ assignment: assignmentId, penalty: '' });
    const [assignment, setAssignment] = useState(null);
    const [existingPenalty, setExistingPenalty] = useState(null);  // Store existing penalty
    const [loading, setLoading] = useState(false);
    const [assignmentLoading, setAssignmentLoading] = useState(true);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    // ✅ Fetch Assignment & Existing Penalty on Load
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [assignmentRes, penaltyRes] = await Promise.all([
                    api.get(`/api/courses/assignment/${assignmentId}/`),
                    api.get(`/api/courses/penalty/?assignment=${assignmentId}`),
                ]);

                setAssignment(assignmentRes.data);

                if (penaltyRes.data.length > 0) {
                    setExistingPenalty(penaltyRes.data[0].penalty);  // Store the first penalty found
                }
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setAssignmentLoading(false);
            }
        };

        if (assignmentId) fetchData();
    }, [assignmentId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'penalty' && (value === '' || /^[0-9]*\.?[0-9]*$/.test(value))) {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
        if (success) setSuccess('');
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess('');
        setError('');

        if (existingPenalty !== null) {
            setError('A penalty is already assigned to this assignment.');
            setLoading(false);
            return;
        }

        const formattedData = {
            assignment: parseInt(formData.assignment, 10),
            penalty: formData.penalty !== '' ? parseFloat(parseFloat(formData.penalty).toFixed(2)) : null,
        };

        if (formattedData.penalty === null || isNaN(formattedData.penalty)) {
            setError('Penalty must be a valid number.');
            setLoading(false);
            return;
        }

        try {
            await api.post('/api/courses/penalty/', formattedData);
            setSuccess('Penalty applied successfully!');
            setExistingPenalty(formattedData.penalty);  // ✅ Update penalty state
            setFormData({ assignment: assignmentId, penalty: '' });
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to apply penalty.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="sm" sx={{ mt: 3 }}>
                <Box sx={{ p: 3, boxShadow: 3, borderRadius: 2, backgroundColor: 'background.paper' }}>
                    

                    {success && <Typography color="primary">{success}</Typography>}
                    {error && <Typography color="error">{error}</Typography>}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Assignment Name"
                            name="assignment"
                            value={assignment ? assignment.title : 'Unknown'}
                            fullWidth
                            margin="normal"
                            disabled
                        />

                        <TextField
                            label="Penalty Amount"
                            name="penalty"
                            type="number"
                            value={existingPenalty !== null ? existingPenalty : formData.penalty}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                            inputProps={{ min: 0, max: 100, step: 0.01 }}
                            disabled={existingPenalty !== null}  // ✅ Disable if penalty exists
                        />

                        <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }} disabled={loading || existingPenalty !== null}>
                            {loading ? <>Applying <CircularProgress size={20} sx={{ ml: 2 }} /></> : 'Apply Penalty'}
                        </Button>
                    </form>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default CreatePenaltyForm;
