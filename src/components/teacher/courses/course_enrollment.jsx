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
  Grid,
} from '@mui/material';
import api from '../../../api';
import theme from '../../Theme';
import { useNavigate } from 'react-router-dom';

const InviteEnrollmentForm = () => {
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingCourses, setFetchingCourses] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('api/courses/course/');
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setFetchingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!course || !studentEmail) {
      setLoading(false);
      return;
    }

    try {

      const response = await api.post('/api/courses/invite_enrollment/', {
        course,
        student_email: studentEmail,
      });

      if (response.status === 201) {
        navigate('/');
      }
    } catch (error) {
      console.error('Error creating invite enrollment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Invite Enrollment
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            mt: 2,
            p: 3,
            backgroundColor: '#fff',
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Course</InputLabel>
                <Select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  disabled={fetchingCourses}
                  sx={{ borderRadius: 1 }}
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
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Student Email"
                type="email"
                fullWidth
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                required
                InputLabelProps={{ shrink: true }}
                sx={{ borderRadius: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={loading}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    borderRadius: '30px',
                    textTransform: 'none',
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: '#fff' }} />
                  ) : (
                    'Send Invite'
                  )}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default InviteEnrollmentForm;
