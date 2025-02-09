import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Container, Box, CircularProgress, Card, CardContent, CardActions, Button, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import api from '../../../../api';

const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: '16px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1), 0px 2px 3px rgba(0, 0, 0, 0.07)',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out, opacity 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
        opacity: 0.9,
    },
    backgroundColor: theme.palette.background.paper,
}));

const StyledButton = styled(Button)(({ theme }) => ({
    textTransform: 'none',
    borderRadius: '20px',
    fontWeight: '600',
    padding: '10px 20px',
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    },
}));

const CourseWeekView = () => {
    const [courseWeeks, setCourseWeeks] = useState([]);
    const [courses, setCourses] = useState([]);
    const [filteredCourseWeeks, setFilteredCourseWeeks] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
              
                const courseWeeksResponse = await api.get('api/courses/course_weeks/');
                console.log('Course Weeks:', courseWeeksResponse.data); 
               
                const coursesResponse = await api.get('api/courses/course/');
                console.log('Courses:', coursesResponse.data); 
              
                
                const coursesMap = coursesResponse.data.reduce((acc, course) => {
                    acc[course.id] = course.course_title;
                    return acc;
                }, {});

                const enrichedCourseWeeks = courseWeeksResponse.data.map((week) => ({
                    ...week,
                    courseTitle: coursesMap[week.course] || 'Unknown Course',
                }));

                setCourseWeeks(enrichedCourseWeeks);
                setFilteredCourseWeeks(enrichedCourseWeeks);
                setCourses(coursesResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleFilterChange = (event) => {
        const courseId = event.target.value;
        setSelectedCourse(courseId);

        if (courseId) {
            const filtered = courseWeeks.filter((week) => week.course === courseId);
            setFilteredCourseWeeks(filtered);
        } else {
            setFilteredCourseWeeks(courseWeeks);
        }
    };

    const handleViewDetails = (id) => {
        navigate(`/courseweekdetail/${id}`);
    };

    return (
        <Container component="main" maxWidth="lg" sx={{ padding: '3rem 1rem', borderRadius: '12px', position: 'relative' }}>
            <Typography variant="h4" gutterBottom textAlign="center" sx={{ fontWeight: '600', color: '#333', marginBottom: '2rem' }}>
                Course Weeks
            </Typography>

            {/* Filter in the top-right corner */}
            <Box sx={{
                position: 'absolute',
                top: '3rem',
                right: '2rem',
                zIndex: 10,
                padding: '1rem',
                borderRadius: '12px',
                width: '200px'
            }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: '600', color: '#333' }}>
                    Filter by Course
                </Typography>
                <FormControl fullWidth>
                    <InputLabel id="course-filter-label">Course</InputLabel>
                    <Select
                        labelId="course-filter-label"
                        id="course-filter"
                        value={selectedCourse}
                        onChange={handleFilterChange}
                        label="Course"
                    >
                        <MenuItem value="">
                            <em>All Courses</em>
                        </MenuItem>
                        {courses.map((course) => (
                            <MenuItem key={course.id} value={course.id}>
                                {course.course_title}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Grid container spacing={4} sx={{ marginTop: '4rem' }}>
                {/* Course Weeks */}
                <Grid item xs={12}>
                    {loading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                            <CircularProgress />
                        </Box>
                    ) : filteredCourseWeeks.length === 0 ? (
                        <Typography variant="h6" color="textSecondary" textAlign="center" sx={{ color: '#999' }}>
                            No course weeks available for the selected course.
                        </Typography>
                    ) : (
                        <Grid container spacing={4}>
                            {filteredCourseWeeks.map((week) => (
                                <Grid item xs={12} sm={6} md={4} key={week.id}>
                                    <StyledCard>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom sx={{ fontWeight: '600', color: '#333' }}>
                                                Week {week.week_number}: {week.week_title}
                                            </Typography>
                                            <Typography variant="subtitle2" color="textSecondary" sx={{ marginBottom: 1 }}>
                                                <strong>Course:</strong> {week.courseTitle}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                                                {week.description || 'No description provided.'}
                                            </Typography>
                                        </CardContent>
                                        <CardActions sx={{ justifyContent: 'center', paddingBottom: 2 }}>
                                            <StyledButton
                                                size="small"
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleViewDetails(week.id)}
                                            >
                                                View Details
                                            </StyledButton>
                                        </CardActions>
                                    </StyledCard>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
};

export default CourseWeekView;
