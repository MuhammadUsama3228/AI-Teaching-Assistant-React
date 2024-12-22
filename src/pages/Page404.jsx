import React from 'react';
import { Box, Typography, Button, Container, ThemeProvider } from '@mui/material';
import { useSpring, animated } from '@react-spring/web'; // Correct import path
import theme from '../components/Theme'; // Custom theme (ensure it's properly set up)
import { useEffect, useState } from 'react';

function PageNotFound() {

    useEffect(() => {
        document.title = "404 Page Not Found";
    }, []);

    // Fade-in animation for the 404 number
    const fadeIn = useSpring({
        opacity: 1,
        from: { opacity: 0 },
        config: { duration: 1500 },
    });

    return (
        <ThemeProvider theme={theme}>
            <Container
                component="main"
                maxWidth="xs"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh', // Ensures full page height
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%', // Ensure it takes full height
                        textAlign: 'center',
                        padding: 2,
                    }}
                >
                    {/* Animated 404 text */}
                    <animated.div style={fadeIn}>
                        <Typography variant="h1" sx={{ fontSize: '100px', fontWeight: 'bold' }} color="primary">
                            404
                        </Typography>
                    </animated.div>

                    {/* Animated message */}
                    <animated.div style={{ ...fadeIn }}>
                        <Typography variant="h5" color="text.primary">
                            Oops! Page not found.
                        </Typography>
                        <Typography variant="p" sx={{ mb: 3 }} color="text.secondary">
                            The page you are looking for doesn't exist.
                        </Typography>
                    </animated.div>

                    {/* Button to redirect to Home */}
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        onClick={() => window.location.href = '/'} // Redirect to home
                    >
                        Go to Home
                    </Button>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default PageNotFound;
