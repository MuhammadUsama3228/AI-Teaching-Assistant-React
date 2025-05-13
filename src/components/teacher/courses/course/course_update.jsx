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
import { styled } from '@mui/material/styles';
import api from '../../../../api';

const StyledContainer = styled(Container)(({ theme }) => ({
    maxWidth: 'md',
    paddingTop: '4rem',
    paddingBottom: '2rem',
}));

const StyledCard = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#FFFFFFFF',
}));

const ActionButton = styled(Button)(({ theme }) => ({
    textTransform: 'capitalize',
    fontWeight: '600',
    borderRadius: '50px',
    padding: theme.spacing(1.5, 3),
    margin: theme.spacing(1),
}));

const CourseUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState({
        course_title: '',
        description: '',
        section: '',
        weeks: '',
        course_code: '',
    });
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await api.get(`/api/courses/course/${id}/`);
                setCourse(response.data);
            } catch (err) {
                console.error('Error fetching course details:', err);
                setError('Failed to load course details.');
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourse((prevCourse) => ({ ...prevCourse, [name]: value }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess('');
        setError('');

        try {
            await api.put(`/api/courses/course/${id}/`, course);
            setSuccess('Course updated successfully!');
            navigate(`/view-courses`);
        } catch (err) {
            console.error('Error updating course:', err);
            setError('Failed to update course. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <StyledContainer>
                <StyledCard>
                    <Skeleton variant="text" width="60%" height={40} sx={{ marginBottom: 2 }} />
                    <Grid container spacing={2}>
                        {Array.from({ length: 4 }).map((_, index) => (
                            <Grid item xs={12} key={index}>
                                <Skeleton variant="rectangular" height={56} />
                            </Grid>
                        ))}
                    </Grid>
                </StyledCard>
            </StyledContainer>
        );
    }

    return (
        <StyledContainer>
            <StyledCard>
               

                <form onSubmit={handleUpdate}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Course Title"
                                name="course_title"
                                size='small'
                                value={course.course_title}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                value={course.description}
                                onChange={handleChange}
                                required
                                multiline
                                rows={4}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Section"
                                name="section"
                                size='small'
                                value={course.section}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                      
                    </Grid>

                    <Box display="flex" justifyContent="flex-end" mt={3}>
                        <ActionButton variant="outlined" color="secondary" onClick={() => navigate(`/coursedetail/${id}`)}>
                            Cancel
                        </ActionButton>
                        <ActionButton variant="contained" color="primary" type="submit">
                            Save Changes
                        </ActionButton>
                    </Box>
                </form>
            </StyledCard>

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
        </StyledContainer>
    );
};

export default CourseUpdate;
