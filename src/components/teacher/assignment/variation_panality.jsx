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
    IconButton,
    Tooltip
} from '@mui/material';
import { Edit } from '@mui/icons-material'; // ✅ Import update/edit icon
import theme from '../../Theme';
import api from '../../../api';
import VariationPenaltyRangeForm from './VariationPenaltyRangeForm'; // Import the range form component

function CreateVariationPenaltyForm({ assignmentId }) {
    const [formData, setFormData] = useState({ assignment: assignmentId, late_submission: '' });
    const [assignment, setAssignment] = useState(null);
    const [existingPenalty, setExistingPenalty] = useState(null);
    const [loading, setLoading] = useState(false);
    const [assignmentLoading, setAssignmentLoading] = useState(true);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [openDialog, setOpenDialog] = useState(false); // Modal state
    const [isUpdating, setIsUpdating] = useState(false); // ✅ Track update state

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [assignmentRes, penaltyRes] = await Promise.all([
                    api.get(`/api/courses/assignment/${assignmentId}/`),
                    api.get(`/api/courses/variation_penalty/?assignment=${assignmentId}`)
                ]);

                setAssignment(assignmentRes.data);

                if (penaltyRes.data.length > 0) {
                    setExistingPenalty(penaltyRes.data[0]); // Store the full penalty object
                    setFormData({ 
                        assignment: assignmentId, 
                        late_submission: penaltyRes.data[0].late_submission 
                    });
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
        if (name === 'late_submission' && (value === '' || /^[0-9]*$/.test(value))) {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
        setSuccess('');
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess('');
        setError('');

        const formattedData = {
            assignment: parseInt(formData.assignment, 10),
            late_submission: formData.late_submission !== '' ? parseInt(formData.late_submission, 10) : null
        };

        if (formattedData.late_submission === null || isNaN(formattedData.late_submission)) {
            setError('Allowed late submission days must be a valid number.');
            setLoading(false);
            return;
        }

        try {
            if (existingPenalty) {
                // ✅ Update existing penalty
                await api.put(`/api/courses/variation_penalty/${existingPenalty.id}/`, formattedData);
                setSuccess('Variation penalty updated successfully!');
            } else {
                // ✅ Create new penalty
                const response = await api.post('/api/courses/variation_penalty/', formattedData);
                setSuccess('Variation penalty applied successfully!');
                setExistingPenalty(response.data);
            }

            setFormData({ assignment: assignmentId, late_submission: '' });
            setOpenDialog(true); // ✅ Open dialog to set penalty ranges
        } catch (err) {
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
                        {existingPenalty && (
                            <Tooltip title="Update Variation Penalty">
                                <IconButton onClick={() => setIsUpdating(true)} sx={{ ml: 1 }}>
                                    <Edit color="primary" /> {/* ✅ Edit icon */}
                                </IconButton>
                            </Tooltip>
                        )}
                    </Typography>

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
                            label="Allowed Late Submission Days"
                            name="late_submission"
                            type="number"
                            value={formData.late_submission}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                            inputProps={{ min: 1 }}
                            disabled={!isUpdating && existingPenalty !== null} // ✅ Enable only for update
                        />

                        <Button 
                            type="submit" 
                            variant="contained" 
                            fullWidth 
                            sx={{ mt: 3 }} 
                            disabled={loading || (!isUpdating && existingPenalty !== null)} // ✅ Prevent unnecessary submissions
                        >
                            {loading ? <>Processing <CircularProgress size={20} sx={{ ml: 2 }} /></> : isUpdating ? 'Update Variation Penalty' : 'Apply Variation Penalty'}
                        </Button>
                    </form>
                </Box>
            </Container>

            {/* 🔥 Dialog for Penalty Ranges */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Set Penalty Ranges</DialogTitle>
                <DialogContent>
                    <VariationPenaltyRangeForm penaltyId={existingPenalty?.id} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    );
}

export default CreateVariationPenaltyForm;
