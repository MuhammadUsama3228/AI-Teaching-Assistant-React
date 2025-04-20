import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Button, Grid, Paper, Typography, CircularProgress } from '@mui/material';

const AssignmentSubmissionForm = ({ assignmentId }) => {
  const [assignmentData, setAssignmentData] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchAssignmentData = async () => {
      try {
        const response = await api.get(`/api/courses/student_insight/`);
        const assignment = response.data.assignment_submission.find(sub => sub.assignment === assignmentId);
        setAssignmentData(assignment);
      } catch (err) {
        console.error("Error fetching assignment data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignmentData();
  }, [assignmentId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append('assignment', assignmentId);
    formData.append('file', file);

    try {
      await api.post(`/api/courses/submission/`, formData, {
        
      });
      alert('Assignment submitted successfully');
    } catch (err) {
      console.error("Submission error:", err);
      alert('Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Paper sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>Assignment Submission</Typography>

      {assignmentData && (
        <Typography variant="subtitle1" gutterBottom>
          Assignment: {assignmentData.assignment_title}
        </Typography>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
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
            {file && <Typography mt={1}>Selected File: {file.name}</Typography>}
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              disabled={submitting || !file}
            >
              {submitting ? 'Submitting...' : 'Submit Assignment'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default AssignmentSubmissionForm;
