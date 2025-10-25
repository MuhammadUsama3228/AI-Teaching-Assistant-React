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
    Paper,
    Stack
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Person, School, Email, Edit } from '@mui/icons-material';
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
        <Box sx={{ minHeight: '100vh', backgroundColor: '#f4f6f8' }}>
            {/* Header */}
            <Box
                sx={{
                    background: 'linear-gradient(90deg, #4B2E83 0%, #6A1B9A 100%)',
                    color: '#fff',
                    py: 4,
                    px: 2,
                    textAlign: 'center',
                }}
            >
                <Typography variant="h4" fontWeight="bold">
                    Teacher Dashboard
                </Typography>
                <Typography variant="subtitle1">
                    View and manage your teaching profile
                </Typography>
            </Box>

            <Container maxWidth="lg" sx={{ py: 5 }}>
                <Grid container spacing={4}>
                    {/* Sidebar */}
                    <Grid item xs={12} md={4}>
                        <Paper elevation={4} sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
                            <Avatar
                                src={profile?.profile_picture ? `${apiURL}${profile.profile_picture}` : ''}
                                alt={profile?.username || ''}
                                sx={{
                                    width: 120,
                                    height: 120,
                                    mx: 'auto',
                                    mb: 2,
                                    border: '3px solid #6A1B9A'
                                }}
                            />
                            <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
                                {profile?.first_name} {profile?.last_name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                <Email sx={{ fontSize: 16, mr: 0.5 }} /> {profile?.email}
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="body2" color="textSecondary">
                                <Person sx={{ fontSize: 16, mr: 0.5 }} /> {profile?.username}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                <School sx={{ fontSize: 16, mr: 0.5 }} /> {profile?.role}
                            </Typography>
                            <Button
                                component={Link}
                                to={hasTeacherProfile ? "/edit_teacher_profile" : "/create_teacher_profile"}
                                startIcon={<Edit />}
                                variant="contained"
                                fullWidth
                                sx={{
                                    mt: 3,
                                    background: 'linear-gradient(90deg, #4B2E83 0%, #6A1B9A 100%)',
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    '&:hover': {
                                        background: 'linear-gradient(90deg, #4527a0 0%, #8e24aa 100%)',
                                    }
                                }}
                            >
                                {hasTeacherProfile ? 'Edit Profile' : 'Create Profile'}
                            </Button>
                        </Paper>
                    </Grid>

                    {/* Main Section */}
                    <Grid item xs={12} md={8}>
                        <Card elevation={4} sx={{ borderRadius: 3 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom fontWeight="bold">
                                    Teacher Profile Details
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                {hasTeacherProfile ? (
                                    <Stack spacing={1}>
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
                                    </Stack>
                                ) : (
                                    <Box
                                        sx={{
                                            backgroundColor: '#e3f2fd',
                                            border: '2px dashed #2196f3',
                                            borderRadius: 3,
                                            p: 4,
                                            textAlign: 'center'
                                        }}
                                    >
                                        <Typography variant="h6" gutterBottom color="primary">
                                            No Teacher Profile Found
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                                            You haven’t created your teacher profile yet.
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
                        <Card elevation={4} sx={{ mt: 4, borderRadius: 3 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom fontWeight="bold">
                                    Teaching Experience
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                {experience.length === 0 ? (
                                    <Typography color="textSecondary">No Experience Added.</Typography>
                                ) : (
                                    <Stack spacing={2}>
                                        {experience.map((exp) => (
                                            <Box key={exp.id}>
                                                <Typography><strong>Institution:</strong> {exp.institution_name}</Typography>
                                                <Typography><strong>Designation:</strong> {exp.designation}</Typography>
                                                <Typography><strong>Department:</strong> {exp.department}</Typography>
                                                <Typography><strong>Start Date:</strong> {exp.start_date}</Typography>
                                                <Typography><strong>End Date:</strong> {exp.end_date}</Typography>
                                                <Typography><strong>Description:</strong> {exp.description}</Typography>
                                                <Divider sx={{ my: 1 }} />
                                            </Box>
                                        ))}
                                    </Stack>
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
