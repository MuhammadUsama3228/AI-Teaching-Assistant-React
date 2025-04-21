import React, { useState, useEffect } from 'react';
import {
  Typography,
  Container,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Grid,
  Skeleton,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  School,
  EventNote,
  Assignment,
  Feedback as FeedbackIcon,
  Campaign as AnnouncementIcon,
  CheckCircle as AssignmentIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { Calendar } from 'react-calendar';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import 'react-calendar/dist/Calendar.css';

// Importing the chart.js and react-chartjs-2
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

const StudentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [value, setValue] = useState(new Date());
  const [announcements, setAnnouncements] = useState([]);
  const [assignmentMarks, setAssignmentMarks] = useState([]);
  const studentId = 5;
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/manage_profile/')
      .then((res) => {
        setUserName(res.data.name);
        setUserAvatar(res.data.avatar);
      })
      .catch((error) => console.error('Error fetching user profile:', error));

    api.get('/api/courses/student_insight/')
      .then((res) => {
        setData(res.data);
        setLoading(false);
        calculateAverageMarks(res.data);
      })
      .catch((error) => console.error('Error fetching student insight:', error));

    api.get('/api/courses/week_announcement/')
      .then((res) => setAnnouncements(res.data))
      .catch((error) => console.error('Error fetching announcements:', error));
  }, []);

  const calculateAverageMarks = (data) => {
    const marksData = data.assignment_submission.map((submission) => {
      const course = data.courses.find((course) => course.id === submission.course);
      return {
        courseTitle: course_title ? course.course_title : 'Unknown',
        marks: submission.obtained_marks || 0, // Marks for the assignment
      };
    });

    const groupedData = marksData.reduce((acc, { courseTitle, marks }) => {
      if (!acc[courseTitle]) {
        acc[courseTitle] = [];
      }
      acc[courseTitle].push(marks);
      return acc;
    }, {});

    const avgMarks = Object.keys(groupedData).map((courseTitle) => {
      const marksArray = groupedData[courseTitle];
      const avg = marksArray.reduce((sum, mark) => sum + mark, 0) / marksArray.length;
      return { courseTitle, avgMarks: avg };
    });

    setAssignmentMarks(avgMarks);
  };

  if (loading || !data) {
    return (
      <Container sx={{ mt: 4 }}>
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={160} sx={{ mb: 2 }} />
        ))}
      </Container>
    );
  }

  const { enrollments, courses, assignment, assignment_submission, feedback, time_slots } = data;

  const enrolledCourses = enrollments.map((e) => {
    const course = courses.find((c) => c.id === e.course);
    return { ...course, enrollment_date: e.enrollment_date };
  });

  const userSubmissions = assignment_submission.filter((s) => s.student === studentId);
  const userFeedback = feedback.filter((f) =>
    userSubmissions.find((sub) => sub.id === f.submission_id)
  );

  // Chart.js Data Configuration
  const chartDataLine = {
    labels: assignmentMarks.map((item) => item.courseTitle),
    datasets: [
      {
        label: 'Average Marks per Course (Line)',
        data: assignmentMarks.map((item) => item.avgMarks),
        fill: false,
        borderColor: '#1976d2',
        tension: 0.1,
        borderWidth: 2,
        pointBackgroundColor: '#1976d2',
      },
    ],
  };

  const chartDataBar = {
    labels: assignmentMarks.map((item) => item.courseTitle),
    datasets: [
      {
        label: 'Average Marks per Course (Bar)',
        data: assignmentMarks.map((item) => item.avgMarks),
        backgroundColor: 'rgba(25, 118, 210, 0.5)',
        borderColor: '#1976d2',
        borderWidth: 1,
      },
    ],
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* User Name and Avatar */}
      <Box display="flex" alignItems="center" mb={2}>
        <Avatar alt={userName} src={userAvatar} sx={{ width: 56, height: 56, mr: 2 }} />
        <Typography variant="h4" sx={{ color: '#1976d2' }}>Welcome, {userName}!</Typography>
      </Box>

      {/* Announcements */}
      <Card sx={{ mb: 4, background: 'linear-gradient(to right, #1976d2, rgb(36, 63, 85))', color: 'white', boxShadow: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1}>
            <AnnouncementIcon />
            <Typography variant="h6">Announcements</Typography>
          </Box>
          {announcements.length > 0 ? (
            <Typography variant="body1">
              {announcements.length} New {announcements.length === 1 ? 'Announcement' : 'Announcements'}
            </Typography>
          ) : (
            <Typography variant="body1">No new announcements.</Typography>
          )}
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Registered Courses */}
        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 3, border: '1px solid #1976d2' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <School color="primary" />
                <Typography variant="h6" sx={{ color: '#1976d2' }}>Registered Courses</Typography>
              </Box>
              <List>
                {enrolledCourses.map((course) => (
                  <ListItem key={course.id} divider>
                    <ListItemText
                      primary={`${course.course_title} (${course.section})`}
                      secondary={`Weeks: ${course.weeks}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Assignments */}
        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 3, border: '1px solid #1976d2' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Assignment color="primary" />
                <Typography variant="h6" sx={{ color: '#1976d2' }}>Assignments</Typography>
              </Box>
              <List>
                {assignment.map((a) => (
                  <ListItem key={a.id} divider>
                    <ListItemText
                      primary={a.title}
                      secondary={`Due: ${new Date(a.due_date).toLocaleDateString()}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Calendar */}
        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 3, border: '1px solid #1976d2' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <EventNote color="primary" />
                <Typography variant="h6" sx={{ color: '#1976d2' }}>Calendar</Typography>
              </Box>
              <Calendar
                onChange={setValue}
                value={value}
                tileContent={({ date }) => {
                  const assignmentsDue = assignment.filter(
                    (a) => new Date(a.due_date).toDateString() === date.toDateString()
                  );
                  return (
                    assignmentsDue.length > 0 && (
                      <Box className="assignment-badge">
                        <Typography variant="caption" color="white">{assignmentsDue.length}</Typography>
                      </Box>
                    )
                  );
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Chart Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3, border: '1px solid #1976d2' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#1976d2' }} mb={2}>Average Marks per Course (Line Chart)</Typography>
              <Line data={chartDataLine} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3, border: '1px solid #1976d2' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#1976d2' }} mb={2}>Average Marks per Course (Bar Chart)</Typography>
              <Bar data={chartDataBar} />
            </CardContent>
          </Card>
        </Grid>

        {/* Feedback */}
        <Grid item xs={12}>
          <Card sx={{ boxShadow: 3, border: '1px solid #1976d2' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <FeedbackIcon color="primary" />
                <Typography variant="h6" sx={{ color: '#1976d2' }}>Feedback</Typography>
              </Box>
              {userFeedback.length > 0 ? (
                <List>
                  {userFeedback.map((f) => (
                    <ListItem key={f.id} divider>
                      <ListItemText primary={`Assignment: ${f.submission_title}`} secondary={f.feedback_text} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography>No feedback available yet.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Time Slots Table */}
        <Grid item xs={12}>
          <Card sx={{ boxShadow: 3, border: '1px solid #1976d2' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2} gap={1}>
                <TimeIcon color="primary" />
                <Typography variant="h6" sx={{ color: '#1976d2' }}>Time Slots</Typography>
              </Box>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead sx={{ backgroundColor: '#1976d2' }}>
                    <TableRow>
                      <TableCell sx={{ color: 'white' }}>Course</TableCell>
                      <TableCell sx={{ color: 'white' }}>Section</TableCell>
                      <TableCell sx={{ color: 'white' }}>Day</TableCell>
                      <TableCell sx={{ color: 'white' }}>Start Time</TableCell>
                      <TableCell sx={{ color: 'white' }}>End Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {time_slots.map((slot) => (
                      <TableRow
                        key={slot.id}
                        hover
                        sx={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/time-slot/${slot.id}`)}
                      >
                        <TableCell>{slot.course_name}</TableCell>
                        <TableCell>{slot.section}</TableCell>
                        <TableCell>{slot.day}</TableCell>
                        <TableCell>{slot.start_time}</TableCell>
                        <TableCell>{slot.end_time}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default StudentDashboard;
