import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(to right, #FFFFFFFF, #F5F7F6FF)', 
      
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
          boxShadow: '0px 4px 6px rgba(0, 0, 255, 0.5)', // Dark blue shadow
          backgroundColor: 'white',
         
        }}

      >
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333', marginBottom: 3 }}>
          Verify Your Email
        </Typography>

        <Typography variant="body1" sx={{ color: '#555', marginBottom: 3 }}>
          A verification email has been sent to <strong>{email}</strong>. Please check your inbox.
        </Typography>

        <motion.div animate={{ rotate: [0, -5, 5, -5, 5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <EmailOutlinedIcon sx={{ fontSize: 70, color: '#0C2E66FF' }} />
        </motion.div>

        {message && <Typography sx={{ color: '#34A853', mt: 2 }}>{message}</Typography>}
        {error && <Typography sx={{ color: '#EA4335', mt: 2 }}>{error}</Typography>}

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
         <Button
  variant="outlined"
  color="primary"
  onClick={handleResendEmail}
  disabled={loading}
  sx={{
    mt: 3,
    padding: '12px 24px',
    borderRadius: 30,
    fontWeight: 'bold',
    border: '2px solid #072A63FF',
    boxShadow: '3' ,// Outline color
    color: '#0F326BFF', // Text color
    ':hover': { 
      borderColor: '#357ae8', // Hover outline color
      color: '#357ae8', // Hover text color
    },
  }}
>
  {loading ? <CircularProgress size={24} sx={{ color: '#4285F4' }} /> : 'Resend Email'}
</Button>

        </motion.div>
      </Paper>
    </Box>
  );
};

export default VerifyEmail;
