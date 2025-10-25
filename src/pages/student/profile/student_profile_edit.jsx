import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Box,
    CircularProgress,
    Tabs,
    Tab,
    TextField,
    Button,
    Grid,
    Divider,
    Card,
    CardContent,
    Avatar,
    Paper
} from '@mui/material';
import api from '../../../api';
import { FormControlLabel, Switch } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Person, Email, School } from '@mui/icons-material';
const textFieldStyles = {
    size: 'small',
    fullWidth: true,
    sx: {
        '& label.Mui-focused': {
            color: '#6A1B9A',
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: '#4B2E83',
            },
            '&:hover fieldset': {
                borderColor: '#6A1B9A',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#6A1B9A',
                borderWidth: 2,
            },
        },
    },
};

const StudentProfileEdit = () => {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [studentDetails, setStudentDetails] = useState(null);
    const [tabIndex, setTabIndex] = useState(0);
    const [previewImage, setPreviewImage] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, studentRes] = await Promise.all([
                    api.get('/api/manage_profile/'),
                    api.get('/api/student-profiles/')
                ]);
                setProfile(profileRes.data);
                setStudentDetails(studentRes.data);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleTabChange = (_, newValue) => setTabIndex(newValue);

    const handleProfilePictureUpload = async () => {
        try {
            if (!(profile.profile_picture instanceof File)) return;

            const formData = new FormData();
            formData.append('profile_picture', profile.profile_picture);

            await api.patch('/api/profile_picture/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            alert('Profile picture updated!');
        } catch (error) {
            console.error('Failed to update picture:', error);
            alert('Profile picture update failed!');
        }
    };

    const handleStudentDetailsSave = async () => {
        try {
            await api.patch(`/api/student-profiles/${studentDetails.id}/`, studentDetails);
            alert('Student Details updated!');
            navigate('/studentprofile');
        } catch (error) {
            console.error('Failed to update student details:', error);
            alert('Update failed!');
        }
    };


    if (loading) {
        return (
            <Container sx={{ textAlign: 'center', mt: 10 }}>
                <CircularProgress />
            </Container>
        );
    }

    const apiURL = import.meta.env.VITE_API_URL || '';
    const avatarSrc = previewImage
        ? previewImage
        : profile?.profile_picture
            ? `${apiURL}${profile.profile_picture}`
            : '';

    return (
        <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            {/* Header */}
            <Box
                sx={{
                    background: 'linear-gradient(90deg, #4B2E83 0%, #6A1B9A 100%)',
                    py: 4,
                    color: '#fff',
                    textAlign: 'center',
                    borderBottomLeftRadius: 30,
                    borderBottomRightRadius: 30,
                    boxShadow: 3,
                    mb: 4
                }}
            >
                <Typography variant="h4" fontWeight="bold">
                    Student Profile Management
                </Typography>
                <Typography variant="subtitle1">
                    Manage your personal and academic information
                </Typography>
            </Box>

            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {/* Sidebar */}
                    <Grid item xs={12} md={4}>
                        <Paper elevation={4} sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
                            <Avatar
                                src={avatarSrc}
                                alt={profile.username}
                                sx={{
                                    width: 120,
                                    height: 120,
                                    mx: 'auto',
                                    mb: 2,
                                    border: '3px solid #6A1B9A'
                                }}
                            />
                            <Typography variant="h6" fontWeight="bold">
                                <Person sx={{ fontSize: 20, mr: 0.5 }} />
                                {profile.first_name} {profile.last_name}
                            </Typography>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="body2" color="textSecondary">
                                <Email sx={{ fontSize: 16, mr: 0.5 }} />
                                {profile.email}
                            </Typography>

                            <Typography variant="body2" color="textSecondary">
                                <School sx={{ fontSize: 16, mr: 0.5 }} />
                                {profile.role}
                            </Typography>

                            <Typography variant="body2" color="textSecondary">
                                <School sx={{ fontSize: 16, mr: 0.5 }} />
                                {studentDetails.institution_name}
                            </Typography>

                        </Paper>
                    </Grid>

                    {/* Main Form */}
                    <Grid item xs={12} md={8}>
                        <Card elevation={4} sx={{ borderRadius: 3 }}>
                            <CardContent>

                                <Tabs
                                    value={tabIndex}
                                    onChange={handleTabChange}
                                    variant="fullWidth"
                                    TabIndicatorProps={{
                                        style: {
                                            backgroundColor: '#6A1B9A',
                                        },
                                    }}
                                    sx={{
                                        '& .MuiTab-root': {
                                            color: '#4B2E83',
                                            fontWeight: 'bold',
                                        },
                                        '& .Mui-selected': {
                                            color: '#6A1B9A !important',
                                        },
                                    }}
                                >
                                    <Tab label="Profile Picture" />
                                    <Tab label="Student Details" />
                                </Tabs>


                                {tabIndex === 0 && (
                                    <Box mt={3}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="First Name"
                                                    value={profile.first_name}
                                                    InputProps={{ readOnly: true }}
                                                    {...textFieldStyles}

                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Last Name"
                                                    value={profile.last_name}
                                                    InputProps={{ readOnly: true }}
                                                    {...textFieldStyles}


                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Username"
                                                    value={profile.username}
                                                    InputProps={{ readOnly: true }}
                                                    {...textFieldStyles}

                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Email"
                                                    value={profile.email}
                                                    InputProps={{ readOnly: true }}
                                                    {...textFieldStyles}

                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Button
                                                    variant="outlined"
                                                    component="label"
                                                    fullWidth
                                                    sx={{
                                                        mt: 1,
                                                        fontWeight: 'bold',
                                                        borderColor: '#6A1B9A',
                                                        color: '#6A1B9A',
                                                        '&:hover': {
                                                            borderColor: '#4B2E83',
                                                            backgroundColor: '#f3e5f5'
                                                        }
                                                    }}
                                                >
                                                    Upload Profile Picture
                                                    <input
                                                        type="file"
                                                        hidden
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            const file = e.target.files[0];
                                                            setProfile({
                                                                ...profile,
                                                                profile_picture: file
                                                            });
                                                            setPreviewImage(URL.createObjectURL(file));
                                                        }}
                                                    />
                                                </Button>
                                            </Grid>
                                        </Grid>

                                        <Button
                                            variant="contained"
                                            sx={{
                                                mt: 3,
                                                background: 'linear-gradient(90deg, #4B2E83 0%, #6A1B9A 100%)',
                                                color: '#fff',
                                                fontWeight: 'bold',
                                                '&:hover': {
                                                    background: 'linear-gradient(90deg, #4527a0 0%, #8e24aa 100%)'
                                                }
                                            }}
                                            onClick={handleProfilePictureUpload}
                                        >
                                            Save Profile Picture
                                        </Button>
                                    </Box>
                                )}

                                {tabIndex === 1 && (
                                    <Box mt={3}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Institution Name"
                                                    value={studentDetails.institution_name}
                                                    onChange={(e) =>
                                                        setStudentDetails({
                                                            ...studentDetails,
                                                            institution_name: e.target.value
                                                        })
                                                    }
                                                    {...textFieldStyles}

                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Institution Type"
                                                    value={studentDetails.institution_type}
                                                    onChange={(e) =>
                                                        setStudentDetails({
                                                            ...studentDetails,
                                                            institution_type: e.target.value
                                                        })


                                                    }
                                                    {...textFieldStyles}

                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Level"
                                                    value={studentDetails.level}
                                                    onChange={(e) =>
                                                        setStudentDetails({
                                                            ...studentDetails,
                                                            level: e.target.value
                                                        })
                                                    }
                                                    {...textFieldStyles}

                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Degree"
                                                    value={studentDetails.degree}
                                                    onChange={(e) =>
                                                        setStudentDetails({
                                                            ...studentDetails,
                                                            degree: e.target.value
                                                        })
                                                    }
                                                    {...textFieldStyles}

                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    type="number"
                                                    label="Year of Study"
                                                    value={studentDetails.year_of_study}
                                                    onChange={(e) =>
                                                        setStudentDetails({
                                                            ...studentDetails,
                                                            year_of_study: parseInt(e.target.value, 10)
                                                        })
                                                    }
                                                    {...textFieldStyles}

                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Date of Birth"
                                                    type="date"
                                                    InputLabelProps={{ shrink: true }}
                                                    value={studentDetails.date_of_birth}
                                                    onChange={(e) =>
                                                        setStudentDetails({
                                                            ...studentDetails,
                                                            date_of_birth: e.target.value
                                                        })
                                                    }
                                                    {...textFieldStyles}

                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Gender"
                                                    value={studentDetails.gender}
                                                    onChange={(e) =>
                                                        setStudentDetails({
                                                            ...studentDetails,
                                                            gender: e.target.value
                                                        })
                                                    }
                                                    {...textFieldStyles}

                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Phone Number"
                                                    value={studentDetails.phone_number}
                                                    onChange={(e) =>
                                                        setStudentDetails({
                                                            ...studentDetails,
                                                            phone_number: e.target.value
                                                        })
                                                    }
                                                    {...textFieldStyles}

                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            checked={studentDetails.phone_hide}
                                                            onChange={(e) =>
                                                                setStudentDetails({ ...studentDetails, phone_hide: e.target.checked })
                                                            }
                                                            sx={{
                                                                '& .MuiSwitch-switchBase.Mui-checked': {
                                                                    color: '#6A1B9A',
                                                                },
                                                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                                    backgroundColor: '#6A1B9A',
                                                                },
                                                            }}
                                                        />
                                                    }
                                                    label="Hide Phone Number"
                                                />

                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            checked={studentDetails.address_hide}
                                                            onChange={(e) =>
                                                                setStudentDetails({ ...studentDetails, address_hide: e.target.checked })
                                                            }
                                                            sx={{
                                                                '& .MuiSwitch-switchBase.Mui-checked': {
                                                                    color: '#6A1B9A',
                                                                },
                                                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                                    backgroundColor: '#6A1B9A',
                                                                },
                                                            }}
                                                        />
                                                    }
                                                    label="Hide Address"
                                                />  </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="City"
                                                    value={studentDetails.city}
                                                    onChange={(e) =>
                                                        setStudentDetails({
                                                            ...studentDetails,
                                                            city: e.target.value
                                                        })
                                                    }
                                                    {...textFieldStyles}

                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Country"
                                                    value={studentDetails.country}
                                                    onChange={(e) =>
                                                        setStudentDetails({
                                                            ...studentDetails,
                                                            country: e.target.value
                                                        })
                                                    }
                                                    {...textFieldStyles}

                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Postal Code"
                                                    value={studentDetails.postal_code}
                                                    onChange={(e) =>
                                                        setStudentDetails({
                                                            ...studentDetails,
                                                            postal_code: e.target.value
                                                        })
                                                    }
                                                    {...textFieldStyles}

                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Bio"
                                                    multiline
                                                    minRows={3}
                                                    value={studentDetails.bio}
                                                    onChange={(e) =>
                                                        setStudentDetails({
                                                            ...studentDetails,
                                                            bio: e.target.value
                                                        })
                                                    }
                                                    {...textFieldStyles}

                                                />
                                            </Grid>
                                        </Grid>
                                        <Button
                                            variant="contained"
                                            sx={{
                                                mt: 3,
                                                background: 'linear-gradient(90deg, #4B2E83 0%, #6A1B9A 100%)',
                                                color: '#fff',
                                                fontWeight: 'bold',
                                                '&:hover': {
                                                    background: 'linear-gradient(90deg, #4527a0 0%, #8e24aa 100%)'
                                                }
                                            }}
                                            onClick={handleStudentDetailsSave}
                                        >
                                            Save Student Details
                                        </Button>
                                    </Box>
                                )}

                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default StudentProfileEdit;
