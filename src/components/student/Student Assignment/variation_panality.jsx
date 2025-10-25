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
import api from '../../../api.js'
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const PRIMARY_COLOR = "#4B2E83";

const VariationPenaltyAccordion = ({ assignmentId }) => {
    const [variationPenalties, setVariationPenalties] = useState([]);
    const [penaltyRanges, setPenaltyRanges] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: variationData } = await api.get(
                    "/api/courses/variation_penalty/",
                    {
                        params: { assignment: assignmentId },
                    }
                );

                setVariationPenalties(variationData);

                const { data: allRanges } = await api.get("/api/courses/penalty_ranges/", {
                    params: { variation_penalty: variationData.id },
                });

                const groupedRanges = {};
                allRanges.forEach((range) => {
                    const vpId = range.variation_penalty;
                    if (!groupedRanges[vpId]) {
                        groupedRanges[vpId] = [];
                    }
                    groupedRanges[vpId].push(range);
                });

                setPenaltyRanges(groupedRanges);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch variation penalties or penalty ranges.");
            } finally {
                setLoading(false);
            }
        };

        if (assignmentId) {
            fetchData();
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
            <Accordion sx={{ borderRadius: 2, boxShadow: 3 }}>

                <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: PRIMARY_COLOR }} />}

                    sx={{
                        bgcolor: "#ede7f6", // lighter purple
                        px: 3,
                        py: 1,
                    }}
                >
                    <Typography
                        sx={{
                            color: PRIMARY_COLOR,
                            fontWeight: "bold",
                            fontSize: "1.1rem",
                        }}
                    >
                        Variation Assignment Penalty
                    </Typography>
                </AccordionSummary>

                <AccordionDetails>
                    {variationPenalties.length === 0 ? (
                        <Typography>No variation penalties found.</Typography>
                    ) : (
                        variationPenalties.map((vp) => (
                            <Box key={vp.id} mb={4}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: PRIMARY_COLOR,
                                        fontWeight: "bold",
                                        mb: 2,
                                    }}
                                >
                                    {vp.variation_penalty_name}
                                </Typography>

                                <Grid container spacing={2}>
                                    {penaltyRanges[vp.id]?.length ? (
                                        penaltyRanges[vp.id].map((range) => (
                                            <Grid item xs={12} sm={6} md={4} key={range.id}>
                                                <Paper
                                                    elevation={3}
                                                    sx={{
                                                        p: 2,
                                                        borderRadius: 2,
                                                        backgroundColor: "#fefefe",
                                                        borderLeft: `5px solid ${PRIMARY_COLOR}`,
                                                        transition: "0.3s",
                                                        "&:hover": {
                                                            boxShadow: 6,
                                                        },
                                                    }}
                                                >
                                                    <Typography
                                                        variant="subtitle1"
                                                        fontWeight="bold"
                                                        color={PRIMARY_COLOR}
                                                    >
                                                        {range.variation_penalty_name}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        <strong>Days Late:</strong> {range.days_late}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        <strong>Penalty:</strong> {range.penalty}%
                                                    </Typography>
                                                </Paper>
                                            </Grid>
                                        ))
                                    ) : (
                                        <Typography color="text.secondary">
                                            No penalty ranges found for this variation.
                                        </Typography>
                                    )}
                                </Grid>
                            </Box>
                        ))
                    )}
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};

export default VariationPenaltyAccordion;
