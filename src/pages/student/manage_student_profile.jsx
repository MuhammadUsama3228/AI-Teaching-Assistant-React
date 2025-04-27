import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Container, Typography, Grid, Avatar, Box,
  FormControlLabel, Checkbox, Snackbar, Alert, Tabs, Tab, CircularProgress, Paper, Divider, Skeleton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

const StudentProfileUpdate = () => {
  const [profile, setProfile] = useState({
    user: '',
    user_type: 'student',
    institution_name: '',
    slug: '',
    institution_type: '',
    level: '',
    degree: '',
    year_of_study: '',
    date_of_birth: '',
    gender: '',
    phone_number: '',
    phone_hide: false,
    address: '',
    city: '',
    country: '',
    postal_code: '',
    bio: '',
    address_hide: false,
  });

  const [isEditable, setIsEditable] = useState(false); // To toggle edit mode
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ open: false, type: '', text: '' });
  const [loadingProfile, setLoadingProfile] = useState(true); // To control skeleton loader

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/api/student-profiles/');
        if (response.status === 200) {
          setProfile(response.data);
          setLoadingProfile(false); // Stop skeleton loading after profile is fetched
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        showMessage('error', 'Failed to fetch profile data');
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.patch(`/api/student-profiles/${profile.id}/`, profile);
      if (response.status === 200) {
        showMessage('success', 'Profile updated successfully');
        setTimeout(() => {
          navigate('/studentprofile');
        }, 1000);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showMessage('error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ open: true, type, text });
  };

  const handleCloseMessage = () => {
    setMessage({ open: false, type: '', text: '' });
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleEditClick = () => {
    setIsEditable((prev) => !prev); // Toggle the edit mode
  };

  const renderTabContent = () => {
    switch (tabIndex) {
      case 0:
        return (
          <>
            <Grid item xs={12}>
              <TextField
                label="Username"
                fullWidth
                name="username"
                value={profile.user}
                disabled={!isEditable} // Disable if not editable
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Date of Birth"
                fullWidth
                name="date_of_birth"
                value={profile.date_of_birth}
                onChange={handleChange}
                type="date"
                InputLabelProps={{ shrink: true }}
                disabled={!isEditable} // Disable if not editable
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Gender"
                fullWidth
                name="gender"
                value={profile.gender}
                onChange={handleChange}
                disabled={!isEditable} // Disable if not editable
              />
            </Grid>
          </>
        );
      case 1:
        return (
          <>
            <Grid item xs={12}>
              <TextField
                label="Institution Name"
                fullWidth
                name="institution_name"
                value={profile.institution_name}
                onChange={handleChange}
                disabled={!isEditable} // Disable if not editable
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Institution Type"
                fullWidth
                name="institution_type"
                value={profile.institution_type}
                onChange={handleChange}
                disabled={!isEditable} // Disable if not editable
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Degree"
                fullWidth
                name="degree"
                value={profile.degree}
                onChange={handleChange}
                disabled={!isEditable} // Disable if not editable
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Phone Number"
                fullWidth
                name="phone_number"
                value={profile.phone_number}
                onChange={handleChange}
                disabled={!isEditable} // Disable if not editable
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox name="phone_hide" checked={profile.phone_hide} onChange={handleChange} />}
                label="Hide Phone Number"
                disabled={!isEditable} // Disable if not editable
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="City"
                fullWidth
                name="city"
                value={profile.city}
                onChange={handleChange}
                disabled={!isEditable} // Disable if not editable
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Country"
                fullWidth
                name="country"
                value={profile.country}
                onChange={handleChange}
                disabled={!isEditable} // Disable if not editable
              />
            </Grid>
          </>
        );
      case 2:
        return (
          <>
            <Grid item xs={12}>
              <TextField
                label="Bio"
                fullWidth
                multiline
                rows={4}
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                disabled={!isEditable} // Disable if not editable
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox name="address_hide" checked={profile.address_hide} onChange={handleChange} />}
                label="Hide Address"
                disabled={!isEditable} // Disable if not editable
              />
            </Grid>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ position: 'relative' }}>
      <Box sx={{
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 10,
        display: { xs: 'block', sm: 'block', md: 'block' },
        paddingRight: { xs: '10px', sm: '15px', md: '25px' }
      }}>
        <Button variant="outlined" onClick={handleEditClick}>
          {isEditable ? 'Cancel Edit' : 'Edit'}
        </Button>
      </Box>

      <Paper sx={{ p: 4, mt: 4, boxShadow: 3, borderRadius: 2 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4} textAlign="center">
            <Avatar
              sx={{
                width: 150,
                height: 150,
                margin: 'auto',
                mb: 2,
                fontSize: '3rem',
                bgcolor: '#8BAED0FF',
                boxShadow: 3,
              }}
            >
              {profile.user?.charAt(0)?.toUpperCase() || <Skeleton width={40} height={40} />}
            </Avatar>
            <Typography variant="h5" fontWeight={600} color="primary">
              {loadingProfile ? <Skeleton width="100%" /> : profile.user}
            </Typography>
            <Typography color="textSecondary" fontSize="1rem">
              {loadingProfile ? <Skeleton width="80%" /> : profile.user_type}
            </Typography>
          </Grid>

          <Grid item xs={12} md={8}>
            <Tabs value={tabIndex} onChange={handleTabChange} indicatorColor="primary" textColor="primary" centered>
              <Tab label="Info" />
              <Tab label="Student Details" />
              <Tab label="Bio and Privacy" />
            </Tabs>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                {renderTabContent()}
              </Grid>

              <Box display="flex" justifyContent="flex-end" mt={3}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={loading}
                  sx={{ px: 5, py: 1.5 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Submit'}
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar open={message.open} autoHideDuration={6000} onClose={handleCloseMessage}>
        <Alert onClose={handleCloseMessage} severity={message.type}>
          {message.text}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default StudentProfileUpdate;
