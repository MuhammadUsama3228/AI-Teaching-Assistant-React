import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  ThemeProvider,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../../../../api'; // Adjust the import based on your project structure
import theme from '../../../Theme'; // Adjust the import based on your project structure

const CourseWeekForm = () => {
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState('');
  const [weekNumber, setWeekNumber] = useState('');
  const [weekTitle, setWeekTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingCourses, setFetchingCourses] = useState(true);
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/api/courses/course/');
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setFormError('Failed to fetch courses. Please try again later.');
      } finally {
        setFetchingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  const handleFileChange = (e) => {
    setUploadedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError('');

    if (!course || !weekTitle) {
      setLoading(false);
      setFormError('Please fill in all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('course', course);
    formData.append('week_number', weekNumber);
    formData.append('week_title', weekTitle);
    formData.append('description', description);
    if (uploadedFile) {
      formData.append('uploaded_file', uploadedFile);
    }

    try {
      const response = await api.post('/api/courses/course_weeks/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        navigate('/course_week_view');
      }
    } catch (error) {
      console.error('Error creating course week:', error);
      setFormError('An error occurred while creating the course week. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container
        component="main"
        maxWidth="sm"
        sx={{ padding: '2rem', backgroundColor: '#fff', boxShadow: 3, borderRadius: 2 }}
      >
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
          Create Course Week
        </Typography>

        {formError && (
          <Alert severity="error" sx={{ marginBottom: '1rem' }}>
            {formError}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
        <InputLabel id="course-select-label">Course</InputLabel>
        <Select
          labelId="course-select-label"
          id="course-select"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          label="Course"
          required
          disabled={fetchingCourses}
        >
          {fetchingCourses ? (
            <MenuItem value="" disabled>
              Loading courses...
            </MenuItem>
          ) : courses.length > 0 ? (
            courses.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.course_title}
              </MenuItem>
            ))
          ) : (
            <MenuItem value="" disabled>
              No courses available
            </MenuItem>
          )}
        </Select>
      </FormControl>

          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />

          <Button
            variant="contained"
            component="label"
            sx={{ marginTop: '1rem', borderRadius: '8px' }}
          >
            Upload File
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
          {uploadedFile && (
            <Typography variant="body2" sx={{ marginTop: '0.5rem' }}>
              {uploadedFile.name}
            </Typography>
          )}

          <Box sx={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
              sx={{
                padding: '10px 20px',
                fontSize: '16px',
                textTransform: 'none',
                borderRadius: '30px',
                '&:hover': { backgroundColor: '#1976d2' },
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Create Course Week'}
            </Button>
          </Box>
        </form>
      </Container>
    </ThemeProvider>
  );
};

export default CourseWeekForm;
