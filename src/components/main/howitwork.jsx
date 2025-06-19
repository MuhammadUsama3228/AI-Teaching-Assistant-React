import React from 'react';
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Box,
  Tooltip,
} from '@mui/material';
import {
  Explore,
  Build,
  School,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const steps = [
  {
    title: 'Explore',
    description: 'Discover AI-powered tools tailored to your teaching needs.',
    icon: <Explore sx={{ fontSize: 42, color: 'white' }} />,
    tooltip: 'Browse tools to fit your teaching style.',
    gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)',
  },
  {
    title: 'Customize',
    description: 'Personalize the assistant to match your teaching approach.',
    icon: <Build sx={{ fontSize: 42, color: 'white' }} />,
    tooltip: 'Adjust settings to suit your needs.',
    gradient: 'linear-gradient(135deg, #8e2de2, #4a00e0)',
  },
  {
    title: 'Teach',
    description: 'Utilize your AI assistant to streamline your teaching process.',
    icon: <School sx={{ fontSize: 42, color: 'white' }} />,
    tooltip: 'Make teaching smoother and smarter.',
    gradient: 'linear-gradient(135deg, #ff4e50, #f9d423)',
  },
];

const HowItWorks = () => {
  return (
      <Box sx={{ py: 10, px: 3, background: '#f4f6fa' }}>
        <Container maxWidth="lg">
          <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
          >
            <Typography
                variant="h4"
                align="center"
                fontWeight="bold"
                sx={{ color: '#052649', mb: 2 }}
            >
              How It Works
            </Typography>
            <Typography
                variant="subtitle1"
                align="center"
                sx={{ mb: 6, color: '#5f6368' }}
            >
              Learn how our AI assistant transforms your teaching workflow.
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {steps.map((step, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <motion.div
                      whileHover={{ scale: 1.05 }}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.2 }}
                      viewport={{ once: true }}
                  >
                    <Card
                        elevation={4}
                        sx={{
                          borderRadius: 4,
                          backdropFilter: 'blur(12px)',
                          background: 'rgba(255, 255, 255, 0.85)',
                          p: 4,
                          height: '100%',
                          textAlign: 'center',
                          transition: '0.3s',
                        }}
                    >
                      <Tooltip title={step.tooltip} arrow>
                        <Box
                            sx={{
                              width: 80,
                              height: 80,
                              mx: 'auto',
                              mb: 3,
                              borderRadius: '50%',
                              background: step.gradient,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                            }}
                        >
                          {step.icon}
                        </Box>
                      </Tooltip>

                      <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, color: '#1e1e1e' }}>
                        {step.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#444' }}>
                        {step.description}
                      </Typography>
                    </Card>
                  </motion.div>
                </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
  );
};

export default HowItWorks;
