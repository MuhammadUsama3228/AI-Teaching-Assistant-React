import React, { useEffect, useState } from 'react';
import {
    TextField, Button, Typography, Container, Box, CircularProgress, ThemeProvider,
    FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox, Snackbar,
    Alert, Slider, Stepper, Step, StepLabel, Grid
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../api';
import theme from '../../Theme';

const steps = ['Basic Info', 'Academic Details', 'Contact & Bio'];

const UpdateStudentProfile = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // student profile ID from URL
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
    const [fetching, setFetching] = useState(true);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get(`/api/student-profiles/${id}/`);
                setFormData(res.data);
            } catch (error) {
                setErrorMessage('Failed to load profile data.');
            } finally {
                setFetching(false);
            }
        };
        fetchProfile();
    }, [id]);

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
            const response = await api.put(`/api/student-profiles/${id}/`, formData);
            setSuccessMessage('Profile updated successfully!');
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
        // Same renderStepContent function you already have
        // You can paste the same as in your original code
        // To keep this short, I'll skip re-pasting it here unless you want it again
        return null;
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="sm" sx={{ padding: 4, backgroundColor: '#fff', boxShadow: 4, borderRadius: 4, marginBlockStart: '70px' }}>
                <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
                    Update Student Profile
                </Typography>

                {fetching ? (
                    <Box display="flex" justifyContent="center" mt={5}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
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
                                        {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Update'}
                                    </Button>
                                ) : (
                                    <Button variant="contained" onClick={handleNext} color="primary">Next</Button>
                                )}
                            </Box>
                        </form>
                    </>
                )}

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

export default UpdateStudentProfile;
