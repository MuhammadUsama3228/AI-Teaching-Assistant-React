import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Typography, Container, Box, Avatar, Divider, Grid, Accordion, AccordionSummary,
    AccordionDetails, Dialog, DialogTitle, DialogContent, DialogActions, Button,
    IconButton, Skeleton, Menu, MenuItem, Drawer, List, ListItem, ListItemIcon,
    ListItemText, useTheme, useMediaQuery
} from '@mui/material';
import { Add, Visibility, MoreVert, ExpandMore, Edit, Delete, Download } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import api from '../../../../api';
import WeekAnnouncementForm from '../week_announcement/week_announcement_create';
import CustomMenuIcon from './icon';
import CourseWeekUpdate from './course_week_update';
import DescriptionIcon from '@mui/icons-material/Description';

const StyledContainer = styled(Container)(({ theme }) => ({
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(6),
    marginRight: theme.spacing(8),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(4),
    boxShadow: theme.shadows[3],
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
        marginTop: theme.spacing(8),
        marginBottom: theme.spacing(4),
        marginRight: theme.spacing(1),
    },
}));

const CourseAvatar = styled(Avatar)(({ theme }) => ({
    width: theme.spacing(14),
    height: theme.spacing(14),
    fontSize: '2.8rem',
    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
    color: theme.palette.common.white,
    margin: 'auto',
    [theme.breakpoints.down('sm')]: {
        width: theme.spacing(10),
        height: theme.spacing(10),
        fontSize: '2rem',
    },
}));

const CourseWeekDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [courseWeek, setCourseWeek] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openAnnouncementDialog, setOpenAnnouncementDialog] = useState(false);
    const [openSidebar, setOpenSidebar] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get(`api/courses/course_weeks/${id}/`);
                setCourseWeek(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleDelete = async () => {
        try {
            await api.delete(`api/courses/course_weeks/${id}/`);
            navigate('/course_week_view');
        } catch (error) {
            console.error(error);
        }
        setOpenDeleteDialog(false);
    };

    if (loading) {
        return (
            <StyledContainer maxWidth="md">
                <Skeleton variant="circular" width={112} height={112} sx={{ mx: 'auto' }} />
                <Skeleton height={40} sx={{ my: 2, mx: 'auto', width: '60%' }} />
                <Skeleton height={30} sx={{ mx: 'auto', width: '40%' }} />
                <Divider sx={{ my: 3 }} />
                <Skeleton variant="rectangular" height={150} />
            </StyledContainer>
        );
    }

    if (!courseWeek) {
        return <Typography align="center" variant="h6" sx={{ mt: 10 }}>Course Week not found.</Typography>;
    }

    return (
        <StyledContainer  maxWidth="md">
            <IconButton
                onClick={() => setOpenSidebar(true)}
                sx={{
                    position: 'fixed',
                    top: { xs: 80, sm: 100 },
                    right: 16,
                    zIndex: 1300,
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: theme.shadows[2],
                    borderRadius: '50%',
                }}
            >
                <CustomMenuIcon />
            </IconButton>

            <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} sm={4}>
                    <CourseAvatar>
                        {courseWeek.week_title.charAt(0).toUpperCase()}
                    </CourseAvatar>
                </Grid>
                <Grid item xs={12} sm={8}>
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        gutterBottom
                        sx={{
                            fontSize: { xs: '1.8rem', sm: '2.2rem' },
                            textAlign: { xs: 'center', sm: 'left' },
                        }}
                    >
                        {courseWeek.week_title}
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        color="text.secondary"
                        sx={{ textAlign: { xs: 'center', sm: 'left' } }}
                    >
                        <strong>Week Number:</strong> {courseWeek.week_number || 'N/A'}
                    </Typography>
                </Grid>
                <Grid item xs={12} textAlign="right">
                    <IconButton onClick={handleMenuOpen}>
                        <MoreVert />
                    </IconButton>
                </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6">Course Week Details</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography paragraph>
                        {courseWeek.description || 'No description available.'}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Uploaded File:</strong>{' '}
                        {courseWeek.uploaded_file ? (
                            <Box display="flex" alignItems="center" gap={1} mt={1}>
                                <DescriptionIcon color="primary" />
                                <a
                                    href={courseWeek.uploaded_file}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ textDecoration: 'none', color: theme.palette.primary.main, fontWeight: 500 }}
                                >
                                    {courseWeek.uploaded_file.split('/').pop()}
                                </a>
                                <IconButton
                                    href={courseWeek.uploaded_file}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    size="small"
                                    color="primary"
                                >
                                    <Download fontSize="small" />
                                </IconButton>
                            </Box>
                        ) : (
                            'No file uploaded.'
                        )}
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={() => { setOpenUpdateDialog(true); handleMenuClose(); }}>
                    <ListItemIcon><Edit /></ListItemIcon>
                    <ListItemText primary="Update Course Week" />
                </MenuItem>
                <MenuItem onClick={() => { setOpenDeleteDialog(true); handleMenuClose(); }}>
                    <ListItemIcon><Delete /></ListItemIcon>
                    <ListItemText primary="Delete Course Week" />
                </MenuItem>
            </Menu>

            <Dialog
                open={openUpdateDialog}
                onClose={() => setOpenUpdateDialog(false)}
                fullScreen={isMobile}
            >
                <DialogTitle>Update Course Week</DialogTitle>
                <DialogContent>
                    <CourseWeekUpdate courseWeek={courseWeek} onClose={() => setOpenUpdateDialog(false)} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenUpdateDialog(false)}>Cancel</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                fullScreen={isMobile}
            >
                <DialogTitle>Delete Course Week</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this course week?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
                    <Button color="error" onClick={handleDelete}>Delete</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openAnnouncementDialog}
                onClose={() => setOpenAnnouncementDialog(false)}
                fullScreen={isMobile}
            >
                <DialogTitle>Create Announcement</DialogTitle>
                <DialogContent>
                    <WeekAnnouncementForm courseId={courseWeek.course} courseWeekId={courseWeek.id} />
                </DialogContent>
            </Dialog>

            <Drawer
                anchor="right"
                open={openSidebar}
                onClose={() => setOpenSidebar(false)}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: { xs: '80%', sm: 280 },
                        padding: 2,
                        borderTopLeftRadius: '16px',
                        borderBottomLeftRadius: '16px',
                        boxShadow: theme.shadows[4],
                        backgroundColor: theme.palette.background.default,
                    },
                }}
            >
                <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    sx={{
                        mb: 6,
                        pl: 1,
                        letterSpacing: 0.5,
                        textTransform: 'uppercase',
                        color: theme.palette.text.primary,
                        fontSize: '0.85rem',
                    }}
                >
                    Announcements
                </Typography>
                <List>
                    <ListItem
                        button
                        onClick={() => {
                            setOpenAnnouncementDialog(true);
                            setOpenSidebar(false);
                        }}
                        sx={{
                            borderRadius: 2,
                            px: 2,
                            '&:hover': {
                                backgroundColor: theme.palette.action.hover,
                                boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.08)',
                            },
                        }}
                    >
                        <ListItemIcon>
                            <Add sx={{ color: theme.palette.text.primary }} />
                        </ListItemIcon>
                        <ListItemText primary="Create Announcement" />
                    </ListItem>

                    <ListItem
                        button
                        onClick={() => {
                            navigate(`/course/${courseWeek.course}/weeks/${courseWeek.id}/announcements`);
                            setOpenSidebar(false);
                        }}
                        sx={{
                            borderRadius: 2,
                            px: 2,
                            mt: 1,
                            '&:hover': {
                                backgroundColor: theme.palette.action.hover,
                                boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.08)',
                            },
                        }}
                    >
                        <ListItemIcon>
                            <Visibility sx={{ color: theme.palette.text.primary }} />
                        </ListItemIcon>
                        <ListItemText primary="View Announcements" />
                    </ListItem>
                </List>
            </Drawer>

        </StyledContainer>
    );
};

export default CourseWeekDetail;
