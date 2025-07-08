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
    MenuItem,
    Avatar,
    Paper
} from '@mui/material';
import api from '../../../api';

const TeacherProfileEdit = () => {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [teacherDetails, setTeacherDetails] = useState(null);
    const [experience, setExperience] = useState([]);
    const [newExperiences, setNewExperiences] = useState([]);
    const [tabIndex, setTabIndex] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, teacherRes, expRes] = await Promise.all([
                    api.get('/api/manage_profile/'),
                    api.get('/api/teacher-profiles/'),
                    api.get('/api/teacher-experience/'),
                ]);
                setProfile(profileRes.data);
                setTeacherDetails(teacherRes.data);
                setExperience(expRes.data);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleTabChange = (_, newValue) => setTabIndex(newValue);

    const handleProfileSave = async () => {
        try {
            const formData = new FormData();
            formData.append('first_name', profile.first_name);
            formData.append('last_name', profile.last_name);
            if (profile.profile_picture instanceof File) {
                formData.append('profile_picture', profile.profile_picture);
            }

            await api.patch('/api/manage_profile/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile.');
        }
    };

    const handleTeacherDetailsSave = async () => {
        try {
            await api.patch(`/api/teacher-profiles/${teacherDetails.id}/`, teacherDetails);
            alert('Teacher Details updated successfully!');
        } catch (error) {
            console.error('Error updating teacher details:', error);
            alert('Failed to update teacher details.');
        }
    };

    const handleExperienceSave = async () => {
        try {
            await Promise.all(experience.map((exp) =>
                api.patch(`/api/teacher-experience/${exp.id}/`, exp)
            ));
            await Promise.all(newExperiences.map((exp) =>
                api.post('/api/teacher-experience/', exp)
            ));
            alert('Experience updated successfully!');
            setNewExperiences([]);
        } catch (error) {
            console.error('Error updating experience:', error);
            alert('Failed to update experience.');
        }
    };

    const handleAddExperience = () => {
        setNewExperiences([...newExperiences, {
            institution_name: '',
            designation: '',
            department: '',
            start_date: '',
            end_date: '',
            description: '',
        }]);
    };

    if (loading) {
        return (
            <Container sx={{ textAlign: 'center', mt: 10 }}>
                <CircularProgress />
            </Container>
        );
    }

    const apiURL = import.meta.env.VITE_API_URL || '';


    return (
        <Box sx={{  backgroundColor: '#f5f5f5', minHeight: '100vh' }}>

            <Box
                sx={{
                    background: 'linear-gradient(90deg, #4B2E83 0%, #6A1B9A 100%)',

                    py: 4,
                    px: 2,
                    color: '#fff',
                    textAlign: 'center',
                    borderBottomLeftRadius: 30,
                    borderBottomRightRadius: 30,
                    boxShadow: 3,
                    mb: 4,
                }}
            >
                <Typography variant="h4" fontWeight="bold">
                    Teacher Profile Management
                </Typography>
                <Typography variant="subtitle1">
                    Update your personal, professional, and experience information
                </Typography>
            </Box>

            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                            <Avatar
                                src={profile.profile_picture ? `${apiURL}${profile.profile_picture}` : ''}
                                alt={profile.username}
                                sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                            />
                            <Typography variant="h6">
                                {profile.first_name} {profile.last_name}
                            </Typography>
                            <Typography variant="subtitle2" color="textSecondary">
                                {teacherDetails.designation || 'Teacher'}
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="body2">Email: {profile.email}</Typography>
                            <Typography variant="body2">Phone: {teacherDetails.phone_number}</Typography>
                            <Typography variant="body2">Institution: {teacherDetails.institution_name}</Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={8}>


                        <Card>
                            <CardContent>
                                <Tabs value={tabIndex} onChange={handleTabChange} variant="fullWidth">
                                    <Tab label="Profile Info" />
                                    <Tab label="Teacher Details" />
                                    <Tab label="Experience" />
                                </Tabs>

                                {tabIndex === 0 && (
                                    <Box mt={3}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="First Name"
                                                    value={profile.first_name}
                                                    onChange={(e) =>
                                                        setProfile({ ...profile, first_name: e.target.value })
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Last Name"
                                                    value={profile.last_name}
                                                    onChange={(e) =>
                                                        setProfile({ ...profile, last_name: e.target.value })
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Username"
                                                    value={profile.username}
                                                    InputProps={{ readOnly: true }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Email"
                                                    value={profile.email}
                                                    InputProps={{ readOnly: true }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Role"
                                                    value={profile.role}
                                                    InputProps={{ readOnly: true }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Button variant="outlined" component="label" fullWidth>
                                                    Upload Profile Picture
                                                    <input
                                                        type="file"
                                                        hidden
                                                        accept="image/*"
                                                        onChange={(e) =>
                                                            setProfile({
                                                                ...profile,
                                                                profile_picture: e.target.files[0],
                                                            })
                                                        }
                                                    />
                                                </Button>
                                            </Grid>
                                        </Grid>
                                        <Button variant="contained" sx={{ mt: 3 }} onClick={handleProfileSave}>
                                            Save Profile Info
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
                                                    value={teacherDetails.institution_name}
                                                    onChange={(e) =>
                                                        setTeacherDetails({ ...teacherDetails, institution_name: e.target.value })
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Institution Type"
                                                    value={teacherDetails.institution_type}
                                                    onChange={(e) =>
                                                        setTeacherDetails({ ...teacherDetails, institution_type: e.target.value })
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Designation"
                                                    value={teacherDetails.designation}
                                                    onChange={(e) =>
                                                        setTeacherDetails({ ...teacherDetails, designation: e.target.value })
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Department"
                                                    value={teacherDetails.department}
                                                    onChange={(e) =>
                                                        setTeacherDetails({ ...teacherDetails, department: e.target.value })
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Teaching Experience (Years)"
                                                    type="number"
                                                    value={teacherDetails.teaching_experience}
                                                    onChange={(e) =>
                                                        setTeacherDetails({ ...teacherDetails, teaching_experience: e.target.value })
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Date of Birth"
                                                    type="date"
                                                    value={teacherDetails.date_of_birth}
                                                    onChange={(e) =>
                                                        setTeacherDetails({ ...teacherDetails, date_of_birth: e.target.value })
                                                    }
                                                    InputLabelProps={{ shrink: true }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    select
                                                    fullWidth
                                                    label="Gender"
                                                    value={teacherDetails.gender}
                                                    onChange={(e) =>
                                                        setTeacherDetails({ ...teacherDetails, gender: e.target.value })
                                                    }
                                                >
                                                    <MenuItem value="male">Male</MenuItem>
                                                    <MenuItem value="female">Female</MenuItem>
                                                    <MenuItem value="other">Other</MenuItem>
                                                </TextField>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Phone Number"
                                                    value={teacherDetails.phone_number}
                                                    onChange={(e) =>
                                                        setTeacherDetails({ ...teacherDetails, phone_number: e.target.value })
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Address"
                                                    value={teacherDetails.address}
                                                    onChange={(e) =>
                                                        setTeacherDetails({ ...teacherDetails, address: e.target.value })
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="City"
                                                    value={teacherDetails.city}
                                                    onChange={(e) =>
                                                        setTeacherDetails({ ...teacherDetails, city: e.target.value })
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Country"
                                                    value={teacherDetails.country}
                                                    onChange={(e) =>
                                                        setTeacherDetails({ ...teacherDetails, country: e.target.value })
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Postal Code"
                                                    value={teacherDetails.postal_code}
                                                    onChange={(e) =>
                                                        setTeacherDetails({ ...teacherDetails, postal_code: e.target.value })
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="About"
                                                    multiline
                                                    rows={3}
                                                    value={teacherDetails.about}
                                                    onChange={(e) =>
                                                        setTeacherDetails({ ...teacherDetails, about: e.target.value })
                                                    }
                                                />
                                            </Grid>
                                        </Grid>
                                        <Button variant="contained" sx={{ mt: 3 }} onClick={handleTeacherDetailsSave}>
                                            Save Teacher Details
                                        </Button>
                                    </Box>
                                )}


                                {tabIndex === 2 && (
                                    <Box mt={3}>
                                        {[...experience, ...newExperiences].map((exp, index) => (
                                            <Box key={index} mb={3}>
                                                <Divider sx={{ my: 2 }} />
                                                <TextField
                                                    fullWidth
                                                    label="Institution Name"
                                                    value={exp.institution_name}
                                                    onChange={(e) => {
                                                        const updated = index < experience.length ? [...experience] : [...newExperiences];
                                                        updated[index < experience.length ? index : index - experience.length].institution_name = e.target.value;
                                                        index < experience.length ? setExperience(updated) : setNewExperiences(updated);
                                                    }}
                                                />
                                                <TextField
                                                    fullWidth
                                                    label="Designation"
                                                    value={exp.designation}
                                                    onChange={(e) => {
                                                        const updated = index < experience.length ? [...experience] : [...newExperiences];
                                                        updated[index < experience.length ? index : index - experience.length].designation = e.target.value;
                                                        index < experience.length ? setExperience(updated) : setNewExperiences(updated);
                                                    }}
                                                    sx={{ mt: 2 }}
                                                />
                                                <TextField
                                                    fullWidth
                                                    label="Department"
                                                    value={exp.department}
                                                    onChange={(e) => {
                                                        const updated = index < experience.length ? [...experience] : [...newExperiences];
                                                        updated[index < experience.length ? index : index - experience.length].department = e.target.value;
                                                        index < experience.length ? setExperience(updated) : setNewExperiences(updated);
                                                    }}
                                                    sx={{ mt: 2 }}
                                                />
                                                <TextField
                                                    fullWidth
                                                    label="Start Date"
                                                    type="date"
                                                    value={exp.start_date}
                                                    onChange={(e) => {
                                                        const updated = index < experience.length ? [...experience] : [...newExperiences];
                                                        updated[index < experience.length ? index : index - experience.length].start_date = e.target.value;
                                                        index < experience.length ? setExperience(updated) : setNewExperiences(updated);
                                                    }}
                                                    sx={{ mt: 2 }}
                                                    InputLabelProps={{ shrink: true }}
                                                />
                                                <TextField
                                                    fullWidth
                                                    label="End Date"
                                                    type="date"
                                                    value={exp.end_date}
                                                    onChange={(e) => {
                                                        const updated = index < experience.length ? [...experience] : [...newExperiences];
                                                        updated[index < experience.length ? index : index - experience.length].end_date = e.target.value;
                                                        index < experience.length ? setExperience(updated) : setNewExperiences(updated);
                                                    }}
                                                    sx={{ mt: 2 }}
                                                    InputLabelProps={{ shrink: true }}
                                                />
                                                <TextField
                                                    fullWidth
                                                    label="Description"
                                                    multiline
                                                    rows={3}
                                                    value={exp.description}
                                                    onChange={(e) => {
                                                        const updated = index < experience.length ? [...experience] : [...newExperiences];
                                                        updated[index < experience.length ? index : index - experience.length].description = e.target.value;
                                                        index < experience.length ? setExperience(updated) : setNewExperiences(updated);
                                                    }}
                                                    sx={{ mt: 2 }}
                                                />
                                            </Box>
                                        ))}
                                        <Button variant="outlined" fullWidth onClick={handleAddExperience}>
                                            Add New Experience
                                        </Button>
                                        <Button variant="contained" sx={{ mt: 3 }} onClick={handleExperienceSave}>
                                            Save All Experience
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

export default TeacherProfileEdit;
