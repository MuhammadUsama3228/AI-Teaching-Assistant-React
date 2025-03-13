import React, { useState, useEffect } from "react";
import { 
    TextField, Button, Typography, Container, Box, 
    ThemeProvider, CircularProgress, Grid, MenuItem, FormControlLabel, Checkbox
} from "@mui/material";
import theme from "../../../components/Theme";
import api from "../../../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../../../constraints.js";
import { motion } from "framer-motion";

const TeacherProfileForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [user, setUser] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        phone_hide: true,
        address: "",
        city: "",
        country: "",
        postal_code: "",
        institution_name: "",
        institution_type: "school",
        designation: "",
        department: "",
        teaching_experience: 0,
        date_of_birth: "",
        gender: "other",
        about: "",
        address_hide: true,
        profile_picture: null,
        role: "", // Added role field
    });

    useEffect(() => {
        document.title = "Profile | AI Teaching Assistant";

        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem(ACCESS_TOKEN);
                if (!token) {
                    navigate("/login");
                    return;
                }
                const response = await api.get("/api/manage_profile/", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const profileData = response.data;

                if (profileData.role !== "teacher") {
                    setError("Access denied. Only teachers can edit this profile.");
                    setLoading(false);
                    return;
                }

                setUser(profileData);
            } catch (error) {
                setError("Failed to fetch user profile.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setUser(prevState => ({
            ...prevState,
            [name]: type === "file" ? files[0] : value
        }));
    };

    const handleCheckboxChange = (e) => {
        setUser(prevState => ({
            ...prevState,
            [e.target.name]: e.target.checked
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem(ACCESS_TOKEN);
            const formData = new FormData();
            Object.keys(user).forEach(key => {
                if (user[key] !== null && user[key] !== undefined) {
                    formData.append(key, user[key]);
                }
            });
            await api.put("/api/manage_profile/", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            setError("");
        } catch (error) {
            console.error("Profile update error:", error.response?.data);
            setError(error.response?.data?.detail || "Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Container sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="sm">
                <Box sx={{ mt: 5, p: 4, boxShadow: 3, borderRadius: 2, textAlign: "center" }}>
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <Typography variant="h4" gutterBottom>Teacher Profile</Typography>
                        {error && <Typography color="error" variant="body2">{error}</Typography>}
                        <form onSubmit={handleSubmit}>
                            <TextField type="file" name="profile_picture" fullWidth margin="normal" onChange={handleChange} InputLabelProps={{ shrink: true }} />
                            <TextField label="First Name" name="first_name" value={user.first_name || ""} onChange={handleChange} fullWidth margin="normal" required />
                            <TextField label="Last Name" name="last_name" value={user.last_name || ""} onChange={handleChange} fullWidth margin="normal" required />
                            <TextField label="Email" name="email" value={user.email || ""} fullWidth margin="normal" disabled />
                            <TextField label="Phone Number" name="phone_number" value={user.phone_number || ""} onChange={handleChange} fullWidth margin="normal" />
                            <FormControlLabel control={<Checkbox checked={user.phone_hide} onChange={handleCheckboxChange} name="phone_hide" />} label="Hide phone number" />
                            <TextField label="Address" name="address" value={user.address || ""} onChange={handleChange} fullWidth margin="normal" />
                            <TextField label="City" name="city" value={user.city || ""} onChange={handleChange} fullWidth margin="normal" />
                            <TextField label="Postal Code" name="postal_code" value={user.postal_code || ""} onChange={handleChange} fullWidth margin="normal" />
                            <TextField label="Country" name="country" value={user.country || ""} onChange={handleChange} fullWidth margin="normal" />
                            <FormControlLabel control={<Checkbox checked={user.address_hide} onChange={handleCheckboxChange} name="address_hide" />} label="Hide address" />
                            <TextField label="Institution Name" name="institution_name" value={user.institution_name || ""} onChange={handleChange} fullWidth margin="normal" />
                            <TextField select label="Institution Type" name="institution_type" value={user.institution_type || "school"} onChange={handleChange} fullWidth margin="normal">
                                <MenuItem value="school">School</MenuItem>
                                <MenuItem value="college">College</MenuItem>
                                <MenuItem value="university">University</MenuItem>
                            </TextField>
                            <TextField label="Designation" name="designation" value={user.designation || ""} onChange={handleChange} fullWidth margin="normal" />
                            <TextField label="Teaching Experience" name="teaching_experience" type="number" value={user.teaching_experience || 0} onChange={handleChange} fullWidth margin="normal" />
                            <TextField select label="Role" name="role" value={user.role || ""} fullWidth margin="normal" disabled>
                                <MenuItem value="teacher">Teacher</MenuItem>
                                <MenuItem value="student">Student</MenuItem>
                            </TextField>
                            <Button type="submit" variant="contained" sx={{ mt: 3 }} fullWidth disabled={loading || user.role !== "teacher"}>
                                {loading ? <CircularProgress size={24} /> : "Update Profile"}
                            </Button>
                        </form>
                    </motion.div>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default TeacherProfileForm;
