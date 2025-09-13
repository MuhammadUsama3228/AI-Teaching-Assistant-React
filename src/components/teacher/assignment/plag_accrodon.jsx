import React, { useEffect, useState } from "react";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Box,
    CircularProgress,
    Chip,
    useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import api from "../../../api"; // adjust path

const PlagiarismPenaltyList = () => {
    const theme = useTheme();
    const [penalties, setPenalties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPenalties = async () => {
            try {
                const res = await api.get("/api/courses/plagiarism-penalties/");
                setPenalties(res.data);
            } catch (err) {
                setError("Failed to fetch penalties.");
            } finally {
                setLoading(false);
            }
        };

        fetchPenalties();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography color="error" align="center">
                {error}
            </Typography>
        );
    }

    if (penalties.length === 0) {
        return (
            <Typography align="center" p={2}>
                No plagiarism penalties found.
            </Typography>
        );
    }

    return (
        <Box p={2}>
            {penalties.map((penalty, index) => (
                <Accordion key={index} sx={{ mb: 2, borderLeft: `5px solid ${theme.palette.error.main}` }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box display="flex" flexDirection="column">
                            <Typography fontWeight="bold">
                                Assignment #{penalty.assignment}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {penalty.penalty.length > 40
                                    ? penalty.penalty.substring(0, 40) + "..."
                                    : penalty.penalty}
                            </Typography>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography sx={{ whiteSpace: "pre-line" }}>
                            {penalty.penalty}
                        </Typography>
                        <Box mt={2}>
                            <Chip
                                label={`Assignment ID: ${penalty.assignment}`}
                                color="error"
                                variant="outlined"
                            />
                        </Box>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    );
};

export default PlagiarismPenaltyList;
