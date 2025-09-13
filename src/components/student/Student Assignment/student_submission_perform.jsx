// src/pages/StudentAssignmentSubmissionPerform.jsx
import React, { useEffect, useState } from 'react';
import {
    Typography, CircularProgress, Box, Alert, Snackbar, Grid,
    Button, TextField, IconButton, Paper, useMediaQuery, useTheme
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useDropzone } from 'react-dropzone';
import api from '../../../api.js';

const PRIMARY_COLOR = '#4B2E83';

const StudentAssignmentSubmissionPerform = ({ submissionId ,assignmentId }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [submission, setSubmission] = useState(null);
    const [files, setFiles] = useState([]);
    const [newFiles, setNewFiles] = useState([]);
    const [assignmentTitle, setAssignmentTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        const fetchSubmission = async () => {
            try {
                const res = await api.get(`/api/courses/submission/${submissionId}/`);
                setSubmission(res.data);
                setAssignmentTitle(res.data.assignment_title || '');
                setFiles(res.data.files || []);

            } catch {
                setSnackbar({ open: true, message: 'Failed to load submission.', severity: 'error' });
            } finally {
                setLoading(false);
            }
        };

        if (submissionId) fetchSubmission();
    }, [submissionId]);


    const onDrop = (acceptedFiles) => {
        setNewFiles(prev => [...prev, ...acceptedFiles]);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: true,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("assignment_title", assignmentTitle);

            // Append new files to formData
            newFiles.forEach((file) => {
                formData.append("files", file);  
            });

            await api.patch(`/api/courses/submission/${submissionId}/`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setSnackbar({ open: true, message: 'Submission updated successfully.', severity: 'success' });

        } catch {
            setSnackbar({ open: true, message: 'Failed to update submission.', severity: 'error' });
        }
    };


    const handleDeleteFile = async (fileId) => {
        try {
            await api.delete(`/api/courses/assignment_submission_content/${fileId}/`);
            setFiles(prev => prev.filter(f => f.id !== fileId));
            setSnackbar({ open: true, message: 'File deleted.', severity: 'success' });
        } catch {
            setSnackbar({ open: true, message: 'Failed to delete file.', severity: 'error' });
        }
    };

    if (loading) return <CircularProgress sx={{ mt: 4 }} />;
    if (!submission) return <Alert severity="error" sx={{ mt: 4 }}>Submission not found.</Alert>;

    return (
        <Box mt={isSmallScreen ? 2 : 4} px={isSmallScreen ? 1 : 0}>
            <Paper elevation={3} sx={{ p: isSmallScreen ? 2 : 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ color: PRIMARY_COLOR }} gutterBottom>
                    Update Submission
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                    <strong>Student:</strong> {submission.student_username}
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Assignment Title"
                                fullWidth
                                value={assignmentTitle}
                                onChange={(e) => setAssignmentTitle(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Box
                                {...getRootProps()}
                                sx={{
                                    border: '2px dashed #aaa',
                                    borderRadius: 2,
                                    p: 2,
                                    textAlign: 'center',
                                    backgroundColor: isDragActive ? '#f3eafc' : '#fafafa',
                                    cursor: 'pointer',
                                }}
                            >
                                <input {...getInputProps()} />
                                <Typography>
                                    {isDragActive ? 'Drop files here...' : 'Drag and drop or click to upload'}
                                </Typography>
                                {newFiles.length > 0 && (
                                    <Typography mt={1} variant="body2">
                                        Selected: {newFiles.map(f => f.name).join(', ')}
                                    </Typography>
                                )}
                            </Box>
                        </Grid>
                    </Grid>

                    <Box mt={3} textAlign={isSmallScreen ? 'center' : 'left'}>
                        <Button
                            variant="contained"
                            type="submit"
                            sx={{
                                backgroundColor: PRIMARY_COLOR,
                                '&:hover': { backgroundColor: '#3b256a' }
                            }}
                        >
                            Save Changes
                        </Button>
                    </Box>
                </form>

                <Box mt={4}>
                    <Typography variant="h6" sx={{ color: PRIMARY_COLOR }}>Uploaded Files</Typography>
                    {files.length === 0 ? (
                        <Typography mt={1} color="text.secondary">No files uploaded.</Typography>
                    ) : (
                        files.map(file => {
                            const fileName = file.file?.split('/').pop() || "File";
                            return (
                                <Box
                                    key={file.id}
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    mt={1}
                                    p={1}
                                    sx={{
                                        border: '1px solid #ddd',
                                        borderRadius: 1,
                                        backgroundColor: '#f9f9f9',
                                        flexDirection: isSmallScreen ? 'column' : 'row',
                                        gap: isSmallScreen ? 1 : 0,
                                    }}
                                >
                                    <Box display="flex" alignItems="center" gap={1} sx={{ overflow: 'hidden' }}>
                                        <InsertDriveFileIcon sx={{ color: PRIMARY_COLOR }} />
                                        <a
                                            href={file.file}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                color: PRIMARY_COLOR,
                                                textDecoration: 'none',
                                                overflow: 'hidden',
                                                whiteSpace: 'nowrap',
                                                textOverflow: 'ellipsis',
                                                display: 'inline-block',
                                                maxWidth: '200px',
                                            }}
                                            title={fileName}
                                        >
                                            {fileName}
                                        </a>
                                    </Box>
                                    <IconButton color="error" onClick={() => handleDeleteFile(file.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            );
                        })
                    )}
                </Box>
            </Paper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    severity={snackbar.severity}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default StudentAssignmentSubmissionPerform;
