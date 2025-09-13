import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Container,
  Box,
  Avatar,
  Divider,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Skeleton,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemIcon,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { styled } from '@mui/material/styles';
import chatboot_launcher from "../../../student/Student_course/Chat Boot/chatboot_launcher.jsx";
import {
  ExpandMore,
  MoreVert,
  Menu as MenuIcon,
} from '@mui/icons-material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CreateIcon from '@mui/icons-material/Create';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import SchoolIcon from '@mui/icons-material/School';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';

import { useDropzone } from 'react-dropzone';

import api from '../../../../api';
import CourseUpdate from './course_update';
import ChatBotLauncher from "../../../student/Student_course/Chat Boot/chatboot_launcher.jsx";

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(10),
  marginBottom: theme.spacing(6),
  backgroundColor: '#fdfdfd',
  boxShadow: '0 0 15px rgba(0, 0, 0, 0.05)',
  borderRadius: '16px',
  padding: theme.spacing(3),
  border: '1px solid #e0e0e0',
}));

const CourseAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(14),
  height: theme.spacing(14),
  color: theme.palette.common.white,
  fontSize: '3rem',
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
}));

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [courseWeeks, setCourseWeeks] = useState([]);
  const [courseContents, setCourseContents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAddContentDialog, setOpenAddContentDialog] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const [iconMenuAnchorEl, setIconMenuAnchorEl] = useState(null);

  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`/api/courses/course/${id}/`);
        setCourse(response.data);

        const weeksResponse = await api.get('/api/courses/course_weeks/', {
          params: { course: id },
        });
        setCourseWeeks(weeksResponse.data);

        const contentResponse = await api.get('/api/courses/course_content/', {
          params: { course: id },
        });
        setCourseContents(contentResponse.data);
      } catch (error) {
        console.error('Error fetching course data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  // Menu Handlers
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleIconMenuOpen = (event) => setIconMenuAnchorEl(event.currentTarget);
  const handleIconMenuClose = () => setIconMenuAnchorEl(null);

  // Course Update Dialog
  const handleUpdateOpen = () => setOpenUpdateDialog(true);
  const handleUpdateClose = () => setOpenUpdateDialog(false);

  // Course Delete Dialog
  const handleDeleteClick = () => {
    handleMenuClose();
    setOpenDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await api.delete(`/api/courses/course/${id}/`);
        navigate('/view-courses');
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
    setOpenDeleteDialog(false);
  };

  // Content Upload Dialog
  const handleAddContentOpen = () => setOpenAddContentDialog(true);
  const handleAddContentClose = () => {
    setOpenAddContentDialog(false);
    setFile(null);
  };

  const handleAddContentSubmit = async () => {
    if (!file) {
      alert('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('course', id);

    try {
      await api.post('/api/courses/course_content/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Course content added successfully!');
      // Refresh course contents after upload
      const contentResponse = await api.get('/api/courses/course_content/', {
        params: { course: id },
      });
      setCourseContents(contentResponse.data);
      handleAddContentClose();
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload course content.');
    }
  };

  // Delete course content file
  const handleDeleteContent = async (contentId) => {
    if (window.confirm('Are you sure you want to delete this content file?')) {
      try {
        await api.delete(`/api/courses/course_content/${contentId}/`);
        setCourseContents((prev) => prev.filter((content) => content.id !== contentId));
        alert('Content deleted successfully!');
      } catch (error) {
        console.error('Error deleting content:', error);
        alert('Failed to delete content.');
      }
    }
  };

  // Navigate to course week detail
  const handleCourseWeekClick = (weekId) => {
    navigate(`/courseweekdetail/${weekId}`);
  };

  // Icon menu actions
  const handleCreateAssignment = () => {
    handleIconMenuClose();
    navigate(`/create_assignment/${id}`);
  };

  const handleViewAssignments = () => {
    handleIconMenuClose();
    navigate(`/read_assignments/${id}`);
  };

  const handleTimeSlots = () => {
    handleIconMenuClose();
    navigate(`/course-time-slots/${id}`);
  };

  // File icons based on extension
  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    if (ext === 'pdf')
      return <PictureAsPdfIcon color="error" sx={{ fontSize: 50 }} />;
    if (['doc', 'docx'].includes(ext))
      return <DescriptionIcon color="primary" sx={{ fontSize: 50 }} />;
    if (['ppt', 'pptx'].includes(ext))
      return <InsertDriveFileIcon color="warning" sx={{ fontSize: 50 }} />;
    return <InsertDriveFileIcon color="disabled" sx={{ fontSize: 50 }} />;
  };

  // File dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc', '.docx'],
      'application/vnd.ms-powerpoint': ['.ppt', '.pptx'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
        '.docx',
      ],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': [
        '.pptx',
      ],
    },
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
      }
    },
  });

  if (loading) {
    return (
      <StyledContainer maxWidth="md">
        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
          <Skeleton variant="circular" width={112} height={112} />
          <Skeleton variant="text" width="60%" height={40} sx={{ marginY: 1 }} />
          <Skeleton variant="text" width="40%" height={30} />
        </Box>
        <Divider sx={{ marginY: 3 }} />
        <Box>
          <Skeleton variant="rectangular" height={100} sx={{ marginBottom: 2 }} />
          <Skeleton variant="rectangular" height={100} />
        </Box>
      </StyledContainer>
    );
  }

  if (!course) {
    return (
      <Typography variant="h6" color="textSecondary" textAlign="center">
        Course not found.
      </Typography>
    );
  }

  return (
    <StyledContainer maxWidth="md">
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} sm={4} md={3} textAlign={{ xs: 'center', sm: 'left' }}>
          <CourseAvatar>{course.course_title.charAt(0).toUpperCase()}</CourseAvatar>
        </Grid>
        <Grid item xs={12} sm={8} md={9}>
          <Typography variant="h4" sx={{ fontWeight: '700', marginBottom: 1 }}>
            {course.course_title}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            <strong>Course Code:</strong> {course.course_code || 'N/A'}
          </Typography>
        </Grid>
        <Grid item xs={6} textAlign="left">
          <IconButton onClick={handleIconMenuOpen}>
            <MenuIcon />
          </IconButton>
        </Grid>
        <Grid item xs={6} textAlign="right">
          <IconButton onClick={handleMenuOpen}>
            <MoreVert />
          </IconButton>
        </Grid>
      </Grid>

      <Divider sx={{ marginY: 3 }} />

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
         <Typography 
  variant="h6" 
  sx={{ mt: 3, mb: 1, fontWeight: 'bold' }}
>
  Course Details
</Typography>

        </AccordionSummary>
        <AccordionDetails>
          <Box>
           <Typography variant="body1" paragraph sx={{ mt: 2, whiteSpace: 'pre-line' }}>
            <strong>Course Description:</strong><br />
            {course.description?.trim() || 'No description available for this course.'}
            </Typography>


            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  <SchoolIcon sx={{ mr: 1 }} />
                  <strong>Section:</strong> {course.section || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  <AccessTimeIcon sx={{ mr:2  }} />
                  <strong>Duration:</strong> {course.weeks} weeks
                </Typography>
              </Grid>
            </Grid>

            {/* Upload icon */}
            <Box mt={3}>
              <IconButton
                color="primary"
                onClick={handleAddContentOpen}
                sx={{ border: '1px dashed #ccc', padding: 2 }}
              >
                <UploadFileIcon />
              </IconButton>
              <Typography variant="body2" color="textSecondary" component="span" ml={1}>
                Upload Course Content
              </Typography>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      
<Accordion defaultExpanded sx={{ mt: 2 }}>
  <AccordionSummary expandIcon={<ExpandMore />}>
    <Typography variant="h6" sx={{ color: 'dark.purple', fontWeight: 'bold' }}>
      Course Contents ({courseContents.length})
    </Typography>
  </AccordionSummary>
  <AccordionDetails>
    {courseContents.length === 0 ? (
      <Typography variant="body2" color="textSecondary">
        No course content uploaded.
      </Typography>
    ) : (
      <Grid container spacing={3} sx={{ p: 1 }}>
        {courseContents.map((content) => (
          <Grid
            key={content.id}
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              p: 2,
              m: 1,
              position: 'relative',
              boxShadow: 1,
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.02)',
              },
            }}
          >
            {getFileIcon(content.file.split('/').pop())}

            <Typography
              variant="caption"
              sx={{
                mt: 1,
                maxWidth: '100%',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              title={content.file.split('/').pop()}
            >
              {content.file.split('/').pop()}
            </Typography>

            <IconButton
              size="small"
              color="error"
              sx={{ position: 'absolute', top: 6, right: 6 }}
              onClick={() => handleDeleteContent(content.id)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>

            <Button
              size="small"
              href={content.file}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              fullWidth
              sx={{ mt: 1 }}
            >
              View
            </Button>
          </Grid>
        ))}
      </Grid>
    )}
  </AccordionDetails>
</Accordion>



      <Accordion defaultExpanded sx={{ marginTop: 2 }}>
  <AccordionSummary expandIcon={<ExpandMore />}>
    <Typography variant="h6" sx={{ color: 'dark.purple', fontWeight: 'bold' }}>
      Course Weeks ({courseWeeks.length})
    </Typography>

  </AccordionSummary>
  <AccordionDetails>
    {courseWeeks.length === 0 ? (
      <Typography variant="body2" color="textSecondary">
        No weeks found for this course.
      </Typography>
    ) : (
      <Box display="flex" flexDirection="column" gap={2}>
        {courseWeeks.map((week) => (
          <Box
            key={week.id}
            onClick={() => handleCourseWeekClick(week.id)}
            sx={{
              p: 2,
              border: '1px solid #ddd',
              borderRadius: 2,
              cursor: 'pointer',
              boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
              transition: 'background-color 0.3s',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.1)', // MUI primary light
              },
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleCourseWeekClick(week.id);
              }
            }}
          >
            <AssignmentIcon color="primary" />
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {week.week_title}
            </Typography>
          </Box>
        ))}
      </Box>
    )}
  </AccordionDetails>
</Accordion>

      <ChatBotLauncher courseId={course.id} />




      {/* Menus */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => { handleUpdateOpen(); handleMenuClose(); }}>
          <UpdateIcon sx={{ mr: 1 }} /> Update Course
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <DeleteIcon sx={{ mr: 1 }} /> Delete Course
        </MenuItem>
      </Menu>

      <Menu
          anchorEl={iconMenuAnchorEl}
          open={Boolean(iconMenuAnchorEl)}
          onClose={handleIconMenuClose}
      >
        <MenuItem onClick={handleCreateAssignment}>
          <CreateIcon sx={{ mr: 1, color: 'blue' }} /> Create Assignment
        </MenuItem>
        <MenuItem onClick={handleViewAssignments}>
          <AssignmentIcon sx={{ mr: 1, color: 'red' }} /> View Assignments
        </MenuItem>
        <MenuItem onClick={handleTimeSlots}>
          <AccessTimeIcon sx={{ mr: 1, color: 'teal' }} /> Create Time Slots
        </MenuItem>
      </Menu>


      {/* Update Course Dialog */}
      <Dialog open={openUpdateDialog} onClose={handleUpdateClose} maxWidth="md" fullWidth>
        <DialogTitle>Update Course</DialogTitle>
        <DialogContent dividers>
          <CourseUpdate course={course} onClose={handleUpdateClose} onUpdated={() => {
            // Refetch course data after update
            setLoading(true);
            api.get(`/api/courses/course/${id}/`)
              .then((res) => setCourse(res.data))
              .finally(() => setLoading(false));
          }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateClose} color="primary">Cancel</Button>
        </DialogActions>
      </Dialog>

     
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete Course</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the course <strong>{course.course_title}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">Cancel</Button>
          <Button onClick={handleDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAddContentDialog} onClose={handleAddContentClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, fontSize: '1.25rem' }}>
            Upload Course Content
        </DialogTitle>
        <DialogContent>
            <Box
                {...getRootProps()}
                sx={{
                    mt: 2,
                    p: 4,
                    border: '2px dashed #ccc',
                    borderRadius: 2,
                    textAlign: 'center',
                    backgroundColor: isDragActive ? '#e3f2fd' : '#fafafa',
                    cursor: 'pointer',
                    '&:hover': {
                        borderColor: 'primary.main',
                        backgroundColor: '#f5f5f5',
                    },
                }}
            >
                <input {...getInputProps()} />
                {file ? (
                    <>
                        {getFileIcon(file.name)}
                        <Typography variant="subtitle1" mt={1}>
                            {file.name}
                        </Typography>
                    </>
                ) : (
                    <>
                        <UploadFileIcon color="primary" sx={{ fontSize: 48 }} />
                        <Typography variant="body1" color="textSecondary" mt={1}>
                            Drag and drop a file here, or click to browse
                        </Typography>
                    </>
                )}
            </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleAddContentClose} variant="outlined">
                Cancel
            </Button>
            <Button
                onClick={handleAddContentSubmit}
                variant="contained"
                color="primary"
                disabled={!file}
            >
                Upload
            </Button>
        </DialogActions>
    </Dialog>


    </StyledContainer>
  );
};

export default CourseDetail;
