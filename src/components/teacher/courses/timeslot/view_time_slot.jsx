import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import api from '../../../../api';

const TimeSlotView = () => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [courses, setCourses] = useState([]);

  const formatTime = (timeString) => {
    const [hour, minute] = timeString.split(':');
    const date = new Date();
    date.setHours(hour, minute);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await api.get('/api/courses/slots/');
        const data = response.data;
        setTimeSlots(data);
        // Extract unique courses for filtering
        const uniqueCourses = Array.from(
          new Set(data.map((slot) => slot.course_name))
        );
        setCourses(uniqueCourses);
      } catch (error) {
        console.error('Error fetching time slots:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, []);

  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
  };

  // Filter time slots based on selected course
  const filteredTimeSlots = selectedCourse
    ? timeSlots.filter((slot) => slot.course_name === selectedCourse)
    : timeSlots;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Course Filter Dropdown */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Course</InputLabel>
        <Select
          value={selectedCourse}
          label="Course"
          onChange={handleCourseChange}
        >
          <MenuItem value="">All Courses</MenuItem>
          {courses.map((course, index) => (
            <MenuItem key={index} value={course}>
              {course}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Time Slot Table */}
      <TableContainer component={Paper} sx={{ maxWidth: '100%' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="h6">Course Name</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Section</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Day</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Time</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Room Link</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Timezone</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTimeSlots.map((slot, index) => (
              <TableRow key={index}>
                <TableCell>{slot.course_name}</TableCell>
                <TableCell>{slot.section}</TableCell>
                <TableCell>{slot.day.charAt(0).toUpperCase() + slot.day.slice(1)}</TableCell>
                <TableCell>{formatTime(slot.start_time)} - {formatTime(slot.end_time)}</TableCell>
                <TableCell>
                  {slot.room_link ? (
                    <a href={slot.room_link} target="_blank" rel="noopener noreferrer">
                      {slot.room_link}
                    </a>
                  ) : (
                    'Not Provided'
                  )}
                </TableCell>
                <TableCell>{slot.timezone}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TimeSlotView;
