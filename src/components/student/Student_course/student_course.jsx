import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Card,
  Avatar,
  TextField,
  MenuItem,
  InputAdornment,
  Button,
  Grid,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Search } from '@mui/icons-material';
import api from '../../../api.js'
import theme from '../../Theme.jsx';
import { ThemeProvider } from '@mui/material/styles';
import {useNavigate, useParams} from 'react-router-dom';

const EnrolledCourses = () => {

  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const navigate = useNavigate();

  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(muiTheme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(muiTheme.breakpoints.up('md'));

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
          <Box mt={isMobile ? 4 : 6} mb={4}>
            <Typography
                variant={isMobile ? 'h5' : 'h4'}
                gutterBottom
                sx={{ fontWeight: 'bold', color: '#052649' }}
            >
              My Courses
            </Typography>

            <Box
                display="flex"
                flexDirection={isMobile ? 'column' : 'row'}
                justifyContent="space-between"
                alignItems={isMobile ? 'stretch' : 'center'}
                gap={2}
                my={3}
            >
              <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Search Courses"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                    ),
                  }}
                  sx={{
                    width: isMobile ? '100%' : '60%',
                    bgcolor: 'white',
                  }}
              />

              <TextField
                  select
                  size="small"
                  label="Filter by"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  sx={{
                    width: isMobile ? '100%' : '30%',
                    bgcolor: 'white',
                  }}
              >
                <MenuItem value="">Default</MenuItem>
                <MenuItem value="title">Title (A-Z)</MenuItem>
                <MenuItem value="weeks">Duration (Low to High)</MenuItem>
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
                    const initial = course.course_title.charAt(0).toUpperCase();

                    return (
                        <Grid item xs={12} sm={6} md={6} key={course.id}>
                          <Card
                              sx={{
                                borderRadius: 4,
                                p: 2,
                                display: 'flex',
                                alignItems: 'center',
                                boxShadow: 3,
                                backgroundColor: 'white',
                              }}
                          >
                            <Avatar
                                sx={{
                                  bgcolor: '#2C2374',
                                  width: 72,
                                  height: 72,
                                  fontSize: 28,
                                  fontWeight: 'bold',
                                  borderRadius: 2,
                                  mr: 3,
                                }}
                            >
                              {initial}
                            </Avatar>

                            <Box flexGrow={1}>
                              <Typography variant="h6" fontWeight="bold" sx={{ textTransform: 'uppercase' }}>
                                {course.course_title}
                              </Typography>
                              <Typography variant="body2">
                                Created: {new Date(enrollment?.enrollment_date).toLocaleDateString()}
                              </Typography>
                              <Typography variant="body2" fontWeight="bold">
                                Duration: {course.weeks} weeks
                              </Typography>
                              <Typography variant="body2" fontWeight="bold">
                                Section: {course.section || 'N/A'}
                              </Typography>

                              <Box display="flex" mt={2} gap={2}>
                                <Button
                                    variant="contained"
                                    onClick={() => navigate(`/student_course_week/${course.id}`)}
                                    sx={{
                                      backgroundColor: '#2C2374',
                                      borderRadius: 2,
                                      fontWeight: 'bold',
                                      textTransform: 'none',
                                      px: 3,
                                      '&:hover': {
                                        backgroundColor: '#1e1b5a',
                                      },
                                    }}
                                >
                                  View Details
                                </Button>
                              </Box>
                            </Box>
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
