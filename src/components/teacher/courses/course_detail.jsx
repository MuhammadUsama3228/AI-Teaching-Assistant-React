import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Container, Box, CircularProgress, Card, CardContent, Avatar, Divider, Button, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Delete, Edit } from '@mui/icons-material';
import api from '../../../api';


const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: '16px',
    boxShadow: '0 6px 24px rgba(0, 0, 0, 0.1)',
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(4),
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
    },
}));

const CourseAvatar = styled(Avatar)(({ theme }) => ({
    width: theme.spacing(12),
    height: theme.spacing(12),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontSize: theme.typography.h4.fontSize,
    marginBottom: theme.spacing(2),
}));

const ActionButton = styled(Button)(({ theme }) => ({
    textTransform: 'capitalize',
    fontWeight: '600',
    borderRadius: '50px',
    padding: theme.spacing(1.5, 3),
    minWidth: '160px',
}));

const CourseDetail = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await api.get(`api/courses/course/${id}/`);
                setCourse(response.data);
            } catch (error) {
                console.error('Error fetching course details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id]);

    const handleUpdate = () => {
        navigate(`/update-course/${id}`);
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await api.delete(`api/courses/course/${id}/`);
                navigate('/view-courses');
            } catch (error) {
                console.error('Error deleting course:', error);
            }
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                <CircularProgress size={60} />
            </Box>
        );
    }

    if (!course) {
        return (
            <Typography variant="h6" color="textSecondary" textAlign="center">
                Course not found.
            </Typography>
        );
    }

    return (
        <Container component="main" maxWidth="lg" sx={{ paddingTop: '4rem', paddingBottom: '2rem' }}>
            <StyledCard>
                <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                    <CourseAvatar>{course.course_title.charAt(0).toUpperCase()}</CourseAvatar>
                    <Typography variant="h4" sx={{ fontWeight: '700', color: 'primary.main', textAlign: 'center' }} gutterBottom>
                        {course.course_title}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary" sx={{ marginBottom: 3 }}>
                        <strong>Course Code:</strong> {course.course_code || 'N/A'}
                    </Typography>
                    {/* Display teacher name */}
                    <Typography variant="subtitle1" color="textSecondary">
                        <strong>Teacher:</strong> {course.teacher || 'N/A'}
                    </Typography>
                </Box>

                <Divider sx={{ marginY: 2 }} />

                <CardContent>
                    <Typography variant="body1" paragraph sx={{ color: 'text.primary', lineHeight: '1.6' }}>
                        {course.description || 'No description available for this course.'}
                    </Typography>
                    <Grid container spacing={2} sx={{ marginTop: 2 }}>
                        <Grid item xs={6}>
                            <Typography variant="body2" color="textSecondary">
                                <strong>Section:</strong> {course.section || 'N/A'}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body2" color="textSecondary">
                                <strong>Duration:</strong> {course.weeks} weeks
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body2" color="textSecondary">
                                <strong>Students Enrolled:</strong> {course.enrolled_students || 0}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>

                <Box display="flex" justifyContent="space-between" mt={4}>
                    <ActionButton
                        variant="contained"
                        color="primary"
                        onClick={handleUpdate}
                        startIcon={<Edit />}
                        sx={{ width: '48%' }}
                    >
                        Update Course
                    </ActionButton>
                    <ActionButton
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                        startIcon={<Delete />}
                        sx={{ width: '48%' }}
                    >
                        Delete Course
                    </ActionButton>
                </Box>
            </StyledCard>
        </Container>
    );
};

export default CourseDetail;
