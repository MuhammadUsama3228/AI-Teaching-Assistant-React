import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Container, Box, CircularProgress, ThemeProvider, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../../api';
import theme from '../../Theme';

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
        try {
            const response = await api.get(`/api/teacher-experience/?teacher=${teacherId}`);
            setExperiences(response.data);
        } catch (error) {
            console.error('Error fetching experiences:', error);
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
            setFormData({ institution_name: '', designation: '', department: '', start_date: '', end_date: '', description: '' });
            fetchExperiences(teacherProfileId);
        } catch (error) {
            console.error('Error adding experience:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteExperience = async (id) => {
        try {
            await api.delete(`/api/teacher-experience/${id}/`);
            fetchExperiences(teacherProfileId);
        } catch (error) {
            console.error('Error deleting experience:', error);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="sm" sx={{ padding: '2rem', backgroundColor: '#fff', boxShadow: 3, borderRadius: 2 }}>
                <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
                    Add Teaching Experience
                </Typography>
                {successMessage && <Typography color="success.main" sx={{ mb: 2 }}>{successMessage}</Typography>}
                <form onSubmit={handleSubmit}>
                    <TextField label="Institution Name" name="institution_name" fullWidth value={formData.institution_name} onChange={handleChange} required margin="normal" />
                    <TextField label="Designation" name="designation" fullWidth value={formData.designation} onChange={handleChange} required margin="normal" />
                    <TextField label="Department" name="department" fullWidth value={formData.department} onChange={handleChange} margin="normal" />
                    <TextField label="Start Date" name="start_date" type="date" InputLabelProps={{ shrink: true }} fullWidth value={formData.start_date} onChange={handleChange} required margin="normal" />
                    <TextField label="End Date (Leave blank if current)" name="end_date" type="date" InputLabelProps={{ shrink: true }} fullWidth value={formData.end_date} onChange={handleChange} margin="normal" />
                    <TextField label="Description" name="description" fullWidth value={formData.description} onChange={handleChange} multiline rows={3} margin="normal" />
                    <Box sx={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
                        <Button variant="contained" color="primary" type="submit" disabled={loading} sx={{ padding: '10px 20px', fontSize: '16px', textTransform: 'none', borderRadius: '30px' }}>
                            {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Add Experience'}
                        </Button>
                    </Box>
                </form>

                <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: 'bold' }}>Previous Experiences</Typography>
                <List>
                    {experiences.map((exp) => (
                        <ListItem key={exp.id} divider>
                            <ListItemText primary={`${exp.designation} at ${exp.institution_name}`} secondary={`${exp.start_date} - ${exp.end_date || 'Present'}`} />
                            <IconButton edge="end" color="error" onClick={() => handleDeleteExperience(exp.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
            </Container>
        </ThemeProvider>
    );
};

export default TeacherExperienceForm;
