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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    Skeleton,
    Menu,
    MenuItem,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ExpandMore, MoreVert, Menu as MenuIcon } from '@mui/icons-material';

import api from '../../../../api';
import CourseUpdate from './course_update';

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

const CourseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [courseWeeks, setCourseWeeks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [iconMenuAnchorEl, setIconMenuAnchorEl] = useState(null);
    const [updatedCourse, setUpdatedCourse] = useState({
        course_title: '',
        course_code: '',
        description: '',
        section: '',
        weeks: '',
    });

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await api.get(`/api/courses/course/${id}/`);
                setCourse(response.data);
                setUpdatedCourse(response.data);
                const weeksResponse = await api.get(`/api/courses/course_weeks/`, {
                    params: { course: id },
                });
                setCourseWeeks(weeksResponse.data);
            } catch (error) {
                console.error('Error fetching course details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id]);

    const handleUpdateOpen = () => {
        setOpenUpdateDialog(true);
    };

    const handleUpdateClose = () => {
        setOpenUpdateDialog(false);
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await api.delete(`/api/courses/course/${id}/`);
                navigate('/view-courses');
            } catch (error) {
                console.error('Error deleting course:', error);
            }
        }
        setOpenDeleteDialog(false);
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDeleteClick = () => {
        handleMenuClose();
        setOpenDeleteDialog(true);
    };

    const handleUpdateClick = () => {
        handleMenuClose();
        handleUpdateOpen();
    };

    const handleCourseWeekClick = (weekId) => {
        navigate(`/courseweekdetail/${weekId}`);
    };

    const handleIconMenuOpen = (event) => {
        setIconMenuAnchorEl(event.currentTarget);
    };

    const handleIconMenuClose = () => {
        setIconMenuAnchorEl(null);
    };

    const handleCreateAssignment = () => {
        handleIconMenuClose();
        navigate(`/create_assignment/${id}`);

    };

    const handleViewAssignments = () => {
        handleIconMenuClose();
        navigate(`/read_assignments/${id}`);
    };

    const handleTimeSlots = () => {
        handleIconMenuClose();
        navigate(`/course-time-slots/${id}`);
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
                <Box>
                    <Skeleton variant="rectangular" height={100} sx={{ marginBottom: 2 }} />
                    <Skeleton variant="rectangular" height={100} />
                </Box>
            </StyledContainer>
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
        <StyledContainer maxWidth="md">
           
            <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} sm={4} md={3} textAlign={{ xs: 'center', sm: 'left' }}>
                    <CourseAvatar>{course.course_title.charAt(0).toUpperCase()}</CourseAvatar>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                    <Typography variant="h4" sx={{ fontWeight: '700', marginBottom: 1 }}>
                        {course.course_title}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        <strong>Course Code:</strong> {course.course_code || 'N/A'}
                    </Typography>
                </Grid>
                <Grid item xs={12} textAlign="right">
                    <IconButton onClick={handleMenuOpen}>
                        <MoreVert />
                    </IconButton>
                </Grid>

                <Grid item xs={12} textAlign="left">
                <IconButton onClick={handleIconMenuOpen}>
                    <MenuIcon />
                </IconButton>
            </Grid>
            </Grid>

            <Divider sx={{ marginY: 3 }} />

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6">Course Details</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box>
                        <Typography variant="body1" paragraph>
                            {course.description || 'No description available for this course.'}
                        </Typography>
                        <Grid container spacing={2} sx={{ marginTop: 2 }}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2">
                                    <strong>Section:</strong> {course.section || 'N/A'}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2">
                                    <strong>Duration:</strong> {course.weeks} weeks
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </AccordionDetails>
            </Accordion>

            <Divider sx={{ marginY: 3 }} />

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6">Course Weeks</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={2}>
                        {courseWeeks.length > 0 ? (
                            courseWeeks.map((week) => (
                                <Grid item xs={12} sm={6} md={4} key={week.id}>
                                    <Box
                                        sx={{
                                            border: '1px solid #ccc',
                                            borderRadius: '8px',
                                            padding: 5,
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            '&:hover': {
                                                backgroundColor: '#f5f5f5',
                                            },
                                        }}
                                        onClick={() => handleCourseWeekClick(week.id)}
                                    >
                                        <Avatar
                                            sx={{
                                                width: 56,
                                                height: 56,
                                                margin: '0 auto 16px',
                                                bgcolor: 'primary.main',
                                                color: 'white',
                                            }}
                                        >
                                            {week.week_number}
                                        </Avatar>
                                        <Typography variant="h6">{`${week.week_title}`}</Typography>
                                    </Box>
                                </Grid>
                            ))
                        ) : (
                            <Typography>No weeks available for this course.</Typography>
                        )}
                    </Grid>
                </AccordionDetails>
            </Accordion>

            <Menu
                anchorEl={iconMenuAnchorEl}
                open={Boolean(iconMenuAnchorEl)}
                onClose={handleIconMenuClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <MenuItem onClick={handleCreateAssignment}>Create Assignment</MenuItem>
                <MenuItem onClick={handleViewAssignments}>View Assignments</MenuItem>
                <MenuItem onClick={handleTimeSlots}>View Time Slots</MenuItem>
            </Menu>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={handleUpdateClick}>Update Course</MenuItem>
                <MenuItem onClick={handleDeleteClick}>Delete Course</MenuItem>
            </Menu>

            <Dialog open={openUpdateDialog} onClose={handleUpdateClose}>
                <DialogTitle>Update Course</DialogTitle>
                <DialogContent>
                    <CourseUpdate />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleUpdateClose}>Cancel</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>Delete Course</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this course?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
                    <Button onClick={handleDelete} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </StyledContainer>
    );
};

export default CourseDetail;
