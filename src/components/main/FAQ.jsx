import React, { useState } from 'react';
import { Container, Grid, Typography, Accordion, AccordionSummary, AccordionDetails, Box, Button, IconButton } from '@mui/material';
import { ExpandMore, Close } from '@mui/icons-material';

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
    <Box sx={{ py: 5, backgroundColor: '#f9f9f9' }}>
      <Button
        variant="contained"
        onClick={toggleFAQ}
        sx={{ mb: 4, backgroundColor: '#052649', color: 'white' }}
      >
        {isOpen ? 'Hide FAQ' : 'Show FAQ'}
      </Button>

      {/* Display close icon button only when the FAQ is open */}
      {isOpen && (
        <IconButton
          onClick={toggleFAQ}
          sx={{
            position: 'absolute',
            top: '10%',
            right: '5%',
            backgroundColor: '#ff0000',
            color: 'white',
            zIndex: 1100,
            padding: '10px',
          }}
        >
          <Close />
        </IconButton>
      )}

      {/* FAQ Section: Initially hidden, shown when isOpen is true */}
      <Box
        sx={{
          display: isOpen ? 'block' : 'none', // Hide FAQ content until isOpen is true
          padding: isOpen ? '16px' : '0', // Add padding only when open
        }}
      >
        <Container sx={{ ml: 0 }}>
          <Typography variant="h4" align="left" gutterBottom sx={{ fontWeight: 'bold', color: '#052649' }}>
            Frequently Asked Questions
          </Typography>
          <Typography variant="subtitle1" align="left" gutterBottom sx={{ color: '#052649' }}>
            Get answers to your questions about how the application works.
          </Typography>
          <Grid container spacing={4} justifyContent="flex-start">
            <Grid item xs={12} sm={10} md={8}>
              {faqItems.map((faq, index) => (
                <Accordion key={index} sx={{ mb: 2, backgroundColor: '#ffffff' }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#052649' }}>
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" sx={{ color: '#6b6b6b' }}>
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default FAQSection;
