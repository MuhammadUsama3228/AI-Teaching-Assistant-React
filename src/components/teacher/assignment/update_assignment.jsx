import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Typography,
    Container,
    Box,
    TextField,
    Button,
    Grid,
    Snackbar,
    Alert,
    Skeleton,
} from '@mui/material';

import api from '../../../api';

const UpdateAssignmentForm = () => {
    const { courseId, assignmentId } = useParams(); // Fetch courseId and assignmentId
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        due_date: '',
        allowed_file_types: '',
        max_file_size: 0,
        marks: 0,
        attempts: 0,
    });
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAssignment = async () => {
            try {
                const response = await api.get(`/api/courses/assignment/${assignmentId}/`);
                setFormData(response.data);
            } catch (err) {
                console.error('Error fetching assignment:', err);
                setError('Failed to load assignment details.');
            } finally {
                setLoading(false);
            }
        };

        fetchAssignment();
    }, [assignmentId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess('');
        setError('');

        try {
            await api.patch(`/api/courses/assignment/${assignmentId}/`, formData);
            setSuccess('Assignment updated successfully!');
            navigate(`/courses/${courseId}/assignments/${assignmentId}/details`); 
        } catch (err) {
            console.error('Error updating assignment:', err);
            setError(err.response?.data?.message || 'Failed to update assignment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Box sx={{ p: 3, border: '1px solid #ccc', borderRadius: '8px',  }}>
                    <Skeleton variant="text" width={200} height={40} />
                    <Grid container spacing={2}>
                        {Array.from({ length: 7 }).map((_, index) => (
                            <Grid item xs={12} sm={index < 5 ? 12 : 6} key={index}>
                                <Skeleton variant="rectangular" height={56} />
                            </Grid>
                        ))}
                    </Grid>
                    <Box display="flex" justifyContent="flex-end" mt={3}>
                        <Skeleton variant="rectangular" width={120} height={40} sx={{ mr: 2 }} />
                        <Skeleton variant="rectangular" width={140} height={40} />
                    </Box>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box sx={{ p: 3, border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                multiline
                                rows={4}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Due Date"
                                name="due_date"
                                type="datetime-local"
                                value={formData.due_date}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Allowed File Types"
                                name="allowed_file_types"
                                value={formData.allowed_file_types}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Max File Size (MB)"
                                name="max_file_size"
                                type="number"
                                value={formData.max_file_size}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Marks"
                                name="marks"
                                type="number"
                                value={formData.marks}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Attempts"
                                name="attempts"
                                type="number"
                                value={formData.attempts}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                    </Grid>

                    <Box display="flex" justifyContent="flex-end" mt={3}>
                        <Button
                            variant="outlined"
                            color="secondary"
                            sx={{ mr: 2 }}
                            onClick={() => navigate(`/courses/${courseId}/assignments/${assignmentId}/details`)}
                        >
                            Cancel
                        </Button>
                        <Button variant="contained" color="primary" type="submit">
                            Save Changes
                        </Button>
                    </Box>
                </form>
            </Box>

            <Snackbar open={Boolean(success)} autoHideDuration={6000} onClose={() => setSuccess('')}>
                <Alert onClose={() => setSuccess('')} severity="success">
                    {success}
                </Alert>
            </Snackbar>

            <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setError('')}>
                <Alert onClose={() => setError('')} severity="error">
                    {error}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default UpdateAssignmentForm;
