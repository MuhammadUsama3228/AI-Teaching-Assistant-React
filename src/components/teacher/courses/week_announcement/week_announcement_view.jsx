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
  useMediaQuery,
} from '@mui/material';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import { useParams } from 'react-router-dom';
import api from '../../../../api';
import RecordNotFound from '../../../Record_not_found.jsx';

const WeekAnnouncementView = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { courseId, courseWeekId } = useParams();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [course, setCourse] = useState(null);
  const [courseWeek, setCourseWeek] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);

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

  const openDeleteDialog = (announcement) => {
    setAnnouncementToDelete(announcement);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!announcementToDelete) return;
    try {
      await api.delete(`/api/courses/week_announcement/${announcementToDelete.id}/`);
      setAnnouncements((prev) => prev.filter((a) => a.id !== announcementToDelete.id));
      setSnackbarMessage('Announcement deleted successfully.');
    } catch (err) {
      console.error(err);
      setSnackbarMessage('Failed to delete announcement.');
    } finally {
      setDeleteDialogOpen(false);
      setAnnouncementToDelete(null);
      setOpenSnackbar(true);
    }
  };

  const filteredAnnouncements = announcements.filter(
      (a) => String(a.course_week) === String(courseWeekId)
  );

  return (
      <Container
          maxWidth="lg"
          sx={{
            py: { xs: 4, sm: 6 },
            px: { xs: 2, sm: 4 },
          }}
      >
        <Typography
            variant="h5"
            fontWeight="bold"
            textAlign="center"
            gutterBottom
            sx={{ mb: 4 }}
        >
          {course && courseWeek
              ? `📢 Announcements - ${courseWeek.week_title} | ${course.course_title}`
              : '📢 Announcements'}
        </Typography>

        {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
              <CircularProgress color="primary" />
            </Box>
        ) : filteredAnnouncements.length === 0 ? (
            <RecordNotFound message="No announcements found for this week." />
        ) : (
            <Grid container spacing={3} justifyContent="center">
              {filteredAnnouncements.map((announcement) => (
                  <Grid item xs={12} sm={10} md={6} key={announcement.id}>
                    <Card
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          p: 2,
                          borderRadius: 3,
                          boxShadow: theme.shadows[2],
                          backgroundColor: theme.palette.background.paper,
                          transition: '0.3s',
                          '&:hover': {
                            boxShadow: theme.shadows[4],
                            transform: 'translateY(-2px)',
                          },
                        }}
                    >
                      <Avatar
                          sx={{
                            width: 64,
                            height: 64,
                            borderRadius: 2,
                            bgcolor: theme.palette.primary.main,
                            color: '#fff',
                          }}
                          variant="rounded"
                      >
                        <AnnouncementIcon />
                      </Avatar>
                      <Box sx={{ ml: 3, flexGrow: 1 }}>
                        <Typography variant="h6" fontWeight={600}>
                          {announcement.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(announcement.announcement_date).toLocaleString()}
                        </Typography>
                        <Box mt={2} display="flex" gap={1} flexWrap="wrap">
                          <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleOpenDialog(announcement)}
                              sx={{ textTransform: 'none' }}
                          >
                            View
                          </Button>
                          <Button
                              variant="text"
                              size="small"
                              color="error"
                              onClick={() => openDeleteDialog(announcement)}
                              sx={{ textTransform: 'none' }}
                          >
                            Delete
                          </Button>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
              ))}
            </Grid>
        )}

        {/* Details Dialog */}
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
          <DialogTitle sx={{ fontWeight: 600 }}>📋 Announcement Details</DialogTitle>
          <DialogContent dividers>
            {selectedAnnouncement && (
                <>
                  <Typography variant="caption" color="text.secondary">
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

        {/* Delete Confirmation */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>🗑️ Confirm Deletion</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this announcement?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button color="error" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
            open={openSnackbar}
            autoHideDuration={5000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="info" variant="filled">
            {snackbarMessage || error}
          </Alert>
        </Snackbar>
      </Container>
  );
};

export default WeekAnnouncementView;
