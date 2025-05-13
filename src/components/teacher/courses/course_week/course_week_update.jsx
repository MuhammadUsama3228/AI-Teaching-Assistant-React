import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, Container, Box, CircularProgress, Grid, Snackbar, Alert, Skeleton } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../../api';
import theme from '../../../Theme';

const CourseWeekUpdate = () => {
  const { id } = useParams();
  const [courseWeek, setCourseWeek] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseWeek = async () => {
      try {
        const response = await api.get(`api/courses/course_weeks/${id}/`);
        setCourseWeek(response.data);
      } catch (error) {
        console.error('Error fetching course week:', error);
        setError('Failed to load course week details.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseWeek();
  }, [id]);

  const handleFileChange = (e) => {
    setUploadedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courseWeek) return;

    const formData = new FormData();
    formData.append('course', courseWeek.course);
    formData.append('week_title', courseWeek.week_title);
    formData.append('description', courseWeek.description);
    if (uploadedFile) {
      formData.append('uploaded_file', uploadedFile);
    }

    try {
      const response = await api.put(`api/courses/course_weeks/${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setSuccess('Course week updated successfully!');
        navigate('/course_week_view');
      }
    } catch (error) {
      console.error('Error updating course week:', error);
      setError('Failed to update course week. Please try again.');
    }
  };

  if (loading) {
    return (
      
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ p: 3, border: '1px solid #ccc', borderRadius: '8px' }}>
          <Skeleton variant="text" width={200} height={40} />
          <Skeleton variant="rectangular" height={400} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ p: 3, border: '1px solid #ccc', borderRadius: '8px', }}>
     
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Week Title"
                value={courseWeek.week_title}
                size='small'
                onChange={(e) => setCourseWeek({ ...courseWeek, week_title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={courseWeek.description}
                onChange={(e) => setCourseWeek({ ...courseWeek, description: e.target.value })}
                required
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12}>
  <Button
    variant="contained"
    component="label"
    sx={{
      borderRadius: '8px',
      marginTop: '1rem',
      backgroundColor: '#fff', // Light background
      color: '#0a486d', // Optional: dark blue text
      border: '1px solid #0a486d', // Dark blue border
      boxShadow: '0px 4px 10px rgba(10, 72, 109, 0.4)', // Dark blue shadow
      '&:hover': {
        backgroundColor: '#f0f0f0',
        boxShadow: '0px 6px 15px rgba(10, 72, 109, 0.6)',
      },
    }}
  >
    Upload File
    <input type="file" hidden onChange={handleFileChange} />
  </Button>

  {uploadedFile && (
    <Typography variant="body2" sx={{ marginTop: '0.5rem' }}>
      {uploadedFile.name}
    </Typography>
  )}
</Grid>

          </Grid>

          <Box display="flex" justifyContent="flex-end" mt={3}>
            <Button variant="outlined" color="secondary" sx={{ mr: 2 }} onClick={() => navigate('/course_week_view')}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" type="submit">
              Update Course Week
            </Button>
          </Box>
        </form>

        <Snackbar open={Boolean(success)} autoHideDuration={6000} onClose={() => setSuccess('')}>
          <Alert onClose={() => setSuccess('')} severity="success">
            {success}
          </Alert>
        </Snackbar>

        <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setError('')}>
          <Alert onClose={() => setError('')} severity="error">
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default CourseWeekUpdate;
