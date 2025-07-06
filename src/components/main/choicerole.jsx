import { useState } from "react";
import { Button, Box, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

const RoleChoice = () => {
    const navigate = useNavigate();
    const theme = useTheme();
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
                backgroundColor: theme.palette.background.paper,
                gap: 3,
                boxShadow: 3,
                borderRadius: 3,
                padding: 4,
            }}
        >
            <img src="src/assets/logo.png" alt="Logo" width="100" />

            <Typography
                variant="h5"
                sx={{
                    fontWeight: 'bold',
                    color: '#4B2E83',
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
                >
                    Student
                </Button>

                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleRoleSelection("teacher")}
                >
                    Teacher
                </Button>
            </Box>

            {selectedRole && (
                <Typography variant="h6" sx={{ mt: 2, color: theme.palette.primary.dark }}>
                    You selected: {selectedRole}
                </Typography>
            )}
        </Box>
    );
};

export default RoleChoice;
