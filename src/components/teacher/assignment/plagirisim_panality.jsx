import React, { useState } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    Snackbar,
    Alert,
} from "@mui/material";
import api from "../../../api"; // adjust as needed

const PlagiarismForm = ({ assignmentId }) => {
    const [penalty, setPenalty] = useState("");
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!assignmentId) {
            setError("Assignment ID is missing.");
            return;
        }

        try {
            await api.post("/api/courses/plagiarism-penalties/", {
                assignment: assignmentId,
                penalty: penalty,
            });
            setSuccess(true);
            setPenalty("");
        } catch (err) {
            console.error(err);
            setError("Failed to submit penalty");
        }
    };

    return (
        <Box maxWidth={400} mx="auto" p={3}>
            <Typography variant="h6" mb={2}>Plagiarism Form</Typography>

            <form onSubmit={handleSubmit}>
                <TextField
                    label="Penalty"
                    value={penalty}
                    onChange={(e) => setPenalty(e.target.value)}
                    fullWidth
                    required
                    margin="normal"
                />

                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Submit
                </Button>
            </form>

            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}

            <Snackbar
                open={success}
                autoHideDuration={3000}
                onClose={() => setSuccess(false)}
            >
                <Alert severity="success" onClose={() => setSuccess(false)}>
                    Penalty submitted successfully!
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default PlagiarismForm;
