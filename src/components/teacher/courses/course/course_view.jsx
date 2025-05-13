import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Container,
  CircularProgress,
  Button,
  Box,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import api from '../../../../api';

const ReadCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const handleCourseClick = (course) => {
    navigate(`/coursedetail/${course.id}`);
  };

  const columns = [
    { field: 'id', headerName: 'Course ID', width: 150 },
    { field: 'course_title', headerName: 'Course Title', width: 200 },
    {
      field: 'description',
      headerName: 'Description',
      width: 250,
      renderCell: (params) => {
        const description = params.value ? params.value.split(' ').slice(0, 2).join(' ') : 'No description';
        return <Typography variant="body2">{description}</Typography>;
      },
    },
    { field: 'section', headerName: 'Section', width: 150 },
    { field: 'weeks', headerName: 'Duration (Weeks)', width: 180 },
    {
      field: 'action',
      headerName: 'Action',
      width: 180,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          startIcon={<VisibilityIcon />}
          onClick={() => handleCourseClick(params.row)}
        >
          View Details
        </Button>
      ),
    },
  ];

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
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={courses}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 15]}
            getRowId={(row) => row.id}
          />
        </div>
      )}
    </Container>
  );
};

export default ReadCourses;
