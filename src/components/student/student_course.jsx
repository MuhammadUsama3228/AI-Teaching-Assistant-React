import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Avatar,
  TextField,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import { School, AccessTime, Search } from '@mui/icons-material';
import api from '../../api';
import theme from '../Theme';
import { ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const EnrolledCourses = () => {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const navigate = useNavigate();

  const courseColors = [
    'linear-gradient(135deg, #004e92, #000428)',
    'linear-gradient(135deg, #1e3c72, #2a5298)',
    'linear-gradient(135deg, #283e51, #485563)',
    'linear-gradient(135deg, #2193b0, #6dd5ed)',
    'linear-gradient(135deg, #1c92d2, #f2fcfe)',
    'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('api/courses/student_insight/');
        const data = response.data;
        const enrolledCourseIds = data.enrollments.map(enroll => enroll.course);
        const enrolledCourses = data.courses
          .filter(course => enrolledCourseIds.includes(course.id))
          .map(course => ({
            ...course,
            color: courseColors[Math.floor(Math.random() * courseColors.length)],
          }));

        setCourses(enrolledCourses);
        setEnrollments(data.enrollments);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleSortChange = (value) => {
    setSortOption(value);
  };

  const filteredAndSortedCourses = courses
    .filter(course =>
      course.course_title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === 'title') {
        return a.course_title.localeCompare(b.course_title);
      } else if (sortOption === 'weeks') {
        return a.weeks - b.weeks;
      }
      return 0;
    });

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg">
        <Box mt={6} mb={4}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#052649' }}>
            🎓 My Enrolled Courses
          </Typography>

          {/* Search and Sort Controls */}
          <Box
            display="flex"
            flexDirection={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems="center"
            gap={2}
            my={3}
          >
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search by course title..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ width: { xs: '100%', sm: '60%' }, bgcolor: 'white' }}
            />

            <TextField
              select
              size="small"
              label="Sort by"
              value={sortOption}
              onChange={(e) => handleSortChange(e.target.value)}
              sx={{ width: { xs: '100%', sm: '30%' }, bgcolor: 'white' }}
            >
              <MenuItem value="">Default</MenuItem>
              <MenuItem value="title">Title (A-Z)</MenuItem>
              <MenuItem value="weeks">Weeks (Low to High)</MenuItem>
            </TextField>
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" mt={6}>
              <CircularProgress size={50} />
            </Box>
          ) : filteredAndSortedCourses.length === 0 ? (
            <Typography variant="body1">No courses match your search.</Typography>
          ) : (
            <Grid container spacing={4}>
              {filteredAndSortedCourses.map((course) => {
                const enrollment = enrollments.find(e => e.course === course.id);

                return (
                  <Grid item xs={12} sm={6} md={4} key={course.id}>
                    <Card
                      onClick={() => navigate(`/student_course_week/${course.id}`)}
                      sx={{
                        borderRadius: '16px',
                        background: course.color,
                        color: 'white',
                        boxShadow: 5,
                        cursor: 'pointer',
                        transition: '0.3s',
                        '&:hover': {
                          transform: 'scale(1.03)',
                          boxShadow: 10,
                        },
                      }}
                    >
                      <CardContent>
                        {/* Box layout for the icon */}
                        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                          <Avatar
                            sx={{
                              bgcolor: 'white',
                              color: '#019cb8',
                              mb: 2,
                              width: 60,
                              height: 60,
                            }}
                          >
                            <School fontSize="large" />
                          </Avatar>
                          <Typography variant="h6" fontWeight="bold" sx={{ textTransform: 'capitalize' }}>
                            {course.course_title}
                          </Typography>
                        </Box>

                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Section:</strong> {course.section || 'N/A'}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <AccessTime fontSize="small" sx={{ mr: 0.5 }} />
                          {course.weeks} Week{course.weeks > 1 ? 's' : ''}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {course.description || 'No description provided.'}
                        </Typography>
                        <Typography variant="caption">
                          Enrolled on:{' '}
                          {new Date(enrollment?.enrollment_date).toLocaleDateString()}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default EnrolledCourses;
