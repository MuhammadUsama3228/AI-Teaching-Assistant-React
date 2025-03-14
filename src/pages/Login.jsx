<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { 
    TextField, Button, Typography, Container, Box, 
    ThemeProvider, CircularProgress, Grid, Link 
} from "@mui/material";
import theme from "../components/Theme"; // Custom theme
=======
import { useState, useEffect } from 'react';
import { TextField, Button, Typography, Container, Box, ThemeProvider, CircularProgress } from '@mui/material';
import theme from '../components/Theme'; // Custom theme
>>>>>>> moeed
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constraints.js";
<<<<<<< HEAD
import { motion } from "framer-motion";



function Login() {
=======
import { loginSuccess } from './auth';
import { useDispatch } from 'react-redux';
import {setUser} from "./profile/manage-profile/manage-profile.js";

function Login() {

    const dispatch = useDispatch();

>>>>>>> moeed
    useEffect(() => {
        document.title = "Login | AI Teaching Assistant";
    }, []);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const getProfile = async () => {
        try {
            const res = await api.get('/api/manage_profile/', {});

            if (res.status === 200) {
                dispatch(setUser(res.data));
            } else {
                console.error('Unexpected response status:', res.status);
            }

        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            console.log('Profile fetch completed.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(""); // Reset error state

        try {
<<<<<<< HEAD
            const response = await api.post("auth/login/", { username, password });

            if (response?.data?.access && response?.data?.refresh) {
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
                navigate("/teacherpanel");
=======
            const response = await api.post('auth/login/', {
                username,
                password,
            });

            dispatch(loginSuccess(response.data));

            console.log(response);

            
            if (response && response.data && response.data.access && response.data.refresh && response.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                localStorage.setItem(REFRESH_TOKEN, response.data.refresh);

                getProfile();

                navigate('/teacherpanel');
>>>>>>> moeed
            } else {
                setError("Invalid credentials. Please try again.");
            }
        } catch (error) {
<<<<<<< HEAD
            setError(error?.response?.data?.message || "Login failed. Please try again.");
=======

            console.error('Login error:', error);
            setError('An error occurred while logging in. Please try again.');
>>>>>>> moeed
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Grid container sx={{ height: "100vh" }}>
                
                {/* Left side - Login Form */}
                <Grid 
                    item xs={12} md={6} 
                    sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: { xs: 2, md: 4 } }}
                >
                    <Container maxWidth="xs">
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                p: 3,
                                boxShadow: 2,
                                borderRadius: 1,
                                width: "100%",
                            }}
                        >
                            <img
                                src="/vite.svg" // Adjust the logo path as needed
                                alt="Logo"
                                style={{ width: "50px", marginBottom: "30px" }}
                            />
                            <Typography variant="h5" gutterBottom>
                                Login
                            </Typography>

                            {error && (
                                <Typography color="error" variant="body2" gutterBottom>
                                    {error}
                                </Typography>
                            )}

                            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
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
                                        backgroundColor: "primary.main",
                                        color: "white",
                                        position: "relative",
                                        cursor: loading ? "not-allowed" : "pointer",
                                    }}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            Please Wait
                                            <CircularProgress size={24} sx={{ ml: 2 }} />
                                        </>
                                    ) : (
                                        "Login"
                                    )}
                                </Button>

                                {/* Forgot Password and Signup Links */}
                                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                                    <Link href="/forgot-password" variant="body2">
                                        Forgot Password?
                                    </Link>
                                    <Link href="/register" variant="body2">
                                        Sign Up
                                    </Link>
                                </Box>
                            </form>
                        </Box>
                    </Container>
                </Grid>

                {/* Right side - Image and Title Animation */}
                <Grid 
                    item xs={12} md={6} 
                    sx={{ 
                        display: { xs: "none", md: "flex" }, 
                        alignItems: "center", 
                        justifyContent: "center", 
                        background: "rgb(6, 52, 79)",
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 5, ease: "easeInOut" }} 
                    >
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: "bold",
                                color: "white",
                                textAlign: "center",
                                fontFamily: "Poppins, sans-serif",
                                textTransform: "uppercase",
                                letterSpacing: "1px",
                                mb: 2,
                            }}
                        >
                            AI-Teaching Assistant
                        </Typography>
                    </motion.div>
                </Grid>

            </Grid>
        </ThemeProvider>
    );
}

export default Login;
