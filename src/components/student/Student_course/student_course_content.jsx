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
    Button,
    Snackbar,
    Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import api from "../../../api.js";
import { BASE_URL } from "../../../constraints.js";
import { useNavigate } from "react-router-dom";

const THEME_COLOR = "#4B2E83";

const CourseContent = ({ courseId }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
    const [courseContent, setCourseContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    useEffect(() => {
        const fetchCourseContent = async () => {
            try {
                const response = await api.get(`/api/courses/course_content/?course=${courseId}`);
                setCourseContent(response.data);
            } catch (err) {
                setError("Failed to fetch course content.");
                setOpenSnackbar(true);
            } finally {
                setLoading(false);
            }
        };

        if (courseId) fetchCourseContent();
    }, [courseId]);

    if (loading) return <CircularProgress sx={{ mt: 4 }} />;

    const getGridSize = () => {
        if (isMobile) return 12;
        if (isTablet) return 6;
        return 4;
    };

    return (
        <>
            {courseContent && (
                <Accordion defaultExpanded sx={{ mt: 3 }}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon sx={{ color: THEME_COLOR }} />}
                        sx={{ backgroundColor: "#f0ecf8" }}
                    >
                        <Typography
                            variant={isMobile ? "subtitle1" : "h6"}
                            sx={{ color: THEME_COLOR, fontWeight: 600 }}
                        >
                            Course Content
                        </Typography>
                    </AccordionSummary>

                    <AccordionDetails sx={{ backgroundColor: "#fafafa" }}>
                        {courseContent && courseContent.length > 0 ? (
                            <Grid container spacing={2}>
                                {courseContent.map((fileObj) => {
                                    const fileUrl = fileObj.file;
                                    const fullUrl = fileUrl.startsWith("http")
                                        ? fileUrl
                                        : `${BASE_URL}${fileUrl}`;
                                    const filename = fileUrl.split("/").pop();

                                    return (
                                        <Grid item xs={12} sm={getGridSize()} key={fileObj.id}>
                                            <Box
                                                sx={{
                                                    p: isMobile ? 1.5 : 2,
                                                    border: "1px solid #e0e0e0",
                                                    borderRadius: 2,

                                                    boxShadow: 1,
                                                    textAlign: "center",
                                                    transition: "transform 0.2s",
                                                    "&:hover": {
                                                        transform: "scale(1.03)",
                                                        boxShadow: "0 4px 12px rgba(75, 46, 131, 0.2)",
                                                    },
                                                }}
                                            >
                                                <InsertDriveFileIcon
                                                    sx={{ fontSize: isMobile ? 30 : 40, color: THEME_COLOR }}
                                                />
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        mt: 1,
                                                        mb: 1,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        fontSize: isMobile ? "0.75rem" : "0.875rem",
                                                    }}
                                                    title={filename}
                                                >
                                                    {filename}
                                                </Typography>
                                                <Button
                                                    href={fullUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                    sx={{
                                                        color: THEME_COLOR,
                                                        borderColor: THEME_COLOR,
                                                        fontSize: isMobile ? "0.7rem" : "0.85rem",
                                                        "&:hover": {
                                                            backgroundColor: "#f3eafc",
                                                            borderColor: THEME_COLOR,
                                                        },
                                                    }}
                                                >
                                                    View File
                                                </Button>
                                            </Box>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        ) : (
                            <Typography color="text.secondary">
                                No files attached for this course.
                            </Typography>
                        )}
                    </AccordionDetails>
                </Accordion>
            )}

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: isMobile ? "center" : "right",
                }}
            >
                <Alert
                    severity="error"
                    onClose={() => setOpenSnackbar(false)}
                    sx={{ width: "100%" }}
                >
                    {error}
                </Alert>
            </Snackbar>
        </>
    );
};

export default CourseContent;
