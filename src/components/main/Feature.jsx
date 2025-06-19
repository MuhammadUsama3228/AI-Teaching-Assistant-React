import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { motion } from 'framer-motion';

const FeaturesSection = () => {
  const featureList = [
    {
      icon: "📝",
      title: "Automated Grading",
      description: "AI-powered grading system that saves time and ensures accuracy.",
      gradient: "linear-gradient(135deg, #ff6ec4, #7873f5)",
    },
    {
      icon: "📊",
      title: "Performance Insights",
      description: "Monitor student progress with smart dashboards and actionable analytics.",
      gradient: "linear-gradient(135deg, #42e695, #3bb2b8)",
    },
    {
      icon: "🔒",
      title: "Data Privacy",
      description: "Top-tier security to protect all academic records and personal data.",
      gradient: "linear-gradient(135deg, #fc6076, #ff9a44)",
    },
  ];

  return (
      <Box
          sx={{
            maxWidth: '1200px',
            mx: 'auto',
            py: 10,
            px: 3,
            textAlign: 'center',
          }}
      >
        <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            sx={{
              color: '#2e003e',
              mb: 6,
              textShadow: '0 3px 8px rgba(0,0,0,0.15)',
            }}
        >
          Features of Our AI Teaching Assistant
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {featureList.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    whileHover={{
                      scale: 1.03,
                      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
                    }}
                >
                  <Paper
                      elevation={4}
                      sx={{
                        borderRadius: '20px',
                        padding: 5,
                        height: '100%',
                        backdropFilter: 'blur(10px)',
                        background: 'rgba(255, 255, 255, 0.85)',
                        textAlign: 'center',
                        transition: '0.4s',
                      }}
                  >
                    <Box
                        sx={{
                          width: 72,
                          height: 72,
                          borderRadius: '50%',
                          background: feature.gradient,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: '2rem',
                          mx: 'auto',
                          mb: 3,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                          transition: 'all 0.3s ease-in-out',
                        }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: '#1e1e1e', mb: 1 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#555' }}>
                      {feature.description}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
          ))}
        </Grid>
      </Box>
  );
};

export default FeaturesSection;
