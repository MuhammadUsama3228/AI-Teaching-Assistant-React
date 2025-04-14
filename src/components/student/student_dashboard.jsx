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
} from '@mui/material';
import {
  School,
  EventNote,
  Assignment,
  Feedback as FeedbackIcon,
  Campaign as AnnouncementIcon,
  CheckCircle as AssignmentIcon,
} from '@mui/icons-material';
import { Calendar } from 'react-calendar'; // Ensure react-calendar is installed
import api from '../../api';
import 'react-calendar/dist/Calendar.css'; // Import styles for react-calendar

const StudentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [value, setValue] = useState(new Date());
  const [announcements, setAnnouncements] = useState([]);
  const studentId = 5;

  useEffect(() => {
    api.get('/api/manage_profile/')
    .then((res) => {
      setUserName(res.data.name);
      setUserAvatar(res.data.avatar);
    })
    .catch((error) => {
      console.error('Error fetching user profile:', error);
    });

    api.get('/api/courses/student_insight/')
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching student insight:', error);
      });

    api.get('/api/courses/week_announcement/')
      .then((res) => {
        setAnnouncements(res.data);
      })
      .catch((error) => {
        console.error('Error fetching announcements:', error);
      });
  }, []);

  if (loading) {
    return (
      <Container sx={{ mt: 4 }}>
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={160} sx={{ mb: 2 }} />
        ))}
      </Container>
    );
  }

  const { enrollments, courses, assignment, assignment_submission, feedback } = data;

  const enrolledCourses = enrollments.map((e) => {
    const course = courses.find((c) => c.id === e.course);
    return { ...course, enrollment_date: e.enrollment_date };
  });

  const userSubmissions = assignment_submission.filter((s) => s.student === studentId);
  const userFeedback = feedback.filter((f) =>
    userSubmissions.find((sub) => sub.id === f.submission_id)
  );

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
            <Typography variant="body1" sx={{ color: 'white' }}>
              {announcements.length} New {announcements.length === 1 ? 'Announcement' : 'Announcements'}
            </Typography>
          ) : (
            <Typography variant="body1" sx={{ color: 'white' }}>
              No new announcements.
            </Typography>
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
                      primary={(
                        <Box display="flex" alignItems="center">
                          <School sx={{ mr: 1 }} />
                          <Typography variant="body1">{`${course.course_title} (${course.section})`}</Typography>
                        </Box>
                      )}
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
                      primary={(
                        <Box display="flex" alignItems="center">
                          <AssignmentIcon sx={{ mr: 1 }} />
                          <Typography variant="body1">{a.title}</Typography>
                        </Box>
                      )}
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
                className="custom-calendar"
                tileContent={({ date }) => {
                  const assignmentsDue = assignment.filter(
                    (a) => new Date(a.due_date).toDateString() === date.toDateString()
                  );

                  return (
                    assignmentsDue.length > 0 && (
                      <Box className="assignment-badge">
                        <Typography variant="caption" color="white">
                          {assignmentsDue.length}
                        </Typography>
                      </Box>
                    )
                  );
                }}
              />
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
                      <ListItemText
                        primary={`Assignment: ${f.submission_title}`}
                        secondary={f.feedback_text}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography>No feedback available yet.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default StudentDashboard;
