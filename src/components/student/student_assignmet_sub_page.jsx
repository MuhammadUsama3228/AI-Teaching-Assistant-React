import React, { useState, useEffect } from 'react';
import api from '../../api';
import { TextField, Button, Grid, Paper, Typography } from '@mui/material';

const AssignmentSubmissionForm = ({ assignmentId }) => {
  const [assignmentData, setAssignmentData] = useState(null);
  const [file, setFile] = useState(null);
  const [marks, setMarks] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch assignment data based on assignmentId
    const fetchAssignmentData = async () => {
      try {
        const response = await api.get(`/api/courses/student_insight/`);
        const assignment = response.data.assignment_submission.find(sub => sub.assignment === assignmentId);
        setAssignmentData(assignment);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching assignment data:", error);
        setLoading(false);
      }
    };
    
    fetchAssignmentData();
  }, [assignmentId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('marks', marks);
    formData.append('feedback', feedback);

    try {
      await api.post(`/api/assignments/submit/`, formData, {
        
      });
      alert('Assignment submitted successfully');
    } catch (error) {
      console.error("Error submitting assignment:", error);
      alert('Error submitting the assignment');
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Paper sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>Assignment Submission</Typography>
      <Typography variant="h6">{assignmentData.assignment_title}</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Marks Obtained"
              variant="outlined"
              type="number"
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Feedback"
              variant="outlined"
              multiline
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              component="label"
              fullWidth
            >
              Upload File
              <input
                type="file"
                hidden
                onChange={(e) => setFile(e.target.files[0])}
              />
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
            >
              Submit Assignment
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default AssignmentSubmissionForm;
