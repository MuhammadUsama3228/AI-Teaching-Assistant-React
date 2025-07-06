import React, { useEffect, useState } from 'react';
import {
  TextField, Button, Typography, Container, Box, Grid, Snackbar, Alert,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';  // ✅ Use MUI hook for theme
import api from '../../../../api';

const CourseWeekUpdate = () => {
  const theme = useTheme();  // ✅ Access your theme here
  const { id } = useParams();
  const [courseWeek, setCourseWeek] = useState(null);
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
        setError('Failed to load course week details.');
      }
    };
    fetchCourseWeek();
  }, [id]);

  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) setUploadedFile(file);
  };

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
    if (uploadedFile) formData.append('uploaded_file', uploadedFile);

    try {
      const response = await api.put(`api/courses/course_weeks/${id}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200) {
        setSuccess('Course week updated successfully!');
        navigate('/course_week_view');
      }
    } catch {
      setError('Failed to update course week.');
    }
  };

  if (!courseWeek) {
    return <Typography sx={{ mt: 10 }} align="center">Loading...</Typography>;
  }

  return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box
            sx={{
              p: 3,
              border: `1px dashed ${theme.palette.divider}`,
              borderRadius: '12px',
              backgroundColor: theme.palette.background.paper,
            }}
        >
          <Typography variant="h5" mb={3}>Update Course Week</Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Week Title"
                    value={courseWeek.week_title}
                    onChange={(e) => setCourseWeek({ ...courseWeek, week_title: e.target.value })}
                    required
                    size="small"
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
                <Box
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleFileDrop}
                    sx={{
                      border: `2px dashed ${theme.palette.primary.main}`,
                      padding: '1rem',
                      borderRadius: '8px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      backgroundColor: theme.palette.background.default,
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                    onClick={() => document.getElementById('file-input').click()}
                >
                  <Typography variant="body2">
                    {uploadedFile ? uploadedFile.name : 'Drag & drop a file here or click to upload'}
                  </Typography>
                  <input
                      id="file-input"
                      type="file"
                      hidden
                      onChange={handleFileChange}
                  />
                </Box>
              </Grid>
            </Grid>

            <Box display="flex" justifyContent="flex-end" mt={3} gap={2}>
              <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => navigate('/course_week_view')}
              >
                Cancel
              </Button>
              <Button
                  variant="contained"
                  color="primary"
                  type="submit"
              >
                Update
              </Button>
            </Box>
          </form>

          <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess('')}>
            <Alert onClose={() => setSuccess('')} severity="success">{success}</Alert>
          </Snackbar>

          <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
            <Alert onClose={() => setError('')} severity="error">{error}</Alert>
          </Snackbar>
        </Box>
      </Container>
  );
};

export default CourseWeekUpdate;
