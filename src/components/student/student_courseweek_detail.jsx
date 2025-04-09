import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Typography,
    Container,
    Box,
    Avatar,
    Divider,
    Grid,
    Accordion,
    AccordionSummary,
    AccordionDetails,
 
    Skeleton,
} from '@mui/material';
import { ExpandMore, MoreVert } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import api from '../../api';

const StyledContainer = styled(Container)(({ theme }) => ({
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(6),
    backgroundColor: '#fff',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    borderRadius: '12px',
    padding: theme.spacing(2),
}));

const CourseAvatar = styled(Avatar)(({ theme }) => ({
    width: theme.spacing(14),
    height: theme.spacing(14),
    color: theme.palette.common.white,
    fontSize: '3rem',
    marginBottom: theme.spacing(2),
}));

const StudentCourseWeekDetail = () => {
    const { id } = useParams(); // Course week ID
    const [courseWeek, setCourseWeek] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourseWeek = async () => {
            try {
                const response = await api.get(`api/courses/course_weeks/${id}/`);
                setCourseWeek(response.data);
            } catch (error) {
                console.error('Error fetching course week:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseWeek();
    }, [id]);

    if (loading) {
        return (
            <StyledContainer maxWidth="md">
                <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                    <Skeleton variant="circular" width={112} height={112} />
                    <Skeleton variant="text" width="60%" height={40} sx={{ marginY: 1 }} />
                    <Skeleton variant="text" width="40%" height={30} />
                </Box>
                <Divider sx={{ marginY: 3 }} />
                <Box>
                    <Skeleton variant="rectangular" height={100} sx={{ marginBottom: 2 }} />
                    <Skeleton variant="rectangular" height={100} />
                </Box>
            </StyledContainer>
        );
    }

    if (!courseWeek) {
        return (
            <Typography variant="h6" color="textSecondary" textAlign="center">
                Course Week not found.
            </Typography>
        );
    }

    return (
        <StyledContainer maxWidth="md">
            <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} sm={4} md={3} textAlign={{ xs: 'center', sm: 'left' }}>
                    <CourseAvatar>{courseWeek.week_title.charAt(0).toUpperCase()}</CourseAvatar>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                    <Typography variant="h4" sx={{ fontWeight: '700', marginBottom: 1 }}>
                        {courseWeek.week_title}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        <strong>Week Number:</strong> {courseWeek.week_number || 'N/A'}
                    </Typography>
                </Grid>
                <Grid item xs={12} textAlign="right">
                    {/* Assuming handleMenuOpen is not needed, remove it if it's not implemented */}
                    
                </Grid>
            </Grid>

            <Divider sx={{ marginY: 3 }} />

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6">Course Week Details</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box>
                        <Typography variant="body1" paragraph>
                            {courseWeek.description || 'No description available for this week.'}
                        </Typography>
                        <Grid container spacing={2} sx={{ marginTop: 2 }}>
                            <Grid item xs={12}>
                                <Typography variant="body2">
                                    <strong>Uploaded File:</strong> {courseWeek.uploaded_file ? (
                                        <a href={courseWeek.uploaded_file} target="_blank" rel="noopener noreferrer">
                                            {courseWeek.uploaded_file}
                                        </a>
                                    ) : (
                                        'No file available for this week.'
                                    )}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </AccordionDetails>
            </Accordion>
        </StyledContainer>
    );
};

export default StudentCourseWeekDetail;
