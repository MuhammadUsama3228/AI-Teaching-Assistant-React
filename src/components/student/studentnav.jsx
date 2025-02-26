import React from "react";
import { AppBar, Toolbar, Button, Box, Typography } from "@mui/material";
import { AccountCircle, Dashboard, School } from "@mui/icons-material";

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#fff", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ color: "#333" }}>
          AI-TA
        </Typography>
        <Box>
          <Button startIcon={<AccountCircle />} sx={{ color: "#333" }}>Profile</Button>
          <Button startIcon={<Dashboard />} sx={{ color: "#333" }}>Dashboard</Button>
          <Button startIcon={<School />} sx={{ color: "#333" }}>Courses</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
