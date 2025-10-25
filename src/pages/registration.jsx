import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Typography,
    Container,
    Box,
    CircularProgress,
    IconButton,
    InputAdornment,
    Alert,
    Skeleton,
    Tabs,
    Tab,
    Link,
    useTheme,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api';

function Register() {
    useEffect(() => {
        document.title = "Sign Up | AI Teaching Assistant";
    }, []);

    const theme = useTheme();

    const [tabIndex, setTabIndex] = useState(0);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState('student');
    const [loading, setLoading] = useState(false);
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [error, setError] = useState('');
    const [loadingSkeleton, setLoadingSkeleton] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.role) {
            setRole(location.state.role);
        }
    }, [location.state]);

    const handleTabChange = (event, newValue) => setTabIndex(newValue);

    const handleSubmit = async () => {
        setLoading(true);
        setLoadingSkeleton(true);
        if (password1 !== password2) {
            setError('Passwords do not match');
            setLoading(false);
            setLoadingSkeleton(false);
            return;
        }

        try {
            const response = await api.post('api/accounts/registration/', {
                username,
                email,
                password1,
                password2,
                first_name: firstName,
                last_name: lastName,
                role,
            });

            if (response.status === 201) {
                navigate('register/verifyemail/');
            }
        } catch (error) {
            setError('An error occurred during registration. Please try again.');
        } finally {
            setLoading(false);
            setLoadingSkeleton(false);
        }
    };

    const renderTabContent = (index) => {
        switch (index) {
            case 0:
                return (
                    <Box>
                        <TextField label="First Name" fullWidth margin="normal" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        <TextField label="Last Name" fullWidth margin="normal" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </Box>
                );
            case 1:
                return (
                    <Box>
                        <TextField label="Username" fullWidth margin="normal" value={username} onChange={(e) => setUsername(e.target.value)} />
                        <TextField label="Email" type="email" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <TextField
                            label="Password"
                            type={showPassword1 ? 'text' : 'password'}
                            fullWidth
                            margin="normal"
                            value={password1}
                            onChange={(e) => setPassword1(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword1(!showPassword1)}>
                                            {showPassword1 ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            label="Confirm Password"
                            type={showPassword2 ? 'text' : 'password'}
                            fullWidth
                            margin="normal"
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword2(!showPassword2)}>
                                            {showPassword2 ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                );
            case 2:
                return (
                    <TextField label="Role" fullWidth margin="normal" value={role} disabled />
                );
            default:
                return null;
        }
    };

    return (
        <Container maxWidth="sm" sx={{ py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box
                sx={{
                    width: '100%',
                    maxWidth: 420,
                    bgcolor: theme.palette.background.paper,
                    p: { xs: 2, sm: 4 },
                    borderRadius: 3,
                    boxShadow: 4,
                    border: `1px solid ${theme.palette.divider}`
                }}
            >
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <img src="src/assets/logo.png" alt="Logo" width="80" />
                    <Typography  variant="h5"
                                 sx={{
                                     fontWeight: 'bold',
                                     color: '#4B2E83',
                                     mb: 2,
                                     textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                                 }}>
                        Sign Up
                    </Typography>


                </Box>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                {loadingSkeleton ? (
                    <Skeleton variant="rectangular" width="100%" height={120} sx={{ mb: 3 }} />
                ) : (
                    <Tabs
                        value={tabIndex}
                        onChange={handleTabChange}
                        variant="fullWidth"
                        indicatorColor="primary"
                        textColor="primary"
                        sx={{ mb: 2 }}
                    >
                        <Tab label="Personal Info" />
                        <Tab label="Credentials" />
                        <Tab label="Role" />
                    </Tabs>
                )}

                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    {renderTabContent(tabIndex)}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => setTabIndex((prev) => Math.max(prev - 1, 0))}
                            disabled={tabIndex === 0}
                        >
                            Back
                        </Button>
                        {tabIndex === 2 ? (
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading}
                                sx={{
                                    background: 'linear-gradient(135deg, #5E35B1 0%, #7E57C2 100%)',
                                    color: '#fff',
                                    fontWeight: 600,
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #4527A0 0%, #311B92 100%)',
                                    },
                                }}
                            >
                                {loading ? <>Wait <CircularProgress size={18} sx={{ ml: 1 }} /></> : 'Sign Up'}
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                onClick={() => setTabIndex((prev) => prev + 1)}
                                sx={{
                                    background: 'linear-gradient(135deg, #5E35B1 0%, #7E57C2 100%)',
                                    color: '#fff',
                                    fontWeight: 600,
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #4527A0 0%, #311B92 100%)',
                                    },
                                }}
                            >
                                Next
                            </Button>
                        )}
                    </Box>
                </form>

                <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                    Already have an account?{' '}
                    <Link href="/login" underline="hover" color="primary" fontWeight={600}>
                        Login
                    </Link>
                </Typography>
            </Box>
        </Container>
    );
}

export default Register;
