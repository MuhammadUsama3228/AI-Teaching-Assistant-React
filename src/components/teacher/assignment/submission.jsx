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
    Card,
    CardContent,
    Divider,
    Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useParams } from "react-router-dom";
import api from "../../../api";

import AssignmentIcon from '@mui/icons-material/Assignment';


const AssignmentStatusSubmissions = () => {
    const { assignmentId } = useParams();
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterFeedback, setFilterFeedback] = useState("all");
    const [filterSubmissionStatus, setFilterSubmissionStatus] = useState("all");

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

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleFeedbackFilter = (event) => {
        setFilterFeedback(event.target.value);
    };

    const handleSubmissionStatusFilter = (event) => {
        setFilterSubmissionStatus(event.target.value);
    };

    // Filter submissions based on the search query, feedback, and submission status
    const filteredSubmissions = submissions.filter((submission) => {
        const matchesSearchQuery =
            submission.student_username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            submission.feedback?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFeedbackFilter =
            filterFeedback === "all" ||
            (filterFeedback === "with-feedback" && submission.feedback) ||
            (filterFeedback === "without-feedback" && !submission.feedback);

        const matchesSubmissionStatusFilter =
            filterSubmissionStatus === "all" ||
            (filterSubmissionStatus === "with-submission" && submission.file) ||
            (filterSubmissionStatus === "without-submission" && !submission.file);

        return matchesSearchQuery && matchesFeedbackFilter && matchesSubmissionStatusFilter;
    });

    // Columns for DataGrid table
    const columns = [
        { field: "id", headerName: "ID", width: 90 },
        {
            field: "student_username",
            headerName: "Student Username",
            width: 180,
            editable: false,
        },
        {
            field: "submission_date",
            headerName: "Submission Date",
            width: 180,
            renderCell: (params) => new Date(params.row.submission_date).toLocaleString(),
        },
        {
            field: "feedback",
            headerName: "Feedback",
            width: 180,
            renderCell: (params) => params.row.feedback || "No feedback",
        },
        {
            field: "file",
            headerName: "Submission File",
            width: 180,
            renderCell: (params) =>
                params.row.file ? (
                    <Button variant="outlined" color="primary" href={params.row.file} target="_blank">
                        Download
                    </Button>
                ) : (
                    "No file"
                ),
        },
    ];

    return (
        <Container sx={{ py: 4 }}>
           <Typography
    variant="h4"
    align="center"
    gutterBottom
    sx={{
        fontWeight: "bold",
        color: "#1a237e",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        background: "linear-gradient(90deg, #1a237e, #4a148c)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        py: 2,
        display: "flex",
        alignItems: "center", // Align the icon and text vertically
        justifyContent: "center", // Center align the content
    }}
>
    <AssignmentIcon sx={{ mr: 1 }} /> {/* This will add the icon */}
    Submissions Status
</Typography

          >  {loading ? (
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Skeleton variant="text" width="60%" height={40} />
                    <Skeleton variant="rectangular" width="100%" height={400} />
                </Box>
            ) : (
                <>
                    {/* Filters and Search */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                        <TextField
                            label="Search"
                            variant="outlined"
                            size="small"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            fullWidth
                            sx={{ maxWidth: 300 }}
                        />
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>Feedback</InputLabel>
                            <Select
                                value={filterFeedback}
                                onChange={handleFeedbackFilter}
                                label="Feedback"
                            >
                                <MenuItem value="all">All</MenuItem>
                                <MenuItem value="with-feedback">With Feedback</MenuItem>
                                <MenuItem value="without-feedback">Without Feedback</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>Submission Status</InputLabel>
                            <Select
                                value={filterSubmissionStatus}
                                onChange={handleSubmissionStatusFilter}
                                label="Submission Status"
                            >
                                <MenuItem value="all">All</MenuItem>
                                <MenuItem value="with-submission">With Submission</MenuItem>
                                <MenuItem value="without-submission">Without Submission</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    {/* Submissions Count */}
                    <Grid item xs={12} sm={6} md={12}>
                        <Box
                            sx={{
                                padding: 2,
                                borderRadius: 2,
                                boxShadow: 3,
                                backgroundColor: "#f5f5f5",
                                textAlign: "center",
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                Submissions Count
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {filteredSubmissions.length} submissions
                            </Typography>
                        </Box>
                    </Grid>

                    {/* DataGrid for Submissions */}
                    <Box sx={{ height: 500, width: "100%", marginTop: 2 }}>
                        <DataGrid
                            rows={filteredSubmissions}
                            columns={columns}
                            pageSize={10}
                            rowsPerPageOptions={[5, 10, 20]}
                            disableSelectionOnClick
                            autoHeight
                            sx={{
                                border: "none",
                                boxShadow: 3,
                                borderRadius: 2,
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
