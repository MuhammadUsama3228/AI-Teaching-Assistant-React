import React, { useState, useEffect } from 'react';
import {
    Typography,
    Container,
    CircularProgress,
    Box,
    Card,
    Grid,
    Button,
    TextField,
    Avatar,
    InputAdornment,
    useTheme,
    Pagination,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import api from '../../../api';
import RecordNotFound from "../../Record_not_found.jsx";

const AssignmentAllRead = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [selectedAssignments, setSelectedAssignments] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const pageSize = 6;
    const theme = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const response = await api.get('/api/courses/assignment/');
                setAssignments(response.data);
            } catch (error) {
                console.error('Error fetching assignments:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAssignments();
    }, []);

    const handleAssignmentClick = (assignmentId) => {
        navigate(`/courses/assignments/${assignmentId}/details`);
    };

    const filteredAssignments = assignments.filter((assignment) =>
        assignment.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const paginatedAssignments = filteredAssignments.slice((page - 1) * pageSize, page * pageSize);
    const pageCount = Math.ceil(filteredAssignments.length / pageSize);

    const handleDelete = () => setOpenDialog(true);

    const confirmDelete = async () => {
        try {
            await Promise.all(
                selectedAssignments.map((id) => api.delete(`/api/courses/assignment/${id}/`))
            );
            setAssignments(assignments.filter((a) => !selectedAssignments.includes(a.id)));
            setSelectedAssignments([]);
        } catch (error) {
            console.error('Error deleting assignments:', error);
        } finally {
            setOpenDialog(false);
        }
    };

    const toggleSelectAssignment = (id) => {
        setSelectedAssignments((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            {/* Header and Search */}
            <Box
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems="center"
                mb={3}
                gap={2}
                flexWrap="wrap"
            >
                <Typography variant="h4" fontWeight="bold">
                    All Assignments
                </Typography>

                <TextField
                    label="Search Assignments"
                    variant="outlined"
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ width: { xs: "100%", sm: "250px" } }}
                />
            </Box>

            {/* Delete Button */}
            <Box mb={2}>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleDelete}
                    disabled={selectedAssignments.length === 0}
                    sx={{ textTransform: 'none' }}
                >
                    Delete Selected
                </Button>
            </Box>

            {/* Loading or No Record */}
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                    <CircularProgress />
                </Box>
            ) : filteredAssignments.length === 0 ? (
                <RecordNotFound message="No assignments found." />
            ) : (
                <>
                    <Grid container spacing={3}>
                        {paginatedAssignments.map((assignment) => (
                            <Grid item xs={12} sm={6} md={4} key={assignment.id}>
                                <Card
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        p: 2,
                                        borderRadius: 3,
                                        height: "100%",
                                        boxShadow: theme.shadows[3],
                                        backgroundColor: theme.palette.background.paper,
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            width: 70,
                                            height: 70,
                                            borderRadius: 2,
                                            bgcolor: theme.palette.primary.dark,
                                            fontWeight: "bold",
                                            fontSize: 24,
                                            flexShrink: 0,
                                        }}
                                    >
                                        {assignment.title?.[0]?.toUpperCase() || "?"}
                                    </Avatar>
                                    <Box sx={{ ml: 2, flexGrow: 1, overflow: "hidden" }}>
                                        <Typography
                                            variant="h6"
                                            fontWeight="bold"
                                            sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                        >
                                            {assignment.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Due: {new Date(assignment.due_date).toLocaleDateString() || "N/A"}
                                        </Typography>
                                        <Typography variant="body2" fontWeight="medium">
                                            Marks: {assignment.marks}
                                        </Typography>

                                        <Box
                                            mt={1}
                                            display="flex"
                                            flexDirection={{ xs: "column", sm: "row" }}
                                            gap={1}
                                            width="100%"
                                        >
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                size="small"
                                                sx={{
                                                    textTransform: "none",
                                                    background: "linear-gradient(to right, #673AB7, #512DA8)",
                                                    color: "#fff",
                                                    "&:hover": {
                                                        background: "linear-gradient(to right, #512DA8, #311B92)",
                                                    },
                                                }}
                                                onClick={() => handleAssignmentClick(assignment.id)}
                                            >
                                                View Details
                                            </Button>
                                            <Button
                                                fullWidth
                                                variant={
                                                    selectedAssignments.includes(assignment.id)
                                                        ? "contained"
                                                        : "outlined"
                                                }
                                                size="small"
                                                color="primary"
                                                onClick={() => toggleSelectAssignment(assignment.id)}
                                                sx={{ textTransform: "none" }}
                                            >
                                                {selectedAssignments.includes(assignment.id) ? "Selected" : "Select"}
                                            </Button>
                                        </Box>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Pagination */}
                    <Box mt={4} display="flex" justifyContent="center">
                        <Pagination
                            count={pageCount}
                            page={page}
                            onChange={(e, value) => setPage(value)}
                            color="primary"
                        />
                    </Box>

                    {/* Confirm Delete Dialog */}
                    <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogContent>
                            <Typography>
                                Are you sure you want to delete the selected assignments?
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenDialog(false)} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={confirmDelete} color="secondary">
                                Confirm
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}
        </Container>
    );
};

export default AssignmentAllRead;
