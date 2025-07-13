import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    CircularProgress,
    useMediaQuery,
    useTheme,
    Grid,
    Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import api from "../../../api.js";
import StudentCourseWeekView from "../Student_course/student_courseweek.jsx";
import {useParams} from "react-router-dom";

const THEME_COLOR = "#4B2E83";

const StudentCourseOverviewAccordion = () => {
    const [data, setData] = useState(null);
    const { courseId } = useParams();
    const [loading, setLoading] = useState(true);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get("/api/courses/student_insight/");
                setData(res.data);
            } catch (err) {
                console.error("Error fetching student insight:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={5}>
                <CircularProgress sx={{ color: THEME_COLOR }} />
            </Box>
        );
    }

    if (!data || !data.courses || data.courses.length === 0) {
        return (
            <Typography align="center" color="textSecondary" mt={4}>
                No enrolled courses found.
            </Typography>
        );
    }

    return (
        <Box px={isMobile ? 2 : 4} py={4}>
            <Typography variant="h4" fontWeight={700} color={THEME_COLOR} mb={4}>
                Enrolled Courses
            </Typography>

            {data.courses
                .filter((course) => !courseId || course.id === parseInt(courseId))
                .map((course) => {
                    const enrollment = data.enrollments.find((e) => e.course === course.id);
                    const assignmentCount = data.assignment.filter((a) => a.course === course.id).length;

                    return (
                        <Accordion
                            key={course.id}
                            sx={{ mb: 2, borderRadius: 2 }}
                            expanded={!courseId || course.id === parseInt(courseId)} // ✅ auto-expand if matching
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon sx={{ color: THEME_COLOR }} />}
                                sx={{
                                    bgcolor: "#f4f4fc",
                                    borderLeft: `6px solid ${THEME_COLOR}`,
                                    borderRadius: 2,
                                    "& .MuiAccordionSummary-content": {
                                        alignItems: "center",
                                    },
                                }}
                            >
                                <Typography sx={{ fontWeight: 600, color: THEME_COLOR }}>
                                    {course.course_title} &nbsp;— Section {course.section}
                                </Typography>
                            </AccordionSummary>

                            <AccordionDetails>
                                <Grid container spacing={2} mb={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="body2">
                                            <strong>Instructor:</strong> {course.teacher_full_name}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Duration:</strong> {course.weeks} weeks
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Enrolled on:</strong>{" "}
                                            {new Date(enrollment?.enrollment_date).toLocaleDateString()}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="body2">
                                            <strong>Assignments:</strong>{" "}
                                            <Chip
                                                label={`${assignmentCount} total`}
                                                color="primary"
                                                variant="outlined"
                                                sx={{
                                                    bgcolor: "#fff",
                                                    color: THEME_COLOR,
                                                    borderColor: THEME_COLOR,
                                                }}
                                            />
                                        </Typography>
                                    </Grid>
                                </Grid>

                                {/* StudentCourseWeekView for this course */}
                                <StudentCourseWeekView courseId={course.id} />
                            </AccordionDetails>
                        </Accordion>
                    );
                })}

        </Box>
    );
};

export default StudentCourseOverviewAccordion;
