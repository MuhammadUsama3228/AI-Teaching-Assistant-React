import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  useTheme,
  Grid,
  Divider,
  TextField,
  Button,
  Skeleton,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  AppBar,
  Toolbar,
  Container,
  Fade,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import api from "../../../api";
import { saveAs } from "file-saver";
import AddIcon from "@mui/icons-material/Add";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import EnrollmentForm from "./enroll_student";
import theme from "../../Theme.jsx";

const EnrollmentDashboard = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [groupedByCourse, setGroupedByCourse] = useState({});
  const [selectedCourse, setSelectedCourse] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [openSidebar, setOpenSidebar] = useState(false);
  const [inviteDrawerOpen, setInviteDrawerOpen] = useState(false);
  const [invites, setInvites] = useState([]);

  const theme = useTheme();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/api/courses/enrollment/");
      setEnrollments(res.data);

      const grouped = res.data.reduce((acc, enrollment) => {
        const { course_name } = enrollment;
        if (!acc[course_name]) acc[course_name] = [];
        acc[course_name].push(enrollment);
        return acc;
      }, {});
      setGroupedByCourse(grouped);

      const courseNames = Object.keys(grouped);
      if (courseNames.length > 0) setSelectedCourse(courseNames[0]);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvites = async () => {
    try {
      const res = await api.get("/api/courses/invite_enrollment/");
      setInvites(res.data);
    } catch (error) {
      console.error("Error fetching invite enrollments", error);
    }
  };

  const handleInviteDrawerToggle = async () => {
    if (!inviteDrawerOpen) {
      await fetchInvites();
    }
    setInviteDrawerOpen(!inviteDrawerOpen);
  };

  const handleOpenSidebar = () => setOpenSidebar(true);
  const handleCloseSidebar = () => setOpenSidebar(false);
  const handleTabChange = (event, newValue) => setSelectedCourse(newValue);
  const handleSearchChange = (event) => setSearchTerm(event.target.value);

  const handleExport = () => {
    const courseEnrollments = groupedByCourse[selectedCourse] || [];
    const csvData = courseEnrollments.map((e) => ({
      ID: e.id,
      Student: e.student,
      "Enrollment Date": e.enrollment_date,
    }));

    const csvContent = [
      ["ID", "Student", "Enrollment Date"],
      ...csvData.map((item) => [item.ID, item.Student, item["Enrollment Date"]]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    saveAs(blob, `${selectedCourse}_enrollments.csv`);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "student", headerName: "Student", flex: 1 },
    {
      field: "enrollment_date",
      headerName: "Enrollment Date",
      flex: 1,
      valueFormatter: (params) => new Date(params.value).toLocaleString(),
    },
  ];

  const rows =
    groupedByCourse[selectedCourse]
      ?.filter((enrollment) =>
        enrollment.student.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map((enrollment) => ({
        id: enrollment.id,
        student: enrollment.student,
        enrollment_date: enrollment.enrollment_date,
      })) || [];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: theme.palette.grey[50] }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 250,
          bgcolor: "linear-gradient(to bottom, #104E81FF, #21CBF3)",
          p: 2,
          borderRadius: "10px",
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" sx={{ mb: 2, color: "#150b29" }}>Dashboard</Typography>
        <Divider sx={{ bgcolor: "#280838", mb: 2 }} />
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" color="#104E81FF">Registered Courses</Typography>
          <Tabs
            value={selectedCourse}
            onChange={handleTabChange}
            orientation="vertical"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              ".MuiTab-root": { textTransform: "none", fontWeight: 500, color: "#150b29" },
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            {Object.keys(groupedByCourse).map((course, index) => (
              <Tab key={index} label={course} value={course} />
            ))}
          </Tabs>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 4 }}>
        <AppBar position="sticky" sx={{ mb: 3, bgcolor: "#280838" }}>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h4" sx={{ color: "#fff" }}>
              Enrollment Dashboard
            </Typography>
            <Tooltip title="View Invites">
              <IconButton onClick={handleInviteDrawerToggle} sx={{ color: "#fff" }}>
                <MailOutlineIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={8}>
              <TextField
                label="Search by Student"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    "&.Mui-focused fieldset": {
                      borderColor: "#150b29",
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Card elevation={3} sx={{ borderRadius: 3, display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: '#280838' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: "#fff" }}>
                    Total Students Enrolled in <strong>{selectedCourse}</strong>:{" "}
                    {groupedByCourse[selectedCourse]?.length || 0}
                  </Typography>
                </CardContent>
                <Tooltip title="Enroll New Student">
                  <IconButton
                    color="secondary"
                    onClick={handleOpenSidebar}
                    sx={{
                      transition: "transform 0.3s",
                      "&:hover": { transform: "scale(1.2)" },
                    }}
                  >
                    <AddIcon sx={{ fontSize: 40 }} />
                  </IconButton>
                </Tooltip>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    👥 Enrollments in <strong>{selectedCourse}</strong>
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  {loading ? (
                    <Skeleton variant="rectangular" width="100%" height={400} />
                  ) : (
                    <>
                      <Box sx={{ height: 420, width: "100%" }}>
                        <DataGrid
                          rows={rows}
                          columns={columns}
                          pageSize={5}
                          rowsPerPageOptions={[5, 10]}
                          disableSelectionOnClick
                          sx={{
                            borderRadius: 2,
                            "& .MuiDataGrid-root": { border: "none" },
                            "& .MuiDataGrid-columnHeader": {
                              backgroundColor: "#280838",
                              color: "#fff",
                            },
                          }}
                        />
                      </Box>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2, width: { xs: "100%", sm: "auto" } }}
                        onClick={handleExport}
                      >
                        Export {selectedCourse} Enrollments to CSV
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Enroll Student Dialog */}
      <Dialog open={openSidebar} onClose={handleCloseSidebar} TransitionComponent={Fade}>
        <DialogTitle>Enroll a New Student</DialogTitle>
        <DialogContent>
          <EnrollmentForm selectedCourse={selectedCourse} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSidebar} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Invite Drawer */}
      <Drawer
        anchor="right"
        open={inviteDrawerOpen}
        onClose={handleInviteDrawerToggle}
        sx={{ zIndex: 1300 }}
      >
        <Box sx={{ width: 350, p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            📩 Course Invitations
          </Typography>
          <List>
            {invites.length === 0 ? (
              <Typography>No invitations found.</Typography>
            ) : (
              invites.map((invite) => (
                <ListItem key={invite.id} divider>
                  <ListItemText
                    primary={invite.student_email}
                    secondary={
                      <>
                        <Typography variant="body2" color="textSecondary">
                          Course: {invite.course.course_title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Course Section: {invite.course.section}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Date: {new Date(invite.created_at).toLocaleString()}
                        </Typography>
                      </>
                    }
                  />
                  <Chip
                    label={invite.accept ? "Accepted" : "Pending"}
                    color={invite.accept ? "success" : "warning"}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </ListItem>
              ))
            )}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default EnrollmentDashboard;
