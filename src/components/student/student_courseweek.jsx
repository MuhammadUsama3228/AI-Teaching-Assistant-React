import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Container, Box, Grid, Card, CardContent, CardActions, Button, Skeleton, Snackbar, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import api from '../../api'; // Assuming you have api configured here
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'; // Importing the arrow icon
import EventIcon from '@mui/icons-material/Event'; // Importing the event icon for weeks

// Styled Card Component
const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: '16px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1), 0px 2px 3px rgba(0, 0, 0, 0.07)',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
    },
    backgroundColor: theme.palette.background.paper,
}));

// Styled Button Component
const StyledButton = styled(Button)(({ theme }) => ({
    textTransform: 'none',
    borderRadius: '20px',
    fontWeight: '600',
    padding: '12px 24px',
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    },
}));

const StudentCourseWeekView = () => {
    const [courseWeeks, setCourseWeeks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const { courseId } = useParams();  // Get the courseId from URL params
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourseWeeks = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get(`/api/courses/course_weeks/?course=${courseId}`);
                setCourseWeeks(response.data); // Assuming the response is an array of course weeks
            } catch (error) {
                setError('Failed to fetch course weeks');
                setOpenSnackbar(true);
            } finally {
                setLoading(false);
            }
        };

        if (courseId) {
            fetchCourseWeeks();
        }
    }, [courseId]);

    const handleViewDetails = (id) => {
        navigate(`/studentcourseweekdetail/${id}`);
    };

    return (
        <Container component="main" maxWidth="lg" sx={{ padding: '3rem 1rem', borderRadius: '12px', backgroundColor: '#f9f9f9' }}>
            <Typography variant="h4" gutterBottom textAlign="center" sx={{ fontWeight: '700', color: '#2c3e50', marginBottom: '2rem' }}>
                Course Weeks
            </Typography>

            {/* Skeleton for loading */}
            {loading ? (
                <Grid container spacing={4}>
                    {[...Array(6)].map((_, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card sx={{ borderRadius: '16px', boxShadow: 'none' }}>
                                <Skeleton variant="rectangular" width="100%" height={140} />
                                <Skeleton variant="text" sx={{ marginTop: 2 }} width="60%" />
                                <Skeleton variant="text" width="80%" />
                                <Skeleton variant="text" width="90%" />
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : error ? (
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000}
                    onClose={() => setOpenSnackbar(false)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert severity="error">{error}</Alert>
                </Snackbar>
            ) : courseWeeks.length === 0 ? (
                <Typography variant="h6" color="textSecondary" textAlign="center" sx={{ color: '#7f8c8d' }}>
                    No course weeks available for this course.
                </Typography>
            ) : (
                <Grid container spacing={4}>
                    {courseWeeks.map((week) => (
                        <Grid item xs={12} sm={6} md={4} key={week.id}>
                            <StyledCard>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: '700', color: '#34495e', display: 'flex', alignItems: 'center' }}>
                                        <EventIcon sx={{ marginRight: 1 }} /> {/* Week icon */}
                                        Week {week.week_number}: {week.week_title}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'center', paddingBottom: 2 }}>
                                    <StyledButton
                                        size="small"
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleViewDetails(week.id)}
                                        endIcon={<ArrowForwardIcon />}  
                                    >
                                        View Details
                                    </StyledButton>
                                </CardActions>
                            </StyledCard>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default StudentCourseWeekView;
