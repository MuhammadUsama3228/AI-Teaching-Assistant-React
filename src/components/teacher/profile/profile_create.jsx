import React, { useState } from 'react';
import { TextField, Button, Grid, Box, Typography, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';

const TeacherProfileForm = () => {
  // Step tracking state
  const [activeStep, setActiveStep] = useState(0);

  // Profile form fields
  const [institutionName, setInstitutionName] = useState('');
  const [institutionType, setInstitutionType] = useState('school');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('');

  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('other');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [about, setAbout] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const profileData = {
      institution_name: institutionName,
      institution_type: institutionType,
      designation: designation,
      department: department,
    
      date_of_birth: dateOfBirth,
      gender: gender,
      phone_number: phoneNumber,
      address: address,
      city: city,
      country: country,
      postal_code: postalCode,
      about: about,
    };

    try {
      const response = await axios.post('api/manage_profile/', profileData);
      console.log('Profile created:', response.data);
      // Handle success (redirect or show message)
    } catch (error) {
      console.error('Error creating profile:', error);
      // Handle error (show error message)
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>Create Teacher Profile</Typography>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Basic Profile Information */}
        {activeStep === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Institution Name"
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Institution Type</InputLabel>
                <Select
                  value={institutionType}
                  onChange={(e) => setInstitutionType(e.target.value)}
                  required
                >
                  <MenuItem value="school">School</MenuItem>
                  <MenuItem value="college">College</MenuItem>
                  <MenuItem value="university">University</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Designation"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        )}

        {/* Step 2: Personal & Contact Information */}
        {activeStep === 1 && (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Postal Code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="About"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
        )}

        {/* Navigation Buttons */}
        <Box display="flex" justifyContent="space-between" mt={4}>
          {activeStep > 0 && (
            <Button variant="outlined" color="secondary" onClick={() => setActiveStep(activeStep - 1)}>
              Back
            </Button>
          )}
          {activeStep < 1 ? (
            <Button variant="contained" color="primary" onClick={() => setActiveStep(activeStep + 1)}>
              Next
            </Button>
          ) : (
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          )}
        </Box>
      </form>
    </Box>
  );
};

export default TeacherProfileForm;
