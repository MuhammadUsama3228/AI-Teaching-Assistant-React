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

    const handleDelete = () => {
        setOpenDialog(true);
    };

    const confirmDelete = async () => {
        try {
            await Promise.all(selectedAssignments.map((assignmentId) =>
                api.delete(`/api/courses/assignment/${assignmentId}/`)
            ));
            setAssignments(assignments.filter((assignment) => !selectedAssignments.includes(assignment.id)));
            setSelectedAssignments([]);
        } catch (error) {
            console.error('Error deleting assignments:', error);
        } finally {
            setOpenDialog(false);
        }
    };

    const toggleSelectAssignment = (assignmentId) => {
        setSelectedAssignments((prevSelected) =>
            prevSelected.includes(assignmentId)
                ? prevSelected.filter((id) => id !== assignmentId)
                : [...prevSelected, assignmentId]
        );
    };

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
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
                    sx={{ width: { xs: '100%', sm: '250px' } }}
                />
            </Box>

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
                                        display: 'flex',
                                        alignItems: 'center',
                                        p: { xs: 1.5, sm: 2 },
                                        borderRadius: 3,
                                        boxShadow: theme.shadows[2],
                                        backgroundColor: theme.palette.background.paper,
                                        height: '100%',
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: 2,
                                            bgcolor: theme.palette.primary.dark,
                                            fontWeight: 'bold',
                                            flexShrink: 0,
                                        }}
                                    >
                                        {assignment.title?.[0]?.toUpperCase() || '?'}
                                    </Avatar>
                                    <Box sx={{ ml: 2, flexGrow: 1 }}>
                                        <Typography variant="h6" fontWeight="bold" noWrap>
                                            {assignment.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Due: {new Date(assignment.due_date).toLocaleDateString() || 'N/A'}
                                        </Typography>
                                        <Typography variant="body2" fontWeight="bold">
                                            Marks: {assignment.marks}
                                        </Typography>
                                        <Box
                                            mt={1}
                                            display="flex"
                                            flexDirection={{ xs: 'column', sm: 'row' }}
                                            gap={1}
                                        >
                                            <Button
                                                variant="contained"
                                                size="small"
                                                sx={{
                                                    textTransform: 'none',
                                                    background: 'linear-gradient(to right, #673AB7, #512DA8)',
                                                    color: '#fff',
                                                    '&:hover': {
                                                        background: 'linear-gradient(to right, #512DA8, #311B92)',
                                                    },
                                                    width: { xs: '100%', sm: 'auto' },
                                                }}
                                                onClick={() => handleAssignmentClick(assignment.id)}
                                            >
                                                View Details
                                            </Button>
                                            <Button
                                                variant={
                                                    selectedAssignments.includes(assignment.id) ? 'contained' : 'outlined'
                                                }
                                                size="small"
                                                color="primary"
                                                onClick={() => toggleSelectAssignment(assignment.id)}
                                                sx={{ textTransform: 'none', width: { xs: '100%', sm: 'auto' } }}
                                            >
                                                {selectedAssignments.includes(assignment.id) ? 'Selected' : 'Select'}
                                            </Button>
                                        </Box>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>


                    <Box mt={4} display="flex" justifyContent="center">
                        <Pagination
                            count={pageCount}
                            page={page}
                            onChange={(e, value) => setPage(value)}
                            color="primary"
                        />
                    </Box>

                    {/* Delete Confirmation Dialog */}
                    <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogContent>
                            <Typography>Are you sure you want to delete the selected assignments?</Typography>
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
