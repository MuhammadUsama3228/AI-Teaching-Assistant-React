import React, { useEffect, useState } from "react";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    CircularProgress,
    Box,
    Grid,
    useTheme,
    useMediaQuery,
    Paper
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import api from "../../../api";

const PRIMARY_COLOR = "#4B2E83";

const CourseTimeSlotsAccordion = ({ courseId }) => {
    const [timeSlots, setTimeSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchInsight = async () => {
            try {
                const response = await api.get(`/api/courses/student_insight/`);
                const allSlots = response.data.time_slots || [];
                const filteredSlots = allSlots.filter(slot => slot.course === courseId);
                setTimeSlots(filteredSlots);
            } catch (err) {
                setError("Failed to load time slots.");
            } finally {
                setLoading(false);
            }
        };

        if (courseId) {
            fetchInsight();
        }
    }, [courseId]);

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
            <Accordion defaultExpanded sx={{
                borderRadius: 2,
                boxShadow: 3,
                border: `1px solid ${PRIMARY_COLOR}`,
                backgroundColor: "#f3e8ff",
            }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: PRIMARY_COLOR }} />}
                    sx={{
                        backgroundColor: '#f5f5f5',
                        borderRadius: 2,
                        color: "#4B2E83",
                        "& .MuiAccordionSummary-content": {
                            marginLeft: 1,
                        }
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        🕒 Course Time Slots
                    </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ backgroundColor: "#fff", borderRadius: 2 }}>
                    {timeSlots.length === 0 ? (
                        <Typography>No time slots available for this course.</Typography>
                    ) : (
                        <Grid container spacing={2}>
                            {timeSlots.map((slot, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Paper
                                        elevation={3}
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            border: `1px solid ${PRIMARY_COLOR}33`,
                                            backgroundColor: "#f9f9f9",
                                            transition: "transform 0.3s",
                                            "&:hover": {
                                                transform: "scale(1.02)",
                                                boxShadow: 6
                                            }
                                        }}
                                    >
                                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: PRIMARY_COLOR }}>
                                            {slot.course_name} (Section {slot.section})
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: "#333" }}>
                                            <strong>Day:</strong> {slot.day}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: "#333" }}>
                                            <strong>Time:</strong> {slot.start_time} — {slot.end_time}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: "#333" }}>
                                            <strong>Room Link:</strong> {slot.room_link}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: "#333" }}>
                                            <strong>Timezone:</strong> {slot.timezone}
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

export default CourseTimeSlotsAccordion;
