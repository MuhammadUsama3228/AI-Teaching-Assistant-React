import React from "react";
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  IconButton,
  Snackbar,
  Alert,
  ThemeProvider,
  Grid,
  Avatar,
  TextField
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import theme from '../../../components/Theme';
import api from '../../../api';
import { setUser, updateUser } from './manage-profile.js';

const ManageProfile = () => {
  const [value, setValue] = React.useState('one');
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState({ open: false, type: 'success', text: '' });
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  const user = userData?.user;

  const [formData, setFormData] = useState({
    id: "",
    username: "",
    email: "",
    role: "",
    profile_picture: null,
    first_name: "",
    last_name: "",
    get_full_name: null,
    get_regressed_email: "",
    profile: {
      teacher: {
        id: "",
        user: "",
        institution_name: "",
        slug: "",
        institution_type: "",
        designation: "",
        department: "",
        teaching_experience: 0,
        date_of_birth: "",
        gender: "",
        phone_number: "",
        phone_hide: false,
        address: "",
        city: "",
        country: "",
        postal_code: "",
        about: "",
        address_hide: false,
        created_at: "",
        updated_at: ""
      },
      experience: [
        {
          id: "",
          teacher: "",
          institution_name: "",
          designation: "",
          department: "",
          start_date: "",
          end_date: "",
          description: "",
          created_at: "",
          updated_at: ""
        }
      ]
    },
    last_login: ""
  });

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id || "",
        username: user.username || "",
        email: user.email || user.get_regressed_email || "",
        role: user.role || "",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        profile_picture: null,
        profile: {
          teacher: {
            id: user.profile?.teacher?.id || "",
            user: user.profile?.teacher?.user || "",
            institution_name: user.profile?.teacher?.institution_name || "",
            slug: user.profile?.teacher?.slug || "",
            institution_type: user.profile?.teacher?.institution_type || "",
            designation: user.profile?.teacher?.designation || "",
            department: user.profile?.teacher?.department || "",
            teaching_experience: user.profile?.teacher?.teaching_experience || 0,
            date_of_birth: user.profile?.teacher?.date_of_birth || "",
            gender: user.profile?.teacher?.gender || "",
            phone_number: user.profile?.teacher?.phone_number || "",
            phone_hide: user.profile?.teacher?.phone_hide || false,
            address: user.profile?.teacher?.address || "",
            city: user.profile?.teacher?.city || "",
            country: user.profile?.teacher?.country || "",
            postal_code: user.profile?.teacher?.postal_code || "",
            about: user.profile?.teacher?.about || "",
            address_hide: user.profile?.teacher?.address_hide || false,
            created_at: user.profile?.teacher?.created_at || "",
            updated_at: user.profile?.teacher?.updated_at || ""
          },
          experience: Array.isArray(user.profile?.experience)
            ? user.profile.experience.map(exp => ({
              id: exp.id || "",
              teacher: exp.teacher || "",
              institution_name: exp.institution_name || "",
              designation: exp.designation || "",
              department: exp.department || "",
              start_date: exp.start_date || "",
              end_date: exp.end_date || "",
              description: exp.description || "",
              created_at: exp.created_at || "",
              updated_at: exp.updated_at || ""
            }))
            : [{
              id: "",
              teacher: "",
              institution_name: "",
              designation: "",
              department: "",
              start_date: "",
              end_date: "",
              description: "",
              created_at: "",
              updated_at: ""
            }]
        },
        last_login: user.last_login || ""
      });

      if (user.profile_picture) {
        setImagePreview(user.profile_picture);
      }
    }
  }, [user]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/manage_profile/');
      if (response.status === 200) {
        dispatch(setUser(response.data));
        showMessage('success', 'Profile data loaded successfully');
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      showMessage('error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      fetchProfileData();
    }
  }, []);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name in (formData.profile?.teacher || {})) {
      setFormData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          teacher: {
            ...prev.profile.teacher,
            [name]: value
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleExperienceChange = (e, index) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updatedExperience = [...prev.profile.experience];
      updatedExperience[index] = {
        ...updatedExperience[index],
        [name]: value
      };
      return {
        ...prev,
        profile: {
          ...prev.profile,
          experience: updatedExperience
        }
      };
    });
  };

  const handleAddExperience = () => {
    setFormData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        experience: [
          ...prev.profile.experience,
          {
            id: "",
            teacher: "",
            institution_name: "",
            designation: "",
            department: "",
            start_date: "",
            end_date: "",
            description: "",
            created_at: "",
            updated_at: ""
          }
        ]
      }
    }));
  };

  const handleRemoveExperience = (index) => {
    setFormData(prev => {
      const updatedExperience = [...prev.profile.experience];
      updatedExperience.splice(index, 1);
      return {
        ...prev,
        profile: {
          ...prev.profile,
          experience: updatedExperience.length > 0 ? updatedExperience : [{
            id: "",
            teacher: "",
            institution_name: "",
            designation: "",
            department: "",
            start_date: "",
            end_date: "",
            description: "",
            created_at: "",
            updated_at: ""
          }]
        }
      };
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    if (user) {
      setFormData({
        ...formData,
        username: user.username || '',
        email: user.get_regressed_email || user.email || '',
        role: user.role || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        profile: {
          ...formData.profile,
          teacher: {
            ...formData.profile.teacher,
            phone_number: user.profile?.teacher?.phone_number || '',
            address: user.profile?.teacher?.address || '',
          }
        }
      });
      setImagePreview(user.profile_picture || null);
    }
    setProfileImage(null);
  };

  const showMessage = (type, text) => {
    setMessage({ open: true, type, text });
  };

  const handleCloseMessage = () => {
    setMessage(prev => ({ ...prev, open: false }));
  };

  const validateForm = () => {
    if (!formData.first_name || !formData.last_name) {
      showMessage('error', 'First and last name are required');
      return false;
    }
    if (formData.profile?.teacher && !formData.profile.teacher.institution_name) {
      showMessage('error', 'Institution name is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!validateForm()) return;
  
    setLoading(true);
  
    try {
      // Prepare form data for submission
      const submitData = new FormData();
  
      // Append top-level fields
      submitData.append('username', formData.username);
      submitData.append('email', formData.email);
      submitData.append('first_name', formData.first_name);
      submitData.append('last_name', formData.last_name);
  
      // Handle teacher profile data
      const teacherProfile = {
        ...formData.profile.teacher,
        teaching_experience: Number(formData.profile.teacher.teaching_experience),
        phone_hide: Boolean(formData.profile.teacher.phone_hide),
        address_hide: Boolean(formData.profile.teacher.address_hide)
      };
      submitData.append('profile.teacher', JSON.stringify(teacherProfile));
  
      // Handle experiences
      const experiences = formData.profile.experience.map(exp => ({
        ...exp,
        id: exp.id || undefined  // Only include id if it's already present
      }));
      submitData.append('profile.experience', JSON.stringify(experiences));
  
      // Append the profile picture if it was changed
      if (profileImage) {
        submitData.append('profile_picture', profileImage);
      }
  
      // Make the PATCH request to update the profile
      const response = await api.patch('/api/manage_profile/', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.status === 200) {
        // Successfully updated profile
        dispatch(updateUser(response.data));  // Update user data in state
        setIsEditing(false);  // Switch to non-edit mode
        showMessage('success', 'Profile updated successfully');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Update error:', error.response?.data || error.message);
  
      // Determine the error message to display
      let errorMessage = 'Failed to update profile';
      if (error.response) {
        if (error.response.data) {
          if (error.response.data.errors) {
            errorMessage = Object.values(error.response.data.errors)
              .flat()
              .join(', ');
          } else {
            errorMessage = error.response.data.message || JSON.stringify(error.response.data);
          }
        }
      } else {
        errorMessage = error.message;
      }
  
      // Display error message
      showMessage('error', errorMessage);
    } finally {
      setLoading(false);  // Stop loading state
    }
  };
  

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
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 3 } }}>
        <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
          <Box
            display="flex"
            flexDirection={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            mb={3}
            gap={2}
          >
            <Typography variant="h4" color="primary" sx={{ fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
              {isEditing ? 'Edit Profile' : user.get_full_name || user.username}
            </Typography>
            <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
              {!isEditing ? (
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={handleEditClick}
                  fullWidth={true}
                  sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                  Edit Profile
                </Button>
              ) : (
                <Box
                  display="flex"
                  justifyContent={{ xs: 'space-between', sm: 'flex-end' }}
                  width="100%"
                >
                  <IconButton
                    color="secondary"
                    onClick={handleCancelClick}
                    sx={{ mr: 1 }}
                  >
                    <CancelIcon />
                  </IconButton>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    Save
                  </Button>
                </Box>
              )}
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box sx={{ width: '100%' }}>
            <Tabs
              value={value}
              onChange={handleTabChange}
              aria-label="tabs"
              centered
            >
              <Tab value="one" label="Info" wrapped />
              <Tab value="two" label={
                user.role === "admin" ? "Admin Details" : 
                user.role === "teacher" ? "Teacher Details" : "Student Details"
              } />
              {user.role !== "admin" && (
                <Tab value="three" label="Experiences" />
              )}
            </Tabs>

            <Box sx={{ padding: 2 }}>
              {value === 'one' && (
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Box display="flex" flexDirection="column" alignItems="center">
                      <Avatar
                        src={imagePreview || user.profile_picture || ''}
                        alt={formData.username}
                        sx={{
                          width: { xs: 150, sm: 180, md: 200 },
                          height: { xs: 150, sm: 180, md: 200 },
                          mb: 2,
                        }}
                      />

                      {isEditing && (
                        <Button
                          variant="outlined"
                          component="label"
                          startIcon={<PhotoCameraIcon />}
                          sx={{ width: { xs: '100%', sm: 'auto' } }}
                        >
                          Change Photo
                          <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </Button>
                      )}

                      <Typography
                        variant="h6"
                        textAlign="center"
                        mt={2}
                        sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                      >
                        {formData.first_name || formData.username} {formData.last_name && ` ${formData.last_name}`}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="textSecondary"
                        textAlign="center"
                      >
                        {formData.role}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={8}>
                    <form onSubmit={handleSubmit}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            disabled
                            required
                            size="small"
                            margin="normal"
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled
                            required
                            size="small"
                            margin="normal"
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="First Name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            disabled={!isEditing || loading}
                            size="small"
                            margin="normal"
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Last Name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            disabled={!isEditing || loading}
                            size="small"
                            margin="normal"
                          />
                        </Grid>

                        {isEditing && (
                          <Grid item xs={12}>
                            <Button
                              type="submit"
                              variant="contained"
                              color="primary"
                              disabled={loading}
                            >
                              {loading ? 'Saving...' : 'Save Changes'}
                            </Button>
                          </Grid>
                        )}
                      </Grid>
                    </form>
                  </Grid>
                </Grid>
              )}

              {value === 'two' && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h5" gutterBottom>
                    Teacher Information
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Institution Name"
                        name="institution_name"
                        value={formData.profile?.teacher?.institution_name || ''}
                        onChange={handleChange}
                        disabled={!isEditing}
                        size="small"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Institution Type"
                        name="institution_type"
                        value={formData.profile?.teacher?.institution_type || ''}
                        onChange={handleChange}
                        disabled={!isEditing}
                        size="small"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Designation"
                        name="designation"
                        value={formData.profile?.teacher?.designation || ''}
                        onChange={handleChange}
                        disabled={!isEditing}
                        size="small"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Department"
                        name="department"
                        value={formData.profile?.teacher?.department || ''}
                        onChange={handleChange}
                        disabled={!isEditing}
                        size="small"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Teaching Experience (Years)"
                        name="teaching_experience"
                        type="number"
                        value={formData.profile?.teacher?.teaching_experience || ''}
                        onChange={handleChange}
                        disabled={!isEditing}
                        size="small"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Date of Birth"
                        name="date_of_birth"
                        type="date"
                        value={formData.profile?.teacher?.date_of_birth || ''}
                        onChange={handleChange}
                        disabled={!isEditing}
                        size="small"
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Gender"
                        name="gender"
                        value={formData.profile?.teacher?.gender || ''}
                        onChange={handleChange}
                        disabled={!isEditing}
                        size="small"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Phone Number"
                        name="phone_number"
                        value={formData.profile?.teacher?.phone_number || ''}
                        onChange={handleChange}
                        disabled={!isEditing}
                        size="small"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="City"
                        name="city"
                        value={formData.profile?.teacher?.city || ''}
                        onChange={handleChange}
                        disabled={!isEditing}
                        size="small"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Country"
                        name="country"
                        value={formData.profile?.teacher?.country || ''}
                        onChange={handleChange}
                        disabled={!isEditing}
                        size="small"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Postal Code"
                        name="postal_code"
                        value={formData.profile?.teacher?.postal_code || ''}
                        onChange={handleChange}
                        disabled={!isEditing}
                        size="small"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Address"
                        name="address"
                        value={formData.profile?.teacher?.address || ''}
                        onChange={handleChange}
                        disabled={!isEditing}
                        multiline
                        rows={2}
                        size="small"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="About"
                        name="about"
                        value={formData.profile?.teacher?.about || ''}
                        onChange={handleChange}
                        disabled={!isEditing}
                        multiline
                        rows={3}
                        size="small"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Box display="flex" gap={1}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          label="Phone Visibility"
                          name="phone_hide"
                          select
                          SelectProps={{ native: true }}
                          value={formData.profile?.teacher?.phone_hide || false}
                          onChange={handleChange}
                          disabled={!isEditing}
                          size="small"
                        >
                          <option value={false}>Visible</option>
                          <option value={true}>Hidden</option>
                        </TextField>

                        <TextField
                          fullWidth
                          variant="outlined"
                          label="Address Visibility"
                          name="address_hide"
                          select
                          SelectProps={{ native: true }}
                          value={formData.profile?.teacher?.address_hide || false}
                          onChange={handleChange}
                          disabled={!isEditing}
                          size="small"
                        >
                          <option value={false}>Visible</option>
                          <option value={true}>Hidden</option>
                        </TextField>
                      </Box>
                    </Grid>

                    {isEditing && (
                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          fullWidth
                          onClick={handleSubmit}
                          disabled={loading}
                        >
                          {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              )}

              {value === 'three' && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h5" gutterBottom>
                    Experience
                  </Typography>

                  {formData.profile?.experience?.map((exp, index) => (
                    <React.Fragment key={index}>
                      <Grid container spacing={2} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            variant="outlined"
                            label="Institution Name"
                            name="institution_name"
                            value={exp.institution_name || ''}
                            onChange={(e) => handleExperienceChange(e, index)}
                            disabled={!isEditing}
                            size="small"
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            variant="outlined"
                            label="Designation"
                            name="designation"
                            value={exp.designation || ''}
                            onChange={(e) => handleExperienceChange(e, index)}
                            disabled={!isEditing}
                            size="small"
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            variant="outlined"
                            label="Department"
                            name="department"
                            value={exp.department || ''}
                            onChange={(e) => handleExperienceChange(e, index)}
                            disabled={!isEditing}
                            size="small"
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            variant="outlined"
                            label="Start Date"
                            name="start_date"
                            type="date"
                            value={exp.start_date || ''}
                            onChange={(e) => handleExperienceChange(e, index)}
                            disabled={!isEditing}
                            size="small"
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            variant="outlined"
                            label="End Date"
                            name="end_date"
                            type="date"
                            value={exp.end_date || ''}
                            onChange={(e) => handleExperienceChange(e, index)}
                            disabled={!isEditing}
                            size="small"
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            variant="outlined"
                            label="Description"
                            name="description"
                            value={exp.description || ''}
                            onChange={(e) => handleExperienceChange(e, index)}
                            disabled={!isEditing}
                            multiline
                            rows={3}
                            size="small"
                          />
                        </Grid>

                        {isEditing && (
                          <Grid item xs={12} sx={{ display: 'flex', gap: 2 }}>
                            <Button
                              variant="outlined"
                              onClick={handleAddExperience}
                              disabled={!isEditing}
                            >
                              Add Experience
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              onClick={() => handleRemoveExperience(index)}
                              disabled={!isEditing || formData.profile.experience.length <= 1}
                            >
                              Remove
                            </Button>
                          </Grid>
                        )}
                      </Grid>
                    </React.Fragment>
                  ))}

                  {isEditing && (
                    <Grid item xs={12} sx={{ mt: 2 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleSubmit}
                        disabled={loading}
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </Grid>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        </Paper>

        <Snackbar
          open={message.open}
          autoHideDuration={6000}
          onClose={handleCloseMessage}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          sx={{ bottom: { xs: 16, sm: 24 } }}
        >
          <Alert
            onClose={handleCloseMessage}
            severity={message.type}
            sx={{ width: '100%' }}
            variant="filled"
          >
            {message.text}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
};

export default ManageProfile;