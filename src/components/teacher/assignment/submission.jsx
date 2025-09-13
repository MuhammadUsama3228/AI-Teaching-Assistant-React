import React, { useEffect, useState } from "react";
import {
    Container,
    Box,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Skeleton,
    Grid,
    Button,
    Chip,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useParams } from "react-router-dom";
import AssignmentIcon from "@mui/icons-material/Assignment";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { BASE_URL } from "../../../constraints.js";
import api from "../../../api";

const AssignmentStatusSubmissions = () => {
    const { assignmentId } = useParams();
    const [submissions, setSubmissions] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterFeedback, setFilterFeedback] = useState("all");
    const [filterSubmissionStatus, setFilterSubmissionStatus] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterCourse, setFilterCourse] = useState("all");

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const response = await api.get(`/api/courses/submission/`, {
                    params: { assignment: assignmentId },
                });
                setSubmissions(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error("Error fetching submissions:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchCourses = async () => {
            try {
                const response = await api.get("/api/courses/course/");
                setCourses(response.data);
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };

        fetchSubmissions();
        fetchCourses();
    }, [assignmentId]);

    const handleDownloadAll = async () => {
        try {
            const response = await api.get(
                `/api/courses/submission/download_zip/`,
                {
                    params: { assignment: assignmentId },
                    responseType: "blob",
                }
            );

            const blob = new Blob([response.data], { type: "application/zip" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `assignment_${assignmentId}_submissions.zip`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Failed to download submissions:", error);
        }
    };

    const filteredSubmissions = submissions.filter((s) => {
        const searchMatch =
            s.student_username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.feedback?.toLowerCase().includes(searchQuery.toLowerCase());

        const feedbackMatch =
            filterFeedback === "all" ||
            (filterFeedback === "with-feedback" && s.feedback) ||
            (filterFeedback === "without-feedback" && !s.feedback);

        const submissionMatch =
            filterSubmissionStatus === "all" ||
            (filterSubmissionStatus === "with-submission" && s.files && s.files.length > 0) ||
            (filterSubmissionStatus === "without-submission" && (!s.files || s.files.length === 0));

        const statusMatch = filterStatus === "all" || s.status === filterStatus;

        const courseMatch =
            filterCourse === "all" || String(s.course) === String(filterCourse);

        return searchMatch && feedbackMatch && submissionMatch && statusMatch && courseMatch;
    });

    const statusColorMap = {
        pending: "warning",
        checked: "success",
        recheck: "info",
        error: "error",
        invalid_tokens: "default",
    };

    const columns = [
        { field: "id", headerName: "ID", flex: 0.3 },
        { field: "assignment_title", headerName: "Assignment", flex: 1 },
        { field: "student_username", headerName: "Student", flex: 1 },
        {
            field: "submission_date",
            headerName: "Date",
            flex: 1,
            renderCell: (params) =>
                params.row.submission_date
                    ? new Date(params.row.submission_date).toLocaleString()
                    : "N/A",
        },
        {
            field: "files",
            headerName: "Files",
            flex: 0.5,
            renderCell: (params) =>
                Array.isArray(params.row.files) && params.row.files.length > 0 ? (
                    <Box display="flex" flexWrap="wrap">
                        {params.row.files.map((fileObj, index) => {
                            const fileUrl =
                                typeof fileObj === "string"
                                    ? fileObj
                                    : fileObj.file || "";
                            const fullUrl = fileUrl.startsWith("http") ? fileUrl : `${BASE_URL}${fileUrl}`;

                            return (
                                <a
                                    key={index}
                                    href={fullUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ marginRight: 8 }}
                                >
                                    <InsertDriveFileIcon sx={{ fontSize: 22, color: "#4B2E83" }} />
                                </a>
                            );
                        })}
                    </Box>
                ) : (
                    <Typography variant="body2" color="text.secondary">
                        —
                    </Typography>
                ),
        },
        {
            field: "feedback",
            headerName: "Feedback",
            flex: 1,
            renderCell: (params) => params.row.feedback || "—",
        },
        {
            field: "obtained_attempts",
            headerName: "Attempts",
            flex: 0.7,
            renderCell: (params) => params.row.obtained_attempts ?? "—",
        },
        {
            field: "obtained_marks",
            headerName: "Marks",
            flex: 0.7,
            renderCell: (params) => params.row.obtained_marks ?? "—",
        },
        {
            field: "status",
            headerName: "Status",
            flex: 0.8,
            renderCell: (params) => (
                <Chip
                    label={params.row.status || "N/A"}
                    color={statusColorMap[params.row.status] || "default"}
                    size="small"
                />
            ),
        },
    ];

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Typography
                variant="h5"
                align="center"
                gutterBottom
                sx={{
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    background: "linear-gradient(90deg, #1a237e, #4a148c)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                }}
            >
                <AssignmentIcon sx={{ mr: 1 }} />
                Assignment Submissions
            </Typography>

            {loading ? (
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Skeleton variant="text" width="60%" height={40} />
                    <Skeleton variant="rectangular" width="100%" height={400} />
                </Box>
            ) : (
                <>
                    <Box
                        display="flex"
                        justifyContent={isMobile ? "center" : "flex-end"}
                        flexWrap="wrap"
                        gap={2}
                        mb={2}
                    >

                    </Box>

                    {/* Filters */}
                    <Grid container spacing={2} mb={3}>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                label="Search"
                                variant="outlined"
                                size="small"
                                fullWidth
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Course</InputLabel>
                                <Select
                                    value={filterCourse}
                                    onChange={(e) => setFilterCourse(e.target.value)}
                                    label="Course"
                                >
                                    <MenuItem value="all">All</MenuItem>
                                    {courses.map((course) => (
                                        <MenuItem key={course.id} value={course.id}>
                                            {course.course_title}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Feedback</InputLabel>
                                <Select
                                    value={filterFeedback}
                                    onChange={(e) => setFilterFeedback(e.target.value)}
                                    label="Feedback"
                                >
                                    <MenuItem value="all">All</MenuItem>
                                    <MenuItem value="with-feedback">With Feedback</MenuItem>
                                    <MenuItem value="without-feedback">Without Feedback</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Submission</InputLabel>
                                <Select
                                    value={filterSubmissionStatus}
                                    onChange={(e) => setFilterSubmissionStatus(e.target.value)}
                                    label="Submission"
                                >
                                    <MenuItem value="all">All</MenuItem>
                                    <MenuItem value="with-submission">With Submission</MenuItem>
                                    <MenuItem value="without-submission">Without Submission</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    label="Status"
                                >
                                    <MenuItem value="all">All</MenuItem>
                                    <MenuItem value="pending">Pending</MenuItem>
                                    <MenuItem value="checked">Checked</MenuItem>
                                    <MenuItem value="recheck">Re Check</MenuItem>
                                    <MenuItem value="error">Error</MenuItem>
                                    <MenuItem value="invalid_tokens">Invalid Tokens</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Box mb={2}>
                        <Typography variant="body1" fontWeight="bold">
                            Total Submissions: {filteredSubmissions.length}
                        </Typography>
                    </Box>

                    <Box sx={{ width: "100%", overflowX: "auto" }}>
                        <Box sx={{ minWidth: 800 }}>
                            <DataGrid
                                rows={filteredSubmissions}
                                columns={columns}
                                pageSize={10}
                                rowsPerPageOptions={[5, 10, 20]}
                                disableSelectionOnClick
                                autoHeight
                                loading={loading}
                                sx={{
                                    border: "none",
                                    boxShadow: 2,
                                    borderRadius: 2,
                                    backgroundColor: "#fff",
                                }}
                            />
                        </Box>
                    </Box>
                </>
            )}
        </Container>
    );
};

export default AssignmentStatusSubmissions;
