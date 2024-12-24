import React, { useState } from "react";
import { Button, Box, Typography } from "@mui/material";

const RoleChoice = () => {
  const [selectedRole, setSelectedRole] = useState(null);

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    console.log(`${role} selected`);
  
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "60vh",
        backgroundColor: "#f5f5f5",
        gap: 3,
      }}
    >
      <Typography variant="h4" sx={{ color: "#052649", mb: 2 }}>
        Choose Your Role
      </Typography>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleRoleSelection("Student")}
          sx={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#019cb8",
            "&:hover": { backgroundColor: "#017a8e" },
          }}
        >
          Student
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleRoleSelection("Teacher")}
          sx={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#ff5722",
            "&:hover": { backgroundColor: "#e64a19" },
          }}
        >
          Teacher
        </Button>
      </Box>

      {selectedRole && (
        <Typography variant="h6" sx={{ mt: 2, color: "#052649" }}>
          You selected: {selectedRole}
        </Typography>
      )}
    </Box>
  );
};

export default RoleChoice;
