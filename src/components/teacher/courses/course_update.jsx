import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Container, Box, TextField, Button, CircularProgress, Grid, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import api from '../../../api';

// Custom Styles
const StyledContainer = styled(Container)(({ theme }) => ({
    maxWidth: 'lg',
    paddingTop: '4rem',
    paddingBottom: '2rem',
    backgroundColor: theme.palette.background.paper,
}));

const StyledCard = styled(Box)(({ theme }) => ({
    borderRadius: '12px',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(4),
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
    },
}));

const ActionButton = styled(Button)(({ theme }) => ({
    textTransform: 'capitalize',
    fontWeight: '600',
    borderRadius: '50px',
    padding: theme.spacing(1.5, 3),
    minWidth: '160px',
    marginTop: theme.spacing(2),
}));

const CourseUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState({
        course_title: '',
        description: '',
        section: '',
        weeks: '',
        course_code: '',
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await api.get(`api/courses/course/${id}/`);
                setCourse(response.data);
            } catch (error) {
                console.error('Error fetching course details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourse({ ...course, [name]: value });
    };

    const handleUpdate = async (e) => {
      e.preventDefault();
      try {
          
          await api.put(`api/courses/course/${id}/`, course);
          
          navigate(`/view-courses`);
      } catch (error) {
          console.error('Error updating course:', error);
      }
  };



    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <StyledContainer component="main">
            <StyledCard>
                <Typography variant="h4" sx={{ fontWeight: '700', color: 'primary.main', textAlign: 'center' }} gutterBottom>
                    Update Course
                </Typography>

                <Divider sx={{ marginY: 2 }} />

                <form onSubmit={handleUpdate}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Course Title"
                                variant="outlined"
                                name="course_title"
                                value={course.course_title}
                                onChange={handleChange}
                                required
                                sx={{ marginBottom: '16px' }}
                            />
                        </Grid>
                       
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                variant="outlined"
                                name="description"
                                value={course.description}
                                onChange={handleChange}
                                required
                                multiline
                                rows={4}
                                sx={{ marginBottom: '16px' }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Section"
                                variant="outlined"
                                name="section"
                                value={course.section}
                                onChange={handleChange}
                                required
                                sx={{ marginBottom: '16px' }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Duration (Weeks)"
                                variant="outlined"
                                name="weeks"
                                value={course.weeks}
                                onChange={handleChange}
                                required
                                sx={{ marginBottom: '16px' }}
                            />
                        </Grid>
                    </Grid>

                    <Box display="flex" justifyContent="space-between" mt={4}>
                        <ActionButton variant="outlined" color="error" onClick={() => navigate(`/coursedetail/${id}`)}>
                            Cancel
                        </ActionButton>
                        <ActionButton variant="contained" color="primary" type="submit">
                            Save Changes
                        </ActionButton>
                    </Box>
                </form>
            </StyledCard>
        </StyledContainer>
    );
};

export default CourseUpdate;
