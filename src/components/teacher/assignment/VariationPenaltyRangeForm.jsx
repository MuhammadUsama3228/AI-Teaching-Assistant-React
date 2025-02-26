import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Typography,
    Container,
    Box,
    CircularProgress,
    ThemeProvider,
    Slider,
    IconButton
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import theme from '../../Theme';
import api from '../../../api';

function VariationPenaltyRangeForm({ assignmentId }) {
    const [variationPenaltyId, setVariationPenaltyId] = useState(null);
    const [ranges, setRanges] = useState([{ days_late: '', penalty: 5 }]); 
    const [lateSubmissionAllowed, setLateSubmissionAllowed] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    // Fetch assignment's late submission limit and existing penalty data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const assignmentRes = await api.get(`/api/courses/assignments/${assignmentId}/`);
                setLateSubmissionAllowed(assignmentRes.data.late_submission);

                const penaltyRes = await api.get(`/api/courses/variation_penalty/?assignment=${assignmentId}`);
                if (penaltyRes.data.length > 0) {
                    const penalty = penaltyRes.data[0];
                    setVariationPenaltyId(penalty.id);
                    setRanges(penalty.variation_penalties_ranges || []);
                }
            } catch (err) {
                setError('Failed to fetch data. Please try again.');
                console.error(err);
            }
        };

        if (assignmentId) fetchData();
    }, [assignmentId]);

    // Handle input change for ranges
    const handleInputChange = (index, field, value) => {
        if (field === 'days_late' && lateSubmissionAllowed && value > lateSubmissionAllowed) {
            setError(`Days late cannot exceed the allowed ${lateSubmissionAllowed} days.`);
            return;
        }

        setError('');
        setRanges(prev => prev.map((range, i) => i === index ? { ...range, [field]: value } : range));
    };

    // Add a new penalty range
    const handleAddRange = () => {
        setRanges(prev => [...prev, { days_late: '', penalty: 5 }]);
    };

    // Remove a specific penalty range
    const handleDeleteRange = (index) => {
        setRanges(prev => prev.filter((_, i) => i !== index));
    };

    // Submit form data
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess('');
        setError('');

        try {
            let penaltyId = variationPenaltyId;
            console.log(penaltyId)


            // Validate fields before API call
            const validRanges = ranges.filter(range => range.days_late !== '' && range.penalty !== '');
            if (validRanges.length === 0) {
                setError('At least one valid penalty range is required.');
                setLoading(false);
                return;
            }

            await Promise.all(
                validRanges.map(range => api.post('/api/courses/penalty_ranges/', {
                    variation_penalty: penaltyId,
                    days_late: Number(range.days_late),
                    penalty: Number(range.penalty)
                }))
            );

            setSuccess('Variation penalty and ranges applied successfully!');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Failed to apply variation penalty.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="sm" sx={{ mt: 3 }}>
                <Box sx={{ p: 3, boxShadow: 3, borderRadius: 2, backgroundColor: 'background.paper' }}>
                    <Typography variant="h5" gutterBottom>
                        Apply Variation Penalty
                    </Typography>

                    {success && <Typography color="primary">{success}</Typography>}
                    {error && <Typography color="error">{error}</Typography>}

                    <form onSubmit={handleSubmit}>
                        {ranges.map((range, index) => (
                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <TextField
                                    label="Days Late"
                                    type="number"
                                    value={range.days_late}
                                    onChange={(e) => handleInputChange(index, 'days_late', e.target.value)}
                                    fullWidth
                                    required
                                    inputProps={{ min: 1, max: lateSubmissionAllowed || undefined }}
                                />
                                
                                <Box sx={{ width: 150 }}>
                                    <Typography variant="body2">Penalty: {range.penalty}%</Typography>
                                    <Slider
                                        value={range.penalty}
                                        onChange={(_, newValue) => handleInputChange(index, 'penalty', newValue)}
                                        min={0}
                                        max={100}
                                        step={0.5}
                                        valueLabelDisplay="auto"
                                    />
                                </Box>

                                <IconButton onClick={() => handleDeleteRange(index)} color="error">
                                    <Delete />
                                </IconButton>
                            </Box>
                        ))}

                        <Button startIcon={<Add />} onClick={handleAddRange} sx={{ mb: 2 }}>
                            Add Range
                        </Button>

                        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={loading}>
                            {loading ? <>Applying <CircularProgress size={20} sx={{ ml: 2 }} /></> : 'Apply Variation Penalty'}
                        </Button>
                    </form>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default VariationPenaltyRangeForm;
