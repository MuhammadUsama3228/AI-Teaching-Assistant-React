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
  useMediaQuery,
  useTheme,
} from '@mui/material';


import {
  School,
  EventNote,
  Assignment,
  Feedback as FeedbackIcon,
  Campaign as AnnouncementIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';

import GradeIcon from '@mui/icons-material/Grade';
import { Calendar } from 'react-calendar';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import {BASE_URL} from "../../constraints.js";
import 'react-calendar/dist/Calendar.css';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import profile from "../../pages/profile/profile/profile.jsx";


const customTheme = createTheme({
  palette: {
    primary: {
      main: '#4B2E83',
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
      color: '#4B2E83',
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
    MuiChip: {
      styleOverrides: {
        root: {
          borderColor: '#4B2E83',
          color: '#4B2E83',
        },
        outlinedPrimary: {
          borderColor: '#4B2E83',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#4B2E83',
        },
      },
    },
  },
});

const StudentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [UserName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [value, setValue] = useState(new Date());
  const [feedbacks, setFeedback] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [assignmentMarks, setAssignmentMarks] = useState([]);
  const studentId = 5;
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profile = await api.get(`/api/manage_profile/`);
        setUserName(profile.data.username);
        setUserAvatar(`${BASE_URL}${profile.data.profile_picture}`);
        console.log(profile.data.username);
        console.log(profile.data.profile_picture);

        const res1 = await api.get('/api/courses/student_insight/');
        setData(res1.data);
        setLoading(false);
        calculateAverageMarks(res1.data);

        const res2 = await api.get('/api/courses/week_announcement/');
        setAnnouncements(res2.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
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
      if (!acc[courseTitle]) acc[courseTitle] = [];
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
  const userFeedback = data.feedback.map((f) => ({
    id: f.id,
    title: f.submission_title,
    feedback: f.feedback_text,
    checked: f.checked_status,
    rating: f.rating,
  }));

  const primaryColor = theme.palette.primary.main;

  const chartDataLine = {
    labels: assignmentMarks.map((item) => item.courseTitle),
    datasets: [
      {
        label: 'Average Marks per Course (Line)',
        data: assignmentMarks.map((item) => item.avgMarks),
        fill: false,
        borderColor: "#4B2E83",
        tension: 0.1,
        borderWidth: 2,
        pointBackgroundColor: "#4B2E83",
      },
    ],
  };

  const chartDataBar = {
    labels: assignmentMarks.map((item) => item.courseTitle),
    datasets: [
      {
        label: 'Average Marks per Course (Bar)',
        data: assignmentMarks.map((item) => item.avgMarks),
        backgroundColor: `${'#4B2E83'}80`,
        borderColor: '#4B2E83',
        borderWidth: 1,
      },
    ],
  };

  const chartDataRatings = {
    labels: userFeedback.map((f) => f.title),
    datasets: [
      {
        label: 'Grade Points (Ratings)',
        data: userFeedback.map((f) => parseFloat(f.rating)),
        backgroundColor: '#4B2E83',
        borderColor: '#311b92',
        borderWidth: 1,
      },
    ],
  };


  return (
      <ThemeProvider theme={customTheme}>
        <Container maxWidth="lg" sx={{ mt: isMobile ? 2 : 4, mb: 4 }}>
          <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} alignItems="center" mb={3}>
            <Avatar alt={UserName} src={userAvatar} sx={{ width: 56, height: 56, mr: isMobile ? 0 : 2, mb: isMobile ? 1 : 0 }} />
            <Typography variant={isMobile ? 'h5' : 'h4'} sx={{ fontWeight: 'bold', color: '#4B2E83' }}>
              Welcome,{UserName} !
            </Typography>
          </Box>

          <Card sx={{ mb: 3, backgroundColor: '#cdb5d8', boxShadow: 1 }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <AnnouncementIcon sx={{ color: "#4B2E83" +
                      "" }} />
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
                    <School sx={{ color: '#4B2E83' }} />
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
                    <Assignment sx={{ color: "#4B2E83"}} />
                    <Typography variant="h6">Assignments</Typography>
                  </Box>
                  <List>
                    {assignment
                        .filter((a) => new Date(a.due_date) >= new Date()) // Only future or today
                        .sort((a, b) => new Date(a.due_date) - new Date(b.due_date)) // Sort by earliest
                        .map((a) => (
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
                    <EventNote sx={{ color: "#4B2E83" }} />
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
                            <Box
                                sx={{
                                  backgroundColor: "#4B2E83",
                                  borderRadius: '50%',
                                  width: 20,
                                  height: 20,
                                  textAlign: 'center',
                                }}
                            >
                              <Typography variant="caption" color="white">
                                {assignmentsDue.length}
                              </Typography>
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
                  <Typography variant="h6" mb={2}>
                    Line Chart - Avg Marks
                  </Typography>
                  <Line data={chartDataLine} />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" mb={2}>
                    Bar Chart - Avg Marks
                  </Typography>
                  <Bar data={chartDataBar} />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <GradeIcon sx={{ color: '#4B2E83' }} />
                    <Typography variant="h6">Grade Points by Submission</Typography>
                  </Box>

                  <Bar data={chartDataRatings} />
                </CardContent>
              </Card>
            </Grid>





            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2} gap={1}>
                    <TimeIcon sx={{ color: "#4B2E83" }} />
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
                                  backgroundColor: '#cdb5d8',
                                  border: '1px solid #90caf9',
                                  boxShadow: 1,
                                  scrollSnapAlign: 'start',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease-in-out',
                                  '&:hover': {
                                    backgroundColor: '#cdb5d8',
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
