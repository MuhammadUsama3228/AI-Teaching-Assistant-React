import { useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const RoleChoice = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    navigate("/register", { state: { role } });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "60vh",
        backgroundColor: "#FFFFFFFF",
        gap: 3,
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Added shadow effect here
        borderRadius: "10px", // Optional: to round the corners of the box
        padding: "20px", // Optional: adds some padding inside the box
      }}
    >
        <img src="src/assets/logo.png" alt="My Photo" width="100" />
                          
         <Typography 
                              variant="h5" 
                              gutterBottom 
                              sx={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  fontWeight: 'bold', 
                                  color: '#0a4870', // teal-blue shade
                                  gap: 1,
                                  mb: 2,
                                  textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                              }}
                              >
      
                              Role Selection
         </Typography>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleRoleSelection("student")}
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
          onClick={() => handleRoleSelection("teacher")}
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
