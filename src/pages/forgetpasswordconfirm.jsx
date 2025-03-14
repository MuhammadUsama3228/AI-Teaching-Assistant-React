import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  TextField, Button, Typography, Container, Box, CircularProgress, 
  Grid, IconButton, InputAdornment 
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material"; 
import { motion } from "framer-motion";
import api from "../api"; // Axios instance
import theme from "../components/Theme"; // Custom MUI Theme
import { ThemeProvider } from "@mui/material/styles";

function ResetPassword() {
  useEffect(() => {
    document.title = "Reset Password | AI Teaching Assistant";
  }, []);

  const { uid, token } = useParams();
  const navigate = useNavigate();

  console.log("UID:", uid, "Token:", token);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Toggle password visibility
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
      const response = await api.post(`/api/password/reset/confirm/`, {
        uid: uid,  // ✅ UID should be sent in the body
        token: token,  // ✅ Token should be sent in the body
        new_password1: newPassword,  // ✅ Correct field names
        confirmPassword,  // ✅ Correct field names
      });

      setSuccess("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error("Reset Error:", error.response?.data);
      setError(error.response?.data?.new_password1?.[0] || error.response?.data?.new_password2?.[0] || "Invalid or expired reset link.");
    } finally {
      setLoading(false);
    }
};


  return (
    <ThemeProvider theme={theme}>
      <Grid container sx={{ height: "100vh", p: { xs: 2, sm: 3 } }}>
        
        {/* Left Side - Form */}
        <Grid 
          item xs={12} md={6} 
          sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <Container 
            maxWidth="sm" 
            sx={{ padding: 3 }}
          >
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 3,
                boxShadow: 2,
                borderRadius: 2,
                backgroundColor: "white",
              }}
            >
              <Typography variant="h5" gutterBottom>
                Reset Your Password
              </Typography>

              {error && (
                <Typography color="error" variant="body2" gutterBottom>
                  {error}
                </Typography>
              )}

              {success && (
                <Typography color="success.main" variant="body2" gutterBottom>
                  {success}
                </Typography>
              )}

              <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                {/* Password Input with Visibility Toggle */}
                <TextField
                  label="New Password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
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
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
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
                  variant="contained"
                  fullWidth
                  sx={{
                    mt: 2,
                    backgroundColor: 'primary.main',
                    position: 'relative',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    color: 'white',
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      Resetting...
                      <CircularProgress size={24} sx={{ ml: 1 }} />
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </Button>
              </form>
            </Box>
          </Container>
        </Grid>

        {/* Right Side - Image / Design */}
        <Grid 
          item xs={12} md={6} 
          sx={{ 
            display: { xs: "none", md: "flex" }, 
            alignItems: "center", 
            justifyContent: "center", 
            background: "rgb(6, 52, 79)" 
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                color: "white",
                textAlign: "center",
                fontFamily: "Poppins, sans-serif",
                textTransform: "uppercase",
                letterSpacing: "2px",
                marginBottom: "20px",
              }}
            >
              AI Teaching Assistant
            </Typography>
          </motion.div>
        </Grid>

      </Grid>
    </ThemeProvider>
  );
}

export default ResetPassword;
