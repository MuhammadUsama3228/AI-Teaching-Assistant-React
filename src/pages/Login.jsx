import React, { useState, useEffect } from "react";
import { 
    TextField, Button, Typography, Container, Box, 
    ThemeProvider, CircularProgress, Grid, Link 
} from "@mui/material";
import theme from "../components/Theme"; // Custom theme
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constraints.js";
import { motion } from "framer-motion";



function Login() {
    useEffect(() => {
        document.title = "Login | AI Teaching Assistant";
    }, []);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(""); // Reset error state

        try {
            const response = await api.post("auth/login/", { username, password });

            if (response?.data?.access && response?.data?.refresh) {
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
                navigate("/teacherpanel");
            } else {
                setError("Invalid credentials. Please try again.");
            }
        } catch (error) {
            setError(error?.response?.data?.message || "Login failed. Please try again.");
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
                                    <Link href="/forgetpassword" variant="body2">
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
