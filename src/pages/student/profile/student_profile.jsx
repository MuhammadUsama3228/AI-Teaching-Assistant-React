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
    Paper
} from '@mui/material';
import { Link } from 'react-router-dom';
import api from '../../../api.js';

const StudentProfile = () => {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [studentDetails, setStudentDetails] = useState(null);

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
                console.error('Failed to fetch student data:', error);
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
    const hasStudentProfile = studentDetails && Object.keys(studentDetails).length > 0;

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
                    Student Dashboard
                </Typography>
                <Typography variant="subtitle1">
                    View your academic profile
                </Typography>
            </Box>

            <Container maxWidth="lg" sx={{ py: 5 }}>
                <Grid container spacing={4}>
                    {/* Sidebar */}
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
                                to="/student_profile_edit"
                                variant="contained"
                                fullWidth
                                sx={{ mt: 2 }}
                            >
                                {hasStudentProfile ? 'Edit Profile' : 'Create Profile'}
                            </Button>
                        </Paper>
                    </Grid>

                    {/* Main Section */}
                    <Grid item xs={12} md={8}>
                        <Card elevation={3}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Student Profile Details
                                </Typography>
                                {hasStudentProfile ? (
                                    <>
                                        <Typography><strong>Institution:</strong> {studentDetails.institution_name}</Typography>
                                        <Typography><strong>Institution Type:</strong> {studentDetails.institution_type}</Typography>
                                        <Typography><strong>Level:</strong> {studentDetails.level}</Typography>
                                        <Typography><strong>Degree:</strong> {studentDetails.degree}</Typography>
                                        <Typography><strong>Year of Study:</strong> {studentDetails.year_of_study}</Typography>
                                        <Typography><strong>Date of Birth:</strong> {studentDetails.date_of_birth}</Typography>
                                        <Typography><strong>Gender:</strong> {studentDetails.gender}</Typography>
                                        <Typography><strong>Phone:</strong> {studentDetails.phone_hide ? 'Hidden' : studentDetails.phone_number}</Typography>
                                        <Typography><strong>Address:</strong> {studentDetails.address_hide ? 'Hidden' : studentDetails.address}</Typography>
                                        <Typography><strong>City:</strong> {studentDetails.city}</Typography>
                                        <Typography><strong>Country:</strong> {studentDetails.country}</Typography>
                                        <Typography><strong>Postal Code:</strong> {studentDetails.postal_code}</Typography>
                                        <Typography><strong>Bio:</strong> {studentDetails.bio}</Typography>
                                    </>
                                ) : (
                                    <Box
                                        sx={{
                                            backgroundColor: '#e3f2fd',
                                            border: '2px dashed #2196f3',
                                            borderRadius: 3,
                                            p: 4,
                                            mt: 1,
                                            textAlign: 'center'
                                        }}
                                    >
                                        <Typography variant="h6" gutterBottom color="primary">
                                            No Student Profile Found
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                                            You haven’t created your student profile yet.
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            component={Link}
                                            to="/studentprofilecreate"
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
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default StudentProfile;
