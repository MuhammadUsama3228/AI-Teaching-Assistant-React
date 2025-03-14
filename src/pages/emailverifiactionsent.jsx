import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';

const VerifyEmail = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5', 
      }}
    >
      <Paper
        sx={{
          padding: 4,
          maxWidth: 400,
          width: '100%',
          textAlign: 'center',
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: 'background.default', // Use MUI default background
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', marginBottom: 3 }}>
          Verify Your Email
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', marginBottom: 3 }}>
          Hello User, check your inbox & click the link to activate your account!
        </Typography>
        
        <Box sx={{ marginBottom: 3 }}>
          <Box
            sx={{
              backgroundColor: '#e0f7fa',
             
              padding: 3,
              marginBottom: 2,
            }}
          >
            <EmailOutlinedIcon sx={{ fontSize: 60, color: '#00796b' }} />
          </Box>
        </Box>

        <Button
          variant="contained"
          color="primary"
          sx={{
            padding: '10px 20px',
            borderRadius: 25,
            fontWeight: 'bold',
            ':hover': { backgroundColor: '#0288d1' },
          }}
        >
          Resend Email
        </Button>
      </Paper>
    </Box>
  );
};

export default VerifyEmail;
