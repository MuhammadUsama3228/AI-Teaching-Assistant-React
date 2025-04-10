import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Snackbar,
  Alert,
  Box,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material'; // Icon for accordion
import api from '../../api'; // Assuming you have api configured here

const StudentAssignmentDetailPage = () => {
  const { assignmentId } = useParams(); // Get assignment ID from URL parameters
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignmentDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/api/courses/student_insight/`);
        const assignments = response.data.assignment; // Assuming this returns an array of assignments
        const foundAssignment = assignments.find((assn) => assn.id === parseInt(assignmentId));
        
        if (foundAssignment) {
          setAssignment(foundAssignment);
        } else {
          throw new Error('Assignment not found');
        }
      } catch (error) {
        setError('Failed to fetch assignment details');
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    if (assignmentId) {
      fetchAssignmentDetails();
    }
  }, [assignmentId]);

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleSubmit = () => {
    // Redirect to submission page
    navigate(`/assignment/submit/${assignmentId}`);
  };

  return (
    <Container
      component="main"
      maxWidth="lg"
      sx={{
        margin: '50px auto', // Center the container with auto left/right margins and add top margin
        padding: '3rem 1rem',
        display: 'flex', // Use flex to center content
        flexDirection: 'column', // Stack elements vertically
        alignItems: 'center', // Center content horizontally
        borderRadius: '12px',
        backgroundColor: '#f9f9f9',
        boxShadow: 3,
      }}
    >
      {loading ? (
        <Typography variant="h6" textAlign="center">Loading...</Typography>
      ) : error ? (
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      ) : assignment ? (
        <Box textAlign="left" width="100%"> {/* Make Box full width for left alignment */}
          <Avatar sx={{ bgcolor: '#1976d2', margin: '0 auto', width: 100, height: 100 }}>
            <Typography variant="h5" color="#fff">{assignment.title.charAt(0)}</Typography>
          </Avatar>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: '700', color: '#2c3e50', marginTop: 2, textAlign: 'left' }}>
            {assignment.title}
          </Typography>
          
          <Divider sx={{ marginY: 2 }} />
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />} sx={{ bgcolor: '#e3f2fd' }}>
              <Typography variant="h6">Assignment Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box textAlign="left">
                <Typography variant="body1"><strong>Description:</strong> {assignment.description}</Typography>
                <Typography variant="body1"><strong>Marks:</strong> {assignment.marks}</Typography>
                <Typography variant="body1"><strong>Due Date:</strong> {new Date(assignment.due_date).toLocaleString()}</Typography>
                <Typography variant="body1"><strong>Allowed File Types:</strong> {assignment.allowed_file_types || 'None'}</Typography>
                <Typography variant="body1"><strong>Max File Size:</strong> {assignment.max_file_size / 1024 / 1024} MB</Typography>
                <Typography variant="body1"><strong>Attempts Allowed:</strong> {assignment.attempts}</Typography>
              </Box>
            </AccordionDetails>
          </Accordion>

          <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ marginTop: '2rem' }}>
            Submit Assignment
          </Button>
        </Box>
      ) : (
        <Typography variant="h6" color="textSecondary" textAlign="center">No assignment details available.</Typography>
      )}
    </Container>
  );
};

export default StudentAssignmentDetailPage;
