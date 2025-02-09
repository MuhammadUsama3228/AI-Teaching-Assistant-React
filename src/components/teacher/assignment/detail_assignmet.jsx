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
import { ExpandMore, MoreVert } from '@mui/icons-material';
import api from '../../../api';
import UpdateAssignmentForm from './update_assignment'; // Ensure correct import path

const StyledContainer = styled(Container)(({ theme }) => ({
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(6),
    backgroundColor: '#fff',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    borderRadius: '12px',
    padding: theme.spacing(2),
}));

const AssignmentAvatar = styled(Avatar)(({ theme }) => ({
    width: theme.spacing(14),
    height: theme.spacing(14),
    color: theme.palette.common.white,
    fontSize: '3rem',
    marginBottom: theme.spacing(2),
}));

const AssignmentDetailPage = () => {
    const { assignmentId } = useParams();
    const [assignment, setAssignment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAssignment = async () => {
            try {
                const response = await api.get(`/api/courses/assignment/${assignmentId}/`);
                setAssignment(response.data);
            } catch (error) {
                console.error('Error fetching assignment:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAssignment();
    }, [assignmentId]);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDeleteClick = () => {
        handleMenuClose();
        setOpenDialog(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await api.delete(`/api/courses/assignment/${assignmentId}/`);
            navigate('/');
        } catch (error) {
            console.error('Error deleting assignment:', error);
        } finally {
            setOpenDialog(false);
        }
    };

    const handleUpdateClick = () => {
        handleMenuClose();
        setOpenUpdateDialog(true); // Open the update dialog instead of navigating
    };

    const handleSubmissionStatusClick = () => {
        handleMenuClose();
        navigate(`/courses/assignment/${assignmentId}/submissions`); 
    };

    const handleUpdateDialogClose = () => {
        setOpenUpdateDialog(false); // Close the update dialog
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

    if (!assignment) {
        return (
            <Typography variant="h6" color="textSecondary" textAlign="center">
                Assignment not found.
            </Typography>
        );
    }

    return (
        <StyledContainer maxWidth="md">
            <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} sm={4} md={3} textAlign={{ xs: 'center', sm: 'left' }}>
                    <AssignmentAvatar>{assignment.title.charAt(0).toUpperCase()}</AssignmentAvatar>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                    <Typography variant="h4" sx={{ fontWeight: '700', marginBottom: 1 }}>
                        {assignment.title}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        <strong>Marks:</strong> {assignment.marks}
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
                    <Typography variant="h6">Assignment Details</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box>
                        <Typography variant="body1" paragraph>
                            <strong>Description:</strong> {assignment.description || 'No description available.'}
                        </Typography>
                        <Grid container spacing={2} sx={{ marginTop: 2 }}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2">
                                    <strong>Due Date:</strong> {new Date(assignment.due_date).toLocaleString()}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2">
                                    <strong>Allowed File Types:</strong> {assignment.allowed_file_types}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2">
                                    <strong>Attempts:</strong> {assignment.attempts}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2">
                                    <strong>Max File Size:</strong> {(assignment.max_file_size / (1024 * 1024)).toFixed(2)} MB
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
                <MenuItem onClick={handleUpdateClick}>Update Assignment</MenuItem>
                <MenuItem onClick={handleSubmissionStatusClick}>View Submission Status</MenuItem> {/* New Menu Item */}
                <MenuItem onClick={handleDeleteClick}>Delete Assignment</MenuItem>
            </Menu>

            <Dialog open={openUpdateDialog} onClose={handleUpdateDialogClose} fullWidth maxWidth="md">
                <DialogTitle>Update Assignment</DialogTitle>
                <DialogContent>
                    <UpdateAssignmentForm assignment={assignment} onClose={handleUpdateDialogClose} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleUpdateDialogClose} color="secondary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Delete Assignment</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this assignment?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </StyledContainer>
    );
};

export default AssignmentDetailPage;
