import React from "react";
import { Button, Typography, Box } from "@mui/material";

const HeroSection = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        background: "linear-gradient(to right,rgb(40, 167, 167),rgb(19, 83, 101))",
        color: "white",
        px: 4,
        py: 6,
        borderRadius:'0 0 16 16 px',
        textAlign: { xs: "center", md: "left" },
      }}
    >
     
      <Box sx={{ flex: 1, mb: { xs: 4, md: 0 } }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Revolutionize Your Teaching Experience
        </Typography>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Meet your AI-powered Teaching Assistant. Automate grading, personalize learning, and save time so you can focus on what matters most—your students.
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "white",
            color: "#28a745",
            fontWeight: "bold",
            px: 4,
            py: 1,
            ":hover": { backgroundColor: "#f1f1f1" },
          }}
        >
          Get Started
        </Button>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src="https://via.placeholder.com/400x300"
          alt="AI Teaching Assistant"
          style={{ width: "100%", maxWidth: "400px", borderRadius: "8px" }}
        />
      </Box>
    </Box>
  );
};

export default HeroSection;
