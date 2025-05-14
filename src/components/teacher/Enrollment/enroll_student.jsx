import React, { useEffect, useState } from "react";
import api from "../../../api";
import { TextField, MenuItem, Button, Typography, Container, Box, CircularProgress, ThemeProvider, Alert, Snackbar, Skeleton } from '@mui/material';
import theme from "../../Theme";
import { CheckCircle, Error, Email, School } from '@mui/icons-material';

const EnrollmentForm = () => {
  const [email, setEmail] = useState("");
  const [courseId, setCourseId] = useState("");
  const [courses, setCourses] = useState([]);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    api.get("/api/courses/course/")
      .then(res => setCourses(res.data))
      .catch(err => console.error("Error fetching courses", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");
    setLoading(true);

    api.post("/api/courses/enrollment/", {
      email: email,
      course: courseId
    })
    .then(res => {
      setLoading(false);
      setSuccess("Enrollment successful!");
      setEmail("");
      setCourseId("");
      setSnackbarSeverity("success");
      setSnackbarMessage("Enrollment successful!");
      setOpenSnackbar(true);
    })
    .catch(err => {
      setLoading(false);
      if (err.response && err.response.data) {
        setErrors(err.response.data);
      } else {
        setErrors({ general: "An error occurred." });
      }
      setSnackbarSeverity("error");
      setSnackbarMessage("An error occurred while enrolling.");
      setOpenSnackbar(true);
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs" sx={{ padding: '2rem', backgroundColor: '#fff', boxShadow: 3, borderRadius: 2 }}>
        

        
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            size="small"
            onChange={(e) => setEmail(e.target.value)}
            required
            margin="normal"
            InputProps={{
              startAdornment: <Email sx={{ color: '#10548BFF', marginRight: '8px' }} />
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px', // Rounded corners
              },
              '& .Mui-focused': {
                borderColor: '#0C4572FF', // Blue border on focus
              },
              '& .MuiInputLabel-root': {
                color: '#555', // Lighter label color
              }
            }}
          />

          {loading ? (
            <Skeleton variant="text" width="100%" height={56} sx={{ marginTop: 2 }} />
          ) : (
            <TextField
              select
              label="Select Course"
              variant="outlined"
              fullWidth
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              required
              size="small"
              margin="normal"
              InputProps={{
                startAdornment: <School sx={{ color: '#0F4571FF', marginRight: '8px' }} />
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px', // Rounded corners
                },
                '& .Mui-focused': {
                  borderColor: '#041A2BFF', // Blue border on focus
                },
              }}
            >
              <MenuItem value="">
                <em>-- Choose a course --</em>
              </MenuItem>
              {courses.map(course => (
                <MenuItem key={course.id} value={course.id}>{course.course_title}</MenuItem>
              ))}
            </TextField>
          )}

          <Box sx={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
              sx={{
                padding: '10px 20px',
                fontSize: '16px',
                textTransform: 'none',
                borderRadius: '30px', // Rounded button
                '&:hover': {
                  backgroundColor: '#073564FF', // Darker blue hover effect
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Adding shadow on hover
                },
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Enroll'}
            </Button>
          </Box>

          {errors.general && (
            <Alert severity="error" sx={{ mt: 2 }} icon={<Error />}>
              {errors.general}
            </Alert>
          )}

          {errors.email && (
            <Alert severity="error" sx={{ mt: 2 }} icon={<Error />}>
              {errors.email[0]}
            </Alert>
          )}

          {errors.course && (
            <Alert severity="error" sx={{ mt: 2 }} icon={<Error />}>
              {errors.course[0]}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mt: 2 }} icon={<CheckCircle />}>
              {success}
            </Alert>
          )}

        </form>

        {/* Snackbar for success or error message */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity={snackbarSeverity}
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
};

export default EnrollmentForm;
