import React, { useState, useEffect } from 'react';
import {
    TextField, Button, Typography, Container, Box,
    CircularProgress, Grid, ThemeProvider, useTheme
} from '@mui/material';
import { motion } from "framer-motion";
import { DotLottiePlayer } from '@dotlottie/react-player';
import '@dotlottie/react-player/dist/index.css';

import api from "../api";
import theme from '../components/Theme';
import { useNavigate } from 'react-router-dom';

function ForgetPassword() {
    useEffect(() => {
        document.title = "Forgot Password | AI Teaching Assistant";
    }, []);

    const navigate = useNavigate();
    const muiTheme = useTheme();

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await api.post('/api/password/reset/', { email });
            setSuccess('Password reset link has been sent to your email.');
            navigate('/verifyemail', { state: { email } });
        } catch (error) {
            console.error('API Error:', error.response ? error.response.data : error.message);
            setError(error.response?.data?.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Grid container sx={{ height: "100vh", p: { xs: 2, sm: 3 }, backgroundColor: muiTheme.palette.background.default }}>
                {/* Left Section: Form */}
                <Grid
                    item
                    xs={12}
                    md={6}
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
                                backgroundColor: muiTheme.palette.background.paper,
                            }}
                        >
                            <img src="src/assets/logo.png" alt="App Logo" width="100" style={{ marginBottom: 16 }} />

                            <Typography
                                variant="h5"
                                gutterBottom
                                sx={{
                                    fontWeight: 'bold',
                                    color: '#4B2E83',
                                    mb: 2,
                                    textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                                }}
                            >
                                Account Recovery
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
                                    size='small'
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
                                        backgroundColor: muiTheme.palette.primary.main,
                                        position: 'relative',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: muiTheme.palette.primary.dark,
                                        },
                                    }}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            Sending...
                                            <CircularProgress size={24} sx={{ ml: 2, color: 'white' }} />
                                        </>
                                    ) : (
                                        'Reset Password'
                                    )}
                                </Button>
                            </form>
                        </Box>
                    </Container>
                </Grid>

                {/* Right Section: Lottie Animation */}
                <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{
                        display: { xs: "none", md: "flex" },
                        alignItems: "center",
                        justifyContent: "center",
                        background: '#4B2E83',
                    }}
                >
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0, y: 30 },
                            visible: {
                                opacity: 1,
                                y: 0,
                                transition: {
                                    staggerChildren: 0.4,
                                    duration: 1,
                                    ease: 'easeOut'
                                }
                            }
                        }}
                        style={{ textAlign: 'center' }}
                    >
                        <motion.div
                            variants={{
                                hidden: { scale: 0.8, opacity: 0 },
                                visible: { scale: 1, opacity: 1 }
                            }}
                        >
                            <DotLottiePlayer
                                src="https://lottie.host/f7872137-ad6b-41ed-b110-84be07b63f9d/9ceTNhZoFR.lottie"
                                autoplay
                                loop
                                style={{ height: 300, width: 300, marginBottom: 16 }}
                            />
                        </motion.div>

                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 }
                            }}
                        >
                            <Typography
                                variant="h5"
                                sx={{
                                    color: 'white',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                }}
                            >
                                Reset Your Password
                            </Typography>
                        </motion.div>
                    </motion.div>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}

export default ForgetPassword;
