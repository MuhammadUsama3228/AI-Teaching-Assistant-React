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
} from '@mui/material';
import { blue } from '@mui/material/colors';

const ReadSubmissionssStatus = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        
        const response = await fetch('/api/submissions'); 
        const data = await response.json();
        setSubmissions(data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch submissions");
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ marginTop: 5 }}>
      <Typography variant="h4" color={blue[900]} gutterBottom textAlign="center">
        Student Submissions
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
          <Table aria-label="submissions table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: blue[50] }}>Student</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: blue[50] }}>Assignment</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: blue[50] }}>Submission Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: blue[50] }}>Submission Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: blue[50] }}>Marks Obtained</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submissions.map((submission) => {
                const isOverdue = new Date(submission.assignment.due_date) < new Date();
                const submissionStatus = submission.file ? 'Submitted' : isOverdue ? 'Overdue' : 'Not Submitted';

                return (
                  <TableRow key={submission.id}>
                    <TableCell>{submission.student.username}</TableCell>
                    <TableCell>{submission.assignment.title}</TableCell>
                    <TableCell>{submissionStatus}</TableCell>
                    <TableCell>
                      {submission.submission_date
                        ? new Date(submission.submission_date).toLocaleDateString()
                        : 'N/A'}
                    </TableCell>
                    <TableCell>{submission.obtained_marks || 'N/A'}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {!loading && submissions.length === 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 5 }}>
          <Typography variant="h6" color="textSecondary">
            No submissions available at the moment.
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default ReadSubmissionssStatus;
