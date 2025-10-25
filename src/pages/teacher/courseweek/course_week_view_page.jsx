import React, { useState } from "react";
import { styled, useTheme, ThemeProvider } from "@mui/material/styles";
import theme from "../../../components/Theme.jsx"; // your custom them
import {
  Box, CssBaseline, AppBar as MuiAppBar, Toolbar, Typography, Divider,
  IconButton, Drawer as MuiDrawer, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText
} from "@mui/material";
import {
  Menu as MenuIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon,
  Dashboard as DashboardIcon, School as SchoolIcon,
  Visibility as VisibilityIcon, ListAlt as ListAltIcon
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import CourseWeekView from "../../../components/teacher/courses/course_week/course_week_view";


const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  background: "linear-gradient(90deg, #4B2E83, #1C1C3A)",
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(
    ({ theme, open }) => ({
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: "nowrap",
      boxSizing: "border-box",
      ...(open ? openedMixin(theme) : closedMixin(theme)),
      "& .MuiDrawer-paper": open ? openedMixin(theme) : closedMixin(theme),
    })
);

export default function CourseWeekViewPage() {
  const muiTheme = useTheme();
  const [open, setOpen] = useState(false);
  const [courseOpen, setCourseOpen] = useState(false);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  const toggleCourseDrawer = () => setCourseOpen(!courseOpen);

  const drawerItemStyles = {
    minHeight: 48,
    px: 2.5,
    borderRadius: 2,
    mx: 1,
    transition: "background 0.3s ease",
    '&:hover': {
      backgroundColor: muiTheme.palette.action.hover,
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    },
  };

  return (
      <ThemeProvider theme={theme}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <AppBar position="fixed" open={open}>
            <Toolbar>
              <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDrawerOpen}
                  edge="start"
                  sx={{ marginRight: 5, ...(open && { display: "none" }) }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap component="div">
                Course Management Panel
              </Typography>
            </Toolbar>
          </AppBar>
          <Drawer variant="permanent" open={open}>
            <DrawerHeader>
              <IconButton onClick={handleDrawerClose}>
                {muiTheme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
              {/* Dashboard Link */}
              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton component={Link} to="/dashboard" sx={drawerItemStyles}>
                  <ListItemIcon><DashboardIcon /></ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItemButton>
              </ListItem>

              {/* Courses Dropdown */}
              <ListItem button onClick={toggleCourseDrawer} sx={drawerItemStyles}>
                <ListItemIcon><SchoolIcon /></ListItemIcon>
                <ListItemText primary="Courses" />
              </ListItem>
              {courseOpen && (
                  <>
                    <ListItem button component={Link} to="/view-courses" sx={drawerItemStyles}>
                      <ListItemIcon><VisibilityIcon /></ListItemIcon>
                      <ListItemText primary="View Courses" />
                    </ListItem>
                    <ListItem button component={Link} to="/course_week_view" sx={drawerItemStyles}>
                      <ListItemIcon><ListAltIcon /></ListItemIcon>
                      <ListItemText primary="View Course Weeks" />
                    </ListItem>
                  </>
              )}
            </List>
            <Divider />
          </Drawer>
          <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 3,
                width: { sm: `calc(100% - ${open ? drawerWidth : 60}px)` },
              }}
          >
            <Toolbar />
            <CourseWeekView />
          </Box>
        </Box>
      </ThemeProvider>
  );
}
