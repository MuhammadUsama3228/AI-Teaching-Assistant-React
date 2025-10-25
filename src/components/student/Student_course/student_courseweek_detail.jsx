import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
    IconButton,
    Tooltip,
    Badge,
    Card,
    CardContent,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { ExpandMore, Visibility, InsertDriveFile } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import api from '../../../api.js';

const THEME_COLOR = '#4B2E83';

const StyledContainer = styled(Container)(({ theme }) => ({
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(6),
    backgroundColor: '#fff',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    borderRadius: '12px',
    padding: theme.spacing(3),
}));

const CourseAvatar = styled(Avatar)(({ theme }) => ({
    width: theme.spacing(14),
    height: theme.spacing(14),
    backgroundColor: THEME_COLOR,
    fontSize: '3rem',
    marginBottom: theme.spacing(2),
}));

const StudentCourseWeekDetail = () => {
    const { id } = useParams();
    const [courseWeek, setCourseWeek] = useState(null);
    const [announcementCount, setAnnouncementCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const weekRes = await api.get(`api/courses/course_weeks/${id}/`);
                setCourseWeek(weekRes.data);
                setAnnouncementCount(weekRes.data.week_announcements?.length || 0);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleViewAnnouncements = () => {
        if (announcementCount === 0) {
            alert('No announcements available for this week.');
        } else {
            navigate(`/course-weeks/${id}/announcements`);
        }
    };

    if (loading) {
        return (
            <StyledContainer maxWidth="md">
                <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                    <Skeleton variant="circular" width={112} height={112} />
                    <Skeleton variant="text" width="60%" height={40} sx={{ marginY: 1 }} />
                    <Skeleton variant="text" width="40%" height={30} />
                </Box>
                <Divider sx={{ marginY: 3 }} />
                <Skeleton variant="rectangular" height={100} sx={{ marginBottom: 2 }} />
                <Skeleton variant="rectangular" height={100} />
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
                <Grid item xs={12} sm={3} textAlign="center">
                    <CourseAvatar>
                        {courseWeek.week_title.charAt(0).toUpperCase()}
                    </CourseAvatar>
                </Grid>
                <Grid item xs={12} sm={8}>
                    <Typography variant={isMobile ? "h5" : "h4"} fontWeight="700" mb={1} color={THEME_COLOR}>
                        {courseWeek.week_title}
                    </Typography>
                    <Typography variant="subtitle1" bgcolor: THEME_COLOR>
                        <strong>Week Number:</strong> {courseWeek.week_number || 'N/A'}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={1} textAlign="right">
                    <Tooltip title="View Announcements">
                        <IconButton onClick={handleViewAnnouncements}>
                            <Badge
                                badgeContent={announcementCount}
                                color="primary"
                                invisible={announcementCount === 0}
                            >
                                <Visibility />
                            </Badge>
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>

            <Divider sx={{ marginY: 3 }} />

            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMore />} sx={{ backgroundColor: '#f9f9ff' }}>
                    <Typography variant="h6" sx={{ color: THEME_COLOR }}>
                        Course Week Details
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box>
                        <Typography variant="body1" paragraph>
                            {courseWeek.description || 'No description available for this week.'}
                        </Typography>

                        {/* File Card */}
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12}>
                                {courseWeek.uploaded_file ? (
                                    <Card
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            bgcolor: '#f0f4ff',
                                            borderLeft: `6px solid ${THEME_COLOR}`,
                                            borderRadius: 2,
                                            px: 2,
                                            py: 1.5,
                                        }}
                                    >
                                        <InsertDriveFile sx={{ color: THEME_COLOR, mr: 2 }} />
                                        <CardContent sx={{ flex: 1 }}>
                                            <Typography variant="body2" fontWeight={600}>
                                                Uploaded File:
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                component="a"
                                                href={courseWeek.uploaded_file}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                sx={{
                                                    color: THEME_COLOR,
                                                    textDecoration: 'underline',
                                                    wordBreak: 'break-all',
                                                }}
                                            >
                                                {courseWeek.uploaded_file}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <Typography variant="body2">
                                        <strong>Uploaded File:</strong> No file available for this week.
                                    </Typography>
                                )}
                            </Grid>
                        </Grid>
                    </Box>
                </AccordionDetails>
            </Accordion>
        </StyledContainer>
    );
};

export default StudentCourseWeekDetail;
