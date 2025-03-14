import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Paper, Box } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ResetPassword = () => {
  const { uidb64, token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `/api/password/reset/confirm/${uidb64}/${token}/`,
        { password }
      );
      setMessage('Your password has been reset successfully!');
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Paper elevation={4} sx={{ padding: 4, width: '100%', maxWidth: 400, backgroundColor: '#f7f7f7' }}>
        <Typography variant="h5" align="center" sx={{ marginBottom: 3, color: '#019cb8', fontWeight: 'bold' }}>
          Reset Password
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="New Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ marginBottom: 2 }}
            InputLabelProps={{
              style: { color: '#019cb8' },
            }}
          />
          <TextField
            label="Confirm New Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
        {message && (
          <Typography
            variant="body2"
            align="center"
            sx={{
              marginTop: 2,
              color: message.includes('success') ? 'green' : 'red',
              fontWeight: 'bold',
            }}
          >
            {message}
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default ResetPassword;
