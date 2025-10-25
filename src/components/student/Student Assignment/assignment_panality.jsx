import React, { useEffect, useState } from "react";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    CircularProgress,
    Box,
    Grid,
    Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import api from "../../../api";

const PRIMARY_COLOR = "#4B2E83";

const AssignmentPenaltyAccordion = ({ assignmentId }) => {
    const [penalties, setPenalties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPenalties = async () => {
            try {
                const response = await api.get("/api/courses/penalty/", {
                    params: { assignment: assignmentId }
                });
                setPenalties(response.data);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch penalties.");
            } finally {
                setLoading(false);
            }
        };

        if (assignmentId) {
            fetchPenalties();
        }
    }, [assignmentId]);

    if (loading) {
        return (
            <Box mt={4} textAlign="center">
                <CircularProgress sx={{ color: PRIMARY_COLOR }} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box mt={4} textAlign="center">
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box mt={4}>
            <Accordion defaultExpanded sx={{ mt: 3 }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: '#4B2E83' }} />}
                    sx={{ backgroundColor: '#f0ecf8' }}
                >
                    <Typography variant="h6" sx={{ color: '#4B2E83', fontWeight: 600 }}>
                        Assignment Panality
                    </Typography>
                </AccordionSummary>

                <AccordionDetails sx={{ backgroundColor: '#fafafa' }}>

                    {penalties.length === 0 ? (
                        <Typography>No penalties found for this assignment.</Typography>
                    ) : (
                        <Grid container spacing={2}>
                            {penalties.map((item) => (
                                <Grid item xs={12} sm={6} md={4} key={item.id}>
                                    <Paper
                                        elevation={3}
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            backgroundColor: "#fdecea",
                                            border: "1px solid #f44336",
                                            transition: "0.3s",
                                            "&:hover": {
                                                transform: "scale(1.02)",
                                                boxShadow: 6,
                                            },
                                        }}
                                    >
                                        <Typography
                                            variant="subtitle1"
                                            fontWeight="bold"
                                            color="#b71c1c"
                                        >
                                            {item.assignment_title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            <strong>Penalty:</strong> {item.penalty}%
                                        </Typography>

                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};

export default AssignmentPenaltyAccordion;
