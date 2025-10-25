import React, { useState, useEffect } from 'react';
import {
    Typography,
    Container,
    Box,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import api from '../../../../api';

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
                const coursesResponse = await api.get('api/courses/course/');

                const coursesMap = coursesResponse.data.reduce((acc, course) => {
                    acc[course.id] = course.course_title;
                    return acc;
                }, {});

                const enrichedCourseWeeks = courseWeeksResponse.data.map((week) => ({
                    ...week,
                    courseTitle: coursesMap[week.course] || 'Unknown Course',
                    id: week.id,
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

    const columns = [
        {
            field: 'week_number',
            headerName: 'Week #',
            width: 100,
        },
        {
            field: 'week_title',
            headerName: 'Title',
            flex: 1,
        },
        {
            field: 'courseTitle',
            headerName: 'Course',
            flex: 1,
        },
        {
            field: 'description',
            headerName: 'Description',
            flex: 2,
            renderCell: (params) =>
                params.value ? (
                    <Typography variant="body2">{params.value}</Typography>
                ) : (
                    <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#888' }}>
                        No description
                    </Typography>
                ),
        },
        {
            field: 'action',
            headerName: 'Action',
            width: 150,
            sortable: false,
            renderCell: (params) => (
                <Box>
                    <button
                        onClick={() => navigate(`/courseweekdetail/${params.row.id}`)}
                        style={{
                            backgroundColor: '#1976d2',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                        }}
                    >
                        View Details
                    </button>
                </Box>
            ),
        },
    ];

    return (
        <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
            <Typography variant="h4" textAlign="center" sx={{ mb: 4, fontWeight: '600' }}>
                Course Weeks
            </Typography>

            {/* Filter Dropdown */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <FormControl sx={{ width: 250 }}>
                    <InputLabel id="filter-label">Filter by Course</InputLabel>
                    <Select
                        labelId="filter-label"
                        value={selectedCourse}
                        onChange={handleFilterChange}
                        label="Filter by Course"
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

            {/* DataGrid Table */}
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                    <CircularProgress />
                </Box>
            ) : (
                <Box sx={{ height: 600, width: '100%', backgroundColor: 'white', borderRadius: '12px', boxShadow: 3 }}>
                    <DataGrid
                        rows={filteredCourseWeeks}
                        columns={columns}
                        pageSize={8}
                        rowsPerPageOptions={[8, 16, 24]}
                        disableSelectionOnClick
                        sx={{
                            borderRadius: '12px',
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: '#f5f5f5',
                                fontWeight: 'bold',
                            },
                        }}
                    />
                </Box>
            )}
        </Container>
    );
};

export default CourseWeekView;
