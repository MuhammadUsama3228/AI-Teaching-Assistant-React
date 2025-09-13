import React, { useState } from "react";
import {
    Button,
    Snackbar,
    Alert,
    CircularProgress,
} from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay"; // Icon for recheck
import api from "../../../api.js";

const RecheckButton = ({ assignmentId }) => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const recheckSubmission = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await api.patch(`/api/courses/submission/${assignmentId}/`, {
                status: "recheck",
            });

            setSuccess("Recheck requested successfully!");
        } catch (err) {
            setError("Failed to request recheck.");
        } finally {
            setLoading(false);
            setOpenSnackbar(true);
        }
    };

    return (
        <>
            <Button
                variant="contained"
                onClick={recheckSubmission}
                disabled={loading}
                startIcon={!loading ? <ReplayIcon /> : null}
                sx={{
                    backgroundColor: "#4B2E83",
                    "&:hover": {
                        backgroundColor: "#3a2369",
                    },
                }}
            >
                {loading ? <CircularProgress size={20} color="inherit" /> : "Request Recheck"}
            </Button>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={5000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                {success ? (
                    <Alert severity="success" onClose={() => setOpenSnackbar(false)}>
                        {success}
                    </Alert>
                ) : error ? (
                    <Alert severity="error" onClose={() => setOpenSnackbar(false)}>
                        {error}
                    </Alert>
                ) : null}
            </Snackbar>
        </>
    );
};

export default RecheckButton;
