import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    TextField, Button, Typography, Container, Box, CircularProgress,
    Grid, IconButton, InputAdornment, ThemeProvider, useTheme
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { motion } from "framer-motion";

import api from "../api";
import theme from "../components/Theme";

function ResetPassword() {
    useEffect(() => {
        document.title = "Reset Password | AI Teaching Assistant";
    }, []);

    const { uid, token } = useParams();
    const navigate = useNavigate();
    const muiTheme = useTheme();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleToggleVisibility = () => setShowPassword((prev) => !prev);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match!");
            setLoading(false);
            return;
        }

        try {
            await api.post(`/api/password/reset/confirm/`, {
                uid,
                token,
                new_password1: newPassword,
                new_password2: confirmPassword,
            });

            setSuccess("Password reset successful! Redirecting to login...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
            console.error("Reset Error:", error.response?.data);
            setError(
                error.response?.data?.new_password1?.[0] ||
                error.response?.data?.new_password2?.[0] ||
                "Invalid or expired reset link."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Grid
                container
                sx={{
                    height: "100vh",
                    backgroundColor: muiTheme.palette.background.default,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 2,
                }}
            >
                <Container maxWidth="sm">
                    <Box
                        component={motion.div}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            padding: 4,
                            boxShadow: 3,
                            borderRadius: 3,
                            backgroundColor: muiTheme.palette.background.paper,
                        }}
                    >
                        <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                            Reset Your Password
                        </Typography>

                        {error && <Typography color="error" variant="body2" sx={{ mb: 1 }}>{error}</Typography>}
                        {success && <Typography color="success.main" variant="body2" sx={{ mb: 1 }}>{success}</Typography>}

                        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                            <TextField
                                label="New Password"
                                type={showPassword ? "text" : "password"}
                                fullWidth
                                margin="normal"
                                required
                                size="small"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleToggleVisibility} edge="end">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                label="Confirm New Password"
                                type={showPassword ? "text" : "password"}
                                fullWidth
                                margin="normal"
                                required
                                size="small"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleToggleVisibility} edge="end">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{
                                    mt: 2,
                                    backgroundColor: muiTheme.palette.primary.main,
                                    color: "#fff",
                                    '&:hover': {
                                        backgroundColor: muiTheme.palette.primary.dark,
                                    }
                                }}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        Resetting...
                                        <CircularProgress size={22} sx={{ ml: 1, color: "#fff" }} />
                                    </>
                                ) : (
                                    "Reset Password"
                                )}
                            </Button>
                        </form>
                    </Box>
                </Container>
            </Grid>
        </ThemeProvider>
    );
}

export default ResetPassword;
