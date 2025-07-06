import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Paper,
    CircularProgress,
    ThemeProvider,
    useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Player } from '@lottiefiles/react-lottie-player';
import api from '../api';
import theme from '../components/Theme';

const EmailVerification = () => {
    const location = useLocation();
    const email = location.state?.email || '';
    const muiTheme = useTheme();

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleResendVerification = async () => {
        if (!email) {
            setError('Email not found. Please go back and register again.');
            return;
        }

        setLoading(true);
        setMessage('');
        setError('');

        try {
            await api.post('/api/password/reset/', { email }); // Update with your actual endpoint
            setMessage('Verification email resent. Please check your inbox.');
        } catch (err) {
            setError(
                err.response?.data?.message || 'Failed to resend verification. Try again later.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box
                component={motion.div}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    background: muiTheme.palette.background.default,
                    p: 2,
                }}
            >
                <Paper
                    elevation={4}
                    sx={{
                        maxWidth: 440,
                        p: 4,
                        borderRadius: 3,
                        textAlign: 'center',
                        backgroundColor: muiTheme.palette.background.paper,
                    }}
                >
                    <Typography variant="h4" fontWeight="bold" color="primary" mb={2}>
                        Verify Your Email
                    </Typography>

                    <Typography variant="body1" color="text.secondary" mb={3}>
                        A verification link has been sent to <strong>{email}</strong>. Please check your inbox.
                    </Typography>

                    <Player
                        autoplay
                        loop
                        src="https://assets1.lottiefiles.com/packages/lf20_jcikwtux.json" // Email verify animation
                        style={{ height: '200px', width: '200px', marginBottom: '16px' }}
                    />

                    {message && <Typography color="success.main" mt={2}>{message}</Typography>}
                    {error && <Typography color="error.main" mt={2}>{error}</Typography>}

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                        <Button
                            variant="outlined"
                            onClick={handleResendVerification}
                            disabled={loading}
                            sx={{
                                mt: 3,
                                px: 4,
                                py: 1.5,
                                borderRadius: 30,
                                fontWeight: 'bold',
                                borderColor: 'primary.main',
                                backgroundColor: 'primary.main',
                                color: '#fff', // ✅ White text
                                '&:hover': {
                                    backgroundColor: 'primary.dark',
                                    borderColor: 'primary.dark',
                                },
                            }}
                        >
                            {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Resend Email'}
                        </Button>

                    </motion.div>
                </Paper>
            </Box>
        </ThemeProvider>
    );
};

export default EmailVerification;
