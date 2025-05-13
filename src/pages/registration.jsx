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
    ThemeProvider,
    Link, // Import Link from Material-UI
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import theme from '../components/Theme';
import api from "../api";
import { useNavigate, useLocation } from 'react-router-dom';

function Register() {
    useEffect(() => {
        document.title = "Sign Up | AI Teaching Assistant";
    }, []);

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

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

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
                navigate('verifyemail/');
            }
        } catch (error) {
            console.error('Registration error:', error);
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
                        <TextField
                            size="small"
                            label="First Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                        <TextField
                            size="small"
                            label="Last Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </Box>
                );
            case 1:
                return (
                    <Box>
                        <TextField
                            size="small"
                            label="Username"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <TextField
                            size="small"
                            label="Email"
                            type="email"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <TextField
                            size="small"
                            label="Password"
                            type={showPassword1 ? 'text' : 'password'}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={password1}
                            onChange={(e) => setPassword1(e.target.value)}
                            required
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword1(!showPassword1)}
                                        >
                                            {showPassword1 ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            size="small"
                            label="Confirm Password"
                            type={showPassword2 ? 'text' : 'password'}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                            required
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword2(!showPassword2)}
                                        >
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
                    <Box>
                        <TextField
                            size="small"
                            label="Role"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            disabled
                        />
                    </Box>
                );
            default:
                return null;
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="sm" sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '70vh',
                px: { xs: 2, sm: 4 },
                py: { xs: 3, sm: 6 }
            }}>
                <Box
                    sx={{
                        width: '100%',
                        maxWidth: 350,
                        bgcolor: 'background.paper',
                        p: { xs: 2, sm: 4 },
                        borderRadius: 2,
                        boxShadow: 3
                    }}
                >
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <img src="src/assets/logo.png" alt="My Photo" width="100" />
                        <Typography variant="h5" fontWeight={600}>
                            Sign Up
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {loadingSkeleton ? (
                        <Skeleton variant="rectangular" width="100%" height={120} sx={{ mb: 3 }} />
                    ) : (
                        <Tabs
                            value={tabIndex}
                            onChange={handleTabChange}
                            variant="fullWidth"
                            textColor="primary"
                            indicatorColor="primary"
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
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    disabled={loading}
                                    sx={{ minWidth: 100 }}
                                >
                                    {loading ? (
                                        <>
                                            Wait
                                            <CircularProgress size={18} sx={{ ml: 1 }} />
                                        </>
                                    ) : 'Sign Up'}
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => setTabIndex((prev) => prev + 1)}
                                >
                                    Next
                                </Button>
                            )}
                        </Box>
                    </form>

                    <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                        Already have an account?{' '}
                        <Link href="/login" underline="hover" color="primary">
                            Login
                        </Link>
                    </Typography>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default Register;
