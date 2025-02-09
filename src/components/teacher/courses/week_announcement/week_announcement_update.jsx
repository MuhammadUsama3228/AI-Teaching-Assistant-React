import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../../api';

const UpdateWeekAnnouncementForm = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [announcementDate, setAnnouncementDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await api.get(`/api/courses/week_announcement/${id}/`);
        const announcement = response.data;
        setTitle(announcement.title);
        setContent(announcement.content);
        setAnnouncementDate(announcement.announcement_date);
      } catch (error) {
        console.error('Error fetching announcement:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncement();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = {
      title,
      content,
      announcement_date:announcementDate,
    };

    try {
      const response = await api.put(`/api/courses/week_announcement/${id}/`, formData);
      if (response.status === 200) {
        setSnackbarMessage('Announcement updated successfully!');
        navigate('/week_announcement_view'); 
      }
    } catch (error) {
      console.error('Error updating announcement:', error);
      setSnackbarMessage('Failed to update announcement. Please try again.');
    } finally {
      setLoading(false);
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ padding: '2rem', backgroundColor: '#fff', boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
        Update Week Announcement
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            margin="normal"
            InputLabelProps={{ shrink: true }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />

          <TextField
            label="Content"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            margin="normal"
            InputLabelProps={{ shrink: true }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />

          <TextField
            label="Announcement Date"
            type="datetime-local"
            variant="outlined"
            fullWidth
            value={announcementDate}
            onChange={(e) => setAnnouncementDate(e.target.value)}
            required
            margin="normal"
            InputLabelProps={{ shrink: true }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />

          <Box sx={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{
                padding: '10px 20px',
                fontSize: '16px',
                textTransform: 'none',
                borderRadius: '30px',
              }}
            >
              Update Announcement
            </Button>
          </Box>
        </form>
      )}

   
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarMessage.includes('Failed') ? 'error' : 'success'}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UpdateWeekAnnouncementForm;
