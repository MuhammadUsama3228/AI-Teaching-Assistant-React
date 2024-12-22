import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Container, Box, ThemeProvider, CircularProgress } from '@mui/material';
import theme from '../components/Theme'; // Custom theme
import api from "../api";
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constraints.js";

function Login() {

    useEffect(() => {
        document.title = "Login | AI Teaching Assistant";
    }, []);


    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setLoading(true);

        try {
            // Make a POST request to your login API
            const response = await api.post('auth/login/', {
                username,
                password,
            });

            console.log(response);

            
            if (response && response.data && response.data.access && response.data.refresh) {
                // Store access and refresh tokens in localStorage
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                localStorage.setItem(REFRESH_TOKEN, response.data.refresh);

                navigate('/');
            } else {
                console.error('Access or Refresh token is missing:', response.data);
                setError(response.data.message || 'Invalid credentials. Please try again.');
            }
        } catch (error) {
            // Handle error and show a generic error message
            console.error('Login error:', error);
            setError('An error occurred while logging in. Please try again.');
        } finally {
            // Set loading state to false after request completion
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container
                component="main"
                maxWidth="xs"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 2,
                        boxShadow: 2,
                        borderRadius: 1,
                    }}
                >
                    <img
                        src='/vite.svg' // Adjust the logo path as needed
                        alt="Logo"
                        style={{ width: '50px', marginBottom: '50px' }}
                    />
                    <Typography variant="h5" gutterBottom>
                        Login
                    </Typography>

                    {error && (
                        <Typography color="error" variant="body2" gutterBottom>
                            {error}
                        </Typography>
                    )}

                    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                        <TextField
                            label="Username or Email"
                            type="text"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />

                        <TextField
                            label="Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{
                                mt: 2,
                                backgroundColor: 'primary.main', // Use primary color from the theme
                                position: 'relative',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                color: loading ? 'black' : 'white',
                            }}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    Please Wait
                                    <CircularProgress
                                        size={24}
                                        style={{ marginLeft: 3 }}
                                    />
                                </>
                            ) : (
                                'Login'
                            )}
                        </Button>
                    </form>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default Login;
