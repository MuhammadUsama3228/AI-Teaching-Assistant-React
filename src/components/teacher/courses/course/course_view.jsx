import React, { useState, useEffect } from 'react';
import {
  Typography,
  Container,
  CircularProgress,
  Box,
  Card,
  Grid,
  Button,
  TextField,
  Avatar,
  InputAdornment,
  MenuItem,
  useTheme,
  Pagination,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import api from '../../../../api';
import RecordNotFound from "../../../Record_not_found.jsx";

const ReadCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const theme = useTheme();
  const navigate = useNavigate();

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

  const handleCourseClick = (courseId) => {
    navigate(`/coursedetail/${courseId}`);
  };

  const sectionOptions = [...new Set(courses.map((c) => c.section).filter(Boolean))];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.course_title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSection = selectedSection ? course.section === selectedSection : true;
    return matchesSearch && matchesSection;
  });

  const paginatedCourses = filteredCourses.slice((page - 1) * pageSize, page * pageSize);
  const pageCount = Math.ceil(filteredCourses.length / pageSize);

  return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
          <Typography variant="h4" fontWeight="bold">
            My Courses
          </Typography>

          <Box display="flex" flexWrap="wrap" gap={2} justifyContent="flex-end">
            <TextField
                label="Search Courses"
                variant="outlined"
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                  ),
                }}
                sx={{ width: { xs: '100%', sm: '220px' } }}
            />
            <TextField
                select
                size="small"
                label="Filter by Section"
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                sx={{ width: { xs: '100%', sm: '180px' } }}
            >
              <MenuItem value="">All Sections</MenuItem>
              {sectionOptions.map((section) => (
                  <MenuItem key={section} value={section}>
                    {section}
                  </MenuItem>
              ))}
            </TextField>
          </Box>
        </Box>

        {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
              <CircularProgress color="primary" />
            </Box>
        ) : filteredCourses.length === 0 ? (
            <RecordNotFound message="No courses found." />
        ) : (
            <>
              <Grid container spacing={2}>
                {paginatedCourses.map((course) => (
                    <Grid item xs={12} sm={6} md={6} key={course.id}>
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
                            src={course.image || ''}
                            sx={{
                              width: 80,
                              height: 80,
                              borderRadius: 2,
                              bgcolor: theme.palette.primary.dark,
                              fontWeight: 'bold',
                            }}
                            variant="rounded"
                        >
                          {course.course_title?.[0]?.toUpperCase() || '?'}
                        </Avatar>
                        <Box sx={{ ml: 2, flexGrow: 1 }}>
                          <Typography variant="h6" fontWeight="bold">
                            {course.course_title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Created: {new Date(course.created_at).toLocaleDateString() || 'N/A'}
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            Duration: {course.weeks || 'N/A'} weeks
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            Section: {course.section || 'N/A'}
                          </Typography>
                          <Box mt={1} display="flex" gap={1} flexWrap="wrap">
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => handleCourseClick(course.id)}
                                sx={{ textTransform: 'none' }}
                            >
                              View Details
                            </Button>
                            <Button
                                variant="contained"
                                size="small"
                                sx={{
                                  textTransform: 'none',
                                  bgcolor: 'error.main',
                                  '&:hover': {
                                    bgcolor: 'error.dark',
                                  },
                                }}
                            >
                              Delete
                            </Button>
                          </Box>
                        </Box>
                      </Card>
                    </Grid>
                ))}
              </Grid>

              <Box mt={4} display="flex" justifyContent="center">
                <Pagination
                    count={pageCount}
                    page={page}
                    onChange={(e, value) => setPage(value)}
                    color="primary"
                />
              </Box>
            </>
        )}
      </Container>
  );
};

export default ReadCourses;
