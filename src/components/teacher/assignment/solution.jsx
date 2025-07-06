import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Stack,
    Typography,
    InputLabel,
    Box,
    Alert,
    CircularProgress,
    Tabs,
    Tab,
    Paper,
    IconButton,
} from '@mui/material';
import { Add, Close } from '@mui/icons-material';
import api from '../../../api';

const UpdateSolutionForm = ({ solution, onClose }) => {
    const [text, setText] = useState(solution?.text || '');
    const [fileTabs, setFileTabs] = useState([{ id: Date.now(), file: null }]);
    const [existingFiles, setExistingFiles] = useState([]);
    const [selectedTab, setSelectedTab] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (solution?.files?.length > 0) {
            setExistingFiles(solution.files);
        }
    }, [solution]);

    const handleTabChange = (_, newValue) => {
        setSelectedTab(newValue);
    };

    const handleFileChange = (index, file) => {
        const updatedTabs = [...fileTabs];
        updatedTabs[index].file = file;
        setFileTabs(updatedTabs);
    };

    const handleAddTab = () => {
        setFileTabs([...fileTabs, { id: Date.now(), file: null }]);
        setSelectedTab(fileTabs.length);
    };

    const handleRemoveTab = (index) => {
        if (fileTabs.length === 1) return;
        const updatedTabs = fileTabs.filter((_, i) => i !== index);
        setFileTabs(updatedTabs);
        setSelectedTab(Math.max(0, index - 1));
    };

    const handleDeleteExistingFile = async (fileId) => {
        if (!window.confirm('Are you sure you want to delete this file?')) return;
        try {
            await api.delete(`/api/courses/solution_file/${fileId}/`);
            setExistingFiles((prev) => prev.filter((file) => file.id !== fileId));
        } catch (err) {
            console.error('Failed to delete file:', err);
            setError('Failed to delete file.');
        }
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

        fileTabs.forEach((tab) => {
            if (tab.file) {
                formData.append('files', tab.file);
            }
        });

        try {
            await api.patch(`/api/courses/solution/${solution.id}/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            onClose(); // Close dialog and refresh
        } catch (err) {
            console.error(err);
            setError('Failed to update solution.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
                {error && <Alert severity="error">{error}</Alert>}

                <TextField
                    label="Solution Text"
                    multiline
                    fullWidth
                    rows={4}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />

                {existingFiles.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Existing Uploaded Files:
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
                                            backgroundColor: '#f9f9f9',
                                            p: 1,
                                            borderRadius: 1,
                                        }}
                                    >
                                        <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                                            {fileName}
                                        </Typography>
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

                <Paper variant="outlined" sx={{ p: 2 }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="subtitle1">Upload New Files</Typography>
                        <IconButton onClick={handleAddTab} color="primary">
                            <Add />
                        </IconButton>
                    </Box>

                    <Tabs
                        value={selectedTab}
                        onChange={handleTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{ borderBottom: 1, borderColor: 'divider', mt: 1 }}
                    >
                        {fileTabs.map((tab, index) => (
                            <Tab
                                key={tab.id}
                                label={
                                    <Box display="flex" alignItems="center" gap={1}>
                                        File {index + 1}
                                        {fileTabs.length > 1 && (
                                            <Box
                                                component="span"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveTab(index);
                                                }}
                                                sx={{
                                                    ml: 1,
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    cursor: 'pointer',
                                                    color: 'error.main',
                                                }}
                                            >
                                                <Close fontSize="small" />
                                            </Box>
                                        )}
                                    </Box>
                                }
                            />
                        ))}
                    </Tabs>

                    {fileTabs[selectedTab] && (
                        <Box mt={2}>
                            <InputLabel>Choose File</InputLabel>
                            <input
                                type="file"
                                onChange={(e) => handleFileChange(selectedTab, e.target.files[0])}
                            />
                            {fileTabs[selectedTab].file && (
                                <Typography variant="caption" color="textSecondary">
                                    Selected: {fileTabs[selectedTab].file.name}
                                </Typography>
                            )}
                        </Box>
                    )}
                </Paper>

                <Box display="flex" justifyContent="flex-end">
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                    >
                        {isSubmitting ? 'Updating...' : 'Update Solution'}
                    </Button>
                </Box>
            </Stack>
        </form>
    );
};

export default UpdateSolutionForm;
