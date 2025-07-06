import React, { useEffect, useState } from 'react';
import {
  Grid, Card, Typography, Box, CircularProgress, Divider, Snackbar,
  Alert, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Button, useTheme
} from '@mui/material';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import api from '../api';

export default function Teacherview() {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [enrollmentCount, setEnrollmentCount] = useState(0);
  const [courses, setCourses] = useState([]);
  const [slots, setSlots] = useState({});
  const [feedbackAverages, setFeedbackAverages] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [assignmentMarksData, setAssignmentMarksData] = useState([]);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [enrollRes, courseRes, slotsRes, feedbackRes, submissionRes] = await Promise.all([
          api.get('/api/courses/enrollment/'),
          api.get('/api/courses/course/'),
          api.get('/api/courses/slots/'),
          api.get('/api/courses/feedback/'),
          api.get('/api/courses/submission/')
        ]);

        setEnrollmentCount(Array.isArray(enrollRes.data) ? enrollRes.data.length : 0);
        setCourses(Array.isArray(courseRes.data) ? courseRes.data : []);

        const slotsData = {};
        slotsRes.data.forEach((slot) => {
          if (!slotsData[slot.course]) slotsData[slot.course] = [];
          slotsData[slot.course].push(slot);
        });
        setSlots(slotsData);

        const feedbackByCourse = {};
        feedbackRes.data.forEach((item) => {
          const courseId = item.course;
          const rating = parseFloat(item.rating);
          if (!feedbackByCourse[courseId]) feedbackByCourse[courseId] = [];
          if (!isNaN(rating)) feedbackByCourse[courseId].push(rating);
        });

        const feedbackSummary = Object.entries(feedbackByCourse).map(([courseId, ratings]) => {
          const courseTitle = courseRes.data.find(c => c.id === parseInt(courseId))?.course_title || 'Unknown';
          const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
          const max = Math.max(...ratings);
          const min = Math.min(...ratings);
          return {
            name: courseTitle,
            avgRating: parseFloat(avg.toFixed(2)),
            maxRating: parseFloat(max.toFixed(2)),
            minRating: parseFloat(min.toFixed(2))
          };
        });
        setFeedbackAverages(feedbackSummary);

        setPerformanceData(
            feedbackSummary.map(item => ({ name: item.name, performance: item.avgRating }))
        );

        const marksData = submissionRes.data
            .filter(sub => sub.obtained_marks !== null)
            .map(sub => ({ name: sub.assignment_title, marks: sub.obtained_marks }));
        setAssignmentMarksData(marksData);

      } catch {
        setError('Failed to load data. Please try again later.');
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSnackbarClose = () => setOpenSnackbar(false);

  const formatTime = (date) => date.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });

  const formatDate = (date) => date.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  if (loading) {
    return (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <CircularProgress />
          <Typography mt={2}>Loading Dashboard...</Typography>
        </Box>
    );
  }

  return (
      <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: 'background.default', minHeight: '100vh' }}>
        <Typography variant="h4" fontWeight="bold" mb={4} color="primary">
          Teacher Dashboard
        </Typography>

        {/* Summary Cards */}
        <Grid container spacing={3}>
          {[
            { title: 'Students Enrolled', value: enrollmentCount },
            { title: 'Calendar', value: 'Upcoming Activities' },
            { title: 'Total Courses', value: courses.length },
          ].map((card, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Card
                    sx={{
                      height: '100%',
                      p: 3,
                      borderRadius: 3,
                      backgroundColor: theme.palette.background.paper,
                      boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
                    }}
                >
                  <Typography variant="subtitle1" color="primary">{card.title}</Typography>
                  <Typography variant="h5" fontWeight="bold">{card.value}</Typography>
                </Card>
              </Grid>
          ))}
        </Grid>

        {/* Graphs Side by Side */}
        <Divider sx={{ my: 5 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight="bold" mb={2} color="primary">Feedback Ratings</Typography>
            <Card sx={{ p: 3, borderRadius: 3, backgroundColor: theme.palette.background.paper, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={feedbackAverages}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-15} textAnchor="end" />
                  <YAxis domain={[0, 5]} allowDecimals={true} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="minRating" fill={theme.palette.error.main} name="Min" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="avgRating" fill={theme.palette.primary.main} name="Avg" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="maxRating" fill={theme.palette.success.main} name="Max" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight="bold" mb={2} color="primary">Student Performance</Typography>
            <Card sx={{ p: 3, borderRadius: 3, backgroundColor: theme.palette.background.paper, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-15} textAnchor="end" />
                  <YAxis domain={[0, 5]} allowDecimals={true} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="performance" stroke={theme.palette.success.main} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Grid>
        </Grid>

        <Typography variant="h6" fontWeight="bold" mt={5} mb={2} color="primary">Assignment Marks</Typography>
        <Card sx={{ p: 3, mb: 5, borderRadius: 3, backgroundColor: theme.palette.background.paper, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={assignmentMarksData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-15} textAnchor="end" />
              <YAxis allowDecimals={true} />
              <Tooltip />
              <Legend />
              <Bar dataKey="marks" fill={theme.palette.secondary.main} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        {/* Clock */}
        <Divider sx={{ my: 5 }} />
        <Typography variant="h6" fontWeight="bold" mb={2} color="primary">Current Time</Typography>
        <Card sx={{ p: 3, mb: 3, borderRadius: 3, backgroundColor: theme.palette.background.paper, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
          <Typography variant="body1">{formatDate(currentTime)}</Typography>
          <Typography variant="h4" fontWeight="bold" color="primary.dark">
            {formatTime(currentTime)}
          </Typography>
        </Card>

        {/* Course List */}
        <Typography variant="h6" fontWeight="bold" mb={2} color="primary">Your Courses</Typography>
        <Grid container spacing={3}>
          {courses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course.id}>
                <Link to={`/coursedetail/${course.id}`} style={{ textDecoration: 'none' }}>
                  <Card
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        backgroundColor: theme.palette.background.paper,
                        boxShadow: '0 6px 16px rgba(0,0,0,0.05)',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                          transform: 'scale(1.02)',
                        },
                      }}
                  >
                    <Typography variant="h6" fontWeight="600">{course.course_title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {course.description || 'No description provided.'}
                    </Typography>
                  </Card>
                </Link>
              </Grid>
          ))}
        </Grid>



        {/* Course Time Slots */}
        <Divider sx={{ my: 5 }} />
        <Typography variant="h6" fontWeight="bold" mb={2} color="primary">Course Time Slots</Typography>
        <TableContainer component={Card} sx={{ borderRadius: 3, boxShadow: '0 6px 20px rgba(0,0,0,0.05)', backgroundColor: theme.palette.background.paper }}>
          <Table stickyHeader>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                {['Course', 'Section', 'Day', 'Start Time', 'End Time', 'Room Link'].map((header) => (
                    <TableCell key={header} sx={{ fontWeight: 'bold' }}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(slots).flatMap((courseId) =>
                  slots[courseId].map((slot) => (
                      <TableRow key={slot.id} hover>
                        <TableCell>{slot.course_name}</TableCell>
                        <TableCell>{slot.section}</TableCell>
                        <TableCell>{slot.day}</TableCell>
                        <TableCell>{slot.start_time}</TableCell>
                        <TableCell>{slot.end_time}</TableCell>
                        <TableCell>
                          {slot.room_link && slot.room_link !== 'N/A' ? (
                              <Button variant="outlined" size="small" href={slot.room_link} target="_blank" sx={{ textTransform: 'none' }}>
                                Join Room
                              </Button>
                          ) : 'N/A'}
                        </TableCell>
                      </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Snackbar */}
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </Box>
  );
}
