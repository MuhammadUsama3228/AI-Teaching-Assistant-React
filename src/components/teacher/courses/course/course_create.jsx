import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box, CircularProgress, ThemeProvider } from '@mui/material';
import api from '../../../../api';
import theme from '../../../Theme';
import { useNavigate } from 'react-router-dom';




const CreateCourseForm = () => {
  const [course_title, setCourseTitle] = useState('');
  const [description, setDescription] = useState('');  const [section, setSection] = useState('');
  const [weeks, setWeeks] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setLoading(true);

    if (!course_title || !weeks) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('api/courses/course/', {
        course_title,
        description,
        section,
        weeks,
      });

      console.log(response);
      if (response.status === 201) {
        navigate('/view-courses');
      }
    } catch (error) {
      console.error('Error creating course:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="sm" sx={{ padding: '2rem', backgroundColor: '#fff', boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
          Create New Course
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <TextField
            label="Course Title"
            variant="outlined"
            fullWidth
            value={course_title}
            size='small'
            onChange={(e) => setCourseTitle(e.target.value)}
            required
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px', // Rounded corners for the input
              },
              '& .Mui-focused': {
                borderColor: '#2196f3', // Blue border on focus
              },
              '& .MuiInputLabel-root': {
                color: '#555', // Lighter label color
              }
            }}
          />
          
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={4}
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px', 
              },
              '& .Mui-focused': {
                borderColor: '#2196f3', 
              },
            }}
          />
          
          <TextField
            label="Section"
             size='small'
            variant="outlined"
            fullWidth
            value={section}
            onChange={(e) => setSection(e.target.value)}
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
              '& .Mui-focused': {
                borderColor: '#2196f3',
              },
            }}
          />

          <TextField
            label="Duration (Weeks)"
            variant="outlined"
            fullWidth
            type="number"
            size='small'
            value={weeks}
            onChange={(e) => setWeeks(e.target.value)}
            required
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
              '& .Mui-focused': {
                borderColor: '#2196f3',
              },
            }}
          />
          
          <Box sx={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
              sx={{
                padding: '10px 20px',
                fontSize: '16px',
                textTransform: 'none',
                borderRadius: '30px', // Rounded button
                '&:hover': {
                  backgroundColor: '#1976d2', // Darker blue hover effect
                },
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Create Course'}
            </Button>
          </Box>
        </form>
      </Container>
    </ThemeProvider>
  );
};

export default CreateCourseForm;
