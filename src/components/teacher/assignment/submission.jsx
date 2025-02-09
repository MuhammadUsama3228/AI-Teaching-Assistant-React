import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Paper,
    Typography,
    CircularProgress,
    Container,
    Skeleton,
    Box,
} from "@mui/material";
import { useParams } from "react-router-dom";
import api from "../../../api";

const AssignmentStatusSubmissions = () => {
    const { assignmentId } = useParams();
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [sortDirection, setSortDirection] = useState("asc");
    const [sortBy, setSortBy] = useState("id");

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const response = await api.get(`/api/courses/submission/`, {
                    params: { assignment: assignmentId },
                });
                setSubmissions(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error("Error fetching submissions:", error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, [assignmentId]);

    const handleSort = (property) => {
        const isAsc = sortBy === property && sortDirection === "asc";
        setSortDirection(isAsc ? "desc" : "asc");
        setSortBy(property);
    };

    const sortedSubmissions = Array.isArray(submissions)
        ? submissions.sort((a, b) => {
            if (!a[sortBy] || !b[sortBy]) return 0;
            if (sortDirection === "asc") {
                return a[sortBy] < b[sortBy] ? -1 : 1;
            } else {
                return a[sortBy] > b[sortBy] ? -1 : 1;
            }
        })
        : [];

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
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            }}
        >
            Submissions Status
        </Typography>

           

            {loading ? (
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Skeleton variant="text" width="60%" height={40} />
                    <Skeleton variant="rectangular" width="100%" height={400} />
                </Box>
            ) : error ? (
                <Typography variant="body1" color="error" align="center">
                    Error fetching submissions. Please try again later.
                </Typography>
            ) : (
                <TableContainer component={Paper} sx={{ mt: 3, border: "1px solid #e0e0e0", borderRadius: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                                <TableCell>
                                    <TableSortLabel
                                        active={sortBy === "id"}
                                        direction={sortBy === "id" ? sortDirection : "asc"}
                                        onClick={() => handleSort("id")}
                                    >
                                        ID
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={sortBy === "studentName"}
                                        direction={sortBy === "studentName" ? sortDirection : "asc"}
                                        onClick={() => handleSort("studentName")}
                                    >
                                        Student Name
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={sortBy === "submission_date"}
                                        direction={sortBy === "submission_date" ? sortDirection : "asc"}
                                        onClick={() => handleSort("submission_date")}
                                    >
                                        Submission Date
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>File</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedSubmissions.map((submission) => (
                                <TableRow
                                    key={submission.id}
                                    sx={{
                                        "&:nth-of-type(odd)": { backgroundColor: "#fafafa" },
                                        "&:hover": { backgroundColor: "#f0f8ff" },
                                    }}
                                >
                                    <TableCell>{submission.id}</TableCell>
                                    <TableCell>{submission.student.username}</TableCell>
                                    <TableCell>{new Date(submission.submission_date).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <a href={submission.file} target="_blank" rel="noopener noreferrer">
                                            Download
                                        </a>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {sortedSubmissions.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        No submissions found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};

export default AssignmentStatusSubmissions;
