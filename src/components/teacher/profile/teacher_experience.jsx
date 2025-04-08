import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Typography,
    Container,
    Box,
    CircularProgress,
    ThemeProvider,
    Stepper,
    Step,
    StepLabel,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Skeleton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../../api';
import theme from '../../Theme';

const steps = ['Basic Info', 'Professional Details', 'Additional Information'];

const TeacherExperienceForm = ({ userId }) => {
    const [teacherProfileId, setTeacherProfileId] = useState(null);
    const [formData, setFormData] = useState({
        institution_name: '',
        designation: '',
        department: '',
        start_date: '',
        end_date: '',
        description: '',
    });
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [experiences, setExperiences] = useState([]);
    const [loadingExperiences, setLoadingExperiences] = useState(true);
    const [activeStep, setActiveStep] = useState(0);

    const fetchTeacherProfile = async () => {
        try {
            const response = await api.get(`/api/teacher-profiles/?user=${userId}`);
            if (response.data.length > 0) {
                setTeacherProfileId(response.data[0].id);
                fetchExperiences(response.data[0].id);
            }
        } catch (error) {
            console.error('Error fetching teacher profile:', error);
        }
    };

    const fetchExperiences = async (teacherId) => {
        setLoadingExperiences(true);
        try {
            const response = await api.get(`/api/teacher-experience/?teacher=${teacherId}`);
            setExperiences(response.data);
        } catch (error) {
            console.error('Error fetching experiences:', error);
        } finally {
            setLoadingExperiences(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchTeacherProfile();
        }
    }, [userId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage('');

        try {
            await api.post('/api/teacher-experience/', { teacher: teacherProfileId, ...formData });
            setSuccessMessage('Experience added successfully!');
            setFormData({
                institution_name: '',
                designation: '',
                department: '',
                start_date: '',
                end_date: '',
                description: '',
            });
            fetchExperiences(teacherProfileId);
            setActiveStep(0); // Reset to the first step
        } catch (error) {
            console.error('Error adding experience:', error);
        } finally {
            setLoading(false);
        }
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

    return (
        <ThemeProvider theme={theme}>
            <Box 
                display="flex" 
                justifyContent="center" 
                alignItems="center" 
                minHeight="100vh" // Take full height of the viewport
                sx={{ backgroundColor: '#f4f6f8' }} // Optional background color
            >
                <Container component="main" maxWidth="sm" sx={{ padding: '2rem', backgroundColor: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                    <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#202124' }}>
                        Add Teaching Experience
                    </Typography>
                    {successMessage && <Typography color="success.main" sx={{ mb: 2 }}>{successMessage}</Typography>}

                    <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    <form onSubmit={handleSubmit}>
                        {activeStep === 0 && (
                            <>
                                <TextField
                                    label="Institution Name"
                                    name="institution_name"
                                    fullWidth
                                    value={formData.institution_name}
                                    onChange={handleChange}
                                    required
                                    margin="normal"
                                    variant="outlined"
                                    sx={{ borderRadius: '8px' }}
                                />
                                <TextField
                                    label="Designation"
                                    name="designation"
                                    fullWidth
                                    value={formData.designation}
                                    onChange={handleChange}
                                    required
                                    margin="normal"
                                    variant="outlined"
                                    sx={{ borderRadius: '8px' }}
                                />
                            </>
                        )}
                        {activeStep === 1 && (
                            <>
                                <TextField
                                    label="Department"
                                    name="department"
                                    fullWidth
                                    value={formData.department}
                                    onChange={handleChange}
                                    margin="normal"
                                    variant="outlined"
                                    sx={{ borderRadius: '8px' }}
                                />
                                <TextField
                                    label="Start Date"
                                    name="start_date"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    value={formData.start_date}
                                    onChange={handleChange}
                                    required
                                    margin="normal"
                                    variant="outlined"
                                    sx={{ borderRadius: '8px' }}
                                />
                            </>
                        )}
                        {activeStep === 2 && (
                            <>
                                <TextField
                                    label="End Date (Leave blank if current)"
                                    name="end_date"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    value={formData.end_date}
                                    onChange={handleChange}
                                    margin="normal"
                                    variant="outlined"
                                    sx={{ borderRadius: '8px' }}
                                />
                                <TextField
                                    label="Description"
                                    name="description"
                                    fullWidth
                                    value={formData.description}
                                    onChange={handleChange}
                                    multiline
                                    rows={3}
                                    margin="normal"
                                    variant="outlined"
                                    sx={{ borderRadius: '8px' }}
                                />
                            </>
                        )}

                        <Box sx={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
                            <Button variant="contained" color="primary" onClick={handleBack} disabled={activeStep === 0}>
                                Back
                            </Button>
                            {activeStep === steps.length - 1 ? (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    disabled={loading}
                                    sx={{ padding: '10px 20px', fontSize: '16px', textTransform: 'none', borderRadius: '30px' }}
                                >
                                    {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Add Experience'}
                                </Button>
                            ) : (
                                <Button variant="contained" color="primary" onClick={handleNext}>
                                    Next
                                </Button>
                            )}
                        </Box>
                    </form>
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default TeacherExperienceForm;
