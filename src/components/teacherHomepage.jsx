import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import LinkIcon from '@mui/icons-material/Link';

const cards = [
  { title: "Profile", subtitle: "View Your Profile", icon: <BookmarkIcon fontSize="large" />, color: "#1565c0", route: "#" },
  { title: "Courses", subtitle: "Manage Your Courses", icon: <ListAltIcon fontSize="large" />, color: "#512da8", route: "/view-courses" },
  { title: "Assignments", subtitle: "View and Set Assignments", icon: <CalendarTodayIcon fontSize="large" />, color: "#0288d1", route: "/view-assignments" },
  { title: "Students", subtitle: "Manage Student Profiles", icon: <PeopleIcon fontSize="large" />, color: "#ff5722", route: "/courseEnrollmentPage" },
  { title: "Resources", subtitle: "Access Learning Materials", icon: <LinkIcon fontSize="large" />, color: "#fbc02d", route: "#" },
];

export default function Teacherview() {
  const cards = [
    {
      title: "Profile",
      subtitle: "View Your Profile",
      icon: <BookmarkIcon fontSize="large" />,
      color: "#1565c0",
      route: "/profile/teacher-slug",
    },
    {
      title: "Courses",
      subtitle: "Manage Your Courses",
      icon: <ListAltIcon fontSize="large" />,
      color: "#512da8",
      route: "/view-courses",
    },
    {
      title: "Assignments",
      subtitle: "View and Set Assignments",
      icon: <CalendarTodayIcon fontSize="large" />,
      color: "#0288d1",
      route: "/view-assignments",
    },
    {
      title: "Students",
      subtitle: "Manage Student Profiles",
      icon: <PeopleIcon fontSize="large" />,
      color: "#ff5722",
      route: "/EnrollmentPage",
    },
    {
      title: "Resources",
      subtitle: "Access Learning Materials",
      icon: <LinkIcon fontSize="large" />,
      color: "#fbc02d",
      route: "#",
    },
  ];

  return (
    <Box
      sx={{
        padding: { xs: 2, md: 4 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      {/* Dashboard Header */}
      <Box
        sx={{
          mb: 5,
          color: "#333",
          borderRadius: 2,
          textAlign: "center",
          width: "100%",
          maxWidth: 600,
        }}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
          My Dashboard
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          Welcome to your dashboard! Here you can manage your courses, assignments, and students effectively.
        </Typography>
      </Box>

      {/* Cards Layout */}
      <Grid container spacing={4}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Link to={card.route} style={{ textDecoration: "none" }}>
              <Card
                sx={{
                  backgroundColor: card.color,
                  color: "#fff",
                  height: "auto",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 2,
                  boxShadow: 3,
                  transition: "transform 0.3s",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent sx={{ textAlign: "center" }}>
                  {card.icon}
                  <Typography variant="h6" sx={{ marginTop: 1 }}>
                    {card.title}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {card.subtitle}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
