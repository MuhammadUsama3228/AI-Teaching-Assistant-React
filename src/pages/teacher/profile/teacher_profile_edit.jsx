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
import { Person, Email, School } from '@mui/icons-material';
import { FormControlLabel, Switch } from '@mui/material';
import { useNavigate } from 'react-router-dom';
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

const TeacherProfileEdit = () => {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [teacherDetails, setTeacherDetails] = useState(null);
    const [experience, setExperience] = useState([]);
    const [newExperiences, setNewExperiences] = useState([]);
    const [tabIndex, setTabIndex] = useState(0);
    const [previewImage, setPreviewImage] = useState(null);
    const navigate = useNavigate();

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

    const handleSaveAll = async () => {
        try {
            // Upload profile picture if changed
            if (profile.profile_picture instanceof File) {
                const formData = new FormData();
                formData.append('profile_picture', profile.profile_picture);
                await api.patch('/api/profile_picture/', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }

            // Update teacher details
            await api.patch(`/api/teacher-profiles/${teacherDetails.id}/`, teacherDetails);

            // Update existing experience only
            for (const exp of experience) {
                await api.patch(`/api/teacher-experience/${exp.id}/`, exp);
            }

            alert('All updates saved successfully!');
            navigate('/profile'); // ✅ redirect to profile page

        } catch (error) {
            console.error('Error saving all data:', error);
            alert('Failed to save everything.');
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
    const avatarSrc = previewImage
        ? previewImage
        : profile?.profile_picture
            ? `${apiURL}${profile.profile_picture}`
            : '';


    return (
        <Box sx={{  backgroundColor: '#f5f5f5', minHeight: '100vh' }}>

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
                    Teacher Profile Management
                </Typography>
                <Typography variant="subtitle1">
                    Update your personal, professional, and experience information
                </Typography>
            </Box>

            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={4} sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
                            <Avatar
                                src={avatarSrc}
                                alt={profile?.username || ''}
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
                                {teacherDetails.institution_name}
                            </Typography>

                        </Paper>
                    </Grid>


                    <Grid item xs={12} md={8}>


                        <Card>
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
                                                <TextField
                                                    fullWidth
                                                    label="Role"
                                                    value={profile.role}
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

                                    </Box>
                                )}

                                {tabIndex === 1 && (

                                    <Box mt={3}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Institution Name"
                                                    value={teacherDetails.institution_name}
                                                    onChange={(e) => setTeacherDetails({ ...teacherDetails, institution_name: e.target.value })}
                                                    {...textFieldStyles}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Institution Type"
                                                    value={teacherDetails.institution_type}
                                                    {...textFieldStyles}
                                                    onChange={(e) => setTeacherDetails({ ...teacherDetails, institution_type: e.target.value })}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Designation"
                                                    value={teacherDetails.designation}
                                                    {...textFieldStyles}
                                                    onChange={(e) => setTeacherDetails({ ...teacherDetails, designation: e.target.value })}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Department"
                                                    value={teacherDetails.department}
                                                    onChange={(e) => setTeacherDetails({ ...teacherDetails, department: e.target.value })}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    type="number"
                                                    label="Teaching Experience (Years)"
                                                    value={teacherDetails.teaching_experience}
                                                    {...textFieldStyles}
                                                    onChange={(e) => setTeacherDetails({ ...teacherDetails, teaching_experience: e.target.value })}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    type="date"
                                                    label="Date of Birth"
                                                    {...textFieldStyles}
                                                    value={teacherDetails.date_of_birth}
                                                    onChange={(e) => setTeacherDetails({ ...teacherDetails, date_of_birth: e.target.value })}
                                                    InputLabelProps={{ shrink: true }}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    select
                                                    label="Gender"
                                                    value={teacherDetails.gender}
                                                    {...textFieldStyles}
                                                    onChange={(e) => setTeacherDetails({ ...teacherDetails, gender: e.target.value })}
                                                >
                                                    <MenuItem value="male">Male</MenuItem>
                                                    <MenuItem value="female">Female</MenuItem>
                                                    <MenuItem value="other">Other</MenuItem>
                                                </TextField>
                                            </Grid>

                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Phone Number"
                                                    value={teacherDetails.phone_number}
                                                    onChange={(e) => setTeacherDetails({ ...teacherDetails, phone_number: e.target.value })}
                                                    {...textFieldStyles}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            checked={teacherDetails.phone_hide}
                                                            onChange={(e) => setTeacherDetails({ ...teacherDetails, phone_hide: e.target.checked })}
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
                                            </Grid>

                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Address"
                                                    value={teacherDetails.address}
                                                    {...textFieldStyles}
                                                    onChange={(e) => setTeacherDetails({ ...teacherDetails, address: e.target.value })}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            checked={teacherDetails.address_hide}
                                                            onChange={(e) => setTeacherDetails({ ...teacherDetails, address_hide: e.target.checked })}
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
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="City"
                                                    {...textFieldStyles}
                                                    value={teacherDetails.city}
                                                    onChange={(e) => setTeacherDetails({ ...teacherDetails, city: e.target.value })}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Country"
                                                    {...textFieldStyles}
                                                    value={teacherDetails.country}
                                                    onChange={(e) => setTeacherDetails({ ...teacherDetails, country: e.target.value })}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Postal Code"
                                                    {...textFieldStyles}
                                                    value={teacherDetails.postal_code}
                                                    onChange={(e) => setTeacherDetails({ ...teacherDetails, postal_code: e.target.value })}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="About"
                                                    multiline
                                                    rows={3}
                                                    value={teacherDetails.about}
                                                    {...textFieldStyles}
                                                    onChange={(e) => setTeacherDetails({ ...teacherDetails, about: e.target.value })}
                                                />
                                            </Grid>
                                        </Grid>



                                    </Box>

                                )}


                                {tabIndex === 2 && (
                                    <Box mt={3}>
                                        {[...experience, ...newExperiences].map((exp, index) => (
                                            <Box key={index} mb={4}>
                                                <Divider sx={{ my: 2 }} />
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12}>
                                                        <TextField
                                                            label="Institution Name"
                                                            value={exp.institution_name}
                                                            onChange={(e) => {
                                                                const updated = index < experience.length ? [...experience] : [...newExperiences];
                                                                updated[index < experience.length ? index : index - experience.length].institution_name = e.target.value;
                                                                index < experience.length ? setExperience(updated) : setNewExperiences(updated);
                                                            }}
                                                            {...textFieldStyles}
                                                        />
                                                    </Grid>

                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            label="Designation"
                                                            value={exp.designation}
                                                            onChange={(e) => {
                                                                const updated = index < experience.length ? [...experience] : [...newExperiences];
                                                                updated[index < experience.length ? index : index - experience.length].designation = e.target.value;
                                                                index < experience.length ? setExperience(updated) : setNewExperiences(updated);
                                                            }}
                                                            {...textFieldStyles}
                                                        />
                                                    </Grid>

                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            label="Department"
                                                            value={exp.department}
                                                            onChange={(e) => {
                                                                const updated = index < experience.length ? [...experience] : [...newExperiences];
                                                                updated[index < experience.length ? index : index - experience.length].department = e.target.value;
                                                                index < experience.length ? setExperience(updated) : setNewExperiences(updated);
                                                            }}
                                                            {...textFieldStyles}
                                                        />
                                                    </Grid>

                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            label="Start Date"
                                                            type="date"
                                                            value={exp.start_date}
                                                            InputLabelProps={{ shrink: true }}
                                                            onChange={(e) => {
                                                                const updated = index < experience.length ? [...experience] : [...newExperiences];
                                                                updated[index < experience.length ? index : index - experience.length].start_date = e.target.value;
                                                                index < experience.length ? setExperience(updated) : setNewExperiences(updated);
                                                            }}
                                                            {...textFieldStyles}
                                                        />
                                                    </Grid>

                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            label="End Date"
                                                            type="date"
                                                            value={exp.end_date}
                                                            InputLabelProps={{ shrink: true }}
                                                            onChange={(e) => {
                                                                const updated = index < experience.length ? [...experience] : [...newExperiences];
                                                                updated[index < experience.length ? index : index - experience.length].end_date = e.target.value;
                                                                index < experience.length ? setExperience(updated) : setNewExperiences(updated);
                                                            }}
                                                            {...textFieldStyles}
                                                        />
                                                    </Grid>

                                                    <Grid item xs={12}>
                                                        <TextField
                                                            label="Description"
                                                            multiline
                                                            rows={3}
                                                            value={exp.description}
                                                            onChange={(e) => {
                                                                const updated = index < experience.length ? [...experience] : [...newExperiences];
                                                                updated[index < experience.length ? index : index - experience.length].description = e.target.value;
                                                                index < experience.length ? setExperience(updated) : setNewExperiences(updated);
                                                            }}
                                                            {...textFieldStyles}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        ))}

                                        <Button
                                            variant="outlined"
                                            fullWidth
                                            onClick={handleAddExperience}
                                            sx={{
                                                mt: 2,
                                                borderColor: '#6A1B9A',
                                                color: '#6A1B9A',
                                                fontWeight: 'bold',
                                                '&:hover': {
                                                    backgroundColor: '#f3e5f5',
                                                    borderColor: '#4B2E83',
                                                },
                                            }}
                                        >
                                            Add New Experience
                                        </Button>


                                        <Button
                                            variant="contained"
                                            sx={{
                                                mt: 3,
                                                background: 'linear-gradient(90deg, #4B2E83 0%, #6A1B9A 100%)',
                                                color: '#fff',
                                                fontWeight: 'bold',
                                                '&:hover': {
                                                    background: 'linear-gradient(90deg, #4527a0 0%, #8e24aa 100%)',
                                                },
                                            }}
                                            onClick={handleSaveAll}
                                        >
                                            Save
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
