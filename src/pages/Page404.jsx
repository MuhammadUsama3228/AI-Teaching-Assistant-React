import React, { useEffect, useState } from 'react';
import {
    Typography,
    Button,
    Container,
    ThemeProvider,
    useTheme,
    Alert,
} from '@mui/material';
import { useSpring, animated } from '@react-spring/web';
import { Player } from '@lottiefiles/react-lottie-player';
import theme from '../components/Theme';

function PageNotFound() {
    useEffect(() => {
        document.title = "404 | Page Not Found";
    }, []);

    const muiTheme = useTheme();
    const [lottieError, setLottieError] = useState(false);

    const fadeIn = useSpring({
        opacity: 1,
        from: { opacity: 0 },
        config: { duration: 1000 },
    });

    return (
        <ThemeProvider theme={theme}>
            <Container
                maxWidth="md"
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: muiTheme.palette.background.default,
                    textAlign: 'center',
                    py: 6,
                }}
            >
                {/* Lottie Animation with error listener */}
                <Player
                    autoplay
                    loop
                    src="https://assets1.lottiefiles.com/packages/lf20_HpFqiS.json"
                    style={{ height: '300px', width: '300px' }}
                    onEvent={(event) => {
                        if (event === 'error') {
                            setLottieError(true);
                        }
                    }}
                />

                {/* Error Message */}
                {lottieError && (
                    <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                        Failed to load animation. Please refresh the page.
                    </Alert>
                )}

                <animated.div style={fadeIn}>
                    <Typography
                        variant="h3"
                        color="primary"
                        fontWeight="bold"
                        sx={{ mt: 2, textShadow: '1px 1px 3px rgba(0,0,0,0.2)' }}
                    >
                        404 - Page Not Found
                    </Typography>

                    <Typography variant="body1" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                        The page you’re looking for doesn’t exist or has been moved.
                    </Typography>
                </animated.div>

                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => window.location.href = '/'}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                    }}
                >
                    Go to Homepage
                </Button>
            </Container>
        </ThemeProvider>
    );
}

export default PageNotFound;
