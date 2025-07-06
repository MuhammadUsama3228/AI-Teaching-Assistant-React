import React, { useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import {
  Box, CssBaseline, Drawer as MuiDrawer, AppBar as MuiAppBar, Toolbar, Typography,
  IconButton, Divider, List, ListItem, ListItemIcon, ListItemText
} from "@mui/material";
import {
  Menu as MenuIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon,
  Visibility as VisibilityIcon, School as SchoolIcon, Dashboard as DashboardIcon
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import WeekAnnouncementView from "../../../components/teacher/courses/week_announcement/week_announcement_view";

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

const AppBar = styled(MuiAppBar, { shouldForwardProp: (prop) => prop !== "open" })(
    ({ theme, open }) => ({
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
      background: "linear-gradient(90deg, #4B2E83, #1C1C3A)", // dark theme gradient
    })
);

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(
    ({ theme, open }) => ({
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: "nowrap",
      boxSizing: "border-box",
      ...(open ? openedMixin(theme) : closedMixin(theme)),
      "& .MuiDrawer-paper": {
        ...(!open ? closedMixin(theme) : openedMixin(theme)),
        borderTopRightRadius: 16,
        borderBottomRightRadius: 16,
        backgroundColor: theme.palette.background.default,
        boxShadow: theme.shadows[4],
      },
    })
);

export default function WeekAnnViewPage() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  return (
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
            <Typography variant="h6" noWrap>
              Course Management Panel
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            <ListItem button component={Link} to="/dashboard">
              <ListItemIcon sx={{ color: '#1C1C1C' }}>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" primaryTypographyProps={{ sx: { color: '#1C1C1C' } }} />
            </ListItem>

            <ListItem button component={Link} to="/view-courses">
              <ListItemIcon sx={{ color: '#1C1C1C' }}>
                <SchoolIcon />
              </ListItemIcon>
              <ListItemText primary="View Courses" primaryTypographyProps={{ sx: { color: '#1C1C1C' } }} />
            </ListItem>

            <ListItem button component={Link} to="/courses/course/1/weeks/1/announcements">
              <ListItemIcon sx={{ color: '#1C1C1C' }}>
                <VisibilityIcon />
              </ListItemIcon>
              <ListItemText primary="Announcements" primaryTypographyProps={{ sx: { color: '#1C1C1C' } }} />
            </ListItem>
          </List>


          <Divider />
        </Drawer>
        <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              width: { sm: `calc(100% - ${open ? drawerWidth : 20}px)` },
            }}
        >
          <Toolbar />
          <WeekAnnouncementView />
        </Box>
      </Box>
  );
}
