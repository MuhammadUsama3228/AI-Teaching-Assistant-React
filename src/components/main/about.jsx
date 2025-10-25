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
    Stack
} from '@mui/material';
import {
    School,
    Computer,
    SchoolOutlined,
    Assignment,
    Assessment,
    Feedback
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AboutUs = () => {
    const navigate = useNavigate();

    // Gradient backgrounds per icon type
    const gradients = {
        mission: 'linear-gradient(135deg, #ff8c00, #ff7043)',
        tech: 'linear-gradient(135deg, #00c6ff, #0072ff)',
        grading: 'linear-gradient(135deg, #42a5f5, #1e88e5)',
        feedback: 'linear-gradient(135deg, #ab47bc, #8e24aa)',
        recommend: 'linear-gradient(135deg, #66bb6a, #388e3c)'
    };

    return (
        <>
            {/* 🔹 Hero Section */}
            <Box
                sx={{
                    py: 10,
                    background: 'linear-gradient(135deg, #1a001f, #3f0071)',
                    color: '#fff',
                    textAlign: 'center'
                }}
            >
                <Container maxWidth="md">
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Typography variant="h3" fontWeight={700} gutterBottom>
                            Empowering Educators with AI
                        </Typography>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.2 }}
                    >
                        <Typography variant="h6" sx={{ mb: 4, color: 'rgba(255,255,255,0.85)' }}>
                            Revolutionizing classrooms with AI-powered grading and feedback automation.
                        </Typography>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        <Button
                            variant="contained"
                            onClick={() => navigate('/login')}
                            sx={{
                                backgroundColor: '#ffffff',
                                color: '#3f0071',
                                px: 4,
                                py: 1.5,
                                borderRadius: 8,
                                fontWeight: 600,
                                textTransform: 'none',
                                '&:hover': {
                                    backgroundColor: '#f3e5f5'
                                }
                            }}
                        >
                            Get Started
                        </Button>
                    </motion.div>
                </Container>
            </Box>

            {/* 🔹 About Section */}
            <Container maxWidth="lg" sx={{ mt: 10, mb: 10 }}>
                <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 700, color: '#3f0071' }}>
                    About Our AI Teaching Assistant
                </Typography>

                <Typography variant="h6" align="center" sx={{ mb: 6, color: '#6c6c6c' }}>
                    Learn how our intelligent assistant transforms the way educators grade, respond, and guide students.
                </Typography>

                {/* Mission & Tech Cards */}
                <Grid container spacing={4}>
                    {[
                        {
                            icon: <School />,
                            title: 'Our Mission',
                            description: `We aim to streamline teaching by reducing manual workload, freeing up time to focus on real student growth.`,
                            bg: gradients.mission
                        },
                        {
                            icon: <Computer />,
                            title: 'Our Technology',
                            description: `Powered by advanced NLP and ML models, we provide robust, adaptable grading and feedback mechanisms.`,
                            bg: gradients.tech
                        }
                    ].map((item, index) => (
                        <Grid item xs={12} md={6} key={index}>
                            <Card
                                sx={{
                                    backgroundColor: '#fdf6ff',
                                    p: 3,
                                    borderRadius: 4,
                                    boxShadow: 3,
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        transition: '0.4s ease',
                                        boxShadow: 6
                                    }
                                }}
                            >
                                <CardContent>
                                    <Stack alignItems="center" spacing={2}>
                                        <Avatar
                                            sx={{
                                                background: item.bg,
                                                width: 80,
                                                height: 80
                                            }}
                                        >
                                            {item.icon}
                                        </Avatar>
                                        <Typography variant="h5" fontWeight={600}>
                                            {item.title}
                                        </Typography>
                                        <Typography variant="body1" align="center" sx={{ color: '#5f5f5f' }}>
                                            {item.description}
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* 🔹 Key Features Section */}
                <Box mt={10}>
                    <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 700, color: '#3f0071' }}>
                        Key Features
                    </Typography>

                    <Grid container spacing={4} mt={2}>
                        {[
                            {
                                icon: <SchoolOutlined />,
                                title: 'Automated Grading',
                                text: 'Grade assignments at scale with AI-powered precision and objectivity.',
                                bg: gradients.grading
                            },
                            {
                                icon: <Feedback />,
                                title: 'Real-Time Feedback',
                                text: 'Deliver meaningful feedback instantly, reducing student wait times.',
                                bg: gradients.feedback
                            },
                            {
                                icon: <Assessment />,
                                title: 'Smart Recommendations',
                                text: 'AI identifies areas for improvement and suggests personalized actions.',
                                bg: gradients.recommend
                            }
                        ].map((feature, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <Card
                                    sx={{
                                        p: 3,
                                        textAlign: 'center',
                                        borderRadius: 4,
                                        backgroundColor: '#fafafa',
                                        boxShadow: 2,
                                        '&:hover': {
                                            boxShadow: 5,
                                            transform: 'translateY(-4px)',
                                            transition: '0.3s ease'
                                        }
                                    }}
                                >
                                    <Stack spacing={2} alignItems="center">
                                        <Avatar
                                            sx={{
                                                background: feature.bg,
                                                width: 64,
                                                height: 64
                                            }}
                                        >
                                            {feature.icon}
                                        </Avatar>
                                        <Typography variant="h6" fontWeight={600}>
                                            {feature.title}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#666' }}>
                                            {feature.text}
                                        </Typography>
                                    </Stack>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* 🔹 Flow Section */}
                <Box mt={10}>
                    <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 700, color: '#3f0071' }}>
                        How It Works
                    </Typography>

                    <Card
                        sx={{
                            mt: 4,
                            p: 4,
                            borderRadius: 4,
                            backgroundColor: '#f9f9f9',
                            boxShadow: 3
                        }}
                    >
                        <Grid container justifyContent="center" alignItems="center" spacing={5}>
                            {[
                                {
                                    icon: <Assignment />,
                                    label: 'Assignment',
                                    text: 'Students submit essays, quizzes, and projects.',
                                    bg: gradients.mission
                                },
                                {
                                    icon: <Assessment />,
                                    label: 'AI Grading',
                                    text: 'Assignments are evaluated with AI-based rubrics.',
                                    bg: gradients.grading
                                },
                                {
                                    icon: <Feedback />,
                                    label: 'Feedback',
                                    text: 'Students instantly receive personalized insights.',
                                    bg: gradients.feedback
                                }
                            ].map((step, i) => (
                                <React.Fragment key={i}>
                                    <Grid item>
                                        <Stack spacing={1} alignItems="center">
                                            <Avatar sx={{ bgcolor: step.bg, width: 60, height: 60 }}>
                                                {step.icon}
                                            </Avatar>
                                            <Typography variant="subtitle1" fontWeight={600}>
                                                {step.label}
                                            </Typography>
                                            <Typography variant="body2" align="center" color="text.secondary">
                                                {step.text}
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                    {i < 2 && (
                                        <Grid item>
                                            <Typography variant="h4" color="#3f0071">➝</Typography>
                                        </Grid>
                                    )}
                                </React.Fragment>
                            ))}
                        </Grid>
                    </Card>
                </Box>

                {/* 🔹 Call To Action */}
                <Box mt={8} textAlign="center">
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate('/login')}
                        sx={{
                            backgroundColor: '#3f0071',
                            color: '#fff',
                            px: 5,
                            py: 1.5,
                            borderRadius: 8,
                            fontWeight: 600,
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: '#5e2ea3'
                            }
                        }}
                    >
                        Try the Assistant Now
                    </Button>
                </Box>
            </Container>
        </>
    );
};

export default AboutUs;
