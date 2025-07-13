// src/pages/student_solution.jsx
import React, { useEffect, useState } from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    CircularProgress,
    Box,
    Alert,
    Button,
    Snackbar,
    Grid,
    useMediaQuery,
    useTheme
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import api from '../../../api.js';

const PRIMARY_COLOR = '#4B2E83';

const StudentAssignmentSolutions = ({ assignmentId }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [solution, setSolution] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    useEffect(() => {
        const fetchSolution = async () => {
            try {
                const response = await api.get('/api/courses/student_insight/');
                const matchedSolution = response.data.assignment_solution.find(
                    (sol) => String(sol.assignment) === String(assignmentId)
                );
                setSolution(matchedSolution || null);
            } catch (err) {
                setError('Failed to fetch assignment solution.');
                setOpenSnackbar(true);
            } finally {
                setLoading(false);
            }
        };

        if (assignmentId) fetchSolution();
    }, [assignmentId]);

    if (loading) return <CircularProgress sx={{ mt: 4 }} />;

    return (
        <>
            {solution ? (
                <Accordion defaultExpanded sx={{ mt: 3 }}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon sx={{ color: PRIMARY_COLOR }} />}
                        sx={{ backgroundColor: '#f3eafc' }}
                    >
                        <Typography variant="h6" sx={{ color: PRIMARY_COLOR }}>
                            Assignment Solution
                        </Typography>
                    </AccordionSummary>

                    <AccordionDetails sx={{ backgroundColor: '#f9fafb' }}>
                        {solution.text && (
                            <Typography gutterBottom>
                                <strong>Text:</strong> {solution.text}
                            </Typography>
                        )}

                        {solution.files && solution.files.length > 0 ? (
                            <Box mt={2}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Attached Files:
                                </Typography>
                                <Grid container spacing={2}>
                                    {solution.files.map((fileObj, index) => {
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
                            <Typography mt={2}>No solution files attached.</Typography>
                        )}
                    </AccordionDetails>
                </Accordion>
            ) : (
                <Typography sx={{ mt: 2 }} color="text.secondary">
                    No solution provided for this assignment.
                </Typography>
            )}

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

export default StudentAssignmentSolutions;
