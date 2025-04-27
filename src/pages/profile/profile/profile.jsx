import { useState, useEffect } from 'react'; 
import { useSelector, useDispatch } from 'react-redux'; 
import {     
    Container,     
    Box,     
    Typography,     
    Paper,     
    Avatar,     
    ThemeProvider,     
    IconButton,     
    CircularProgress,     
    Button,     
    Dialog,     
    DialogTitle,     
    DialogContent,     
    DialogActions,     
    Tooltip,     
    List,     
    ListItem,     
    ListItemText,     
    ListItemSecondaryAction,     
    Grid,     
    Skeleton 
} from '@mui/material'; 
import EditIcon from '@mui/icons-material/Edit'; 
import DeleteIcon from '@mui/icons-material/Delete'; 
import AddIcon from '@mui/icons-material/Add'; 
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; 
import CreateIcon from '@mui/icons-material/Create'; // Import the CreateIcon
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
 const handleProfileNavigation = async () => {
        try {
            const response = await api.get('/api/manage_profile/');
            const role = response.data.role;
    
            if (role === 'teacher') {
                navigate('/teacherpanel');
            } else if (role === 'student') {
                
                navigate('/studentpanel');  // You probably meant this instead of navigating both to /teacherpanel
            } else {
                console.error('Unknown role:', role);
            }
        } catch (error) {
            console.error('Error during profile navigation:', error);
        }
    };
    const handleDeleteExperience = async () => {         
        if (!selectedExperience) return;         
        try {             
            await api.delete(`/api/teacher-experience/${selectedExperience.id}/`);             
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
            {loading ? (                 
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">                     
                    <CircularProgress />                 
                </Box>             
            ) : (                 
                <>                     
                    {/* Header Section */}                     
                    <Box                         
                        sx={{                             
                            background: 'linear-gradient(to right, #0f172a, #1e293b)',                             
                            color: 'white',                             
                            p: 4,                             
                            position: 'relative',                             
                            borderBottomLeftRadius: 40,                             
                            borderBottomRightRadius: 40,                         
                        }}                     
                    >                         
                        <Typography variant="h4" fontWeight="bold">                             
                            Hello {user?.get_full_name || user?.username}                         
                        </Typography>                         
                        <Typography variant="body1" mt={1}>                             
                            This is your profile page. You can see the progress you’ve made with your work and manage your projects or assignments.                         
                        </Typography>                         
                        <Button                             
                            variant="contained"                             
                            sx={{ mt: 2, backgroundColor: '#38bdf8' }}                             
                            onClick={() => navigate('/teacher_manage_profile')}                         
                        >                             
                            Edit Profile                         
                        </Button>                          

                        <Avatar                             
                            alt={user?.get_full_name || user?.username}                             
                            src={profileImage}                             
                            sx={{                                 
                                width: 120,                                 
                                height: 120,                                 
                                border: '4px solid white',                                 
                                position: 'absolute',                                 
                                bottom: -60,                                 
                                right: 40,                             
                            }}                         
                        >                             
                            {!profileImage && <AccountCircleIcon fontSize="large" />}                         
                        </Avatar>                     
                    </Box>                      

                    {/* Show "Create Profile" if not created */}                     
                    {!user?.profile && (                         
                        <Container maxWidth="sm" sx={{ mt: 10 }}>                             
                            <Paper                                 
                                sx={{                                     
                                    p: 4,                                     
                                    borderRadius: 4,                                     
                                    textAlign: 'center',                                     
                                    border: '2px dashed #94a3b8',                                     
                                    backgroundColor: '#f1f5f9',                                     
                                    boxShadow: 2                                 
                                }}                             
                            >                                 
                                <AccountCircleIcon sx={{ fontSize: 64, color: '#64748b' }} />                                 
                                <Typography variant="h6" mt={2} fontWeight="bold">                                     
                                    Profile Not Created                                 
                                </Typography>                                 
                                <Typography variant="body2" mt={1} color="text.secondary">                                     
                                    You haven't created your profile yet. Click the button below to get started.                                 
                                </Typography>                                 
                                <Button                                     
                                    variant="contained"                                     
                                    startIcon={<CreateIcon />} // Add the Create icon here                                     
                                    sx={{ mt: 3 }}                                     
                                    onClick={() => navigate('/teacher_profile')}                                 
                                >                                     
                                    Create Profile                                 
                                </Button>                             
                            </Paper>                         
                        </Container>                     
                    )}                      

                    {/* If profile exists, show details */}                     
                    {user?.profile && (                         
                        <Container maxWidth="md">                             
                            <Grid container spacing={4} mt={10}>                                 
                                {/* My Account */}                                 
                                <Grid item xs={12} md={6}>                                     
                                    <Paper sx={{ p: 3, borderRadius: 3 }}>                                         
                                        <Typography variant="h6" fontWeight="bold" gutterBottom>                                             
                                            My Account                                         
                                        </Typography>                                         
                                        <Box display="flex" flexDirection="column" gap={1}>                                             {loading ? (                                                 <>                                                     <Skeleton variant="text" width="60%" />                                                     <Skeleton variant="text" width="80%" />                                                     <Skeleton variant="text" width="70%" />                                                 </>                                             ) : (                                                 <>                                                     <Typography><strong>Email:</strong> {user?.email}</Typography>                                                     <Typography><strong>Phone:</strong> {user?.profile?.teacher?.phone_hide ? 'Hidden' : user?.profile?.phone_number}</Typography>                                                 </>                                             )}                                         </Box>                                     
                                    </Paper>                                 
                                </Grid>                                  

                                {/* Professional Info */}                                 
                                <Grid item xs={12} md={6}>                                     
                                    <Paper sx={{ p: 3, borderRadius: 3 }}>                                         
                                        <Typography variant="h6" fontWeight="bold" gutterBottom>                                             
                                            Professional Details                                         
                                        </Typography>                                         
                                        <Box display="flex" flexDirection="column" gap={1}>                                             {loading ? (                                                 <>                                                     <Skeleton variant="text" width="60%" />                                                     <Skeleton variant="text" width="80%" />                                                     <Skeleton variant="text" width="70%" />                                                     <Skeleton variant="text" width="50%" />                                                 </>                                             ) : (                                                 <>                                                     <Typography><strong>Institution:</strong> {user?.profile?.teacher?.institution_name}</Typography>                                                     <Typography><strong>Designation:</strong> {user?.profile?.teacher?.designation}</Typography>                                                     <Typography><strong>Department:</strong> {user?.profile?.teacher?.department}</Typography>                                                     <Typography><strong>Experience:</strong> {user?.profile?.teacher?.teaching_experience} years</Typography>                                                 </>                                             )}                                         </Box>                                     
                                    </Paper>                                 
                                </Grid>                                  

                                {/* Experience Section */}                                 
                                <Grid item xs={12}>                                     
                                    <Paper sx={{ p: 3, borderRadius: 3 }}>                                         
                                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>                                             <Typography variant="h6" fontWeight="bold">Experience</Typography>                                             <Tooltip title="Add Experience">                                                 <Button startIcon={<AddIcon />} variant="contained" onClick={() => navigate('/experience')}>                                                     Add                                                 </Button>                                             </Tooltip>                                         </Box>                                         
                                        <List>                                             {user?.profile?.experience?.length > 0 ? (                                                 user.profile.experience.map((exp) => (                                                     <ListItem key={exp.id} divider>                                                         <ListItemText                                                             primary={<Typography fontWeight="bold">{exp.institution_name}</Typography>}                                                             secondary={`${exp.designation} - ${exp.department}`}                                                         />                                                         <ListItemSecondaryAction>                                                             <Tooltip title="Delete Experience">                                                                 <IconButton                                                                     edge="end"                                                                     color="error"                                                                     onClick={() => {                                                                         setSelectedExperience(exp);                                                                         setDeleteDialogOpen(true);                                                                     }}                                                                 >                                                                     <DeleteIcon />                                                                 </IconButton>                                                             </Tooltip>                                                         </ListItemSecondaryAction>                                                     </ListItem>                                                 ))                                             ) : (                                                 <Typography color="text.secondary">No experience added yet.</Typography>                                             )}                                         </List>                                     
                                    </Paper>                                 
                                </Grid>                             </Grid>                         
                        </Container>                     
                    )}                      

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
                </>             
            )}         
        </ThemeProvider>     
    ); 
};  

export default Profile; 
