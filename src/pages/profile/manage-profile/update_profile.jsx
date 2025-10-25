import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Container,
    Box,
    Typography,
    Paper,
    Avatar,
    TextField,
    Button,
    ThemeProvider,
    Tooltip,
    CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import theme from '../../../components/Theme';
import api from '../../../api';
import { setUser } from '../manage-profile/manage-profile';

const UpdateProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.user);
    const user = userData?.user;

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({});
    const [alertMessage, setAlertMessage] = useState(null);

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                institution_name: user.profile?.teacher?.institution_name || '',
                institution_type: user.profile?.teacher?.institution_type || '',
                designation: user.profile?.teacher?.designation || '',
                department: user.profile?.teacher?.department || '',
                teaching_experience: user.profile?.teacher?.teaching_experience || '',
                date_of_birth: user.profile?.teacher?.date_of_birth || '',
                gender: user.profile?.teacher?.gender || '',
                phone_number: user.profile?.teacher?.phone_number || '',
                address: user.profile?.teacher?.address || '',
                city: user.profile?.teacher?.city || '',
                country: user.profile?.teacher?.country || '',
                postal_code: user.profile?.teacher?.postal_code || '',
                about: user.profile?.teacher?.about || '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
    
        // Prepare payload
        const payload = {
            first_name: formData.first_name,
            last_name: formData.last_name,
            profile: {
                teacher: {  // Change `teacher_profile` to `teacher`
                    institution_name: formData.institution_name,
                    institution_type: formData.institution_type,
                    designation: formData.designation,
                    department: formData.department,
                    teaching_experience: formData.teaching_experience,
                    date_of_birth: formData.date_of_birth,
                    gender: formData.gender,
                    phone_number: formData.phone_number,
                    address: formData.address,
                    city: formData.city,
                    country: formData.country,
                    postal_code: formData.postal_code,
                    about: formData.about,
                },
                experience: formData.experience ? formData.experience.map(exp => ({
                    institution_name: exp.institution_name,
                    designation: exp.designation,
                    department: exp.department,
                    start_date: exp.start_date,
                    end_date: exp.end_date,
                    description: exp.description,
                })) : [],  // Ensure experience is an array
            }
        };
    
        try {
            const response = await api.put('/api/manage_profile/', payload, {
                headers: { "Content-Type": "application/json" }
            });
    
            if (response.status === 200) {
                alert("Profile updated successfully!");
                dispatch(setUser(response.data));
            }
        } catch (error) {
            console.error("Error updating profile:", error.response?.data);
            alert(`Failed to update profile: ${JSON.stringify(error.response?.data.errors)}`);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                institution_name: user.profile?.teacher?.institution_name || '',
                institution_type: user.profile?.teacher?.institution_type || '',
                designation: user.profile?.teacher?.designation || '',
                department: user.profile?.teacher?.department || '',
                teaching_experience: user.profile?.teacher?.teaching_experience || '',
                date_of_birth: user.profile?.teacher?.date_of_birth || '',
                gender: user.profile?.teacher?.gender || '',
                phone_number: user.profile?.teacher?.phone_number || '',
                address: user.profile?.teacher?.address || '',
                city: user.profile?.teacher?.city || '',
                country: user.profile?.teacher?.country || '',
                postal_code: user.profile?.teacher?.postal_code || '',
                about: user.profile?.teacher?.about || '',
                experience: user.profile?.experience || [] // Ensure experience is an array
            });
        }
    }, [user]);
        
    
    

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 4, background: 'linear-gradient(to right, #f8fafc, #e2e8f0)' }}>
                    <Typography variant="h4" fontWeight="bold" color="primary" mb={3}>Edit Profile</Typography>
                    {alertMessage && <Typography color="success.main" mb={2}>{alertMessage}</Typography>}
                    <form onSubmit={handleSubmit}>
                        <Box display="grid" gap={2}>
                            <TextField label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} fullWidth />
                            <TextField label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} fullWidth />
                            <TextField label="Institution Name" name="institution_name" value={formData.institution_name} onChange={handleChange} fullWidth />
                            <TextField label="Institution Type" name="institution_type" value={formData.institution_type} onChange={handleChange} fullWidth />
                            <TextField label="Designation" name="designation" value={formData.designation} onChange={handleChange} fullWidth />
                            <TextField label="Department" name="department" value={formData.department} onChange={handleChange} fullWidth />
                            <TextField label="Teaching Experience (Years)" name="teaching_experience" type="number" value={formData.teaching_experience} onChange={handleChange} fullWidth />
                            <TextField label="Date of Birth" name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
                            <TextField label="Gender" name="gender" value={formData.gender} onChange={handleChange} fullWidth />
                            <TextField label="Phone Number" name="phone_number" value={formData.phone_number} onChange={handleChange} fullWidth />
                            <TextField label="Address" name="address" value={formData.address} onChange={handleChange} fullWidth />
                            <TextField label="City" name="city" value={formData.city} onChange={handleChange} fullWidth />
                            <TextField label="Country" name="country" value={formData.country} onChange={handleChange} fullWidth />
                            <TextField label="Postal Code" name="postal_code" value={formData.postal_code} onChange={handleChange} fullWidth />
                            <TextField label="About" name="about" multiline rows={3} value={formData.about} onChange={handleChange} fullWidth />
                        </Box>
                        <Box display="flex" justifyContent="center" mt={3}>
                            <Button type="submit" variant="contained" color="primary" disabled={loading}>
                                {loading ? <CircularProgress size={24} /> : 'Update Profile'}
                            </Button>
                        </Box>
                    </form>
                </Paper>
            </Container>
        </ThemeProvider>
    );
};

export default UpdateProfile;