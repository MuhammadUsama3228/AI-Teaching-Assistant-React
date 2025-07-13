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
  Avatar,
  Pagination,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  AccessTime,
  AssignmentTurnedIn,
  Assignment,
  Search,
  Sort,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "../../../api.js";
import RecordNotFound from "../../Record_not_found.jsx";

const THEME_COLOR = "#4B2E83";

const AssignmentViewPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedCourse, setSelectedCourse] = useState("All");
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await api.get("/api/courses/student_insight/");
        const { assignment, courses } = res.data;

        const enhancedAssignments = assignment.map((a) => {
          const course = courses.find((c) => c.id === a.course);
          const is_submitted = res.data.assignment_submission.some(
              (s) => s.assignment === a.id
          );
          return {
            ...a,
            course_title: course?.course_title || "Unknown Course",
            is_submitted,
            submitted_at: res.data.assignment_submission.find(
                (s) => s.assignment === a.id
            )?.submission_date,
          };
        });

        setAssignments(enhancedAssignments);
        setCourses(courses);
      } catch (err) {
        setError("Failed to fetch assignments");
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch = assignment.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
        filterStatus === "All" ||
        (filterStatus === "Submitted" && assignment.is_submitted) ||
        (filterStatus === "Pending" && !assignment.is_submitted);
    const matchesCourse =
        selectedCourse === "All" || assignment.course_title === selectedCourse;

    return matchesSearch && matchesStatus && matchesCourse;
  });

  const paginatedAssignments = filteredAssignments.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredAssignments.length / itemsPerPage);

  const handleAssignmentClick = (assignmentId) => {
    navigate(`/assignment/detail/${assignmentId}`);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handlePageChange = (_, value) => {
    setCurrentPage(value);
  };

  return (
      <Box
          p={isMobile ? 1 : 3}
          sx={{
            maxWidth: "1400px",
            margin: "0 auto",
            minHeight: "100vh",
            background: "#fff",
          }}
      >
        <Box
            mb={3}
            display="flex"
            flexDirection="column"
            alignItems="center"
            textAlign="center"
        >
          <Assignment sx={{ fontSize: 50, color: THEME_COLOR }} />
          <Typography
              variant={isMobile ? "h5" : "h4"}
              fontWeight={600}
              color={THEME_COLOR}
          >
            Your Assignments
          </Typography>
        </Box>

        <Box
            mb={3}
            display="flex"
            justifyContent="space-between"
            flexWrap="wrap"
            gap={2}
        >
          <TextField
              variant="outlined"
              placeholder="Search by title..."
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: THEME_COLOR }} />
                    </InputAdornment>
                ),
              }}
              size="small"
              sx={{ width: isMobile ? "100%" : 200 }}
          />

          <FormControl size="small" sx={{ minWidth: 120 }}>
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

          <IconButton>
            <Sort sx={{ color: THEME_COLOR }} />
          </IconButton>
        </Box>

        {loading ? (
            <Box display="flex" justifyContent="center" mt={5}>
              <CircularProgress sx={{ color: THEME_COLOR }} />
            </Box>
        ) : filteredAssignments.length === 0 ? (
            <RecordNotFound message="No assignments found!" />
        ) : (
            <>
              <Grid container spacing={3}>
                {paginatedAssignments.map((assignment) => (
                    <Grid item xs={12} sm={6} md={4} key={assignment.id}>
                      <Card
                          onClick={() => handleAssignmentClick(assignment.id)}
                          sx={{
                            borderRadius: 3,
                            boxShadow: `0px 4px 20px rgba(75, 46, 131, 0.3)`,
                            cursor: "pointer",
                            backgroundColor: "#ffffff",
                            transition: "0.3s",
                            "&:hover": {
                              transform: "scale(1.02)",
                              boxShadow: `0px 6px 25px rgba(75, 46, 131, 0.45)`,
                            },
                          }}
                      >
                        <CardContent>
                          <Box display="flex" alignItems="center" mb={2}>
                            <Avatar
                                variant="square"
                                sx={{
                                  bgcolor: "#fff",
                                  color: THEME_COLOR,
                                  border: `2px solid ${THEME_COLOR}`,
                                  width: 48,
                                  height: 48,
                                  fontWeight: "bold",
                                  mr: 2,
                                }}
                            >
                              {assignment.title.charAt(0).toUpperCase()}
                            </Avatar>

                            <Box flexGrow={1}>
                              <Typography variant="h6" fontWeight={600}>
                                {assignment.title}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {assignment.course_title}
                              </Typography>
                            </Box>
                          </Box>

                          <Box display="flex" alignItems="center" mt={1}>
                            <AccessTime sx={{ mr: 1, color: THEME_COLOR }} />
                            <Typography variant="body2">
                              Due:{" "}
                              {new Date(assignment.due_date).toLocaleDateString()}
                            </Typography>
                          </Box>

                          {assignment.is_submitted && assignment.submitted_at && (
                              <Typography variant="body2" mt={1}>
                                Submitted:{" "}
                                {new Date(
                                    assignment.submitted_at
                                ).toLocaleString()}
                              </Typography>
                          )}

                          <Box mt={2}>
                            <Chip
                                label={assignment.is_submitted ? "Submitted" : "Pending"}
                                color={assignment.is_submitted ? "success" : "warning"}
                                icon={
                                  <AssignmentTurnedIn sx={{ color: THEME_COLOR }} />
                                }
                                variant="outlined"
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                ))}
              </Grid>

              <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    shape="rounded"
                    sx={{
                      "& .MuiPaginationItem-root": {
                        color: THEME_COLOR,
                        borderColor: THEME_COLOR,
                      },
                      "& .Mui-selected": {
                        backgroundColor: THEME_COLOR,
                        color: "#fff",
                        "&:hover": {
                          backgroundColor: THEME_COLOR,
                        },
                      },
                    }}
                />
              </Box>

            </>
        )}

        <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
        >
          <Alert
              onClose={handleCloseSnackbar}
              severity="error"
              sx={{ width: "100%" }}
          >
            {error}
          </Alert>
        </Snackbar>
      </Box>
  );
};

export default AssignmentViewPage;
