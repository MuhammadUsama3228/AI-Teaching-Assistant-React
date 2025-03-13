import {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {
    Container,
    Box,
    Typography,
    Paper,
    Divider,
    Avatar,
    ThemeProvider, Badge, Chip, Tooltip
} from '@mui/material';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import theme from '../../../components/Theme';
import api from '../../../api';
import {convertUTCToLocalTime} from '../../../utils/timeUtils.js';
import {setUser} from '../manage-profile/manage-profile.js';
import {fontSize} from "@mui/system";

const Profile = () => {
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.user);
    const user = userData?.user;

    const [loading, setLoading] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [lastLoginTime, setLastLoginTime] = useState(null);

    const fetchProfileData = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/manage_profile/');
            if (response.status === 200) {
                dispatch(setUser(response.data));
            }
        } catch (error) {
            console.error('Error fetching profile data', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProfileImage = async () => {
        try {
            if (!user?.profile_picture) return;

            const imageUrl = user.profile_picture;

            const response = await api.get(imageUrl, {
                responseType: 'blob'
            });

            if (response.status === 200) {
                const imageBlob = response.data;
                const imageObjectURL = URL.createObjectURL(imageBlob);
                setProfileImage(imageObjectURL);
            }
        } catch (error) {
            console.error('Error fetching profile image:', error);
        }
    };

    const last_loginTime = async () => {
        if (user.last_login) {
            const time = convertUTCToLocalTime(user.last_login);
            setLastLoginTime(time);
        }
    };

    useEffect(() => {
        if (user) {
            fetchProfileImage();
            last_loginTime();
        }
    }, [user]);

    useEffect(() => {
        if (!user) {
            fetchProfileData();
        }
    }, []);
    console.log(user.profile.experience);
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
            <Container maxWidth="lg" sx={{py: {xs: 2, md: 4}}}>
                <Paper sx={{p: {xs: 2, sm: 3}, borderRadius: 2, boxShadow: 3}}>
                    <Box
                        display="flex"
                        flexDirection={{xs: 'column', sm: 'row'}}
                        justifyContent={{xs: 'center', sm: 'left', md: 'left'}}
                        alignItems="center"
                        mb={3}
                        gap={{xs: 2, sm: 3}}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                width: {xs: '100%', sm: 'auto'}
                            }}
                        >
                            <Avatar
                                alt={user.get_full_name}
                                src={profileImage}
                                sx={{
                                    width: {xs: 100, sm: 150, md: 200},
                                    height: {xs: 100, sm: 150, md: 200},
                                    bgcolor: 'grey.600'
                                }}
                            >
                                {!profileImage && (
                                    <AccountCircleIcon
                                        sx={{
                                            fontSize: {xs: 60, sm: 80, md: 100},
                                            color: '#757575'
                                        }}
                                    />
                                )}
                            </Avatar>
                        </Box>
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems={{
                                xs: 'center',
                                sm: 'center',
                                md: 'flex-start',
                                lg: 'flex-start'
                            }}
                        >
                            <Typography
                                variant="h4"
                                color="primary"
                                sx={{
                                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                                    textAlign: { xs: 'center', sm: 'left' },
                                    wordBreak: 'break-word'
                                }}
                            >
                                {loading ? 'Profile' : user.get_full_name || user.username}

                                {(user.role === 'admin' || user.role === 'staff') && (
                                    <Tooltip title={`Role is ${user.role}`}>
                                        <Chip
                                            label={user.role.toUpperCase()}
                                            color="error"
                                            size="small"
                                            variant="outlined"
                                        />
                                    </Tooltip>
                                )}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="textSecondary"
                                sx={{
                                    fontSize: { xs: '0.8rem', sm: '1rem', md: '1.2rem' },
                                }}
                            >
                                {user.email}
                            </Typography>
                            <Typography
                                variant="body2"
                                color="textSecondary"
                                sx={{
                                    fontSize: { xs: '0.8rem', sm: '1rem', md: '1.2rem' },
                                }}
                            >

                                {
                                    user.role === 'teacher' && user.profile && user.profile.teacher && user.profile.teacher.phone_number && user.profile.teacher.phone_hide
                                        ? user.profile.teacher.phone_number
                                        : user.username
                                }

                            </Typography>
                        </Box>

                    </Box>


                    <Divider sx={{mb: 3}}/>

                    <Typography variant="caption" color="text">
                        {/*Last Login: {lastLoginTime}*/}

                        {user.role === "teacher" && user.profile && user.profile.teacher.about && (
                            <Typography
                                variant="body2"
                                color="textPrimary"
                                sx={{
                                    fontSize: { xs: '1rem', sm: '1.2rem' },
                                    fontWeight: '500',
                                    lineHeight: 1.5,
                                    marginTop: 1,
                                    textAlign: { xs: 'center', sm: 'left' },
                                    color: 'text.secondary',
                                }}
                            >
                                {user.profile.teacher.about}
                            </Typography>
                        )}
                    </Typography>

                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>Personal Information</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>

                            {/* Full Name */}
                            <Box>
                                <Typography variant="body2" color="textPrimary" fontWeight="bold">
                                    Full Name:
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {user.get_full_name || 'Not provided'}
                                </Typography>
                            </Box>

                            {/* Date of Birth */}
                            <Box>
                                <Typography variant="body2" color="textPrimary" fontWeight="bold">
                                    Date of Birth:
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {user.profile?.teacher?.date_of_birth || 'Not provided'}
                                </Typography>
                            </Box>

                            {/* Address */}
                            <Box>
                                <Typography variant="body2" color="textPrimary" fontWeight="bold">
                                    Address:
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    { user.profile?.teacher.address }
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="body2" color="textPrimary" fontWeight="bold">
                                    Institution:
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {user.profile?.teacher?.institution_name || 'Not provided'}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="body2" color="textPrimary" fontWeight="bold">
                                    Designation:
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {user.profile?.teacher?.designation || 'Not provided'}
                                </Typography>
                            </Box>

                            {/* Department */}
                            <Box>
                                <Typography variant="body2" color="textPrimary" fontWeight="bold">
                                    Department:
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {user.profile?.teacher?.department || 'Not provided'}
                                </Typography>
                            </Box>

                            {/* Teaching Experience */}
                            <Box>
                                <Typography variant="body2" color="textPrimary" fontWeight="bold">
                                    Teaching Experience (Years):
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {user.profile?.teacher?.teaching_experience || 'Not provided'}
                                </Typography>
                            </Box>

                            {/* Gender */}
                            <Box>
                                <Typography variant="body2" color="textPrimary" fontWeight="bold">
                                    Gender:
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {user.profile?.teacher?.gender || 'Not provided'}
                                </Typography>
                            </Box>

                            {/* City */}
                            <Box>
                                <Typography variant="body2" color="textPrimary" fontWeight="bold">
                                    City:
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {user.profile?.teacher?.city || 'Not provided'}
                                </Typography>
                            </Box>

                            {/* Country */}
                            <Box>
                                <Typography variant="body2" color="textPrimary" fontWeight="bold">
                                    Country:
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {user.profile?.teacher?.country || 'Not provided'}
                                </Typography>
                            </Box>

                            {/* Postal Code */}
                            <Box>
                                <Typography variant="body2" color="textPrimary" fontWeight="bold">
                                    Postal Code:
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {user.profile?.teacher?.postal_code || 'Not provided'}
                                </Typography>
                            </Box>

                        </Box>
                    </Box>


                    <Box mt={4}>
                        <Typography variant="h6" color="primary" sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' } }}>
                            Experiences
                        </Typography>
                        {user?.profile?.experience && user.profile.experience.length > 0 ? (
                            user.profile.experience.map((exp, index) => (
                                <Paper key={index} sx={{ p: 2, mb: 2, borderRadius: 2, boxShadow: 2 }}>
                                    <Typography variant="h6" color="textPrimary">
                                        {exp.teacher} at {exp.institution_name}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {exp.start_date} - {exp.end_date ? exp.end_date : 'Present'}
                                    </Typography>
                                    <Typography variant="body2" color="textPrimary" sx={{ mt: 1 }}>
                                        {exp.description}
                                    </Typography>
                                </Paper>
                            ))
                        ) : (
                            <Typography variant="body2" color="textSecondary">
                                No experiences listed.
                            </Typography>
                        )}
                    </Box>

                </Paper>
            </Container>
        </ThemeProvider>
    );
};

export default Profile;
