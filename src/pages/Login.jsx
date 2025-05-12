import { useState, useEffect } from 'react';
import {
    TextField, Button, Typography, Container, Box,
    ThemeProvider, CircularProgress, Avatar, InputAdornment, IconButton, Link
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'; // ✅ Login icon
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import theme from '../components/Theme';
import api from "../api";
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constraints.js";
import { loginSuccess } from './auth';
import { useDispatch } from 'react-redux';
import { setUser } from "./profile/manage-profile/manage-profile.js";

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

    useEffect(() => {
        document.title = "Login | AI Teaching Assistant";
    }, []);

    const handleProfileNavigation = async () => {
        try {
            const response = await api.get('/api/manage_profile/');
            const role = response.data.role;

            dispatch(setUser(response.data));

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
        setError('');

        try {
            const response = await api.post('auth/login/', {
                username,
                password,
            });

            if (response.data.access && response.data.refresh) {
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
                dispatch(loginSuccess(response.data));
                await handleProfileNavigation();
            } else {
                setError(response.data.message || 'Invalid credentials. Please try again.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Login failed. Check your credentials.');
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
                        padding: 4,
                        boxShadow: 3,
                        borderRadius: 2,
                    }}
                >
                    {/* ✅ Lock Icon Avatar */}
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>

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
                            type={showPassword ? 'text' : 'password'} // Toggle between text and password
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{
                                mt: 2,
                                position: 'relative',
                                backgroundColor: 'primary.main',
                                color: loading ? 'black' : 'white',
                                cursor: loading ? 'not-allowed' : 'pointer',
                            }}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    Please Wait
                                    <CircularProgress size={20} sx={{ ml: 2, color: 'white' }} />
                                </>
                            ) : (
                                'Login'
                            )}
                        </Button>
                    </form>

                    {/* Create Account and Password Recovery Links */}
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <Link href="/register" variant="body2" color="primary">
                            {"Don't have an account? Sign Up"}
                        </Link>
                        <Link href="/forgot-password" variant="body2" color="primary">
                            {"Forgot password?"}
                        </Link>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default Login;
