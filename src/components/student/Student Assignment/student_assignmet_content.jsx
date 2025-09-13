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
import {BASE_URL} from "../../../constraints.js";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import api from '../../../api.js';

const StudentAssignmentContent = ({ assignmentId }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [assignment, setAssignment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    useEffect(() => {
        const fetchAssignment = async () => {
            try {
                const response = await api.get('/api/courses/student_insight/');
                const found = response.data.assignment.find(
                    (a) => String(a.id) === String(assignmentId)
                );
                if (!found) throw new Error("Assignment not found.");
                setAssignment(found);
            } catch (err) {
                setError('Failed to fetch assignment content.');
                setOpenSnackbar(true);
            } finally {
                setLoading(false);
            }
        };

        if (assignmentId) fetchAssignment();
    }, [assignmentId]);

    if (loading) return <CircularProgress sx={{ mt: 4 }} />;

    return (
        <>
            {assignment && (
                <Accordion defaultExpanded sx={{ mt: 3 }}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon sx={{ color: '#4B2E83' }} />}
                        sx={{ backgroundColor: '#f0ecf8' }}
                    >
                        <Typography variant="h6" sx={{ color: '#4B2E83', fontWeight: 600 }}>
                            Assignment Files
                        </Typography>
                    </AccordionSummary>

                    <AccordionDetails sx={{ backgroundColor: '#fafafa' }}>
                        {assignment.assignment_files.length > 0 ? (
                            <Grid container spacing={2}>
                                {assignment.assignment_files.map((fileObj) => {
                                    const fileUrl = fileObj.file;
                                    const fullUrl = fileUrl.startsWith('http')
                                        ? fileUrl
                                        : `${BASE_URL}${fileUrl}`;
                                    const filename = fileUrl.split('/').pop();

                                    return (
                                        <Grid item xs={12} sm={6} md={4} key={fileObj.id}>
                                            <Box
                                                sx={{
                                                    p: 2,
                                                    border: '1px solid #e0e0e0',
                                                    borderRadius: 2,
                                                    boxShadow: 1,
                                                    textAlign: 'center',
                                                    transition: 'transform 0.2s',
                                                    '&:hover': {
                                                        transform: 'scale(1.03)',
                                                        boxShadow: '0 4px 12px rgba(75, 46, 131, 0.2)',
                                                    },
                                                }}
                                            >
                                                <InsertDriveFileIcon sx={{ fontSize: 40, color: '#4B2E83' }} />
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
                                                    sx={{
                                                        color: '#4B2E83',
                                                        borderColor: '#4B2E83',
                                                        '&:hover': {
                                                            backgroundColor: '#f3eafc',
                                                            borderColor: '#4B2E83',
                                                        },
                                                    }}
                                                >
                                                    View File
                                                </Button>
                                            </Box>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        ) : (
                            <Typography color="text.secondary">
                                No files attached for this assignment.
                            </Typography>
                        )}
                    </AccordionDetails>
                </Accordion>
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

export default StudentAssignmentContent;
