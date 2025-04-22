import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  Typography,
  Box,
  CircularProgress,
  Avatar,
  Divider,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Teacherview() {
  const [loading, setLoading] = useState(true);
  const [enrollmentCount, setEnrollmentCount] = useState(0);
  const [courses, setCourses] = useState([]);
  const [slots, setSlots] = useState({});
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const enrollRes = await api.get('/api/courses/enrollment/');
        const courseRes = await api.get('/api/courses/course/');
        const slotsRes = await api.get('/api/courses/slots/');

        setEnrollmentCount(Array.isArray(enrollRes.data) ? enrollRes.data.length : 0);
        setCourses(Array.isArray(courseRes.data) ? courseRes.data : []);

        const slotsData = {};
        slotsRes.data.forEach((slot) => {
          if (!slotsData[slot.course]) {
            slotsData[slot.course] = [];
          }
          slotsData[slot.course].push({
            id: slot.id,
            course_name: slot.course_name,
            section: slot.section,
            day: slot.day,
            start_time: slot.start_time,
            end_time: slot.end_time,
            room_link: slot.room_link || 'N/A',
          });
        });
        setSlots(slotsData);
      } catch (error) {
        setError('Failed to load data. Please try again later.');
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Update the time every second
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Clear the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <CircularProgress />
        <Typography mt={2}>Loading Dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        👨‍🏫 Teacher Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%', p: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(255, 87, 34, 0.2)', display: 'flex', alignItems: 'center', backgroundColor: '#fff' }}>
            <Avatar sx={{ bgcolor: '#ff5722', mr: 2 }}>
              <PeopleIcon />
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight="medium">Students Enrolled</Typography>
              <Typography variant="h5" fontWeight="bold">{enrollmentCount}</Typography>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%', p: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(63, 81, 181, 0.2)', display: 'flex', alignItems: 'center', backgroundColor: '#fff' }}>
            <Avatar sx={{ bgcolor: '#3f51b5', mr: 2 }}>
              <CalendarTodayIcon />
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight="medium">Calendar</Typography>
              <Typography variant="body2">View upcoming activities</Typography>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%', p: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0, 150, 136, 0.2)', display: 'flex', alignItems: 'center', backgroundColor: '#fff' }}>
            <Avatar sx={{ bgcolor: '#009688', mr: 2 }}>
              <SchoolIcon />
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight="medium">Total Courses</Typography>
              <Typography variant="h5" fontWeight="bold">{courses.length}</Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ my: 5 }} />

      <Typography variant="h5" fontWeight="bold" mb={2}>Current Time</Typography>
      <Card sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)', backgroundColor: '#fff' }}>
        <Typography variant="h6" fontWeight="bold">{formatDate(currentTime)}</Typography>
        <Typography variant="h4" fontWeight="bold">{formatTime(currentTime)}</Typography>
      </Card>

      <Typography variant="h5" fontWeight="bold" mb={2}>Your Courses</Typography>
      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course.id}>
            <Link to={`/coursedetail/${course.id}`} style={{ textDecoration: 'none' }}>
              <Card sx={{ height: '100%', p: 3, borderRadius: 3, backgroundColor: '#fff', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
                <Typography variant="h6">{course.course_title}</Typography>
                <Typography variant="body2" color="text.secondary">{course.description || 'No description provided.'}</Typography>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 5 }} />
      <Typography variant="h5" fontWeight="bold" mb={2}>Course Time Slots</Typography>
      <TableContainer sx={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', borderRadius: 2, backgroundColor: '#fff' }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Course</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Section</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Day</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Start Time</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>End Time</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Room Link</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(slots).map((courseId) =>
              slots[courseId].map((slot, index) => (
                <TableRow key={slot.id} sx={{ backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff', '&:hover': { backgroundColor: '#f1f1f1' } }}>
                  <TableCell>{slot.course_name}</TableCell>
                  <TableCell>{slot.section}</TableCell>
                  <TableCell>{slot.day}</TableCell>
                  <TableCell>{slot.start_time}</TableCell>
                  <TableCell>{slot.end_time}</TableCell>
                  <TableCell>
                    {slot.room_link !== 'N/A' ? (
                      <a href={slot.room_link} target="_blank" rel="noopener noreferrer" style={{ color: '#3f51b5', textDecoration: 'none' }}>
                        Join Room
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}
