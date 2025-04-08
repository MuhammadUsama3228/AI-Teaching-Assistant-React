import { useState, useEffect } from 'react';
import { TextField, Button, Typography, Container, Box, ThemeProvider, CircularProgress } from '@mui/material';
import theme from '../components/Theme'; // Custom theme
import api from "../api";
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constraints.js";
import { loginSuccess } from './auth';
import { useDispatch } from 'react-redux';
import {setUser} from "./profile/manage-profile/manage-profile.js";

function Login() {

    const dispatch = useDispatch();

    useEffect(() => {
        document.title = "Login | AI Teaching Assistant";
    }, []);


    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const getProfile = async () => {
        try {
            const profile_role= await api.get('/api/manage_profile/');
            console.log(profile_role.data.role);  // Correct access to role
    
            if (profile_role.status === 200) {
                dispatch(setUser(profile_role.data));  // Use response, not res
            } else {
                console.error('Unexpected response status:', profile_role.status);
            }
    
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            console.log('Profile fetch completed.');
        }
    };

    const handleProfileNavigation = async () => {
        try {
            const response = await api.get('/api/manage_profile/');
            const role = response.data.role;
    
            if (role === 'teacher') {
                navigate('/teacherpanel');
            } else if (role === 'student') {
                navigate('/studentpanel');  
            } else {
                console.error('Unknown role:', role);
            }
        } catch (error) {
            console.error('Error during profile navigation:', error);
        }
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setLoading(true);

        try {
            const response = await api.post('auth/login/', {
                username,
                password,
            });

            dispatch(loginSuccess(response.data));

            console.log(response);

            
            if (response && response.data && response.data.access && response.data.refresh && response.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                localStorage.setItem(REFRESH_TOKEN, response.data.refresh);

            handleProfileNavigation ()

            } else {
                console.error('Access or Refresh token is missing:', response.data);
                setError(response.data.message || 'Invalid credentials. Please try again.');
            }
        } catch (error) {

            console.error('Login error:', error);
            setError('An error occurred while logging in. Please try again.');
        } finally {
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
