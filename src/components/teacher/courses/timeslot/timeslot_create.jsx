import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  CircularProgress,
  ThemeProvider,
  Skeleton,
  FormControl,
  InputLabel,
  MenuItem,
  FormHelperText,
  Select,
  Snackbar,
  Alert
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate

import api from '../../../../api';
import theme from '../../../Theme';

const TimeSlotModel = {
  course: '',
  day: '',
  start_time: '',
  end_time: '',
  room_link: '',
  timezone: 'UTC',
};

function TimeSlotForm() {
  const { id } = useParams();
  const navigate = useNavigate(); // Initialize the navigate hook
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [formData, setFormData] = useState({ ...TimeSlotModel, course: id || '' });
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar open state
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' or 'error'

  const daysOfWeek = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday',
  ];

  // Fetch the courses when the component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/api/courses/course/');
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setCoursesLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, course: id }));
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setErrors({});

    try {
      await api.post('api/courses/slots/', formData);
      setSuccess('Time Slot created successfully!');
      setFormData({ ...TimeSlotModel, course: id || '' });
      setSnackbarMessage('Time Slot created successfully!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);

      // After successful submission, navigate to "View Time Slot" page
      navigate(`/viewtimeslot`); // Modify this URL as per your routing setup
    } catch (err) {
      setErrors(err.response.data); // Capture and display validation errors
      setSnackbarMessage('Error creating time slot');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      console.error('Error creating time slot:', err);
    } finally {
      setLoading(false);
    }
  };

  // Find the course name based on the `id`
  const courseName = courses.find((course) => course.id === formData.course)?.name;

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Box
          sx={{
            p: 4,
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h5" gutterBottom color="primary">
            Create Time Slot
          </Typography>

          {/* Skeleton loader for form content */}
          {coursesLoading ? (
            <>
              <Skeleton variant="text" width="100%" height={40} />
              <Skeleton variant="text" width="60%" height={40} sx={{ my: 2 }} />
              <Skeleton variant="rectangular" width="100%" height={100} sx={{ mb: 3 }} />
            </>
          ) : (
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              {/* Day selection */}
              <FormControl fullWidth required error={Boolean(errors.day)} sx={{ mb: 3 }}>
                <InputLabel>Day</InputLabel>
                <Select
                  value={formData.day}
                  name="day"
                  onChange={handleInputChange}
                  label="Day"
                  variant="outlined"
                  sx={{ backgroundColor: '#f4f6f8' }}
                >
                  {daysOfWeek.map((day) => (
                    <MenuItem key={day} value={day}>
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
                {errors.day && <FormHelperText>{errors.day}</FormHelperText>}
              </FormControl>

              {/* Start Time */}
              <TextField
                label="Start Time"
                name="start_time"
                type="time"
                value={formData.start_time}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                error={Boolean(errors.start_time)}
                helperText={errors.start_time ? 'This field is required' : ''}
                sx={{ backgroundColor: '#f4f6f8' }}
              />

              {/* End Time */}
              <TextField
                label="End Time"
                name="end_time"
                type="time"
                value={formData.end_time}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                error={Boolean(errors.end_time)}
                helperText={errors.end_time ? 'This field is required' : ''}
                sx={{ backgroundColor: '#f4f6f8' }}
              />

              {/* Room Link */}
              <TextField
                label="Room Link"
                name="room_link"
                value={formData.room_link}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
                error={Boolean(errors.room_link)}
                helperText={errors.room_link ? 'This field is required' : ''}
                sx={{ backgroundColor: '#f4f6f8' }}
              />

              {/* Timezone */}
              <FormControl fullWidth required error={Boolean(errors.timezone)} sx={{ mb: 3 }}>
                <InputLabel>Timezone</InputLabel>
                <Select
                  value={formData.timezone}
                  name="timezone"
                  onChange={handleInputChange}
                  variant="outlined"
                  label="Timezone"
                  sx={{ backgroundColor: '#f4f6f8' }}
                >
                  <MenuItem value="UTC">UTC</MenuItem>
                  {/* Add more timezone options as needed */}
                </Select>
                {errors.timezone && <FormHelperText>{errors.timezone}</FormHelperText>}
              </FormControl>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 3 }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    Submitting
                    <CircularProgress size={20} sx={{ ml: 2 }} />
                  </>
                ) : (
                  'Create Time Slot'
                )}
              </Button>
            </form>
          )}
        </Box>
      </Container>

      {/* Snackbar to show success/error message */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default TimeSlotForm;
