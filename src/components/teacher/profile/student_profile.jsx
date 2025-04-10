import React, { useState } from 'react';
import {
    TextField,
    Button,
    Typography,
    Container,
    Box,
    CircularProgress,
    ThemeProvider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Checkbox,
    Snackbar,
    Alert,
    Slider,
    Stepper,
    Step,
    StepLabel,
    Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../../../api';
import theme from '../../Theme';

const steps = ['Basic Info', 'Academic Details', 'Contact & Bio'];

const CreateStudentProfile = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        institution_name: '',
        date_of_birth: '',
        phone_number: '',
        country: '',
        institution_type: 'college',
        level: 'undergraduate',
        degree: '',
        year_of_study: 1,
        gender: 'other',
        phone_hide: true,
        address: '',
        city: '',
        postal_code: '',
        bio: '',
        address_hide: true
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [activeStep, setActiveStep] = useState(0);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckboxChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.checked });
    };

    const handleSliderChange = (e, newValue) => {
        setFormData({ ...formData, year_of_study: newValue });
    };

    const handleCloseSnackbar = () => {
        setSuccessMessage('');
        setErrorMessage('');
    };

    const handleNext = () => {
        if (activeStep < steps.length - 1) {
            setActiveStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        if (activeStep > 0) {
            setActiveStep((prev) => prev - 1);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/api/student-profiles/', formData);
            setSuccessMessage('Profile created successfully!');
            setErrors({});
            setTimeout(() => {
                navigate('/studentprofile');
            }, 1500);
        } catch (error) {
            if (error.response && error.response.data) {
                setErrors(error.response.data);
                setErrorMessage('Please correct the highlighted fields.');
            }
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return (
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Institution Name"
                                name="institution_name"
                                fullWidth
                                value={formData.institution_name}
                                onChange={handleChange}
                                required
                                margin="normal"
                                error={!!errors.institution_name}
                                helperText={errors.institution_name?.[0]}
                                variant="outlined" // Modern variant
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Date of Birth"
                                name="date_of_birth"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                value={formData.date_of_birth}
                                onChange={handleChange}
                                required
                                margin="normal"
                                error={!!errors.date_of_birth}
                                helperText={errors.date_of_birth?.[0]}
                                variant="outlined" // Modern variant
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth margin="normal" variant="outlined">
                                <InputLabel>Gender</InputLabel>
                                <Select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    label="Gender"
                                >
                                    <MenuItem value="male">Male</MenuItem>
                                    <MenuItem value="female">Female</MenuItem>
                                    <MenuItem value="other">Other</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                );
            case 1:
                return (
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormControl fullWidth margin="normal" variant="outlined">
                                <InputLabel>Institution Type</InputLabel>
                                <Select
                                    name="institution_type"
                                    value={formData.institution_type}
                                    onChange={handleChange}
                                    label="Institution Type"
                                >
                                    <MenuItem value="college">College</MenuItem>
                                    <MenuItem value="university">University</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth margin="normal" variant="outlined">
                                <InputLabel>Level</InputLabel>
                                <Select
                                    name="level"
                                    value={formData.level}
                                    onChange={handleChange}
                                    label="Level"
                                >
                                    <MenuItem value="undergraduate">Undergraduate</MenuItem>
                                    <MenuItem value="graduate">Graduate</MenuItem>
                                    <MenuItem value="postgraduate">Postgraduate</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Degree"
                                name="degree"
                                fullWidth
                                value={formData.degree}
                                onChange={handleChange}
                                required
                                margin="normal"
                                error={!!errors.degree}
                                helperText={errors.degree?.[0]}
                                variant="outlined" // Modern variant
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ mt: 2 }}>
                                <Typography gutterBottom>
                                    Year of Study: {formData.year_of_study}
                                </Typography>
                                <Slider
                                    value={formData.year_of_study}
                                    onChange={handleSliderChange}
                                    step={1}
                                    marks
                                    min={1}
                                    max={4}
                                    valueLabelDisplay="auto"
                                />
                            </Box>
                        </Grid>
                    </Grid>
                );
            case 2:
                return (
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Phone Number"
                                name="phone_number"
                                fullWidth
                                value={formData.phone_number}
                                onChange={handleChange}
                                required
                                margin="normal"
                                error={!!errors.phone_number}
                                helperText={errors.phone_number?.[0]}
                                variant="outlined" // Modern variant
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Country"
                                name="country"
                                fullWidth
                                value={formData.country}
                                onChange={handleChange}
                                required
                                margin="normal"
                                error={!!errors.country}
                                helperText={errors.country?.[0]}
                                variant="outlined" // Modern variant
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.phone_hide}
                                        onChange={handleCheckboxChange}
                                        name="phone_hide"
                                        color="primary" // Use primary color for better visibility
                                    />
                                }
                                label="Hide Phone Number"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Address"
                                name="address"
                                fullWidth
                                value={formData.address}
                                onChange={handleChange}
                                margin="normal"
                                variant="outlined" // Modern variant
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="City"
                                name="city"
                                fullWidth
                                value={formData.city}
                                onChange={handleChange}
                                margin="normal"
                                variant="outlined" // Modern variant
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Postal Code"
                                name="postal_code"
                                fullWidth
                                value={formData.postal_code}
                                onChange={handleChange}
                                margin="normal"
                                variant="outlined" // Modern variant
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Bio"
                                name="bio"
                                fullWidth
                                value={formData.bio}
                                onChange={handleChange}
                                multiline
                                rows={3}
                                margin="normal"
                                variant="outlined" // Modern variant
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.address_hide}
                                        onChange={handleCheckboxChange}
                                        name="address_hide"
                                        color="primary" // Use primary color for better visibility
                                    />
                                }
                                label="Hide Address"
                            />
                        </Grid>
                    </Grid>
                );
            default:
                return null;
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="sm" sx={{ padding: 4, backgroundColor: '#fff', boxShadow: 4, borderRadius: 4, marginBlockStart: '70px' }}>
                <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
                    Create Student Profile
                </Typography>

                <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <form onSubmit={handleSubmit}>
                    {renderStepContent()}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                        <Button disabled={activeStep === 0} onClick={handleBack}>Back</Button>
                        {activeStep === steps.length - 1 ? (
                            <Button type="submit" variant="contained" disabled={loading} color="primary">
                                {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Submit'}
                            </Button>
                        ) : (
                            <Button variant="contained" onClick={handleNext} color="primary">Next</Button>
                        )}
                    </Box>
                </form>

                <Snackbar open={!!successMessage} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                        {successMessage}
                    </Alert>
                </Snackbar>

                <Snackbar open={!!errorMessage} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                        {errorMessage}
                    </Alert>
                </Snackbar>
            </Container>
        </ThemeProvider>
    );
};

export default CreateStudentProfile;
