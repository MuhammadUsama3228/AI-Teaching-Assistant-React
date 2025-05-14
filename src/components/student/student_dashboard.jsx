import React, { useState, useEffect } from 'react';
import { Typography, Container, Box, Card, CardContent, List, ListItem, ListItemText, Grid, Skeleton, Avatar, Paper } from '@mui/material';
import { School, EventNote, Assignment, Feedback as FeedbackIcon, Campaign as AnnouncementIcon, AccessTime as TimeIcon } from '@mui/icons-material';
import { Calendar } from 'react-calendar';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import 'react-calendar/dist/Calendar.css';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#9c27b0',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#202124',
      secondary: '#5f6368',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
    body1: {
      fontWeight: 400,
    },
    subtitle2: {
      fontWeight: 400,
      color: '#757575',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
        },
      },
    },
  },
});

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
        courseTitle: course ? course.course_title : 'Unknown',
        marks: submission.obtained_marks || 0,
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
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <Avatar alt={userName} src={userAvatar} sx={{ width: 56, height: 56, mr: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>Welcome, {userName}!</Typography>
        </Box>

        <Card sx={{ mb: 3, backgroundColor: '#e8f0fe', boxShadow: 1 }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1}>
              <AnnouncementIcon sx={{ color: '#1967d2' }} />
              <Typography variant="h6">Announcements</Typography>
            </Box>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {announcements.length > 0
                ? `${announcements.length} New ${announcements.length === 1 ? 'Announcement' : 'Announcements'}`
                : 'No new announcements.'}
            </Typography>
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <School sx={{ color: '#1967d2' }} />
                  <Typography variant="h6">Registered Courses</Typography>
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

          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Assignment sx={{ color: '#1967d2' }} />
                  <Typography variant="h6">Assignments</Typography>
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

          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <EventNote sx={{ color: '#1967d2' }} />
                  <Typography variant="h6">Calendar</Typography>
                </Box>
                <Calendar
                  onChange={setValue}
                  value={value}
                  tileContent={({ date }) => {
                    const assignmentsDue = assignment.filter(
                      (a) => new Date(a.due_date).toDateString() === date.toDateString()
                    );
                    return assignmentsDue.length > 0 && (
                      <Box sx={{ backgroundColor: '#1967d2', borderRadius: '50%', width: 20, height: 20, textAlign: 'center' }}>
                        <Typography variant="caption" color="white">{assignmentsDue.length}</Typography>
                      </Box>
                    );
                  }}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
    

            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" mb={2}>Line Chart - Avg Marks</Typography>
                <Line data={chartDataLine} />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" mb={2}>Bar Chart - Avg Marks</Typography>
                <Bar data={chartDataBar} />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <FeedbackIcon sx={{ color: '#1967d2' }} />
                  <Typography variant="h6">Feedback</Typography>
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

          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Box display="flex" alignItems="center" mb={2} gap={1}>
                  <TimeIcon sx={{ color: '#1967d2' }} />
                  <Typography variant="h6">Time Slots</Typography>
                </Box>

                {time_slots.length === 0 ? (
                  <Typography>No time slots available.</Typography>
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 2,
                      overflowX: 'auto',
                      p: 1,
                      scrollSnapType: 'x mandatory',
                    }}
                  >
                    {time_slots.map((slot) => (
                      <Box
                        key={slot.id}
                        onClick={() => navigate(`/time-slot/${slot.id}`)}
                        sx={{
                          flex: '0 0 auto',
                          minWidth: 160,
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: '#e3f2fd',
                          border: '1px solid #90caf9',
                          boxShadow: 1,
                          scrollSnapAlign: 'start',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            backgroundColor: '#bbdefb',
                            boxShadow: 3,
                          },
                        }}
                      >
                        <Typography variant="subtitle2" color="textSecondary">
                          {slot.day}
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {slot.course_name} ({slot.section})
                        </Typography>
                        <Typography variant="body2" mt={1}>
                          {slot.start_time} - {slot.end_time}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default StudentDashboard;
