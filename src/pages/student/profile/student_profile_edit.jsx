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

const StudentProfileEdit = () => {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [studentDetails, setStudentDetails] = useState(null);
    const [tabIndex, setTabIndex] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, studentRes] = await Promise.all([
                    api.get('/api/manage_profile/'),
                    api.get('/api/student-profiles/'),
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

    const handleStudentDetailsSave = async () => {
        try {
            await api.patch(`/api/student-profiles/${studentDetails.id}/`, studentDetails);
            alert('Student Details updated successfully!');
        } catch (error) {
            console.error('Error updating student details:', error);
            alert('Failed to update student details.');
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

    return (
        <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
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
                    Student Profile Management
                </Typography>
                <Typography variant="subtitle1">
                    Update your personal and academic information
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
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="body2">Email: {profile.email}</Typography>
                            <Typography variant="body2">Institution: {studentDetails.institution_name}</Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <Card>
                            <CardContent>
                                <Tabs value={tabIndex} onChange={handleTabChange} variant="fullWidth">
                                    <Tab label="Profile Info" />
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
                                                    value={studentDetails.institution_name}
                                                    onChange={(e) =>
                                                        setStudentDetails({ ...studentDetails, institution_name: e.target.value })
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Student ID"
                                                    value={studentDetails.student_id}
                                                    onChange={(e) =>
                                                        setStudentDetails({ ...studentDetails, student_id: e.target.value })
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Program"
                                                    value={studentDetails.program}
                                                    onChange={(e) =>
                                                        setStudentDetails({ ...studentDetails, program: e.target.value })
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Department"
                                                    value={studentDetails.department}
                                                    onChange={(e) =>
                                                        setStudentDetails({ ...studentDetails, department: e.target.value })
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Phone Number"
                                                    value={studentDetails.phone_number}
                                                    onChange={(e) =>
                                                        setStudentDetails({ ...studentDetails, phone_number: e.target.value })
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Address"
                                                    value={studentDetails.address}
                                                    onChange={(e) =>
                                                        setStudentDetails({ ...studentDetails, address: e.target.value })
                                                    }
                                                />
                                            </Grid>
                                        </Grid>
                                        <Button variant="contained" sx={{ mt: 3 }} onClick={handleStudentDetailsSave}>
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
