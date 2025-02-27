import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Container, Box, CircularProgress, Grid } from '@mui/material';
import { motion } from "framer-motion";
import api from "../api"; // Axios instance
import theme from '../components/Theme'; // Custom MUI Theme
import { ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { StaticDatePicker } from '@mui/lab';

function ForgetPassword() {
    useEffect(() => {
        document.title = "Forgot Password | AI Teaching Assistant";
    }, []);

    const navigate = useNavigate(); 
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        console.log('Submitting email:', email); 

        try {
            const response = await api.post('/api/password/reset/', { email });
            console.log('API Response:', response.data); 
            setSuccess('Password reset link has been sent to your email.');
            
            
            navigate('/verifyemail' ,{ state: { email } });
        } catch (error) {
            console.error('API Error:', error.response ? error.response.data : error.message);
            setError(error.response?.data?.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Grid container sx={{ height: "100vh", p: { xs: 2, sm: 3 } }}>
                
                {/* Left Side - Form */}
                <Grid 
                    item 
                    xs={12} md={6} 
                    sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                    <Container 
                        maxWidth={false} 
                        sx={{ 
                            width: { xs: "95%", sm: "80%", md: "60%", lg: "45%" },
                            padding: 3
                        }}
                    >
                        <Box
                            component={motion.div}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: { xs: 2, sm: 3 },
                                boxShadow: 2,
                                borderRadius: 2,
                                width: "100%",
                                backgroundColor: "white",
                            }}
                        >
                            <Typography variant="h5" gutterBottom>
                                Forgot Password?
                            </Typography>

                            {error && (
                                <Typography color="error" variant="body2" gutterBottom>
                                    {error}
                                </Typography>
                            )}

                            {success && (
                                <Typography color="success.main" variant="body2" gutterBottom>
                                    {success}
                                </Typography>
                            )}

                            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                                <TextField
                                    label="Enter your email"
                                    type="email"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />

                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    sx={{
                                        mt: 2,
                                        backgroundColor: 'primary.main',
                                        position: 'relative',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        color: 'white',
                                    }}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            Sending...
                                            <CircularProgress size={24} style={{ marginLeft: 3 }} />
                                        </>
                                    ) : (
                                        'Reset Password'
                                    )}
                                </Button>
                            </form>
                        </Box>
                    </Container>
                </Grid>

                {/* Right Side - Image / Design */}
                <Grid 
                    item 
                    xs={12} md={6} 
                    sx={{ 
                        display: { xs: "none", md: "flex" }, 
                        alignItems: "center", 
                        justifyContent: "center", 
                        background: "rgb(6, 52, 79)" 
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: "bold",
                                color: "white",
                                textAlign: "center",
                                fontFamily: "Poppins, sans-serif",
                                textTransform: "uppercase",
                                letterSpacing: "2px",
                                marginBottom: "20px",
                            }}
                        >
                            AI Teaching Assistant
                        </Typography>
                    </motion.div>
                </Grid>

            </Grid>
        </ThemeProvider>
    );
}

export default ForgetPassword;
