// src/pages/StudentAssignmentSubmissionFeedback.jsx
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
    Grid,
    Button,
    useMediaQuery,
    useTheme
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import api from '../../../api.js';

const PRIMARY_COLOR = '#4B2E83';

const StudentAssignmentSubmissionFeedback = ({ assignmentId }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [submission, setSubmission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    useEffect(() => {
        const fetchSubmission = async () => {
            try {
                const response = await api.get('/api/courses/student_insight/');
                const matchedSubmission = response.data.assignment_submission.find(
                    (sub) => String(sub.assignment) === String(assignmentId)
                );
                setSubmission(matchedSubmission || null);
            } catch (err) {
                setError('Failed to fetch assignment submission.');
                setOpenSnackbar(true);
            } finally {
                setLoading(false);
            }
        };

        if (assignmentId) fetchSubmission();
    }, [assignmentId]);

    if (loading) return <CircularProgress sx={{ mt: 4 }} />;

    return (
        <>
            {submission ? (
                <Accordion defaultExpanded sx={{ mt: 3 }}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon sx={{ color: PRIMARY_COLOR }} />}
                        sx={{ backgroundColor: '#f3eafc' }}
                    >
                        <Typography variant="h6" sx={{ color: PRIMARY_COLOR }}>
                            Assignment Submission
                        </Typography>
                    </AccordionSummary>

                    <AccordionDetails sx={{ backgroundColor: '#f9fafb' }}>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2">
                                <strong>Assignment Title:</strong> {submission.assignment_title}
                            </Typography>
                            <Typography variant="subtitle2">
                                <strong>Attempts:</strong> {submission.obtained_attempts}
                            </Typography>
                            <Typography variant="subtitle2">
                                <strong>Marks:</strong> {submission.obtained_marks ?? 'N/A'}
                            </Typography>
                            <Typography variant="subtitle2">
                                <strong>Date:</strong> {new Date(submission.submission_date).toLocaleString()}
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 2 }}>
                                <strong>Feedback:</strong><br />
                                {submission.feedback || 'Awaiting feedback...'}
                            </Typography>
                        </Box>

                        {submission.files?.length > 0 ? (
                            <Box mt={2}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Attached Files:
                                </Typography>
                                <Grid container spacing={2}>
                                    {submission.files.map((fileObj, index) => {
                                        const fileUrl = fileObj.file;
                                        const fullUrl = fileUrl.startsWith('http')
                                            ? fileUrl
                                            : `http://localhost:8000${fileUrl}`;
                                        const filename = fileUrl.split('/').pop();

                                        return (
                                            <Grid item xs={12} sm={6} md={4} key={fileObj.id || index}>
                                                <Box
                                                    sx={{
                                                        p: 2,
                                                        border: '1px solid #ddd',
                                                        borderRadius: 2,
                                                        boxShadow: 1,
                                                        textAlign: 'center',
                                                        transition: 'transform 0.2s',
                                                        '&:hover': { transform: 'scale(1.03)' },
                                                    }}
                                                >
                                                    <InsertDriveFileIcon sx={{ fontSize: 40, color: PRIMARY_COLOR }} />
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            mt: 1,
                                                            mb: 1,
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                        }}
                                                        title={filename}
                                                    >
                                                        {filename}
                                                    </Typography>
                                                    <Button
                                                        href={fullUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        variant="outlined"
                                                        size="small"
                                                        fullWidth
                                                    >
                                                        View File
                                                    </Button>
                                                </Box>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            </Box>
                        ) : (
                            <Typography mt={2}>No files attached.</Typography>
                        )}
                    </AccordionDetails>
                </Accordion>
            ) : (
                <Typography sx={{ mt: 2 }} color="text.secondary">
                    No submission found for this assignment.
                </Typography>
            )}

            <Snackbar
                open={openSnackbar}
                autoHideDuration={5000}
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

export default StudentAssignmentSubmissionFeedback;
