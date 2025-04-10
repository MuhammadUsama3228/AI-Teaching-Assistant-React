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
import CreateIcon from '@mui/icons-material/Create'; 
import { useNavigate } from 'react-router-dom'; 
import theme from '../../../components/Theme'; 
import api from '../../../api'; 
import { setUser } from '../manage-profile/manage-profile';  

const StudentProfilePage = () => {     
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
                            onClick={() => navigate('/manage-profile')}                         
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
                                    onClick={() => navigate('/studentprofilecreate')}                                 
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
                                        <Box display="flex" flexDirection="column" gap={1}>                                             {loading ? (                                                 <>                                                     <Skeleton variant="text" width="60%" />                                                     <Skeleton variant="text" width="80%" />                                                     <Skeleton variant="text" width="70%" />                                                 </>                                             ) : (                                                 <>                                                     <Typography><strong>Email:</strong> {user?.email}</Typography>                                                     <Typography><strong>Phone:</strong> {user?.profile?.phone_hide ? 'Hidden' : user?.profile?.phone_number}</Typography>                                                 </>                                             )}                                         </Box>                                     
                                    </Paper>                                 
                                </Grid>                                  


                                {/* Personal Details Section */}                                 
                                <Grid item xs={12} md={6}>                                     
                                    <Paper sx={{ p: 3, borderRadius: 3 }}>                                         
                                        <Typography variant="h6" fontWeight="bold" gutterBottom>                                             
                                            Personal Details                                          
                                        </Typography>                                         
                                        <Box display="flex" flexDirection="column" gap={1}>                                             {loading ? (                                                 <>                                                     <Skeleton variant="text" width="60%" />                                                     <Skeleton variant="text" width="80%" />                                                     <Skeleton variant="text" width="70%" />                                                     <Skeleton variant="text" width="50%" />                                                 </>                                             ) : (                                                 <>                                                     <Typography><strong>Date of Birth:</strong> {user?.profile?.date_of_birth}</Typography>                                                     <Typography><strong>Country:</strong> {user?.profile?.country}</Typography>                                                     <Typography><strong>Gender:</strong> {user?.profile?.gender}</Typography>                                                     <Typography><strong>Address:</strong> {user?.profile?.address_hide ? 'Hidden' : user?.profile?.address}</Typography>                                                     <Typography><strong>City:</strong> {user?.profile?.city}</Typography>                                                     <Typography><strong>Postal Code:</strong> {user?.profile?.postal_code}</Typography>                                                     <Typography><strong>Bio:</strong> {user?.profile?.bio}</Typography>                                                 </>                                             )}                                         </Box>                                     
                                    </Paper>                                 
                                </Grid>                                  


                                {/* Educational Details Section */}                                 
                                <Grid item xs={12}>                                     
                                    <Paper sx={{ p: 3, borderRadius: 3 }}>                                         
                                        <Typography variant="h6" fontWeight="bold" gutterBottom>                                             
                                            Educational Details                                          
                                        </Typography>                                         
                                        <Box display="flex" flexDirection="column" gap={1}>                                             {loading ? (                                                 <>                                                     <Skeleton variant="text" width="60%" />                                                     <Skeleton variant="text" width="80%" />                                                     <Skeleton variant="text" width="70%" />                                                     <Skeleton variant="text" width="50%" />                                                 </>                                             ) : (                                                 <>                                                     <Typography><strong>Institution Name:</strong> {user?.profile?.institution_name}</Typography>                                                     <Typography><strong>Institution Type:</strong> {user?.profile?.institution_type}</Typography>                                                     <Typography><strong>Level:</strong> {user?.profile?.level}</Typography>                                                     <Typography><strong>Degree:</strong> {user?.profile?.degree}</Typography>                                                     <Typography><strong>Year of Study:</strong> {user?.profile?.year_of_study}</Typography>                                                 </>                                             )}                                         </Box>                                     
                                    </Paper>                                 
                                </Grid>                                 
                            </Grid>                         
                        </Container>                     
                    )}                      

                </>             
            )}         
        </ThemeProvider>     
    ); 
};  

export default StudentProfilePage;
