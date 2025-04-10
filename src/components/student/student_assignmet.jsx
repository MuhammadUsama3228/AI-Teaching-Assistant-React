import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  AccessTime,
  AssignmentTurnedIn,
  Assignment,
  Search,
  Sort,
} from "@mui/icons-material";
import api from "../../api";
import { useNavigate } from "react-router-dom";

const assignmentIcons = {
  24: <Assignment />,
  23: <Assignment />,
};

const getColor = (assignmentId) => {
  const colors = {
    24: "#3f51b5",
    23: "#1976d2",
  };
  return colors[assignmentId] || "#e3f2fd";
};

const AssignmentViewPage = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedCourse, setSelectedCourse] = useState("All");
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await api.get("/api/courses/student_insight/");
        const { assignment, courses } = res.data;

        const enhancedAssignments = assignment.map((a) => {
          const course = courses.find((c) => c.id === a.course);
          return {
            ...a,
            course_title: course?.course_title || "Unknown Course",
            is_submitted: false,
          };
        });

        setAssignments(enhancedAssignments);
        setCourses(courses);
      } catch (err) {
        console.error("Failed to fetch assignments", err);
        setError("Failed to fetch assignments");
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" ||
      (filterStatus === "Submitted" && assignment.is_submitted) ||
      (filterStatus === "Pending" && !assignment.is_submitted);
    const matchesCourse =
      selectedCourse === "All" || assignment.course_title === selectedCourse;

    return matchesSearch && matchesStatus && matchesCourse;
  });

  const handleAssignmentClick = (assignmentId) => {
    navigate(`/assignment/detail/${assignmentId}`);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box p={2} sx={{ maxWidth: '1200px', margin: '0 auto' }}>
      <Box display="flex" justifyContent="center" alignItems="center" mb={3}>
        <Assignment sx={{ fontSize: 40, mr: 1 }} />
        <Typography variant="h4" fontWeight={600} textAlign="center">
          Your Assignments
        </Typography>
      </Box>

      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center">
          <TextField
            variant="outlined"
            placeholder="Search..."
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            size="small"
            sx={{ width: { xs: '100%', sm: 200 }, mr: 2 }} // Responsive width
          />

          <FormControl size="small" sx={{ minWidth: 120, mr: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Submitted">Submitted</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Course</InputLabel>
            <Select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              label="Course"
            >
              <MenuItem value="All">All</MenuItem>
              {courses.map((course) => (
                <MenuItem key={course.id} value={course.course_title}>
                  {course.course_title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <IconButton color="primary">
          <Sort />
        </IconButton>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredAssignments.map((assignment) => (
            <Grid item xs={12} sm={6} md={4} key={assignment.id}>
              <Card
                sx={{
                  borderRadius: 4,
                  boxShadow: 3,
                  transition: "0.3s",
                  backgroundColor: getColor(assignment.id),
                  cursor: "pointer",
                }}
                onClick={() => handleAssignmentClick(assignment.id)}
              >
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <Typography variant="h6" gutterBottom flexGrow={1}>
                      {assignment.title}
                    </Typography>
                    {assignmentIcons[assignment.id] || <Assignment />}
                  </Box>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {assignment.course_title}
                  </Typography>

                  <Box display="flex" alignItems="center" mt={1}>
                    <AccessTime fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      Due: {new Date(assignment.due_date).toLocaleDateString()}
                    </Typography>
                  </Box>

                  <Box mt={2}>
                    <Chip
                      label={assignment.is_submitted ? "Submitted" : "Pending"}
                      color={assignment.is_submitted ? "success" : "warning"}
                      icon={<AssignmentTurnedIn />}
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AssignmentViewPage;
