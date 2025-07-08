// ✅ Keep all your imports (same as before)
import React, { useState } from 'react';
import {
    Container, Typography, Box, Button, TextField, Stepper, Step, StepLabel,
    CircularProgress, ThemeProvider, Tabs, Tab, Paper, Snackbar, Alert, Slider,
    FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../../api';
import theme from '../../Theme';
import { useNavigate } from 'react-router-dom';

const steps = ['Basic Info', 'Professional Details', 'Contact, Bio & Experience'];

const CreateTeacherProfile = () => {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [profileData, setProfileData] = useState({
        institution_name: '', date_of_birth: '', phone_number: '', country: '',
        institution_type: 'school', designation: '', department: '', teaching_experience: 0,
        gender: 'other', phone_hide: true, address: '', city: '', postal_code: '', about: ''
    });

    const [experienceData, setExperienceData] = useState({
        institution_name: '', designation: '', department: '', start_date: '', end_date: '', description: ''
    });

    const [experienceList, setExperienceList] = useState([]);

    const handleProfileChange = (e) => setProfileData({ ...profileData, [e.target.name]: e.target.value });
    const handleExperienceChange = (e) => setExperienceData({ ...experienceData, [e.target.name]: e.target.value });
    const handleCheckboxChange = (e) => setProfileData({ ...profileData, [e.target.name]: e.target.checked });
    const handleSliderChange = (e, newValue) => setProfileData({ ...profileData, teaching_experience: newValue });

    const handleNext = () => setActiveStep((prev) => prev + 1);
    const handleBack = () => setActiveStep((prev) => prev - 1);

    const addExperienceToList = () => {
        const { institution_name, designation, department, start_date, end_date } = experienceData;
        if (institution_name && designation && department && start_date && end_date) {
            setExperienceList([...experienceList, { ...experienceData }]);
            setExperienceData({ institution_name: '', designation: '', department: '', start_date: '', end_date: '', description: '' });
        } else {
            setErrorMessage('Fill required experience fields before adding.');
        }
    };

    const deleteExperience = (index) => {
        const updated = [...experienceList];
        updated.splice(index, 1);
        setExperienceList(updated);
    };

    const handleFinalSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const profileRes = await api.post('/api/teacher-profiles/', profileData);
            const teacherId = profileRes.data.id;

            for (const exp of experienceList) {
                await api.post('/api/teacher-experience/', { ...exp, teacher: teacherId });
            }

            setSuccessMessage('Profile and experiences submitted!');
            setTimeout(() => navigate('/manage-profile'), 2000);
        } catch (err) {
            setErrorMessage('Submission failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return (
                    <>
                        <TextField name="institution_name" label="Institution Name" fullWidth margin="normal" value={profileData.institution_name} onChange={handleProfileChange} />
                        <TextField name="date_of_birth" label="Date of Birth" type="date" InputLabelProps={{ shrink: true }} fullWidth margin="normal" value={profileData.date_of_birth} onChange={handleProfileChange} />
                        <TextField name="phone_number" label="Phone Number" fullWidth margin="normal" value={profileData.phone_number} onChange={handleProfileChange} />
                        <TextField name="country" label="Country" fullWidth margin="normal" value={profileData.country} onChange={handleProfileChange} />
                    </>
                );
            case 1:
                return (
                    <>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Institution Type</InputLabel>
                            <Select name="institution_type" value={profileData.institution_type} onChange={handleProfileChange}>
                                <MenuItem value="school">School</MenuItem>
                                <MenuItem value="college">College</MenuItem>
                                <MenuItem value="university">University</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField name="designation" label="Designation" fullWidth margin="normal" value={profileData.designation} onChange={handleProfileChange} />
                        <TextField name="department" label="Department" fullWidth margin="normal" value={profileData.department} onChange={handleProfileChange} />
                        <Box mt={2}>
                            <Typography gutterBottom>Teaching Experience: {profileData.teaching_experience} years</Typography>
                            <Slider value={profileData.teaching_experience} onChange={handleSliderChange} min={0} max={40} step={1} valueLabelDisplay="auto" />
                        </Box>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Gender</InputLabel>
                            <Select name="gender" value={profileData.gender} onChange={handleProfileChange}>
                                <MenuItem value="male">Male</MenuItem>
                                <MenuItem value="female">Female</MenuItem>
                                <MenuItem value="other">Other</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControlLabel control={<Checkbox checked={profileData.phone_hide} onChange={handleCheckboxChange} name="phone_hide" />} label="Hide Phone Number" />
                    </>
                );
            case 2:
                return (
                    <>
                        <TextField name="address" label="Address" fullWidth margin="normal" value={profileData.address} onChange={handleProfileChange} />
                        <TextField name="city" label="City" fullWidth margin="normal" value={profileData.city} onChange={handleProfileChange} />
                        <TextField name="postal_code" label="Postal Code" fullWidth margin="normal" value={profileData.postal_code} onChange={handleProfileChange} />
                        <TextField name="about" label="About" fullWidth margin="normal" multiline rows={3} value={profileData.about} onChange={handleProfileChange} />

                        <Typography variant="h6" sx={{ mt: 3 }}>Teaching Experience</Typography>
                        <TextField name="institution_name" label="Institution Name" fullWidth margin="normal" value={experienceData.institution_name} onChange={handleExperienceChange} />
                        <TextField name="designation" label="Designation" fullWidth margin="normal" value={experienceData.designation} onChange={handleExperienceChange} />
                        <TextField name="department" label="Department" fullWidth margin="normal" value={experienceData.department} onChange={handleExperienceChange} />
                        <TextField name="start_date" label="Start Date" type="date" InputLabelProps={{ shrink: true }} fullWidth margin="normal" value={experienceData.start_date} onChange={handleExperienceChange} />
                        <TextField name="end_date" label="End Date" type="date" InputLabelProps={{ shrink: true }} fullWidth margin="normal" value={experienceData.end_date} onChange={handleExperienceChange} />
                        <TextField name="description" label="Description" fullWidth margin="normal" multiline rows={3} value={experienceData.description} onChange={handleExperienceChange} />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 2 }}>
                            <Button variant="outlined" onClick={addExperienceToList}>Add Experience</Button>
                        </Box>

                        {experienceList.map((exp, i) => (
                            <Paper key={i} sx={{ p: 2, mb: 2, position: 'relative' }}>
                                <Typography><strong>{exp.institution_name}</strong> — {exp.designation}</Typography>
                                <Typography>{exp.department} | {exp.start_date} - {exp.end_date}</Typography>
                                <Typography variant="body2">{exp.description}</Typography>
                                <Button onClick={() => deleteExperience(i)} size="small" color="error" sx={{ position: 'absolute', top: 8, right: 8 }}>
                                    <DeleteIcon />
                                </Button>
                            </Paper>
                        ))}
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
                <Box sx={{ background: 'linear-gradient(90deg, #4B2E83 0%, #6A1B9A 100%)', color: '#fff', py: 3, px: 2, textAlign: 'center' }}>
                    <Typography variant="h5" fontWeight="bold">Profile Dashboard</Typography>
                    <Typography variant="subtitle1">Manage your profile and teaching details</Typography>
                </Box>

                <Container maxWidth="md" sx={{ py: 5 }}>
                    <Typography variant="h4" fontWeight="bold" align="center" gutterBottom color="text.primary">Teacher Profile</Typography>
                    <Paper elevation={2} sx={{ mt: 4, p: 3, borderRadius: 3 }}>
                        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                            {steps.map((label) => (
                                <Step key={label}><StepLabel>{label}</StepLabel></Step>
                            ))}
                        </Stepper>
                        <form onSubmit={handleFinalSubmit}>
                            {renderStepContent()}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                                <Button disabled={activeStep === 0} onClick={handleBack}>Back</Button>
                                {activeStep === steps.length - 1 ? (
                                    <Button type="submit" variant="contained" disabled={loading}>
                                        {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Submit All'}
                                    </Button>
                                ) : (
                                    <Button variant="contained" onClick={handleNext}>Next</Button>
                                )}
                            </Box>
                        </form>
                    </Paper>
                </Container>

                <Snackbar open={!!successMessage} autoHideDuration={3000} onClose={() => setSuccessMessage('')}>
                    <Alert onClose={() => setSuccessMessage('')} severity="success">{successMessage}</Alert>
                </Snackbar>
                <Snackbar open={!!errorMessage} autoHideDuration={3000} onClose={() => setErrorMessage('')}>
                    <Alert onClose={() => setErrorMessage('')} severity="error">{errorMessage}</Alert>
                </Snackbar>
            </Box>
        </ThemeProvider>
    );
};

export default CreateTeacherProfile;
