import { Container, Grid, Typography, Card, CardContent, Box, Tooltip } from '@mui/material';
import { Explore, Build, School } from '@mui/icons-material'; // Make sure icons are installed

const HowItWorks = () => {
  const steps = [
    {
      title: 'Explore',
      description: 'Discover AI-powered tools tailored to your teaching needs.',
      icon: <Explore sx={{ fontSize: 40, color: '#019cb8' }} />,
      tooltip: 'Browse through available tools and find the ones that suit your teaching style.'
    },
    {
      title: 'Customize',
      description: 'Personalize the AI assistant to match your teaching style.',
      icon: <Build sx={{ fontSize: 40, color: '#019cb8' }} />,
      tooltip: 'Adjust settings and preferences to optimize the AI for your classroom needs.'
    },
    {
      title: 'Teach',
      description: 'Utilize your AI assistant to streamline your teaching process.',
      icon: <School sx={{ fontSize: 40, color: '#019cb8' }} />,
      tooltip: 'Engage with your AI assistant to make teaching more efficient and effective.'
    },
  ];

  return (
    <Box sx={{ py: 5, backgroundColor: '#f9f9f9' }}>
      <Container>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#052649' }}>
          How It Works
        </Typography>
        <Typography variant="subtitle1" align="center" gutterBottom sx={{ color: '#052649' }}>
          Learn how our AI tools can make teaching easier, step by step.
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {steps.map((step, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  boxShadow: 3,
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'scale(1.05)',
                    transition: 'all 0.3s ease',
                  },
                  borderRadius: 2,
                  backgroundColor: '#ffffff',
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <Tooltip title={step.tooltip} arrow>
                      <Box>{step.icon}</Box>
                    </Tooltip>
                  </Box>
                  <Typography variant="h6" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#052649' }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" align="center" sx={{ color: '#6b6b6b' }}>
                    {step.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HowItWorks;
