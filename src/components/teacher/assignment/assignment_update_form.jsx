import React, { useState, useEffect } from 'react';
import { TextField, Checkbox, FormControlLabel, Button, Box, Grid, Typography, Container, InputLabel, Select, MenuItem, FormControl, Divider } from '@mui/material';
import { blue } from '@mui/material/colors';

const AssignmentUpdateForm = ({ existingAssignment }) => {
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

  // Populate the form with existing assignment data when the component mounts
  useEffect(() => {
    if (existingAssignment) {
      setFormData({
        course: existingAssignment.course || '',
        title: existingAssignment.title || '',
        marks: existingAssignment.marks || '',
        description: existingAssignment.description || '',
        dueDate: existingAssignment.due_date || '',
        allowedFileTypes: existingAssignment.allowed_file_types || '',
        attempts: existingAssignment.attempts || '',
        maxFileSize: existingAssignment.max_file_size || 5,
        acceptWithinDueDate: existingAssignment.accept_within_due_date || false,
      });
    }
  }, [existingAssignment]);

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
    // Handle form submission here (e.g., send updated data to API)
  };

  // Check if there is an existing assignment
  if (!existingAssignment) {
    return (
      <Container maxWidth="sm" sx={{ marginTop: 5, backgroundColor: '#fff', borderRadius: 2, padding: 3, boxShadow: 4 }}>
        <Typography variant="h5" color="textSecondary" gutterBottom textAlign="center">
          No assignment available to update.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ marginTop: 5, backgroundColor: '#fff', borderRadius: 2, padding: 3, boxShadow: 4 }}>
      <Typography variant="h4" color={blue[900]} gutterBottom textAlign="center">
        Update Assignment
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom textAlign="center">
        Please update the assignment details below.
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
                {/* Populate with existing courses */}
                <MenuItem value="course1">Course 1</MenuItem>
                <MenuItem value="course2">Course 2</MenuItem>
                <MenuItem value="course3">Course 3</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Assignment Title Field */}
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

          {/* Marks Field */}
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
              inputProps={{ min: 0 }}
            />
          </Grid>

          {/* Description Field */}
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

          {/* Due Date Field */}
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

          {/* Allowed File Types Field */}
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

          {/* Attempts Field */}
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
              inputProps={{ min: 1 }}
            />
          </Grid>

          {/* Max File Size Field */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Max File Size (MB)"
              name="maxFileSize"
              type="number"
              value={formData.maxFileSize}
              onChange={handleChange}
              variant="outlined"
              inputProps={{ min: 1 }}
            />
          </Grid>

          {/* Checkbox for Accept Within Due Date */}
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox checked={formData.acceptWithinDueDate} onChange={handleChange} name="acceptWithinDueDate" />}
              label="Accept submissions within the due date?"
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit" fullWidth sx={{ padding: 1.5 }}>
              Update Assignment
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default AssignmentUpdateForm;
