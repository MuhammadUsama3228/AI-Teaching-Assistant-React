import React, { useState, useEffect } from 'react';
import {
    Typography,
    Container,
    Box,
    TextField,
    Button,
    Grid,
    Snackbar,
    Alert,
    Skeleton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import api from '../../../../api'; // Adjust your path here

const StyledContainer = styled(Container)(({ theme }) => ({
    maxWidth: 'md',
    paddingTop: '4rem',
    paddingBottom: '2rem',
}));

const StyledCard = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
}));

const ActionButton = styled(Button)(({ theme }) => ({
    textTransform: 'capitalize',
    fontWeight: '600',
    borderRadius: '50px',
    padding: theme.spacing(1.5, 3),
    margin: theme.spacing(1),
}));

const ManageProfile = ({ userData }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        institution_name: '',
        slug: '',
        institution_type: '',
        level: '',
        degree: '',
        year_of_study: '',
        date_of_birth: '',
        gender: '',
        phone_number: '',
        phone_hide: false,
        address: '',
        address_hide: false,
        city: '',
        country: '',
        postal_code: '',
        bio: '',
    });

    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (userData && userData.profile) {
            setFormData({
                institution_name: userData.profile.institution_name || '',
                slug: userData.profile.slug || '',
                institution_type: userData.profile.institution_type || '',
                level: userData.profile.level || '',
                degree: userData.profile.degree || '',
                year_of_study: userData.profile.year_of_study || '',
                date_of_birth: userData.profile.date_of_birth || '',
                gender: userData.profile.gender || '',
                phone_number: userData.profile.phone_number || '',
                phone_hide: userData.profile.phone_hide || false,
                address: userData.profile.address || '',
                address_hide: userData.profile.address_hide || false,
                city: userData.profile.city || '',
                country: userData.profile.country || '',
                postal_code: userData.profile.postal_code || '',
                bio: userData.profile.bio || '',
            });
        }
        setLoading(false);
    }, [userData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess('');
        setError('');

        try {
            await api.patch('/api/manage_profile/', formData); // adjust API path
            setSuccess('Profile updated successfully!');
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <StyledContainer>
                <StyledCard>
                    <Skeleton variant="text" width="60%" height={40} sx={{ marginBottom: 2 }} />
                    <Grid container spacing={2}>
                        {Array.from({ length: 10 }).map((_, index) => (
                            <Grid item xs={12} key={index}>
                                <Skeleton variant="rectangular" height={56} />
                            </Grid>
                        ))}
                    </Grid>
                </StyledCard>
            </StyledContainer>
        );
    }

    return (
        <StyledContainer>
            <StyledCard>
                <Typography variant="h5" mb={3}>Manage Profile</Typography>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Institution Name" name="institution_name" value={formData.institution_name} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Slug" name="slug" value={formData.slug} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Institution Type" name="institution_type" value={formData.institution_type} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Level" name="level" value={formData.level} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Degree" name="degree" value={formData.degree} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth type="number" label="Year of Study" name="year_of_study" value={formData.year_of_study} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth type="date" label="Date of Birth" name="date_of_birth" InputLabelProps={{ shrink: true }} value={formData.date_of_birth} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Gender" name="gender" value={formData.gender} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Phone Number" name="phone_number" value={formData.phone_number} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Address" name="address" value={formData.address} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="City" name="city" value={formData.city} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Country" name="country" value={formData.country} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Postal Code" name="postal_code" value={formData.postal_code} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth multiline rows={4} label="Bio" name="bio" value={formData.bio} onChange={handleChange} />
                        </Grid>
                    </Grid>

                    <Box display="flex" justifyContent="flex-end" mt={3}>
                        <ActionButton variant="outlined" color="secondary" onClick={() => navigate(-1)}>
                            Cancel
                        </ActionButton>
                        <ActionButton variant="contained" color="primary" type="submit">
                            Save Changes
                        </ActionButton>
                    </Box>
                </form>
            </StyledCard>

            <Snackbar open={Boolean(success)} autoHideDuration={6000} onClose={() => setSuccess('')}>
                <Alert onClose={() => setSuccess('')} severity="success">
                    {success}
                </Alert>
            </Snackbar>

            <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setError('')}>
                <Alert onClose={() => setError('')} severity="error">
                    {error}
                </Alert>
            </Snackbar>
        </StyledContainer>
    );
};

export default ManageProfile;
