import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Container, Box, ThemeProvider, CircularProgress, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import theme from '../components/Theme'; // Custom theme
import api from "../api"; // API for making requests
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constraints.js";

const Register = () => {
    useEffect(() => {
        document.title = "SignUp | AI Teaching Assistant";
    }, []);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        role: "student", // Default role
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { firstName, lastName, email, username, password, confirmPassword } = formData;

        if (!firstName || !lastName || !email || !username || !password || !confirmPassword) {
            setError("All fields are required.");
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            const response = await api.post('auth/register/', {
                firstName,
                lastName,
                email,
                username,
                role: formData.role,
                password,
            });

            console.log(response);

            if (response && response.data && response.data.access && response.data.refresh) {
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
                navigate('/'); // Redirect to home after successful registration
            } else {
                setError(response.data.message || 'An error occurred. Please try again.');
            }
        } catch (error) {
            console.error("Registration error:", error);
            setError('An error occurred while registering. Please try again.');
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
                        Sign Up
                    </Typography>

                    {error && (
                        <Typography color="error" variant="body2" gutterBottom>
                            {error}
                        </Typography>
                    )}

                    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                        <TextField
                            label="First Name"
                            type="text"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={formData.firstName}
                            onChange={handleChange}
                            name="firstName"
                            required
                        />

                        <TextField
                            label="Last Name"
                            type="text"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={formData.lastName}
                            onChange={handleChange}
                            name="lastName"
                            required
                        />

                        <TextField
                            label="Email"
                            type="email"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={formData.email}
                            onChange={handleChange}
                            name="email"
                            required
                        />

                        <TextField
                            label="Username"
                            type="text"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={formData.username}
                            onChange={handleChange}
                            name="username"
                            required
                        />

                        <FormControl fullWidth variant="outlined" margin="normal">
                            <InputLabel>Role</InputLabel>
                            <Select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                label="Role"
                            >
                                <MenuItem value="student">Student</MenuItem>
                                <MenuItem value="teacher">Teacher</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            label="Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={formData.password}
                            onChange={handleChange}
                            name="password"
                            required
                        />

                        <TextField
                            label="Confirm Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            name="confirmPassword"
                            required
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{
                                mt: 2,
                                backgroundColor: 'primary.main',
                                position: 'relative',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                color: loading ? 'black' : 'white',
                            }}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    Please Wait
                                    <CircularProgress size={24} style={{ marginLeft: 3 }} />
                                </>
                            ) : (
                                'Sign Up'
                            )}
                        </Button>
                    </form>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default Register;
