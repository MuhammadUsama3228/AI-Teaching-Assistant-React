import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';

const TeacherPortalFooter = () => {
  return (
    <Box sx={{ backgroundColor: '#052649', color: 'white', py: 4 }}>
      <Container>
        <Grid container spacing={4} justifyContent="space-between">
          {/* Left Section: About Us */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              About Teacher Portal
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Teacher Portal is designed to streamline the teaching experience, offering tools to manage courses, assignments, and communications seamlessly.
            </Typography>
            <Link href="#" color="inherit" sx={{ display: 'inline-block', mb: 1 }}>
              Learn More
            </Link>
          </Grid>

          {/* Middle Section: Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Quick Links
            </Typography>
            <Grid container direction="column" spacing={1}>
              <Grid item>
                <Link href="#" color="inherit" sx={{ textDecoration: 'none' }}>
                  Dashboard
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" color="inherit" sx={{ textDecoration: 'none' }}>
                  Courses
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" color="inherit" sx={{ textDecoration: 'none' }}>
                  Support
                </Link>
              </Grid>
            </Grid>
          </Grid>

          {/* Right Section: Social Media */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Follow Us
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <IconButton sx={{ backgroundColor: '#3b5998', color: 'white' }} aria-label="Facebook">
                <Facebook />
              </IconButton>
              <IconButton sx={{ backgroundColor: '#00acee', color: 'white' }} aria-label="Twitter">
                <Twitter />
              </IconButton>
              <IconButton sx={{ backgroundColor: '#E4405F', color: 'white' }} aria-label="Instagram">
                <Instagram />
              </IconButton>
              <IconButton sx={{ backgroundColor: '#0077b5', color: 'white' }} aria-label="LinkedIn">
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="inherit">
            &copy; {new Date().getFullYear()} Teacher Portal. All Rights Reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default TeacherPortalFooter;
