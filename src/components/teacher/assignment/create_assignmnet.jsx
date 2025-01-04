import React, { useState } from 'react';
import { TextField, Checkbox, FormControlLabel, Button, Box, Grid, Typography, Container, InputLabel, Select, MenuItem, FormControl, Divider } from '@mui/material';
import { blue } from '@mui/material/colors';

const CreateAssignmentForm = () => {
  const [formData, setFormData] = useState({
    course: '',
    title: '',
    marks: '',
    description: '',
    dueDate: '',
    allowedFileTypes: '',
    attempts: '',
    maxFileSize: 5, 
    acceptWithinDueDate: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Handle form submission here (e.g., send data to API)
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 5, backgroundColor: '#fff', borderRadius: 2, padding: 3, boxShadow: 4 }}>
      <Typography variant="h4" color={blue[900]} gutterBottom textAlign="center">
        Create New Assignment
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom textAlign="center">
        Please fill in the details below to create a new assignment for your course.
      </Typography>
      <Divider sx={{ marginBottom: 3 }} />

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Course Field */}
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Course</InputLabel>
              <Select
                label="Course"
                name="course"
                value={formData.course}
                onChange={handleChange}
                fullWidth
              >
              
              </Select>
            </FormControl>
          </Grid>

      
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Assignment Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              variant="outlined"
              required
            />
          </Grid>

      
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Marks"
              name="marks"
              type="number"
              value={formData.marks}
              onChange={handleChange}
              variant="outlined"
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              variant="outlined"
              multiline
              rows={4}
              required
            />
          </Grid>

  
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Due Date"
              name="dueDate"
              type="datetime-local"
              value={formData.dueDate}
              onChange={handleChange}
              variant="outlined"
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

       
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Allowed File Types (comma separated)"
              name="allowedFileTypes"
              value={formData.allowedFileTypes}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Attempts"
              name="attempts"
              type="number"
              value={formData.attempts}
              onChange={handleChange}
              variant="outlined"
              required
            />
          </Grid>

     
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Max File Size (MB)"
              name="maxFileSize"
              type="number"
              value={formData.maxFileSize}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox checked={formData.acceptWithinDueDate} onChange={handleChange} name="acceptWithinDueDate" />}
              label="Accept submissions within the due date?"
            />
          </Grid>

         
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit" fullWidth sx={{ padding: 1.5 }}>
              Create Assignment
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default CreateAssignmentForm;
