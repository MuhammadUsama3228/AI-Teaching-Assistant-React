import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { blue } from '@mui/material/colors';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const ReadAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch('/api/assignments');
        const data = await response.json();
        setAssignments(data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch assignments");
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const handleMenuClick = (event, assignment) => {
    setAnchorEl(event.currentTarget);
    setSelectedAssignment(assignment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAssignment(null);
  };

  const handleEdit = () => {
    navigate(`/assignmentupdate/${selectedAssignment.id}`);
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (selectedAssignment) {
      const confirmed = window.confirm("Are you sure you want to delete this assignment?");
      if (confirmed) {
        try {
          await fetch(`/api/assignments/${selectedAssignment.id}/`, {
            method: 'DELETE',
          });
          setAssignments(assignments.filter(a => a.id !== selectedAssignment.id));
          console.log("Deleted assignment:", selectedAssignment);
        } catch (error) {
          console.error("Error deleting assignment:", error);
        }
      }
      handleMenuClose();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: 5 }}>
      <Typography variant="h4" color={blue[900]} gutterBottom textAlign="center">
        All Assignments
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph textAlign="center">
        Below is the list of all assignments available in the system. Click on a title to view more details.
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 5 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center" variant="h6">
          {error}
        </Typography>
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
          <Table aria-label="assignments table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: blue[50] }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: blue[50] }}>Course</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: blue[50] }}>Due Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: blue[50] }}>Marks</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: blue[50] }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell component="th" scope="row">
                    <Link
                      to={`/assignments/${assignment.id}`}
                      style={{ textDecoration: 'none', color: blue[900] }}
                    >
                      {assignment.title}
                    </Link>
                  </TableCell>
                  <TableCell>{assignment.course}</TableCell>
                  <TableCell>{new Date(assignment.due_date).toLocaleDateString()}</TableCell>
                  <TableCell>{assignment.marks}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={(event) => handleMenuClick(event, assignment)}
                      size="small"
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {!loading && assignments.length === 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 5 }}>
          <Typography variant="h6" color="textSecondary">
            No assignments available at the moment.
          </Typography>
        </Box>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            width: '200px',
            boxShadow: 3,
          },
        }}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
        <MenuItem onClick={() => navigate(`/assignments/${selectedAssignment.id}`)}>View</MenuItem>
      </Menu>
    </Container>
  );
};

export default ReadAssignments;



