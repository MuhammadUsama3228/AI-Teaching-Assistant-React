import React, { useState } from "react";
import { Box, RadioGroup, FormControlLabel, Radio, Button, TextField } from "@mui/material";

const LoginForm = () => {
    const [userType, setUserType] = useState("student");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleUserTypeChange = (event) => {
        setUserType(event.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("User Type:", userType);
        console.log("Email:", email);
        console.log("Password:", password);
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                padding: 4,
            }}
        >
            <Box sx={{ maxWidth: 400, width: "100%", border: "1px solid #ccc", borderRadius: "8px", padding: 4 }}>
                <h2
                    style={{
                        textAlign: "center",
                        color: "#019cb8",
                        fontFamily: "Arial, sans-serif",
                        fontWeight: "bold",
                        fontSize: "2rem",
                        marginBottom: "20px",
                    }}
                >
                    Login
                </h2>

                <form onSubmit={handleSubmit}>
                    <Box sx={{ marginBottom: 3 }}>
                        <RadioGroup
                            row
                            value={userType}
                            onChange={handleUserTypeChange}
                            sx={{ display: "flex", justifyContent: "center" }}
                        >
                            <FormControlLabel value="student" control={<Radio />} label="Student" />
                            <FormControlLabel value="teacher" control={<Radio />} label="Teacher" />
                        </RadioGroup>
                    </Box>

                    <TextField
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                    />
                    <TextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                    />

                    <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
                        <Button type="submit" variant="contained" color="primary">
                            Login
                        </Button>
                    </Box>
                </form>
            </Box>
        </Box>
    );
};

export default LoginForm;