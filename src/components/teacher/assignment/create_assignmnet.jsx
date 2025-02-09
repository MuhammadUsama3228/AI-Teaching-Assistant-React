import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Typography,
    Container,
    Box,
    CircularProgress,
    ThemeProvider,
    Skeleton,
    Switch,
    FormControlLabel,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import theme from '../../Theme';
import api from '../../../api';


const AssignmentModel = {
    course: '',
    title: '',
    marks: '',
    description: '',
    due_date: '',
    allowed_file_types: '',
    attempts: '',
    max_file_size: 5 * (1024 * 1024), 
    accept_within_due_date: false,
};

function CreateAssignmentForm() {
    const { id } = useParams();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [coursesLoading, setCoursesLoading] = useState(true); 
    const [formData, setFormData] = useState({ ...AssignmentModel, course: id || '' });
    const [success, setSuccess] = useState('');

  
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await api.get('/api/courses/course/');
                setCourses(response.data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            } finally {
                setCoursesLoading(false);
            }
        };
        fetchCourses();
    }, []);

  
    useEffect(() => {
        setFormData((prev) => ({ ...prev, course: id }));
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (success) setSuccess('');
    };

    const handleSwitchChange = (e) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({ ...prev, [name]: checked }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess('');

        try {
            await api.post('/api/courses/assignment/', formData);
            setSuccess('Assignment created successfully!');
            setFormData({ ...AssignmentModel, course: id || '' });
        } catch (err) {
            console.error('Error creating assignment:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="sm" sx={{ mt: 5 }}>
                <Box
                    sx={{
                        p: 3,
                        boxShadow: 3,
                        borderRadius: 2,
                        backgroundColor: 'background.paper',
                    }}
                >
                    <Typography variant="h4" gutterBottom>
                        Create Assignment
                    </Typography>

                    {success && (
                        <Typography color="primary" gutterBottom>
                            {success}
                        </Typography>
                    )}

                    {coursesLoading ? (
                        <>
                            <Skeleton variant="text" width="100%" height={40} />
                            <Skeleton variant="text" width="60%" height={40} sx={{ my: 2 }} />
                            <Skeleton variant="rectangular" width="100%" height={100} sx={{ mb: 3 }} />
                        </>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="Title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                                required
                            />

                            <TextField
                                label="Marks"
                                name="marks"
                                type="number"
                                value={formData.marks}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />

                            <TextField
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                fullWidth
                                multiline
                                rows={4}
                                margin="normal"
                            />

                            <TextField
                                label="Due Date"
                                name="due_date"
                                type="datetime-local"
                                value={formData.due_date}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                required
                            />

                            <TextField
                                label="Allowed File Types"
                                name="allowed_file_types"
                                value={formData.allowed_file_types}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                                placeholder="e.g., zip,py"
                            />

                            <TextField
                                label="Attempts"
                                name="attempts"
                                type="number"
                                value={formData.attempts}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />

                            <TextField
                                label="Max File Size (MB)"
                                name="max_file_size"
                                type="number"
                                value={formData.max_file_size / (1024 * 1024)}
                                onChange={(e) =>
                                    handleInputChange({
                                        target: {
                                            name: 'max_file_size',
                                            value: e.target.value * (1024 * 1024),
                                        },
                                    })
                                }
                                fullWidth
                                margin="normal"
                            />

                            <FormControlLabel
                                control={
                                    <Switch
                                        name="accept_within_due_date"
                                        checked={formData.accept_within_due_date}
                                        onChange={handleSwitchChange}
                                    />
                                }
                                label="Accept Submissions Within Due Date"
                                sx={{ mt: 2 }}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{ mt: 3 }}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        Submitting
                                        <CircularProgress size={20} sx={{ ml: 2 }} />
                                    </>
                                ) : (
                                    'Create Assignment'
                                )}
                            </Button>
                        </form>
                    )}
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default CreateAssignmentForm;
