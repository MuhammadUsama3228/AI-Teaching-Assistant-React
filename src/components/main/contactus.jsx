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
  useTheme,
  Paper
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
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      <Typography variant="h4" align="center" sx={{ fontWeight: 700, mb: 4 }}>
        Contact Us
      </Typography>

      <Grid container spacing={4}>
        {/* Contact Info */}
        <Grid item xs={12} md={5}>
          <Card variant="outlined" sx={{ borderRadius: 3, boxShadow: 4, height: '100%' }}>
            <CardContent>
              <Stack spacing={3}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Get in Touch</Typography>
                <Box display="flex" alignItems="center">
                  <LocationOn color="primary" sx={{ mr: 2 }} />
                  <Typography variant="body1">123 AI Street, Tech City, TX 75000</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <Phone color="primary" sx={{ mr: 2 }} />
                  <Typography variant="body1">(123) 456-7890</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <Email color="primary" sx={{ mr: 2 }} />
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
                    sx={{ bgcolor: 'background.paper' }}
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
                    sx={{ bgcolor: 'background.paper' }}
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
                    sx={{ bgcolor: 'background.paper' }}
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
                      bgcolor: theme.palette.primary.main,
                      '&:hover': {
                        bgcolor: theme.palette.primary.dark,
                      }
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

      {/* Optional: Add some spacing or message after form */}
      <Box mt={5} sx={{ textAlign: 'center' }}>
        <Typography variant="h6" sx={{ color: theme.palette.text.secondary }}>
          We will get back to you as soon as possible.
        </Typography>
      </Box>
    </Container>
  );
};

export default ContactUs;
