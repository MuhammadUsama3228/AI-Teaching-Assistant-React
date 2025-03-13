import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card, CardContent, CardHeader, CardMedia, Typography, Box, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, IconButton, Grid,
  Accordion, AccordionSummary, AccordionDetails
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import api from "../../../api";

const ProfilePage = () => {
  const { slug } = useParams();
  const [profile, setProfile] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/api/manage_profile/`);
        setProfile(response.data);
        setUpdatedProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, [slug]);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile((prev) => ({ ...prev, [name]: value || prev[name] }));
  };

  const handleUpdateProfile = async () => {
    try {
      await api.put(`/api/manage_profile/`, updatedProfile);
      setProfile(updatedProfile);
      handleCloseDialog();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (!profile) {
    return <Typography variant="h5" align="center">Loading Profile...</Typography>;
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        background: "linear-gradient(to bottom, #f8f9fa, #ffffff)",
        padding: 3,
      }}
    >
      <Card sx={{ maxWidth: 700, p: 3, boxShadow: 4, borderRadius: 3, backgroundColor: "#fff" }}>
        <CardHeader
          title={<Typography variant="h5" fontWeight="bold">{profile.name}</Typography>}
          subheader={
            <Box display="flex" alignItems="center" color="gray">
              <EmailIcon sx={{ mr: 1 }} /> {profile.email}
            </Box>
          }
          action={
            <IconButton onClick={handleOpenDialog} color="primary">
              <EditIcon />
            </IconButton>
          }
        />
        <CardMedia
          component="img"
          height="200"
          image={profile.avatar || "https://via.placeholder.com/200"}
          alt="Profile Avatar"
          sx={{
            borderRadius: "50%",
            width: 150,
            height: 150,
            objectFit: "cover",
            margin: "auto",
            border: "4px solid #1976d2",
          }}
        />
        <CardContent>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {profile.bio || "No bio available."}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box display="flex" alignItems="center">
                <WorkIcon sx={{ mr: 1, color: "gray" }} />
                <Typography variant="body2"><strong>Designation:</strong> {profile.designation}</Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="flex" alignItems="center">
                <SchoolIcon sx={{ mr: 1, color: "gray" }} />
                <Typography variant="body2"><strong>Institution:</strong> {profile.institution_name}</Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="flex" alignItems="center">
                <LocationOnIcon sx={{ mr: 1, color: "gray" }} />
                <Typography variant="body2"><strong>Address:</strong> {profile.address || "N/A"}</Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Update Profile Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>Update Profile</DialogTitle>
        <DialogContent>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">Basic Information</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField label="Name" name="name" value={updatedProfile.name || ""} onChange={handleInputChange} fullWidth margin="dense" />
              <TextField label="Email" name="email" value={updatedProfile.email || ""} onChange={handleInputChange} fullWidth margin="dense" />
              <TextField label="Bio" name="bio" value={updatedProfile.bio || ""} onChange={handleInputChange} fullWidth multiline rows={3} margin="dense" />
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">Professional Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField label="Designation" name="designation" value={updatedProfile.designation || ""} onChange={handleInputChange} fullWidth margin="dense" />
              <TextField label="Institution" name="institution_name" value={updatedProfile.institution_name || ""} onChange={handleInputChange} fullWidth margin="dense" />
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">Contact & Location</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField label="Address" name="address" value={updatedProfile.address || ""} onChange={handleInputChange} fullWidth margin="dense" />
              <TextField label="City" name="city" value={updatedProfile.city || ""} onChange={handleInputChange} fullWidth margin="dense" />
              <TextField label="Country" name="country" value={updatedProfile.country || ""} onChange={handleInputChange} fullWidth margin="dense" />
            </AccordionDetails>
          </Accordion>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ color: "#1976d2" }}>Cancel</Button>
          <Button onClick={handleUpdateProfile} variant="contained" sx={{ backgroundColor: "#1976d2" }}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfilePage;
