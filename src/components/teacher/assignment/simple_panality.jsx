import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Typography,
    Container,
    Box,
    CircularProgress,
    Snackbar,
    Alert,
    ThemeProvider
} from '@mui/material';
import theme from '../../Theme';
import api from '../../../api';

function CreatePenaltyForm({ assignmentId }) {
    const [formData, setFormData] = useState({ assignment: assignmentId, penalty: '' });
    const [assignment, setAssignment] = useState(null);
    const [existingPenalty, setExistingPenalty] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingAssignment, setLoadingAssignment] = useState(true);

    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        const fetchData = async () => {
            if (!assignmentId || isNaN(Number(assignmentId))) {
                setSnackbar({ open: true, message: "Invalid assignment ID.", severity: 'error' });
                setLoadingAssignment(false);
                return;
            }

            try {
                const [assignmentRes, penaltyRes] = await Promise.all([
                    api.get(`/api/courses/assignment/${assignmentId}/`),
                    api.get(`/api/courses/penalty/?assignment=${assignmentId}`)
                ]);

                if (assignmentRes) setAssignment(assignmentRes.data);
                if (penaltyRes.data.length > 0) {
                    setExistingPenalty(penaltyRes.data[0].penalty);
                }
            } catch (err) {
                const msg = err.response?.data?.detail || 'Error fetching data.';
                setSnackbar({ open: true, message: msg, severity: 'error' });
            } finally {
                setLoadingAssignment(false);
            }
        };

        fetchData();
    }, [assignmentId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'penalty' && (value === '' || /^[0-9]*\.?[0-9]*$/.test(value))) {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formatted = {
            assignment: parseInt(formData.assignment),
            penalty: parseFloat(formData.penalty)
        };

        if (isNaN(formatted.penalty) || formatted.penalty < 0) {
            setSnackbar({ open: true, message: "Enter a valid positive penalty.", severity: 'error' });
            setLoading(false);
            return;
        }

        try {
            await api.post('/api/courses/penalty/', formatted, {
                headers: { 'Content-Type': 'application/json' }
            });
            setExistingPenalty(formatted.penalty);
            setFormData({ assignment: assignmentId, penalty: '' });
            setSnackbar({ open: true, message: 'Penalty applied successfully!', severity: 'success' });
        } catch (err) {
            const msg = err.response?.data?.error || 'Failed to apply penalty.';
            setSnackbar({ open: true, message: msg, severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="sm" sx={{ mt: 4 }}>
                <Box
                    sx={{
                        p: 4,
                        boxShadow: 4,
                        borderRadius: 3,
                        backgroundColor: 'background.paper',
                    }}
                >
                    <Typography variant="h5" gutterBottom>
                        Apply Penalty to Assignment
                    </Typography>

                    {loadingAssignment ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="Assignment Title"
                                name="assignment"
                                value={assignment?.title || 'Unknown'}
                                fullWidth

                                margin="normal"
                            />

                            <TextField
                                label="Penalty (%)"
                                name="penalty"
                                type="number"
                                inputProps={{ min: 0, max: 100, step: 0.01 }}
                                value={existingPenalty !== null ? existingPenalty : formData.penalty}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                                required
                                disabled={existingPenalty !== null}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{ mt: 3 }}
                                disabled={loading || existingPenalty !== null}
                            >
                                {loading ? (
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        Applying... <CircularProgress size={20} sx={{ ml: 2 }} />
                                    </Box>
                                ) : (
                                    'Apply Penalty'
                                )}
                            </Button>
                        </form>
                    )}
                </Box>

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={4000}
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert
                        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                        severity={snackbar.severity}
                        variant="filled"
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Container>
        </ThemeProvider>
    );
}

export default CreatePenaltyForm;
