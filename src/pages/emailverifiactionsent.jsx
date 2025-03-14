
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom'; // Get email from previous page
import { Box, Typography, Button, Paper, CircularProgress } from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { motion } from 'framer-motion';
import api from '../api'; // Axios instance

const VerifyEmail = () => {
  const location = useLocation();
  const email = location.state?.email || ''; // Get email passed from ForgetPassword.js

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResendEmail = async () => {
    if (!email) {
      setError('Email not found. Please go back and enter your email.');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      await api.post('/api/password/reset/', { email });
      setMessage('Password reset email has been resent. Check your inbox.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend email. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(to right, #2193b0, #6dd5ed)',
        padding: 2,
      }}
    >
      <Paper
        component={motion.div}
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        sx={{
          padding: 4,
          maxWidth: 420,
          textAlign: 'center',
          borderRadius: 3,
          boxShadow: 3,
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#fff', marginBottom: 3 }}>
          Verify Your Email
        </Typography>

        <Typography variant="body1" sx={{ color: '#e3f2fd', marginBottom: 3 }}>
          A verification email has been sent to <strong>{email}</strong>. Please check your inbox.
        </Typography>

        <motion.div animate={{ rotate: [0, -5, 5, -5, 5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <EmailOutlinedIcon sx={{ fontSize: 70, color: '#fff' }} />
        </motion.div>

        {message && <Typography sx={{ color: 'green', mt: 2 }}>{message}</Typography>}
        {error && <Typography sx={{ color: 'red', mt: 2 }}>{error}</Typography>}

        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleResendEmail}
            disabled={loading}
            sx={{
              mt: 3,
              padding: '12px 24px',
              borderRadius: 30,
              fontWeight: 'bold',
              backgroundColor: '#ff9800',
              color: 'white',
              ':hover': { backgroundColor: '#ff5722' },
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Resend Email'}
          </Button>
        </motion.div>
      </Paper>
    </Box>
  )
}
export default VerifyEmail;