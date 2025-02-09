import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Typography,
  Container,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import api from '../../../../api';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const WeekAnnouncementView = () => {
  const { courseId, courseWeekId } = useParams();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('announcement_date');
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [course, setCourse] = useState(null);
  const [courseWeek, setCourseWeek] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/api/courses/week_announcement/`, {
          params: {
            course_week: courseWeekId,
          },
        });
        if (response.status === 200) {
          setAnnouncements(response.data || []);
        }
      } catch (error) {
        console.error('Error fetching announcements:', error);
        setError('Failed to load announcements. Please try again.');
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    const fetchCourseDetails = async () => {
      try {
        const response = await api.get(`/api/courses/course/${courseId}/`);
        if (response.status === 200) {
          setCourse(response.data);
        }
      } catch (error) {
        console.error('Error fetching course:', error);
        setError('Failed to load course details. Please try again.');
        setOpenSnackbar(true);
      }
    };

    const fetchCourseWeekDetails = async () => {
      try {
        const response = await api.get(`/api/courses/course_weeks/${courseWeekId}/`);
        if (response.status === 200) {
          setCourseWeek(response.data);
        }
      } catch (error) {
        console.error('Error fetching course week:', error);
        setError('Failed to load course week details. Please try again.');
        setOpenSnackbar(true);
      }
    };

    fetchAnnouncements();
    fetchCourseDetails();
    fetchCourseWeekDetails();
  }, [courseId, courseWeekId]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedAnnouncements = [...announcements].sort((a, b) => {
    const isAsc = order === 'asc';
    if (orderBy === 'announcement_date') {
      return isAsc
        ? new Date(a.announcement_date) - new Date(b.announcement_date)
        : new Date(b.announcement_date) - new Date(a.announcement_date);
    }
    return 0;
  });

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: '2rem', padding: '2rem', backgroundColor: '#fff', borderRadius: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
       
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : announcements.length === 0 ? (
        <Typography variant="h6" color="textSecondary" align="center">
          No announcements found for this week.
        </Typography>
      ) : (
        <>
          {course && courseWeek && (
            <Typography variant="h4" gutterBottom>
              Announcements for Week {courseWeek.week_title} in Course {course.course_title}
            </Typography>
          )}
          <StyledTableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'announcement_date'}
                      direction={orderBy === 'announcement_date' ? order : 'asc'}
                      onClick={() => handleRequestSort('announcement_date')}
                    >
                      Date
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Content</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedAnnouncements.map((announcement) => (
                  <TableRow key={announcement.id}>
                    <TableCell>{new Date(announcement.announcement_date).toLocaleString()}</TableCell>
                    <TableCell>{announcement.title}</TableCell>
                    <TableCell>{announcement.content}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </StyledTableContainer>
        </>
      )}

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default WeekAnnouncementView;
