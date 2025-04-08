import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Container,
    Box,
    Typography,
    Paper,
    Avatar,
    ThemeProvider,
    Tooltip,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    IconButton,
    CircularProgress,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import TeacherExperienceForm from '../../../components/teacher/profile/teacher_experience';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import theme from '../../../components/Theme';
import api from '../../../api';
import { setUser } from '../manage-profile/manage-profile';

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.user);
    const user = userData?.user;

    const [loading, setLoading] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [experienceDialogOpen, setExperienceDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedExperience, setSelectedExperience] = useState(null);

    const fetchProfileData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/manage_profile/');
            if (response.status === 200) {
                dispatch(setUser(response.data));
                setProfileImage(response.data.profile_picture || null);
            }
        } catch (error) {
            console.error('Error fetching profile data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, []);

    const handleDeleteExperience = async () => {
        if (!selectedExperience) return;
        try {
            await api.delete(`/api/manage_profile/experience/${selectedExperience.id}/`);
            fetchProfileData();
        } catch (error) {
            console.error('Error deleting experience:', error);
        } finally {
            setDeleteDialogOpen(false);
            setSelectedExperience(null);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 4, background: 'linear-gradient(to right, #f8fafc, #e2e8f0)' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Typography variant="h4" fontWeight="bold" color="primary">
                            Profile
                        </Typography>
                        <Tooltip title="Edit Profile">
                            <IconButton color="primary" onClick={() => navigate('/manage-profile')}>
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    {loading ? (
                        <Box display="flex" justifyContent="center" py={3}>
                            <CircularProgress color="primary" />
                        </Box>
                    ) : (
                        <>
                            {/* Personal Information */}
                            <Accordion sx={{ borderRadius: 2, backgroundColor: '#fff' }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon color="primary" />}>
                                    <Typography variant="h6" fontWeight="medium">Personal Information</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box display="flex" flexDirection="column" gap={2}>
                                        <Box display="flex" alignItems="center" gap={3}>
                                            <Avatar 
                                                alt={user?.get_full_name || user?.username} 
                                                src={profileImage} 
                                                sx={{ width: 120, height: 120, border: '3px solid #019cb8' }}
                                            >
                                                {!profileImage && <AccountCircleIcon fontSize="large" />}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="h5" fontWeight="bold">{user?.get_full_name || user?.username}</Typography>
                                                <Typography variant="body1" color="textSecondary">{user?.email}</Typography>
                                                <Typography variant="body2">Institution: {user?.profile?.teacher?.institution_name}</Typography>
                                                <Typography variant="body2">Designation: {user?.profile?.teacher?.designation}</Typography>
                                                <Typography variant="body2">Department: {user?.profile?.teacher?.department}</Typography>
                                                <Typography variant="body2">Experience: {user?.profile?.teacher?.teaching_experience} years</Typography>
                                                <Typography variant="body2">Phone: {user?.profile?.teacher?.phone_hide ? 'Hidden' : user?.profile?.phone_number}</Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>

                            {/* Experience Section */}
                            <Accordion sx={{ borderRadius: 2, backgroundColor: '#fff', mt: 2 }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon color="primary" />}>
                                    <Typography variant="h6" fontWeight="medium">Experience</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <List>
                                        {user?.profile?.experience?.length > 0 ? (
                                            user.profile.experience.map((exp) => (
                                                <ListItem key={exp.id} sx={{ borderBottom: '1px solid #ddd' }}>
                                                    <ListItemText 
                                                        primary={<Typography variant="body1" fontWeight="bold">{exp.institution_name}</Typography>} 
                                                        secondary={`${exp.designation} - ${exp.department}`} 
                                                    />
                                                    <ListItemSecondaryAction>
                                                        <Tooltip title="Delete Experience">
                                                            <IconButton
                                                                edge="end"
                                                                color="error"
                                                                onClick={() => {
                                                                    setSelectedExperience(exp);
                                                                    setDeleteDialogOpen(true);
                                                                }}
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </ListItemSecondaryAction>
                                                </ListItem>
                                            ))
                                        ) : (
                                            <Typography variant="body2" color="textSecondary" textAlign="center">
                                                No experience added yet.
                                            </Typography>
                                        )}
                                    </List>
                                    <Box display="flex" justifyContent="center" mt={2}>
                                        <Tooltip title="Add Experience">
                                            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setExperienceDialogOpen(true)}>
                                                Add Experience
                                            </Button>
                                        </Tooltip>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </>
                    )}
                </Paper>
            </Container>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this experience?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleDeleteExperience} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    );
};

export default Profile;
