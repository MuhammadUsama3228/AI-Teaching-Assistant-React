import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box, CircularProgress, ThemeProvider, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../../../api';
import theme from '../../Theme';


const CreateTeacherProfile = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        institution_name: '',
        date_of_birth: '',
        phone_number: '',
        country: '',
        institution_type: 'school',
        designation: '',
        department: '',
        teaching_experience: '',
        gender: 'other',
        phone_hide: true,
        address: '',
        city: '',
        postal_code: '',
        about: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckboxChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.checked });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/api/teacher-profiles/', formData);
            console.log('Profile created successfully', response.data);
            setErrors({});
            navigate('/manage-profile');
        } catch (error) {
            if (error.response && error.response.data) {
                setErrors(error.response.data);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="sm" sx={{ padding: '2rem', backgroundColor: '#fff', boxShadow: 3, borderRadius: 2 }}>
                <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
                    Create Teacher Profile
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField label="Institution Name" name="institution_name" fullWidth value={formData.institution_name} onChange={handleChange} required margin="normal" error={!!errors.institution_name} helperText={errors.institution_name?.[0]} />
                    <TextField label="Date of Birth" name="date_of_birth" type="date" InputLabelProps={{ shrink: true }} fullWidth value={formData.date_of_birth} onChange={handleChange} required margin="normal" error={!!errors.date_of_birth} helperText={errors.date_of_birth?.[0]} />
                    <TextField label="Phone Number" name="phone_number" fullWidth value={formData.phone_number} onChange={handleChange} required margin="normal" error={!!errors.phone_number} helperText={errors.phone_number?.[0]} />
                    <TextField label="Country" name="country" fullWidth value={formData.country} onChange={handleChange} required margin="normal" error={!!errors.country} helperText={errors.country?.[0]} />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Institution Type</InputLabel>
                        <Select name="institution_type" value={formData.institution_type} onChange={handleChange}>
                            <MenuItem value="school">School</MenuItem>
                            <MenuItem value="college">College</MenuItem>
                            <MenuItem value="university">University</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField label="Designation" name="designation" fullWidth value={formData.designation} onChange={handleChange} required margin="normal" error={!!errors.designation} helperText={errors.designation?.[0]} />
                    <TextField label="Department" name="department" fullWidth value={formData.department} onChange={handleChange} margin="normal" />
                    <TextField label="Teaching Experience" name="teaching_experience" type="number" fullWidth value={formData.teaching_experience} onChange={handleChange} required margin="normal" error={!!errors.teaching_experience} helperText={errors.teaching_experience?.[0]} />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Gender</InputLabel>
                        <Select name="gender" value={formData.gender} onChange={handleChange}>
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControlLabel control={<Checkbox checked={formData.phone_hide} onChange={handleCheckboxChange} name="phone_hide" />} label="Hide Phone Number" />
                    <TextField label="Address" name="address" fullWidth value={formData.address} onChange={handleChange} margin="normal" />
                    <TextField label="City" name="city" fullWidth value={formData.city} onChange={handleChange} margin="normal" />
                    <TextField label="Postal Code" name="postal_code" fullWidth value={formData.postal_code} onChange={handleChange} margin="normal" />
                    <TextField label="About" name="about" fullWidth value={formData.about} onChange={handleChange} multiline rows={3} margin="normal" />
                    <Box sx={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
                        <Button variant="contained" color="primary" type="submit" disabled={loading} sx={{ padding: '10px 20px', fontSize: '16px', textTransform: 'none', borderRadius: '30px' }}>
                            {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Create Profile'}
                        </Button>
                    </Box>
                </form>
            </Container>
        </ThemeProvider>
    );
};

export default CreateTeacherProfile;