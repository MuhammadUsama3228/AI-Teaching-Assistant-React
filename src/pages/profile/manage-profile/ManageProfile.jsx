import {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
    Container,
    Box,
    Typography,
    Button,
    Paper,
    Divider,
    IconButton,
    Snackbar,
    Alert,
    ThemeProvider
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import theme from '../../../components/Theme';
import api from '../../../api';
import {setUser} from './manage-profile.js';

import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';


const ManageProfile = () => {
    const [value, setValue] = React.useState('one');

    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    };

    const dispatch = useDispatch();
    const userData = useSelector((state) => state.user);
    const user = userData?.user;

    const [isEditing, setIsEditing] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [message, setMessage] = useState({open: false, type: 'success', text: ''});
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        id: "",
        username: "",
        email: "",
        role: "",
        profile_picture: null,
        first_name: "",
        last_name: "",
        get_full_name: null,
        get_regressed_email: "",
        profile: null,
    });

    useEffect(() => {
        if (user) {
            setFormData({
                id: user.id,
                username: user.username || '',
                email: user.email || user.get_regressed_email || '',
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                profile_picture: null,
            });

            if (user.profile_picture) {
                setImagePreview(user.profile_picture);
            }
        }
    }, [user]);

    const fetchProfileData = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/manage_profile/');

            if (response.status === 200) {
                dispatch(setUser(response.data));
                showMessage('success', 'Profile data loaded successfully');
            }
        } catch (error) {
            console.error('Error fetching profile data:', error);
            showMessage('error', 'Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) {
            fetchProfileData();
        }
    }, []);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };


    const handleCancelClick = () => {
        setIsEditing(false);

        if (user) {
            setFormData({
                username: user.username || '',
                email: user.get_regressed_email || user.email || '',
                role: user.role || '',
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                phone_number: user.phone_number || '',
                address: user.address || '',
            });

            if (user.profile_picture) {
                setImagePreview(user.profile_picture);
            } else {
                setImagePreview(null);
            }
        }
        setProfileImage(null);
    };

    const showMessage = (type, text) => {
        setMessage({open: true, type, text});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const submitData = new FormData();

            Object.keys(formData).forEach(key => {
                if (formData[key]) {
                    submitData.append(key, formData[key]);
                }
            });

            if (profileImage) {
                submitData.append('profile_picture', profileImage);
            }

            const response = await api.put('/api/manage_profile/', submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                dispatch(setUser(response.data));
                setIsEditing(false);
                showMessage('success', 'Profile updated successfully');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            showMessage('error', 'Failed to update profile: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    // Close the snackbar message
    const handleCloseMessage = () => {
        setMessage({...message, open: false});
    };

    if (!user) {
        return (
            <ThemeProvider theme={theme}>
                <Container>
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                        <Typography variant="h6">
                            {loading ? 'Loading profile data...' : 'No user profile found. Please log in.'}
                        </Typography>
                    </Box>
                </Container>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="lg" sx={{
                py: {xs: 2, md: 3},
            }}>
                <Paper sx={{p: {xs: 2, sm: 3}, borderRadius: 2}}>
                    <Box
                        display="flex"
                        flexDirection={{xs: 'column', sm: 'row'}}
                        justifyContent="space-between"
                        alignItems={{xs: 'flex-start', sm: 'center'}}
                        mb={3}
                        gap={2}
                    >
                        <Typography variant="h4" color="primary" sx={{fontSize: {xs: '1.5rem', md: '2.125rem'}}}>
                            {isEditing ? 'Edit Profile' : user.get_full_name || user.username}
                        </Typography>
                        <Box sx={{width: {xs: '100%', sm: 'auto'}}}>
                            {!isEditing ? (
                                <Button
                                    variant="contained"
                                    startIcon={<EditIcon/>}
                                    onClick={handleEditClick}
                                    fullWidth={true}
                                    sx={{width: {xs: '100%', sm: 'auto'}}}
                                >
                                    Edit Profile
                                </Button>
                            ) : (
                                <Box
                                    display="flex"
                                    justifyContent={{xs: 'space-between', sm: 'flex-end'}}
                                    width="100%"
                                >
                                    <IconButton
                                        color="secondary"
                                        onClick={handleCancelClick}
                                        sx={{mr: 1}}
                                    >
                                        <CancelIcon/>
                                    </IconButton>
                                    <Button
                                        variant="contained"
                                        startIcon={<SaveIcon/>}
                                        onClick={handleSubmit}
                                        disabled={loading}
                                    >
                                        Save
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </Box>

                    <Divider sx={{mb: 3}}/>

                    <Box sx={{width: '100%'}}>
                        <Tabs
                            value={value}
                            onChange={handleTabChange}
                            aria-label="tabs" centered
                        >
                            <Tab
                                value="one"
                                label="Info"
                                wrapped
                            />

                            <Tab value="two" label={
                                user.role === "admin"
                                    ? "Admin Details"
                                    : user.role === "teacher" ? "Teacher Details" : "Student"
                            }/>
                            {user.role != "admin" && (<Tab value="three" label="Experiences"/>)}

                        </Tabs>
                    </Box>

                    {/*<Grid container spacing={{xs: 2, md: 4}}>*/}
                    {/*    /!* Profile Image Section *!/*/}
                    {/*    <Grid item xs={12} md={4} sx={{mb: {xs: 3, md: 0}}}>*/}
                    {/*        <Box display="flex" flexDirection="column" alignItems="center">*/}
                    {/*            <Avatar*/}
                    {/*                src={imagePreview || (user.profile_picture || '')}*/}
                    {/*                alt={formData.username}*/}
                    {/*                sx={{*/}
                    {/*                    width: {xs: 150, sm: 180, md: 200},*/}
                    {/*                    height: {xs: 150, sm: 180, md: 200},*/}
                    {/*                    mb: 2*/}
                    {/*                }}*/}
                    {/*            />*/}

                    {/*            {isEditing && (*/}
                    {/*                <Button*/}
                    {/*                    variant="outlined"*/}
                    {/*                    component="label"*/}
                    {/*                    startIcon={<PhotoCameraIcon/>}*/}
                    {/*                    sx={{width: {xs: '100%', sm: 'auto'}}}*/}
                    {/*                >*/}
                    {/*                    Change Photo*/}
                    {/*                    <input*/}
                    {/*                        type="file"*/}
                    {/*                        hidden*/}
                    {/*                        accept="image/*"*/}
                    {/*                        onChange={handleImageChange}*/}
                    {/*                    />*/}
                    {/*                </Button>*/}
                    {/*            )}*/}

                    {/*            <Typography*/}
                    {/*                variant="h6"*/}
                    {/*                textAlign="center"*/}
                    {/*                mt={2}*/}
                    {/*                sx={{fontSize: {xs: '1rem', sm: '1.25rem'}}}*/}
                    {/*            >*/}
                    {/*                {formData.first_name || formData.username}*/}
                    {/*                {formData.last_name && ` ${formData.last_name}`}*/}
                    {/*            </Typography>*/}

                    {/*            <Typography*/}
                    {/*                variant="body2"*/}
                    {/*                color="textSecondary"*/}
                    {/*                textAlign="center"*/}
                    {/*            >*/}
                    {/*                {formData.role}*/}
                    {/*            </Typography>*/}
                    {/*        </Box>*/}
                    {/*    </Grid>*/}

                    {/*    /!* Profile Details Section *!/*/}
                    {/*    <Grid item xs={12} md={8}>*/}
                    {/*        <form onSubmit={handleSubmit}>*/}
                    {/*            <Grid container spacing={{xs: 1, sm: 2}}>*/}

                    {/*                <Grid item xs={12} sm={6}>*/}
                    {/*                    <TextField*/}
                    {/*                        fullWidth*/}
                    {/*                        label="Username"*/}
                    {/*                        name="username"*/}
                    {/*                        value={formData.username}*/}
                    {/*                        onChange={handleChange}*/}
                    {/*                        disabled={true}*/}
                    {/*                        required*/}
                    {/*                        size="small"*/}
                    {/*                        margin="normal"*/}
                    {/*                        sx={{mt: {xs: 1, sm: 2}}}*/}
                    {/*                    />*/}
                    {/*                </Grid>*/}

                    {/*                <Grid item xs={12} sm={6}>*/}
                    {/*                    <TextField*/}
                    {/*                        fullWidth*/}
                    {/*                        label="Email"*/}
                    {/*                        name="email"*/}
                    {/*                        value={formData.email}*/}
                    {/*                        onChange={handleChange}*/}
                    {/*                        disabled={true}*/}
                    {/*                        required*/}
                    {/*                        size="small"*/}
                    {/*                        margin="normal"*/}
                    {/*                        sx={{mt: {xs: 1, sm: 2}}}*/}
                    {/*                    />*/}
                    {/*                </Grid>*/}

                    {/*                <Grid item xs={12} sm={6}>*/}
                    {/*                    <TextField*/}
                    {/*                        fullWidth*/}
                    {/*                        label="First Name"*/}
                    {/*                        name="first_name"*/}
                    {/*                        value={formData.first_name}*/}
                    {/*                        onChange={handleChange}*/}
                    {/*                        disabled={!isEditing || loading}*/}
                    {/*                        size="small"*/}
                    {/*                        margin="normal"*/}
                    {/*                    />*/}
                    {/*                </Grid>*/}

                    {/*                <Grid item xs={12} sm={6}>*/}
                    {/*                    <TextField*/}
                    {/*                        fullWidth*/}
                    {/*                        label="Last Name"*/}
                    {/*                        name="last_name"*/}
                    {/*                        value={formData.last_name}*/}
                    {/*                        onChange={handleChange}*/}
                    {/*                        disabled={!isEditing || loading}*/}
                    {/*                        size="small"*/}
                    {/*                        margin="normal"*/}
                    {/*                    />*/}
                    {/*                </Grid>*/}
                    {/*            </Grid>*/}
                    {/*        </form>*/}
                    {/*    </Grid>*/}
                    {/*</Grid>*/}
                </Paper>

                {/* Messages */}
                <Snackbar
                    open={message.open}
                    autoHideDuration={6000}
                    onClose={handleCloseMessage}
                    anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                    sx={{bottom: {xs: 16, sm: 24}}}
                >
                    <Alert
                        onClose={handleCloseMessage}
                        severity={message.type}
                        sx={{width: '100%'}}
                        variant="filled"
                    >
                        {message.text}
                    </Alert>
                </Snackbar>
            </Container>
        </ThemeProvider>
    );
};

export default ManageProfile;