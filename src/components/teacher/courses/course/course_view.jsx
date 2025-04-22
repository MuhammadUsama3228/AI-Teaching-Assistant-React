import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Container,
  Box,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Avatar,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import api from '../../../../api';

// Icons
import ScheduleIcon from '@mui/icons-material/Schedule';
import GroupIcon from '@mui/icons-material/Group';
import VisibilityIcon from '@mui/icons-material/Visibility';

// Styled Card with modern glassmorphism effect
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '20px',
  backdropFilter: 'blur(8px)',
  background: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(255, 255, 255, 0.85)',
  boxShadow: theme.shadows[3],
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-6px)',
    boxShadow: theme.shadows[8],
    cursor: 'pointer',
  },
}));

const CourseAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(10),
  height: theme.spacing(10),
  backgroundColor: theme.palette.primary.main,
  fontSize: '2.5rem',
  fontWeight: 'bold',
  color: '#fff',
  marginBottom: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '999px',
  textTransform: 'none',
  fontWeight: 'bold',
  padding: '10px 24px',
  transition: '0.3s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    boxShadow: theme.shadows[4],
  },
}));

const ReadCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/api/courses/course/');
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleCourseClick = (course) => {
    navigate(`/coursedetail/${course.id}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
        📚 Explore Our Courses
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <CircularProgress />
        </Box>
      ) : courses.length === 0 ? (
        <Typography variant="h6" color="text.secondary" align="center">
          No courses available at the moment.
        </Typography>
      ) : (
        <Grid container spacing={4} mt={2}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course.id}>
              <Box onClick={() => handleCourseClick(course)}>
                <StyledCard>
                  <Box display="flex" flexDirection="column" alignItems="center" p={3}>
                    <CourseAvatar>{course.course_title.charAt(0)}</CourseAvatar>
                    <Typography variant="h6" fontWeight="600" gutterBottom>
                      {course.course_title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontStyle="italic" textAlign="center">
                      {course.description || 'No description provided.'}
                    </Typography>
                  </Box>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={1}>
                      <GroupIcon fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        <strong>Section:</strong> {course.section || 'N/A'}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <ScheduleIcon fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        <strong>Duration:</strong> {course.weeks} weeks
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <StyledButton
                      variant="contained"
                      color="primary"
                      startIcon={<VisibilityIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCourseClick(course);
                      }}
                    >
                      View Details
                    </StyledButton>
                  </CardActions>
                </StyledCard>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ReadCourses;
