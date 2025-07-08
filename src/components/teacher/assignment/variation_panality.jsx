import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Typography,
    Container,
    Box,
    CircularProgress,
    ThemeProvider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert
} from '@mui/material';
import theme from '../../Theme';
import api from '../../../api';
import VariationPenaltyRangeForm from './VariationPenaltyRangeForm'; // Must be implemented

function CreateVariationPenaltyForm({ assignmentId, onPenaltyApplied }) {
    const [formData, setFormData] = useState({ assignment: assignmentId, late_submission: '' });
    const [assignment, setAssignment] = useState(null);
    const [existingPenalty, setExistingPenalty] = useState(null);
    const [loading, setLoading] = useState(false);
    const [assignmentLoading, setAssignmentLoading] = useState(true);

    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [assignmentRes, penaltyRes] = await Promise.all([
                    api.get(`/api/courses/assignment/${assignmentId}/`),
                    api.get(`/api/courses/variation_penalty/?assignment=${assignmentId}`)
                ]);

                setAssignment(assignmentRes.data);

                if (penaltyRes.data.length > 0) {
                    setExistingPenalty(penaltyRes.data[0]);
                    setFormData({
                        assignment: assignmentId,
                        late_submission: penaltyRes.data[0].late_submission
                    });
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                setSnackbar({ open: true, message: 'Error fetching data.', severity: 'error' });
            } finally {
                setAssignmentLoading(false);
            }
        };

        if (assignmentId) fetchData();
    }, [assignmentId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'late_submission' && (value === '' || /^[0-9]*$/.test(value))) {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formatted = {
            assignment: parseInt(formData.assignment, 10),
            late_submission: parseInt(formData.late_submission, 10)
        };

        if (isNaN(formatted.late_submission) || formatted.late_submission <= 0) {
            setSnackbar({ open: true, message: 'Allowed days must be a valid number.', severity: 'error' });
            setLoading(false);
            return;
        }

        try {
            if (!existingPenalty) {
                const response = await api.post('/api/courses/variation_penalty/', formatted);
                setExistingPenalty(response.data);
                setOpenDialog(true);
                setSnackbar({ open: true, message: 'Variation penalty applied successfully!', severity: 'success' });

                if (onPenaltyApplied) onPenaltyApplied(response.data);
            } else {
                setSnackbar({ open: true, message: 'Penalty already exists and cannot be changed.', severity: 'info' });
            }
        } catch (err) {
            setSnackbar({ open: true, message: err.response?.data?.error || 'Failed to apply penalty.', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="sm" sx={{ mt: 4 }}>
                <Box sx={{ p: 4, boxShadow: 3, borderRadius: 3, backgroundColor: 'background.paper' }}>
                    <Typography variant="h5" gutterBottom>
                        Apply Variation Penalty
                    </Typography>

                    {assignmentLoading ? (
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
                                label="Allowed Late Submission Days"
                                name="late_submission"
                                type="number"
                                inputProps={{ min: 1 }}
                                value={formData.late_submission}
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
                                        Processing <CircularProgress size={20} sx={{ ml: 2 }} />
                                    </Box>
                                ) : (
                                    'Apply Variation Penalty'
                                )}
                            </Button>
                        </form>
                    )}
                </Box>
            </Container>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle>Set Penalty Ranges</DialogTitle>
                <DialogContent>
                    <VariationPenaltyRangeForm penaltyId={existingPenalty?.id} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>

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
        </ThemeProvider>
    );
}

export default CreateVariationPenaltyForm;
