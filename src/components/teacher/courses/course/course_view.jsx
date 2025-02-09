import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Container, Box, CircularProgress, Card, CardContent, CardActions, Button, Grid, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import api from '../../../../api';

// Custom styles
const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: '16px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1), 0px 2px 3px rgba(0, 0, 0, 0.07)',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out, opacity 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
        opacity: 0.9,
        cursor: 'pointer',
    },
    backgroundColor: theme.palette.background.paper,
    overflow: 'hidden',
}));

const CourseAvatar = styled(Avatar)(({ theme }) => ({
    width: theme.spacing(10),
    height: theme.spacing(10),
    backgroundColor: theme.palette.primary.main,
    marginBottom: theme.spacing(2),
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#fff',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
}));

const StyledButton = styled(Button)(({ theme }) => ({
    textTransform: 'none',
    borderRadius: '20px',
    fontWeight: '600',
    padding: '10px 20px',
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    },
}));

const ReadCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await api.get('/api/courses/course/');
                setCourses(response.data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const handleCourseClick = (course) => {
        console.log(`Clicked on course: ${course.course_title}`);
        navigate(`/coursedetail/${course.id}`);
    };

    return (
        <Container component="main" maxWidth="lg" sx={{ padding: '3rem 1rem', borderRadius: '12px' }}>
            <Typography variant="h4" gutterBottom textAlign="center" sx={{ fontWeight: '600', color: '#333', marginBottom: '2rem' }}>
                Our Courses
            </Typography>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                    <CircularProgress />
                </Box>
            ) : courses.length === 0 ? (
                <Typography variant="h6" color="textSecondary" textAlign="center" sx={{ color: '#999' }}>
                    No courses available at the moment.
                </Typography>
            ) : (
                <Grid container spacing={4}>
                    {courses.map((course) => (
                        <Grid item xs={12} sm={6} md={4} key={course.id}>
                            <Box onClick={() => handleCourseClick(course)}>
                                <StyledCard>
                                    <Box display="flex" flexDirection="column" alignItems="center" p={3}>
                                        <CourseAvatar>{course.course_title.charAt(0)}</CourseAvatar>
                                        <Typography variant="h6" gutterBottom sx={{ fontWeight: '600', color: '#333' }}>
                                            {course.course_title}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                                            {course.description || 'No description provided.'}
                                        </Typography>
                                    </Box>
                                    <CardContent>
                                        <Typography variant="body2" color="textSecondary">
                                            <strong>Section:</strong> {course.section || 'N/A'}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            <strong>Duration:</strong> {course.weeks} weeks
                                        </Typography>
                                    </CardContent>
                                    <CardActions sx={{ justifyContent: 'center', paddingBottom: 2 }}>
                                        <StyledButton
                                            size="small"
                                            variant="contained"
                                            color="primary"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevents triggering card click
                                                handleCourseClick(course);
                                            }}
                                        >
                                            View Details
                                        </StyledButton>
                                    </CardActions>
                                </StyledCard>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default ReadCourses;
