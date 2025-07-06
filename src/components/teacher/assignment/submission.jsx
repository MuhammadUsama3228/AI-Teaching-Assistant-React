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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useParams } from "react-router-dom";
import AssignmentIcon from "@mui/icons-material/Assignment";
import api from "../../../api";

const AssignmentStatusSubmissions = () => {
    const { assignmentId } = useParams();
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterFeedback, setFilterFeedback] = useState("all");
    const [filterSubmissionStatus, setFilterSubmissionStatus] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");

    useEffect(() => {
        const fetchSubmissions = async () => {
            const response = await api.get(`/api/courses/submission/`, {
                params: { assignment: assignmentId },
            });
            setSubmissions(Array.isArray(response.data) ? response.data : []);
            setLoading(false);
        };
        fetchSubmissions();
    }, [assignmentId]);

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
            (filterSubmissionStatus === "with-submission" && s.file) ||
            (filterSubmissionStatus === "without-submission" && !s.file);

        const statusMatch = filterStatus === "all" || s.status === filterStatus;

        return searchMatch && feedbackMatch && submissionMatch && statusMatch;
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
        { field: "student_username", headerName: "Student", flex: 1 },
        {
            field: "submission_date",
            headerName: "Date",
            flex: 1,
            renderCell: (params) =>
                new Date(params.row.submission_date).toLocaleString(),
        },
        {
            field: "feedback",
            headerName: "Feedback",
            flex: 1,
            renderCell: (params) => params.row.feedback || "—",
        },
        {
            field: "file",
            headerName: "File",
            flex: 1,
            renderCell: (params) =>
                params.row.file ? (
                    <Button
                        variant="outlined"
                        color="primary"
                        href={params.row.file}
                        target="_blank"
                        size="small"
                    >
                        View
                    </Button>
                ) : (
                    "No file"
                ),
        },
        {
            field: "status",
            headerName: "Status",
            flex: 1,
            renderCell: (params) => (
                <Chip
                    label={params.row.status}
                    color={statusColorMap[params.row.status] || "default"}
                    size="small"
                />
            ),
        },
    ];

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
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
                    <Grid container spacing={2} mb={3}>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                label="Search"
                                variant="outlined"
                                size="small"
                                fullWidth
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                sx={{ minHeight: 40 }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Feedback</InputLabel>
                                <Select
                                    value={filterFeedback}
                                    onChange={(e) => setFilterFeedback(e.target.value)}
                                    label="Feedback"
                                    sx={{ minHeight: 40 }}
                                >
                                    <MenuItem value="all">All</MenuItem>
                                    <MenuItem value="with-feedback">With Feedback</MenuItem>
                                    <MenuItem value="without-feedback">Without Feedback</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Submission</InputLabel>
                                <Select
                                    value={filterSubmissionStatus}
                                    onChange={(e) =>
                                        setFilterSubmissionStatus(e.target.value)
                                    }
                                    label="Submission"
                                    sx={{ minHeight: 40 }}
                                >
                                    <MenuItem value="all">All</MenuItem>
                                    <MenuItem value="with-submission">With Submission</MenuItem>
                                    <MenuItem value="without-submission">
                                        Without Submission
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    label="Status"
                                    sx={{ minHeight: 40 }}
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
                        <DataGrid
                            rows={filteredSubmissions}
                            columns={columns}
                            pageSize={10}
                            rowsPerPageOptions={[5, 10, 20]}
                            disableSelectionOnClick
                            autoHeight
                            sx={{
                                border: "none",
                                boxShadow: 2,
                                borderRadius: 2,
                                minWidth: 600,
                                backgroundColor: "#fff",
                            }}
                        />
                    </Box>
                </>
            )}
        </Container>
    );
};

export default AssignmentStatusSubmissions;
