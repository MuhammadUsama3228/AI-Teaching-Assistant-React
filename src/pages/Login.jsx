import { useState, useEffect } from 'react';
import {
    TextField, Button, Typography, Container, Box,
    ThemeProvider, CircularProgress, Avatar,
    InputAdornment, IconButton, Link
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import theme from '../components/Theme';
import api from "../api";
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constraints";
import { loginSuccess } from './auth';
import { useDispatch } from 'react-redux';
import { setUser } from "./profile/manage-profile/manage-profile";


function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        document.title = "Login | AI Teaching Assistant";
    }, []);

    const handleProfileNavigation = async () => {
        try {
            const response = await api.get('/api/manage_profile/');
            const role = response.data.role;
            console.log(role)

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
            const response = await api.post('auth/login/', { username, password });

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
            <Container maxWidth="xs">
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        mt: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 2,
                        boxShadow: 3,
                        borderRadius: 2,
                    }}
                >
                   <img src="src/assets/logo.png" alt="My Photo" width="100" />
                    
                    <Typography 
                        variant="h5" 
                        gutterBottom 
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            fontWeight: 'bold', 
                            color: '#0a4870', // teal-blue shade
                            gap: 1,
                            mb: 2,
                            textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                        }}
                        >

                        Sign In
                        </Typography>

                    {error && (
                        <Typography color="error" sx={{ mt: 1 }}>
                            {error}
                        </Typography>
                    )}

                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        size='small'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <TextField
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        size='small'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        disabled={loading}
                        sx={{
                            mt: 2,
                            backgroundColor: 'primary.main',
                            color: 'white',
                            cursor: loading ? 'not-allowed' : 'pointer',
                        }}
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

                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <Link href="/choice" variant="body2" color="primary">
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
