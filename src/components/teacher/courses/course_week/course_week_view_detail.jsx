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
    CircularProgress,
    Skeleton,
    Menu,
    MenuItem,
    Fab,
    Drawer,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import { Add, Visibility, MoreVert } from '@mui/icons-material';
import { ExpandMore } from '@mui/icons-material';
import WeekAnnouncementForm from '../week_announcement/week_announcement_create';
import { styled } from '@mui/material/styles';
import api from '../../../../api';
import CustomMenuIcon from './icon';
import CourseWeekUpdate from './course_week_update';

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

const CourseWeekDetail = () => {
    const { id } = useParams(); // Course week ID
    const navigate = useNavigate();
    const [courseWeek, setCourseWeek] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openAnnouncementDialog, setOpenAnnouncementDialog] = useState(false);
    const [openSidebar, setOpenSidebar] = useState(false); // Sidebar state

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

    const handleUpdateOpen = () => {
        setOpenUpdateDialog(true);
        handleMenuClose();
    };

    const handleUpdateClose = () => {
        setOpenUpdateDialog(false);
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

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this course week?')) {
            try {
                await api.delete(`api/courses/course_weeks/${id}/`);
                navigate('/course_week_view');
            } catch (error) {
                console.error('Error deleting course week:', error);
            }
        }
        setOpenDeleteDialog(false);
    };

    const handleSidebarOpen = () => {
        setOpenSidebar(true);
    };

    const handleSidebarClose = () => {
        setOpenSidebar(false);
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

    if (!courseWeek) {
        return (
            <Typography variant="h6" color="textSecondary" textAlign="center">
                Course Week not found.
            </Typography>
        );
    }

    return (
        <StyledContainer maxWidth="md">
            <IconButton
                onClick={handleSidebarOpen}
                sx={{
                    position: 'fixed',
                    top: 100,
                    right: 16,
                    zIndex: 1000, 
                }}
            >
                <CustomMenuIcon />
            </IconButton>

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
                    <IconButton onClick={handleMenuOpen}>
                        <MoreVert />
                    </IconButton>
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
                <MenuItem onClick={handleUpdateOpen}>Update Course</MenuItem>
                <MenuItem onClick={handleDeleteClick}>Delete Course</MenuItem>
            </Menu>

            <Dialog open={openUpdateDialog} onClose={handleUpdateClose}>
                <DialogTitle>Update Course Week</DialogTitle>
                <DialogContent>
                    <CourseWeekUpdate courseWeek={courseWeek} onClose={handleUpdateClose} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleUpdateClose}>Cancel</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>Delete Course Week</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this course week?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
                    <Button onClick={handleDelete} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openAnnouncementDialog} onClose={() => setOpenAnnouncementDialog(false)}>
                <DialogTitle>Create Announcement</DialogTitle>
                <DialogContent>
                    <WeekAnnouncementForm courseId={courseWeek.course} courseWeekId={courseWeek.id} />
                </DialogContent>
            </Dialog>

            {/* Sidebar Drawer */}
            <Drawer
                anchor="right"
                open={openSidebar}
                onClose={handleSidebarClose}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: '230px', 
                        backgroundColor: '#f7f9fc', 
                        borderLeft: '1px solid #ccc', 
                        padding: '16px', 
                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)', 
                        top: 50
                    },
                }}
            >
                <List>
                    <ListItem button onClick={() => { 
                        setOpenAnnouncementDialog(true); 
                        handleSidebarClose(); 
                    }} sx={{ padding: '10px 16px', borderRadius: '8px', '&:hover': { backgroundColor: '#e0f7fa' } }}>
                        <Add sx={{ marginRight: 1 }} />
                        <ListItemText primary="Create Announcement" />
                    </ListItem>
                    <ListItem button onClick={() => { 
                        navigate(`/courses/course/${courseWeek.course}/weeks/${courseWeek.id}/announcements`);
                        handleSidebarClose(); 
                    }} sx={{ padding: '10px 16px', borderRadius: '8px', '&:hover': { backgroundColor: '#e0f7fa' } }}>
                        <Visibility sx={{ marginRight: 1 }} />
                        <ListItemText primary="View Announcements" />
                    </ListItem>
                </List>
            </Drawer>
        </StyledContainer>
    );
};

export default CourseWeekDetail;
