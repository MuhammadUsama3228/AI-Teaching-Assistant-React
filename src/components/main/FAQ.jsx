import React, { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button,
  IconButton,
} from '@mui/material';
import { ExpandMore, Close } from '@mui/icons-material';
import { motion } from 'framer-motion';

const FAQSection = () => {
  const [isOpen, setIsOpen] = useState(false);

  const faqItems = [
    {
      question: 'What is this application?',
      answer: 'This is an AI-powered application designed to assist teachers in improving their teaching experience. It offers personalized AI tools to streamline classroom activities.',
    },
    {
      question: 'How does the AI assistant work?',
      answer: 'The AI assistant helps automate repetitive tasks, suggests teaching strategies, and provides personalized feedback based on your teaching style and preferences.',
    },
    {
      question: 'Can I customize the AI assistant?',
      answer: 'Yes! You can personalize the AI assistant to suit your unique teaching methods and classroom environment by adjusting settings and preferences.',
    },
    {
      question: 'Is this application suitable for all subjects?',
      answer: 'Yes, the AI tools are designed to be adaptable to a variety of subjects and educational levels, helping you with anything from lesson planning to student engagement.',
    },
    {
      question: 'Is there a mobile version of the app?',
      answer: 'Currently, the app is designed for desktop use. However, a mobile version is in development and will be available soon.',
    },
    {
      question: 'How do I get started?',
      answer: 'Simply sign up, explore the available AI tools, and begin personalizing the assistant for your teaching needs. The app will guide you step by step.',
    },
    {
      question: 'Is my data safe with this application?',
      answer: 'Yes, we take data security seriously. All user data is encrypted and stored securely. We adhere to strict privacy policies to protect your information.',
    },
  ];

  const toggleFAQ = () => {
    setIsOpen(!isOpen);
  };

  return (
      <Box sx={{ py: 10, backgroundColor: '#ffffff', position: 'relative' }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 4 }}>
            <Button
                variant="contained"
                onClick={toggleFAQ}
                sx={{
                  background: 'linear-gradient(to right, #8e24aa, #6a1b9a)',
                  color: 'white',
                  fontWeight: 'bold',
                  px: 2,
                  py: 1.5,
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(142, 36, 170, 0.4)',
                  ':hover': {
                    background: 'linear-gradient(to right, #6a1b9a, #8e24aa)',
                  },
                }}
            >
              {isOpen ? 'Hide FAQ' : 'Show FAQ'}
            </Button>
          </Box>

          {isOpen && (
              <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
              >
                <IconButton
                    onClick={toggleFAQ}
                    sx={{
                      position: 'absolute',
                      top: 40,
                      right: 40,
                      backgroundColor: '#d81b60',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#c2185b',
                      },
                    }}
                >
                  <Close />
                </IconButton>

                <Typography
                    variant="h4"
                    align="left"
                    gutterBottom
                    sx={{ fontWeight: 'bold', color: '#2e003e', mb: 2 }}
                >
                  Frequently Asked Questions
                </Typography>

                <Typography
                    variant="subtitle1"
                    align="left"
                    sx={{ color: '#2e003e', mb: 4 }}
                >
                  Get answers to your most common questions.
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    {faqItems.map((faq, index) => (
                        <Accordion
                            key={index}
                            sx={{
                              mb: 2,
                              backgroundColor: '#ffffff',
                              borderRadius: '12px',
                              boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                              '&:before': {
                                display: 'none',
                              },
                              '&:hover': {
                                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                              },
                            }}
                        >
                          <AccordionSummary expandIcon={<ExpandMore sx={{ color: '#8e24aa' }} />}>
                            <Typography fontWeight="bold" color="#2e003e">
                              {faq.question}
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography sx={{ color: '#4e4e4e' }}>
                              {faq.answer}
                            </Typography>
                          </AccordionDetails>
                        </Accordion>
                    ))}
                  </Grid>
                </Grid>
              </motion.div>
          )}
        </Container>
      </Box>
  );
};

export default FAQSection;
