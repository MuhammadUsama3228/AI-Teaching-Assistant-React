import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Skeleton,
    Snackbar,
    Alert,
    Button,
    useMediaQuery,
    useTheme
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EventIcon from '@mui/icons-material/Event';
import { useNavigate } from 'react-router-dom';
import api from '../../../api.js';

const THEME_COLOR = '#4B2E83';

const StudentCourseWeekView = ({ courseId }) => {
    const [courseWeeks, setCourseWeeks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourseWeeks = async () => {
            try {
                const response = await api.get(`/api/courses/course_weeks/?course=${courseId}`);
                setCourseWeeks(response.data);
            } catch (err) {
                setError('Failed to fetch course weeks.');
                setOpenSnackbar(true);
            } finally {
                setLoading(false);
            }
        };

        if (courseId) fetchCourseWeeks();
    }, [courseId]);

    const handleViewDetails = (id) => {
        navigate(`/studentcourseweekdetail/${id}`);
    };

    return (
        <Container maxWidth="lg" sx={{ py: isMobile ? 2 : 4 }}>
            <Typography
                variant={isMobile ? 'h6' : isTablet ? 'h5' : 'h4'}
                sx={{ fontWeight: 600, color: THEME_COLOR, mb: 3 }}
            >
                Course Weeks
            </Typography>

            {loading ? (
                <Box>
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} variant="rectangular" height={60} sx={{ mb: 2 }} />
                    ))}
                </Box>
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
                <Typography align="center" color="text.secondary">
                    No course weeks available for this course.
                </Typography>
            ) : (
                <Box>
                    {courseWeeks.map((week) => (
                        <Accordion key={week.id} sx={{ borderRadius: 2, mb: 2 }}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon sx={{ color: THEME_COLOR }} />}
                                sx={{ backgroundColor: '#f5f5f5', px: isMobile ? 2 : 4 }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: 600,
                                        color: THEME_COLOR,
                                        fontSize: isMobile ? '1rem' : '1.1rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}
                                >
                                    <EventIcon sx={{ color: THEME_COLOR }} />
                                    Week {week.week_number}: {week.week_title}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ px: isMobile ? 2 : 4, pb: 3 }}>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    {week.description || 'No description available.'}
                                </Typography>
                                <Button
                                    variant="contained"
                                    onClick={() => handleViewDetails(week.id)}
                                    sx={{
                                        textTransform: 'none',
                                        backgroundColor: THEME_COLOR,
                                        color: '#fff',
                                        borderRadius: 2,
                                        px: 3,
                                        '&:hover': {
                                            backgroundColor: '#3a2168',
                                        },
                                    }}
                                    endIcon={<ArrowForwardIcon />}
                                >
                                    View Details
                                </Button>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>
            )}
        </Container>
    );
};

export default StudentCourseWeekView;
