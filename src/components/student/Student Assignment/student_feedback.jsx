// src/pages/StudentAssignmentFeedback.jsx
import React, { useEffect, useState } from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    CircularProgress,
    Box,
    Alert,
    Snackbar,
    useTheme,
    useMediaQuery
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import api from '../../../api.js';

const PRIMARY_COLOR = '#4B2E83';

const StudentAssignmentFeedback = ({ submissionId }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const response = await api.get('/api/courses/student_insight/');
                const matchedFeedback = response.data.feedback.find(
                    fb => String(fb.submission_id) === String(submissionId)
                );
                setFeedback(matchedFeedback || null);
            } catch (err) {
                setError('Failed to fetch assignment feedback.');
                setOpenSnackbar(true);
            } finally {
                setLoading(false);
            }
        };

        if (submissionId) fetchFeedback();
    }, [submissionId]);

    if (loading) return <CircularProgress sx={{ mt: 4 }} />;

    return (
        <>
            <Accordion defaultExpanded sx={{ mt: 3 }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: PRIMARY_COLOR }} />}
                    sx={{ backgroundColor: '#f3eafc' }}
                >
                    <Typography variant="h6" sx={{ color: PRIMARY_COLOR }}>
                        Assignment Feedback
                    </Typography>
                </AccordionSummary>

                <AccordionDetails sx={{ backgroundColor: "#f9fafb" }}>
                    {feedback ? (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2">
                                <strong>Student:</strong> {feedback.student_name || 'N/A'}
                            </Typography>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    maxWidth: isSmallScreen ? '100%' : 500,
                                }}
                                title={feedback.submission_title}
                            >
                                <strong>Submission Title:</strong> {feedback.submission_title || 'N/A'}
                            </Typography>
                            <Typography variant="subtitle2">
                                <strong>Rating:</strong> {feedback.rating || 'N/A'}
                            </Typography>
                            <Typography variant="subtitle2">
                                <strong>Status:</strong> {feedback.checked_status ? 'Checked' : 'Pending'}
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 2 }}>
                                <strong>Feedback:</strong><br />
                                {feedback.feedback_text || 'No feedback written.'}
                            </Typography>
                        </Box>
                    ) : (
                        <Typography color="text.secondary">
                            No feedback provided for this assignment.
                        </Typography>
                    )}
                </AccordionDetails>
            </Accordion>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: isSmallScreen ? 'center' : 'right' }}
            >
                <Alert severity="error" onClose={() => setOpenSnackbar(false)} sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </>
    );
};

export default StudentAssignmentFeedback;
