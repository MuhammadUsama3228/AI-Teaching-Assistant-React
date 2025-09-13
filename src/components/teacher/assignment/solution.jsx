import React, { useState, useEffect, useRef } from 'react';
import {
    TextField,
    Button,
    Stack,
    Typography,
    Box,
    Alert,
    CircularProgress,
    Paper,
    IconButton,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import api from '../../../api';

const UpdateSolutionForm = ({ solution, onClose }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const fileInputRef = useRef();

    const [text, setText] = useState(solution?.text || '');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [existingFiles, setExistingFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    useEffect(() => {
        if (solution?.files?.length > 0) {
            setExistingFiles(solution.files);
        }
    }, [solution]);

    const handleDeleteExistingFile = async (fileId) => {
        if (!window.confirm('Are you sure you want to delete this file?')) return;
        try {
            await api.delete(`/api/courses/assignment_solution_content/${fileId}/`);
            setExistingFiles((prev) => prev.filter((file) => file.id !== fileId));
        } catch (err) {
            console.error('Failed to delete file:', err);
            setError('Failed to delete file.');
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        const files = Array.from(e.dataTransfer.files);
        setSelectedFiles((prev) => [...prev, ...files]);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = () => {
        setDragActive(false);
    };

    const handleFileInputChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles((prev) => [...prev, ...files]);
    };

    const handleRemoveFile = (index) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        if (!solution?.id || !solution?.assignment) {
            setError('Missing solution or assignment ID.');
            setIsSubmitting(false);
            return;
        }

        const formData = new FormData();
        formData.append('text', text);
        formData.append('assignment', solution.assignment);
        selectedFiles.forEach((file) => formData.append('files', file));

        try {
            await api.patch(`/api/courses/solution/${solution.id}/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            onClose();
        } catch (err) {
            console.error(err);
            setError('Failed to update solution.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box
            sx={{
                maxWidth: '900px',
                mx: 'auto',
                p: isMobile ? 2 : 4,
                bgcolor: '#fff',
                borderRadius: 3,
                boxShadow: 3,
            }}
        >
            <form onSubmit={handleSubmit}>
                <Stack spacing={4}>
                    <Typography variant="h5" fontWeight="bold" textAlign="center" color="primary">
                        Update Assignment Solution
                    </Typography>

                    {error && <Alert severity="error">{error}</Alert>}

                    <TextField
                        label="Solution Description"
                        multiline
                        fullWidth
                        rows={4}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />

                    {/* Existing Files */}
                    {existingFiles.length > 0 && (
                        <Box>
                            <Typography variant="subtitle1" gutterBottom>
                                Previously Uploaded Files:
                            </Typography>
                            <Stack spacing={1}>
                                {existingFiles.map((file) => {
                                    const fileName = file.file?.split('/').pop() || 'File';
                                    return (
                                        <Box
                                            key={file.id}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                bgcolor: '#f5f5f5',
                                                p: 1,
                                                borderRadius: 1,
                                            }}
                                        >
                                            <Typography variant="body2">{fileName}</Typography>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleDeleteExistingFile(file.id)}
                                            >
                                                <Close fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    );
                                })}
                            </Stack>
                        </Box>
                    )}

                    {/* Drag-and-Drop Zone */}
                    <Paper
                        elevation={0}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current.click()}
                        sx={{
                            border: '2px dashed',
                            borderColor: dragActive ? 'primary.main' : '#90caf9',
                            bgcolor: dragActive ? '#e3f2fd' : '#f0f8ff',
                            p: 4,
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: '0.2s ease-in-out',
                        }}
                    >
                        <CloudUploadIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                        <Typography variant="subtitle1">
                            {dragActive ? 'Release to Upload' : 'Drag & Drop Files Here'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            or click to browse files
                        </Typography>
                        <input
                            ref={fileInputRef}
                            type="file"
                            hidden
                            multiple
                            onChange={handleFileInputChange}
                        />

                        {/* Selected files preview */}
                        {selectedFiles.length > 0 && (
                            <Stack spacing={1} mt={3}>
                                {selectedFiles.map((file, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            bgcolor: '#e0e0e0',
                                            p: 1,
                                            borderRadius: 1,
                                        }}
                                    >
                                        <Typography variant="body2">{file.name}</Typography>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleRemoveFile(index)}
                                            color="error"
                                        >
                                            <Close fontSize="small" />
                                        </IconButton>
                                    </Box>
                                ))}
                            </Stack>
                        )}
                    </Paper>

                    {/* Submit Button */}
                    <Box display="flex" justifyContent="flex-end">
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            color="primary"
                            disabled={isSubmitting}
                            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                            sx={{ px: 4 }}
                        >
                            {isSubmitting ? 'Updating...' : 'Update Solution'}
                        </Button>
                    </Box>
                </Stack>
            </form>
        </Box>
    );
};

export default UpdateSolutionForm;
