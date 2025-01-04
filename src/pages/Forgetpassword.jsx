import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box, Paper } from '@mui/material';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('api/password/reset/', { email });
      setMessage('If this email is registered, a password reset link has been sent.');
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Paper elevation={3} sx={{ padding: 3, width: '100%', maxWidth: 400, backgroundColor: '#f7f7f7' }}>
        <Typography variant="h5" align="center" sx={{ marginBottom: 2, color: '#019cb8', fontWeight: 'bold' }}>
          Forgot Password
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email Address"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ marginBottom: 2 }}
            InputLabelProps={{
              style: { color: '#019cb8' },
            }}
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth 
            disabled={loading} 
            sx={{
              backgroundColor: '#019cb8',
              '&:hover': { backgroundColor: '#017a8f' },
              padding: '10px 0',
              fontWeight: 'bold',
            }}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>
        {message && <Typography variant="body2" color={message.includes('error') ? 'error' : 'success'} align="center" sx={{ marginTop: 2 }}>{message}</Typography>}
      </Paper>
    </Container>
  );
};

export default ForgotPassword;
