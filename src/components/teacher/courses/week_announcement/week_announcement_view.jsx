import React, { useState, useEffect } from 'react';
import {
  Typography,
  Container,
  CircularProgress,
  Box,
  Card,
  Grid,
  Button,
  Avatar,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import { useParams } from 'react-router-dom';
import api from '../../../../api';
import RecordNotFound from '../../../Record_not_found.jsx';  // ✅ No record found animation

const WeekAnnouncementView = () => {
  const theme = useTheme();
  const { courseId, courseWeekId } = useParams();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [course, setCourse] = useState(null);
  const [courseWeek, setCourseWeek] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [announcementRes, courseRes, weekRes] = await Promise.all([
          api.get('/api/courses/week_announcement/', { params: { course_week: courseWeekId } }),
          api.get(`/api/courses/course/${courseId}/`),
          api.get(`/api/courses/course_weeks/${courseWeekId}/`),
        ]);
        setAnnouncements(announcementRes.data || []);
        setCourse(courseRes.data);
        setCourseWeek(weekRes.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch announcements.');
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId, courseWeekId]);

  const handleOpenDialog = (announcement) => {
    setSelectedAnnouncement(announcement);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => setDialogOpen(false);
  const handleCloseSnackbar = () => setOpenSnackbar(false);

  // ✅ Extra Safety Filter for Specific Course Week Announcements
  const filteredAnnouncements = announcements.filter(
      (a) => String(a.course_week) === String(courseWeekId)
  );

  return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {course && courseWeek
              ? `Announcements - ${courseWeek.week_title} | ${course.course_title}`
              : 'Announcements'}
        </Typography>

        {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
              <CircularProgress color="primary" />
            </Box>
        ) : filteredAnnouncements.length === 0 ? (
            <RecordNotFound message="No announcements found for this week." />
        ) : (
            <Grid container spacing={4}>
              {filteredAnnouncements.map((announcement) => (
                  <Grid item xs={12} md={6} key={announcement.id}>
                    <Card
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          p: 2,
                          borderRadius: 3,
                          boxShadow: theme.shadows[2],
                          backgroundColor: theme.palette.background.paper,
                        }}
                    >
                      <Avatar
                          sx={{
                            width: 70,
                            height: 70,
                            borderRadius: 2,
                            bgcolor: theme.palette.primary.dark,
                          }}
                          variant="rounded"
                      >
                        <AnnouncementIcon />
                      </Avatar>
                      <Box sx={{ ml: 3, flexGrow: 1 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          {announcement.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(announcement.announcement_date).toLocaleString()}
                        </Typography>
                        <Box mt={1}>
                          <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleOpenDialog(announcement)}
                              sx={{ textTransform: 'none' }}
                          >
                            View Details
                          </Button>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
              ))}
            </Grid>
        )}

        {/* Dialog for Announcement Details */}
        <Dialog
            open={dialogOpen}
            onClose={handleCloseDialog}
            fullWidth
            maxWidth="sm"
            PaperProps={{
              sx: {
                borderRadius: 4,
                background:
                    theme.palette.mode === 'dark'
                        ? theme.palette.background.paper
                        : '#f9f9fb',
              },
            }}
        >
          <DialogTitle sx={{ fontWeight: 600 }}>Announcement Details</DialogTitle>
          <DialogContent dividers>
            {selectedAnnouncement && (
                <>
                  <Typography variant="subtitle2" color="text.secondary">
                    {new Date(selectedAnnouncement.announcement_date).toLocaleString()}
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
                    {selectedAnnouncement.title}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    {selectedAnnouncement.content}
                  </Typography>
                </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for Error */}
        <Snackbar
            open={openSnackbar}
            autoHideDuration={5000}
            onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity="error">
            {error}
          </Alert>
        </Snackbar>
      </Container>
  );
};

export default WeekAnnouncementView;
