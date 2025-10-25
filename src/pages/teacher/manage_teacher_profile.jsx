import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Container, Typography, Grid, Avatar, Box,
  FormControlLabel, Checkbox, Snackbar, Alert, Tabs, Tab, CircularProgress, Paper, Divider, Skeleton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

const TeacherProfileUpdate = () => {
  const [profile, setProfile] = useState({
    id: 4,
    user: 'Moeed',
    institution_name: 'UMt',
    slug: 'moeed',
    institution_type: 'school',
    designation: 'ASA',
    department: 'SST',
    teaching_experience: 4,
    date_of_birth: '2002-11-11',
    gender: 'male',
    phone_number: '+923246558805',
    phone_hide: true,
    address: '294 Eden Rasidencia Nasheman-e-Iqbal phase2',
    city: 'Lahore',
    country: 'PK',
    postal_code: '54000',
    about: 'qqq',
    address_hide: true,
  });

  const [experience, setExperience] = useState({
    id: 3,
    teacher: 'Moeed',
    institution_name: 'UMt',
    designation: 'ASA',
    department: 'SST',
    start_date: '2025-04-24',
    end_date: '2025-04-25',
    description: 'dd',
  });

  const [isEditable, setIsEditable] = useState(false); // To toggle edit mode
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ open: false, type: '', text: '' });
  const [loadingProfile, setLoadingProfile] = useState(true); // To control skeleton loader

  const navigate = useNavigate();
  const [experiences, setExperiences] = useState([]);
  const [editedExperiences, setEditedExperiences] = useState({}); // Store edited fields by ID
  
  // Fetch multiple experiences
  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileResponse = await api.get('/api/teacher-profiles/');
        if (profileResponse.status === 200) {
          setProfile(profileResponse.data);
        }
  
        const experienceResponse = await api.get('/api/teacher-experience/');
        if (experienceResponse.status === 200) {
          setExperiences(experienceResponse.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        showMessage('error', 'Failed to fetch data');
      } finally {
        setLoadingProfile(false);
      }
    };
  
    fetchData();
  }, []);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleExperienceChange = (e, id) => {
    const { name, value } = e.target;
    setEditedExperiences((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [name]: value,
      },
    }));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      // PATCH profile
      if (profile.id) {
        await api.patch(`/api/teacher-profiles/${profile.id}/`, profile);
      }
  
      // PATCH each edited experience
      for (const id in editedExperiences) {
        await api.patch(`/api/teacher-experience/${id}/`, editedExperiences[id]);
      }
  
      showMessage('success', 'Profile and Experiences updated successfully');
  
      setTimeout(() => {
        navigate('/profile');
      }, 1000);
    } catch (error) {
      console.error('Error updating:', error);
      showMessage('error', 'Failed to update');
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
            name="user"
            value={profile.user}
            disabled // Always disabled
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
                label="Designation"
                fullWidth
                name="designation"
                value={profile.designation}
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
                label="About"
                fullWidth
                multiline
                rows={4}
                name="about"
                value={profile.about}
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
        case 3:
            return experiences.length === 0 ? (
              <Typography>No experiences found.</Typography>
            ) : (
              experiences.map((exp) => (
                <Box key={exp.id} sx={{ mb: 4, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        label="Institution Name"
                        fullWidth
                        name="institution_name"
                        value={editedExperiences[exp.id]?.institution_name ?? exp.institution_name}
                        onChange={(e) => handleExperienceChange(e, exp.id)}
                        disabled={!isEditable}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Designation"
                        fullWidth
                        name="designation"
                        value={editedExperiences[exp.id]?.designation ?? exp.designation}
                        onChange={(e) => handleExperienceChange(e, exp.id)}
                        disabled={!isEditable}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Department"
                        fullWidth
                        name="department"
                        value={editedExperiences[exp.id]?.department ?? exp.department}
                        onChange={(e) => handleExperienceChange(e, exp.id)}
                        disabled={!isEditable}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Start Date"
                        fullWidth
                        name="start_date"
                        value={editedExperiences[exp.id]?.start_date ?? exp.start_date}
                        onChange={(e) => handleExperienceChange(e, exp.id)}
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        disabled={!isEditable}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="End Date"
                        fullWidth
                        name="end_date"
                        value={editedExperiences[exp.id]?.end_date ?? exp.end_date}
                        onChange={(e) => handleExperienceChange(e, exp.id)}
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        disabled={!isEditable}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Description"
                        fullWidth
                        name="description"
                        value={editedExperiences[exp.id]?.description ?? exp.description}
                        onChange={(e) => handleExperienceChange(e, exp.id)}
                        multiline
                        rows={3}
                        disabled={!isEditable}
                      />
                    </Grid>
                  </Grid>
                </Box>
              ))
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
              {loadingProfile ? <Skeleton width="80%" /> : profile.institution_name}
            </Typography>
          </Grid>

          <Grid item xs={12} md={8}>
            <Tabs value={tabIndex} onChange={handleTabChange} indicatorColor="primary" textColor="primary" centered>
              <Tab label="Info" />
              <Tab label="Details" />
              <Tab label="Bio" />
              <Tab label="Experience" />
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

export default TeacherProfileUpdate;
