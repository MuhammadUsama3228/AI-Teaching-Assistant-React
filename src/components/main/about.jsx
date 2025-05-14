import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  Stack,
  useTheme
} from '@mui/material';
import { School, Computer, SchoolOutlined, Assignment, Assessment, Feedback } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
      <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 700 }}>
        About Our AI Teaching Assistant
      </Typography>

      <Typography variant="h6" align="center" sx={{ mb: 4, color: theme.palette.text.secondary }}>
        Revolutionizing education with AI-driven grading and feedback automation.
      </Typography>

      {/* Mission & Technology Cards */}
      <Grid container spacing={4}>
        {[{
          icon: <School />,
          title: 'Our Mission',
          description: `Our goal is to enhance the learning experience by automating grading and feedback through the power of Artificial Intelligence. We aim to save teachers' time and provide students with instant, personalized feedback, enabling a more efficient educational environment.`
        }, {
          icon: <Computer />,
          title: 'Our Technology',
          description: `Our platform uses the latest advancements in Natural Language Processing (NLP) and Machine Learning to automate grading and provide feedback on assignments. The system is designed to handle diverse assignment types, including essays, multiple-choice questions, coding assignments, and more.`
        }].map((item, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 3,
                boxShadow: 2,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 4,
                }
              }}
            >
              <CardContent>
                <Stack alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 80, height: 80 }}>
                    {item.icon}
                  </Avatar>
                  <Typography variant="h5" align="center" sx={{ fontWeight: 600 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body1" align="center" color="text.secondary">
                    {item.description}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Key Features */}
        <Grid item xs={12}>
          <Card
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: 3,
              boxShadow: 2,
              transition: 'box-shadow 0.3s ease',
              '&:hover': {
                boxShadow: 4,
              }
            }}
          >
            <CardContent>
              <Typography variant="h5" align="center" sx={{ fontWeight: 600, mb: 3 }}>
                Key Features
              </Typography>
              <Grid container spacing={3}>
                {[
                  {
                    icon: <SchoolOutlined sx={{ fontSize: 40 }} />,
                    title: 'Automated Grading',
                    text: 'Quickly grade assignments based on predefined rubrics with AI-powered evaluation.'
                  },
                  {
                    icon: <Computer sx={{ fontSize: 40 }} />,
                    title: 'Real-Time Feedback',
                    text: 'Provide students with real-time feedback, helping them improve faster.'
                  },
                  {
                    icon: <School sx={{ fontSize: 40 }} />,
                    title: 'Personalized Learning',
                    text: 'AI adapts to each student’s performance, offering personalized resources and feedback.'
                  }
                ].map((feature, idx) => (
                  <Grid item xs={12} md={4} key={idx}>
                    <Stack spacing={2} alignItems="center" textAlign="center">
                      <Box color="primary.main">{feature.icon}</Box>
                      <Typography variant="h6">{feature.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.text}
                      </Typography>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Flow Chart */}
        <Grid item xs={12}>
          <Card
            variant="outlined"
            sx={{
              p: 3,
              mt: 4,
              borderRadius: 3,
              boxShadow: 2,
              backgroundColor: '#f9f9f9',
            }}
          >
            <Typography variant="h5" align="center" sx={{ fontWeight: 600, mb: 4 }}>
              How It Works
            </Typography>
            <Grid container justifyContent="center" alignItems="center" spacing={4}>
              <Grid item>
                <Stack spacing={1} alignItems="center">
                  <Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60 }}>
                    <Assignment />
                  </Avatar>
                  <Typography variant="subtitle1" fontWeight={600}>Assignment</Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    Students submit their assignments (essays, quizzes, code, etc.).
                  </Typography>
                </Stack>
              </Grid>

              <Grid item>
                <Typography variant="h4" color="primary">➝</Typography>
              </Grid>

              <Grid item>
                <Stack spacing={1} alignItems="center">
                  <Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60 }}>
                    <Assessment />
                  </Avatar>
                  <Typography variant="subtitle1" fontWeight={600}>Sub-grade</Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    AI evaluates the assignment using custom rubrics and models.
                  </Typography>
                </Stack>
              </Grid>

              <Grid item>
                <Typography variant="h4" color="primary">➝</Typography>
              </Grid>

              <Grid item>
                <Stack spacing={1} alignItems="center">
                  <Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60 }}>
                    <Feedback />
                  </Avatar>
                  <Typography variant="subtitle1" fontWeight={600}>Feedback</Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    Students receive personalized feedback instantly to improve learning.
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        {/* CTA Button */}
        <Grid item xs={12}>
          <Box mt={6} textAlign="center">
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/login')}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 8,
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: 2,
                '&:hover': {
                  boxShadow: 4,
                }
              }}
            >
              Learn More
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AboutUs;
