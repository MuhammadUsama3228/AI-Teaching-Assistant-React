import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Box,
  Stack,
  useTheme
} from '@mui/material';
import { Email, Phone, LocationOn } from '@mui/icons-material';

const ContactUs = () => {
  const theme = useTheme();
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const mailtoLink = `mailto:moeedpir330@gmail.com?subject=Contact Us: ${form.name}&body=Name: ${form.name}%0AEmail: ${form.email}%0AMessage: ${form.message}`;
    window.location.href = mailtoLink;
  };

  return (
      <>
        {/* 🔹 Hero Section */}
        <Box
            sx={{
              py: 10,
              background: 'linear-gradient(135deg, #1a001f, #3f0071)',
              color: '#fff',
              textAlign: 'center',
            }}
        >
          <Container maxWidth="md">
            <Typography
                variant="h3"
                fontWeight={700}
                gutterBottom
                sx={{
                  animation: 'fadeInDown 1s ease-out',
                  '@keyframes fadeInDown': {
                    '0%': { opacity: 0, transform: 'translateY(-20px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                  },
                }}
            >
              We'd Love to Hear From You
            </Typography>

            <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255,255,255,0.85)',
                  mb: 3,
                  animation: 'fadeInUp 1.2s ease-out',
                  '@keyframes fadeInUp': {
                    '0%': { opacity: 0, transform: 'translateY(20px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                  },
                }}
            >
              Whether you have a question, suggestion, or just want to say hello, our team is ready to help.
            </Typography>

            <Button
                variant="contained"
                size="large"
                href="#contact-form"
                sx={{
                  backgroundColor: '#ffffff',
                  color: '#3f0071',
                  px: 4,
                  py: 1.5,
                  borderRadius: 8,
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#f3e5f5',
                  },
                }}
            >
              Contact Us
            </Button>
          </Container>
        </Box>

        {/* 🔹 Contact Section */}
        <Container id="contact-form" maxWidth="md" sx={{ mt: 8, mb: 8 }}>
          <Typography variant="h4" align="center" sx={{ fontWeight: 700, mb: 4, color: '#3f0071' }}>
            Get in Touch
          </Typography>

          <Grid container spacing={4}>
            {/* Contact Info */}
            <Grid item xs={12} md={5}>
              <Card variant="outlined" sx={{ borderRadius: 3, boxShadow: 4, height: '100%' }}>
                <CardContent>
                  <Stack spacing={3}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#3f0071' }}>Contact Information</Typography>
                    <Box display="flex" alignItems="center">
                      <LocationOn sx={{ mr: 2, color: '#ff6f61' }} />
                      <Typography variant="body1">123 AI Street, Tech City, TX 75000</Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <Phone sx={{ mr: 2, color: '#009688' }} />
                      <Typography variant="body1">(123) 456-7890</Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <Email sx={{ mr: 2, color: '#3f51b5' }} />
                      <Typography variant="body1">support@aiteachingassistant.com</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Contact Form */}
            <Grid item xs={12} md={7}>
              <Card variant="outlined" sx={{ borderRadius: 3, boxShadow: 4 }}>
                <CardContent>
                  <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                      <TextField
                          label="Full Name"
                          name="name"
                          variant="outlined"
                          fullWidth
                          required
                          value={form.name}
                          onChange={handleChange}
                          sx={{
                            bgcolor: 'background.paper',
                            '& .MuiOutlinedInput-root:hover': {
                              '& fieldset': {
                                borderColor: '#8e2de2',
                              },
                            },
                          }}
                      />
                      <TextField
                          label="Email Address"
                          name="email"
                          type="email"
                          variant="outlined"
                          fullWidth
                          required
                          value={form.email}
                          onChange={handleChange}
                          sx={{
                            bgcolor: 'background.paper',
                            '& .MuiOutlinedInput-root:hover': {
                              '& fieldset': {
                                borderColor: '#8e2de2',
                              },
                            },
                          }}
                      />
                      <TextField
                          label="Message"
                          name="message"
                          variant="outlined"
                          fullWidth
                          multiline
                          rows={4}
                          required
                          value={form.message}
                          onChange={handleChange}
                          sx={{
                            bgcolor: 'background.paper',
                            '& .MuiOutlinedInput-root:hover': {
                              '& fieldset': {
                                borderColor: '#8e2de2',
                              },
                            },
                          }}
                      />
                      <Button
                          type="submit"
                          variant="contained"
                          size="large"
                          sx={{
                            alignSelf: 'flex-start',
                            borderRadius: 2,
                            px: 4,
                            fontWeight: 600,
                            textTransform: 'none',
                            background: 'linear-gradient(45deg, #8e2de2, #4a00e0)',
                            color: '#fff',
                            '&:hover': {
                              background: 'linear-gradient(45deg, #7b1fa2, #311b92)',
                            },
                          }}
                      >
                        Send Message
                      </Button>
                    </Stack>
                  </form>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Footer Message */}
          <Box mt={5} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: theme.palette.text.secondary }}>
              We will get back to you as soon as possible.
            </Typography>
          </Box>
        </Container>
      </>
  );
};

export default ContactUs;
