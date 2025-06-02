import React, { useState, useEffect, useCallback } from 'react';
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  CircularProgress,
  ThemeProvider,
  Skeleton,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import theme from '../../Theme';
import api from '../../../api';

const AssignmentModel = {
  course: '',
  title: '',
  marks: '',
  description: '',
  due_date: '',
  allowed_file_types: '',
  attempts: '',
  max_file_size: 5 * 1024 * 1024,
  accept_within_due_date: false,
  level: 'medium',
  files: [],
};

function CreateAssignmentForm() {
  const { id } = useParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [formData, setFormData] = useState({ ...AssignmentModel, course: id || '' });
  const [success, setSuccess] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/api/courses/course/');
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setCoursesLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, course: id || '' }));
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (success) setSuccess('');
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    if (ext === 'pdf') return <PictureAsPdfIcon color="error" sx={{ fontSize: 40 }} />;
    if (['doc', 'docx'].includes(ext)) return <DescriptionIcon color="primary" sx={{ fontSize: 40 }} />;
    if (['ppt', 'pptx'].includes(ext)) return <InsertDriveFileIcon color="warning" sx={{ fontSize: 40 }} />;
    return <InsertDriveFileIcon color="disabled" sx={{ fontSize: 40 }} />;
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setSelectedFiles((prev) => {
          const newFiles = acceptedFiles.filter(
            (f) => !prev.some((pf) => pf.name === f.name && pf.size === f.size)
          );
          return [...prev, ...newFiles];
        });
      }
    },
    [setSelectedFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: true,
    onDrop,
  });

  const removeFile = (fileName) => {
    setSelectedFiles((prev) => prev.filter((file) => file.name !== fileName));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');

    const data = new FormData();
    for (const key in formData) {
      if (key !== 'files') {
        data.append(key, formData[key]);
      }
    }
    selectedFiles.forEach((file) => {
      data.append('files', file);
    });

    try {
      await api.post('/api/courses/assignment/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess('Assignment created successfully!');
      setFormData({ ...AssignmentModel, course: id || '' });
      setSelectedFiles([]);
    } catch (err) {
      console.error('Error creating assignment:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Box sx={{ p: 3, boxShadow: 3, borderRadius: 2, backgroundColor: 'background.paper' }}>
          <Typography variant="h4" gutterBottom>
            Create Assignment
          </Typography>

          {success && (
            <Typography color="primary" gutterBottom>
              {success}
            </Typography>
          )}

          {coursesLoading ? (
            <>
              <Skeleton variant="text" width="100%" height={40} />
              <Skeleton variant="text" width="60%" height={40} sx={{ my: 2 }} />
              <Skeleton variant="rectangular" width="100%" height={100} sx={{ mb: 3 }} />
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <TextField
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Marks"
                name="marks"
                type="number"
                value={formData.marks}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={4}
                margin="normal"
              />
              <TextField
                label="Due Date"
                name="due_date"
                type="datetime-local"
                value={formData.due_date}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                required
              />
              <TextField
                label="Allowed File Types"
                name="allowed_file_types"
                value={formData.allowed_file_types}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                placeholder="e.g., zip,py"
              />
              <TextField
                label="Attempts"
                name="attempts"
                type="number"
                value={formData.attempts}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Max File Size (MB)"
                name="max_file_size"
                type="number"
                value={formData.max_file_size / (1024 * 1024)}
                onChange={(e) =>
                  handleInputChange({
                    target: {
                      name: 'max_file_size',
                      value: e.target.value * 1024 * 1024,
                    },
                  })
                }
                fullWidth
                margin="normal"
              />

              <FormControl fullWidth margin="normal">
                <InputLabel id="level-label">Level</InputLabel>
                <Select
                  labelId="level-label"
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  label="Level"
                >
                  <MenuItem value="light">Light</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="hard">Hard</MenuItem>
                  <MenuItem value="veryhard">Very Hard</MenuItem>
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Switch
                    name="accept_within_due_date"
                    checked={formData.accept_within_due_date}
                    onChange={handleSwitchChange}
                  />
                }
                label="Accept Submissions Within Due Date"
                sx={{ mt: 2 }}
              />

              <Paper
                {...getRootProps()}
                sx={{
                  border: '2px dashed #ccc',
                  padding: 2,
                  textAlign: 'center',
                  cursor: 'pointer',
                  mt: 3,
                  bgcolor: isDragActive ? '#f0f0f0' : 'inherit',
                }}
              >
                <input {...getInputProps()} />
                <Box display="flex" justifyContent="center" alignItems="center" gap={1} mb={1}>
                  <InsertDriveFileIcon color="primary" sx={{ fontSize: 50, cursor: 'pointer' }} />
                  <Typography variant="body1" sx={{ cursor: 'pointer' }}>
                    {isDragActive ? 'Drop the files here...' : 'Drag & drop files here, or click to select files'}
                  </Typography>
                </Box>
                <Typography variant="caption" display="block" mt={1}>
                  Supported: All file types
                </Typography>
              </Paper>

              {selectedFiles.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">Selected files:</Typography>
                  <Grid container spacing={2} mt={1}>
                    {selectedFiles.map((file) => (
                      <Grid
                        item
                        key={file.name}
                        xs={12}
                        sm={6}
                        md={4}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          border: '1px solid #ccc',
                          borderRadius: 1,
                          p: 1,
                        }}
                      >
                        {getFileIcon(file.name)}
                        <Typography
                          variant="body2"
                          sx={{
                            flexGrow: 1,
                            ml: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                          title={file.name}
                        >
                          {file.name}
                        </Typography>
                        <Button variant="text" color="error" size="small" onClick={() => removeFile(file.name)}>
                          Remove
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={loading}
                  startIcon={loading && <CircularProgress size={20} color="inherit" />}
                >
                  {loading ? 'Saving...' : 'Create Assignment'}
                </Button>
              </Box>
            </form>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default CreateAssignmentForm;
