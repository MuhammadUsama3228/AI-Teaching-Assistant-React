import React, { useState } from "react";
import { styled, useTheme, ThemeProvider } from "@mui/material/styles";
import theme from "../../../components/Theme.jsx"; // Custom theme
import { Link } from "react-router-dom";

import {
  Box,
  CssBaseline,
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  Divider,
  IconButton,
  Drawer as MuiDrawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";

import AssignmentDetailPage from "../../../components/teacher/assignment/detail_assignmet";

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
  background: "linear-gradient(90deg, #4B2E83, #1C1C3A)", // Purple gradient
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open ? openedMixin(theme) : closedMixin(theme)),
  "& .MuiDrawer-paper": {
    ...(open ? openedMixin(theme) : closedMixin(theme)),
    backgroundColor: theme.palette.background.paper,
    borderRight: "1px solid #e0e0e0",
    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
}));

export default function Assignmentdetailpage() {
  const muiTheme = useTheme();
  const [open, setOpen] = useState(false);
  const [assignmentOpen, setAssignmentOpen] = useState(true);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  const toggleAssignmentDrawer = () => setAssignmentOpen(!assignmentOpen);

  const drawerItemStyles = {
    minHeight: 48,
    px: 2.5,
    borderRadius: 2,
    mx: 1,
    transition: "background 0.3s ease",
    "&:hover": {
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
                  onClick={handleDrawerOpen}
                  edge="start"
                  sx={{ marginRight: 5, ...(open && { display: "none" }) }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap>
                Assignment Panel
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
              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton onClick={toggleAssignmentDrawer} sx={drawerItemStyles}>
                  <ListItemIcon sx={{ color: "#150b29" }}>
                    <AssignmentIcon />
                  </ListItemIcon>
                  <ListItemText primary="Assignments" sx={{ color: "#280838" }} />
                </ListItemButton>
              </ListItem>

              {assignmentOpen && (
                  <>
                    <ListItemButton component={Link} to="/view-assignments" sx={drawerItemStyles}>
                      <ListItemIcon sx={{ color: "#150b29" }}>
                        <VisibilityIcon />
                      </ListItemIcon>
                      <ListItemText primary="View Assignments" sx={{ color: "#280838" }} />
                    </ListItemButton>
                    <ListItemButton component={Link} to="/submission-status" sx={drawerItemStyles}>
                      <ListItemIcon sx={{ color: "#150b29" }}>
                        <CheckCircleIcon />
                      </ListItemIcon>
                      <ListItemText primary="Submission Status" sx={{ color: "#280838" }} />
                    </ListItemButton>
                  </>
              )}
            </List>
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
            <AssignmentDetailPage />
          </Box>
        </Box>
      </ThemeProvider>
  );
}
