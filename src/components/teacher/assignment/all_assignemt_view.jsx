import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Typography,
    Container,
    Box,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Paper,
    Checkbox,
    Button,
    Skeleton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import api from '../../../api';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    marginTop: theme.spacing(2),
    overflowX: 'auto', // Ensures table can scroll on small screens
}));

const AssignmentAllRead = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('id');
    const [selectedAssignments, setSelectedAssignments] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const response = await api.get('/api/courses/assignment/');
                setAssignments(response.data);
            } catch (err) {
                console.error('Error fetching assignments:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAssignments();
    }, []);

    const handleCardClick = (assignmentId) => {
        navigate(`/courses/assignments/${assignmentId}/details`);
    };

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            const newSelecteds = assignments.map((assignment) => assignment.id);
            setSelectedAssignments(newSelecteds);
            return;
        }
        setSelectedAssignments([]);
    };

    const handleSelectOne = (assignmentId) => {
        const selectedIndex = selectedAssignments.indexOf(assignmentId);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selectedAssignments, assignmentId);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selectedAssignments.slice(1));
        } else if (selectedIndex === selectedAssignments.length - 1) {
            newSelected = newSelected.concat(selectedAssignments.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selectedAssignments.slice(0, selectedIndex),
                selectedAssignments.slice(selectedIndex + 1),
            );
        }

        setSelectedAssignments(newSelected);
    };

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
        } catch (err) {
            console.error('Error deleting assignments:', err);
        } finally {
            setOpenDialog(false);
        }
    };

    const sortedAssignments = [...assignments].sort((a, b) => {
        const isAsc = order === 'asc';
        if (orderBy === 'id') {
            return isAsc ? a.id - b.id : b.id - a.id;
        } else if (orderBy === 'due_date') {
            return isAsc ? new Date(a.due_date) - new Date(b.due_date) : new Date(b.due_date) - new Date(a.due_date);
        }
        return 0;
    });

    return (
        <Container maxWidth="lg" sx={{ mt: 5 }}>
            <Typography variant="h4" gutterBottom textAlign="center" sx={{ fontWeight: '600', color: '#333', marginBottom: '2rem' }}>
                All Assignments
            </Typography>

            {loading ? (
                <Box display="flex" flexDirection="column" alignItems="center" height="50vh">
                    <CircularProgress />
                    <Skeleton variant="rectangular" width="100%" height={200} sx={{ marginTop: 2 }} />
                </Box>
            ) : !Array.isArray(assignments) || assignments.length === 0 ? (
                <Typography variant="body1" textAlign="center" color="textSecondary">
                    No assignments available.
                </Typography>
            ) : (
                <>
                    <Box display="flex" justifyContent="flex-end" mb={2}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleDelete}
                            disabled={selectedAssignments.length === 0}
                        >
                            Delete Selected
                        </Button>
                    </Box>
                    <StyledTableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            color="primary"
                                            indeterminate={selectedAssignments.length > 0 && selectedAssignments.length < assignments.length}
                                            checked={assignments.length > 0 && selectedAssignments.length === assignments.length}
                                            onChange={handleSelectAll}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={orderBy === 'id'}
                                            direction={orderBy === 'id' ? order : 'asc'}
                                            onClick={() => handleRequestSort('id')}
                                        >
                                            Assignment ID
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>Title</TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={orderBy === 'due_date'}
                                            direction={orderBy === 'due_date' ? order : 'asc'}
                                            onClick={() => handleRequestSort('due_date')}
                                        >
                                            Due Date
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>Marks</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedAssignments.map((assignment) => (
                                    <TableRow key={assignment.id} hover>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={selectedAssignments.indexOf(assignment.id) !== -1}
                                                onChange={() => handleSelectOne(assignment.id)}
                                            />
                                        </TableCell>
                                        <TableCell onClick={() => handleCardClick(assignment.id)} style={{ cursor: 'pointer' }}>
                                            {assignment.id}
                                        </TableCell>
                                        <TableCell onClick={() => handleCardClick(assignment.id)} style={{ cursor: 'pointer' }}>
                                            {assignment.title}
                                        </TableCell>
                                        <TableCell onClick={() => handleCardClick(assignment.id)} style={{ cursor: 'pointer' }}>
                                            {new Date(assignment.due_date).toLocaleString()}
                                        </TableCell>
                                        <TableCell onClick={() => handleCardClick(assignment.id)} style={{ cursor: 'pointer' }}>
                                            {assignment.marks}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </StyledTableContainer>

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
