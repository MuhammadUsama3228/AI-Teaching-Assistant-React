import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Avatar,
    Box,
    Divider,
    CircularProgress,
    Button,
    IconButton,
    Tooltip,
    Paper
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';
import api from '../../../api.js';

const TeacherProfile = () => {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [teacherDetails, setTeacherDetails] = useState(null);
    const [experience, setExperience] = useState([]);

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

    if (loading) {
        return (
            <Container sx={{ textAlign: 'center', mt: 10 }}>
                <CircularProgress />
            </Container>
        );
    }

    const apiURL = import.meta.env.VITE_API_URL || '';
    const hasTeacherProfile = teacherDetails && Object.keys(teacherDetails).length > 0;

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
            {/* Header */}
            <Box
                sx={{
                    background: 'linear-gradient(90deg, #4B2E83 0%, #6A1B9A 100%)',
                    color: '#fff',
                    py: 3,
                    px: 2,
                    textAlign: 'center',
                }}
            >
                <Typography variant="h5" fontWeight="bold">
                    Profile Dashboard
                </Typography>
                <Typography variant="subtitle1">
                    Manage your profile and teaching details
                </Typography>
            </Box>

            <Container maxWidth="lg" sx={{ py: 5 }}>
                <Grid container spacing={4}>
                    {/* Sidebar Card */}
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                            <Avatar
                                src={profile?.profile_picture ? `${apiURL}${profile.profile_picture}` : ''}
                                alt={profile?.username || ''}
                                sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                            />

                            <Typography variant="h6" fontWeight="bold">
                                {profile?.first_name} {profile?.last_name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {profile?.email}
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="body2" color="textSecondary">
                                Username: {profile?.username}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Role: {profile?.role}
                            </Typography>
                            <Button
                                component={Link}
                                to="/create_teacher_profile"
                                variant="contained"
                                fullWidth
                                sx={{ mt: 2 }}
                            >
                                {hasTeacherProfile ? 'Edit Profile' : 'Create Profile'}
                            </Button>
                        </Paper>
                    </Grid>

                    {/* Main Section */}
                    <Grid item xs={12} md={8}>
                        <Card elevation={3}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6">Teacher Details</Typography>
                                    <Tooltip title="Edit Teacher Profile">
                                        <IconButton
                                            component={Link}
                                            to="/edit_teacher_profile"
                                            color="primary"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Box>

                                {hasTeacherProfile ? (
                                    <>
                                        <Typography><strong>Institution:</strong> {teacherDetails.institution_name}</Typography>
                                        <Typography><strong>Institution Type:</strong> {teacherDetails.institution_type}</Typography>
                                        <Typography><strong>Designation:</strong> {teacherDetails.designation}</Typography>
                                        <Typography><strong>Department:</strong> {teacherDetails.department}</Typography>
                                        <Typography><strong>Experience:</strong> {teacherDetails.teaching_experience} year(s)</Typography>
                                        <Typography><strong>Date of Birth:</strong> {teacherDetails.date_of_birth}</Typography>
                                        <Typography><strong>Gender:</strong> {teacherDetails.gender}</Typography>
                                        <Typography><strong>Phone:</strong> {teacherDetails.phone_hide ? 'Hidden' : teacherDetails.phone_number}</Typography>
                                        <Typography><strong>Address:</strong> {teacherDetails.address_hide ? 'Hidden' : teacherDetails.address}</Typography>
                                        <Typography><strong>City:</strong> {teacherDetails.city}</Typography>
                                        <Typography><strong>Country:</strong> {teacherDetails.country}</Typography>
                                        <Typography><strong>Postal Code:</strong> {teacherDetails.postal_code}</Typography>
                                        <Typography><strong>About:</strong> {teacherDetails.about}</Typography>
                                    </>
                                ) : (
                                    <Box
                                        sx={{
                                            backgroundColor: '#f3e5f5',
                                            border: '2px dashed #ba68c8',
                                            borderRadius: 3,
                                            p: 4,
                                            mt: 1,
                                            textAlign: 'center'
                                        }}
                                    >
                                        <Typography variant="h6" gutterBottom color="primary">
                                            No Teacher Profile Found
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                                            You haven't set up your teaching profile yet. Start now to access teaching features!
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            component={Link}
                                            to="/create_teacher_profile"
                                            sx={{
                                                background: 'linear-gradient(90deg, #4B2E83 0%, #6A1B9A 100%)',
                                                color: '#fff',
                                                fontWeight: 'bold',
                                                px: 4,
                                                py: 1.5,
                                                borderRadius: '20px',
                                                '&:hover': {
                                                    background: 'linear-gradient(90deg, #4527a0 0%, #8e24aa 100%)',
                                                }
                                            }}
                                        >
                                            Create Profile Now
                                        </Button>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>

                        {/* Experience Section */}
                        <Card elevation={3} sx={{ mt: 4 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Experience
                                </Typography>
                                {experience.length === 0 ? (
                                    <Typography color="textSecondary">No Experience Added.</Typography>
                                ) : (
                                    experience.map((exp) => (
                                        <Box key={exp.id} sx={{ mb: 2 }}>
                                            <Typography><strong>Institution:</strong> {exp.institution_name}</Typography>
                                            <Typography><strong>Designation:</strong> {exp.designation}</Typography>
                                            <Typography><strong>Department:</strong> {exp.department}</Typography>
                                            <Typography><strong>Start Date:</strong> {exp.start_date}</Typography>
                                            <Typography><strong>End Date:</strong> {exp.end_date}</Typography>
                                            <Typography><strong>Description:</strong> {exp.description}</Typography>
                                            <Divider sx={{ my: 2 }} />
                                        </Box>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default TeacherProfile;
