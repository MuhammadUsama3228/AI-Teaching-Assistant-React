import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Container,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Skeleton,
} from '@mui/material';
import api from '../../../../api'; 
import { useNavigate } from 'react-router-dom';

const WeekAnnouncementForm = ({ courseId, courseWeekId }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [announcementDate, setAnnouncementDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();

 
  useEffect(() => {
    const fetchData = async () => {
      // Simulate a delay for loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false); // Set loading to false after fetching
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = {
        title,
        content,
        announcement_date: announcementDate,
        course_week: courseWeekId, 
        course: courseId, 
      };

      const response = await api.post(  `/api/courses/week_announcement/`, formData);
      if (response.status === 201) {
        setSnackbarMessage('Announcement created successfully!');
        setOpenSnackbar(true);
        setTimeout(() => {
          navigate(`/course/${courseId}/weeks/${courseWeekId}/announcements`);

        }, 2000);
        
      }
    } catch (error) {
      console.error('Error creating week announcement:', error);
      setSnackbarMessage('Failed to create announcement. Please try again.');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{
        padding: '2rem',
        backgroundColor: '#fff',
        boxShadow: 3,
        borderRadius: 2,
        marginTop: '2rem',
      }}
    >
      {loading ? (
        // Skeleton Loader while loading
        <Box>
          <Skeleton variant="text" width="60%" height={40} />
          <Skeleton variant="rectangular" height={56} />
          <Skeleton variant="rectangular" height={56} />
          <Skeleton variant="rectangular" height={56} />
          <Skeleton variant="rectangular" height={56} />
        </Box>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Announcement Title Input */}
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            size='small'
            margin="normal"
          />

          {/* Announcement Content Input */}
          <TextField
            label="Content"
            variant="outlined"
            fullWidth
            size='small'
            multiline
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            margin="normal"
          />

          {/* Announcement Date Input */}
          <TextField
            label="Announcement Date"
            type="datetime-local"
            variant="outlined"
            fullWidth
            value={announcementDate}
            onChange={(e) => setAnnouncementDate(e.target.value)}
            required
            size='small'
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />

          <Box sx={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              color="primary"
              type="submit"
              disabled={loading}
              sx={{
                padding: '10px 20px',
                fontSize: '16px',
                textTransform: 'none',
                borderRadius: '30px',
                boxShadow:'3',
                '&:hover': { backgroundColor: '#0D355DFF', color: '#fff' },
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: '#104375FF' }} /> : 'Create Announcement'}
            </Button>
          </Box>
        </form>
      )}

      {/* Snackbar Notification */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarMessage.includes('Failed') ? 'error' : 'success'}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};


export default WeekAnnouncementForm;




