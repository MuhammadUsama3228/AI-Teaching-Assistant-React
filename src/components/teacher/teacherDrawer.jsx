import React, { useState } from "react";
import { styled, useTheme, ThemeProvider } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import theme from "../Theme.jsx";
import {
    Box, CssBaseline, AppBar as MuiAppBar, Toolbar, Typography, Divider,
    IconButton, Drawer as MuiDrawer, List, ListItem, ListItemButton,
    ListItemIcon, ListItemText, Menu, MenuItem
} from "@mui/material";
import {
    Menu as MenuIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon,
    Dashboard as DashboardIcon, LibraryBooks as LibraryBooksIcon,
    Assignment as AssignmentIcon, Grade as GradeIcon,
    People as PeopleIcon, CalendarToday as CalendarTodayIcon,
    AccountCircle, Person as ProfileIcon, ExitToApp as LogoutIcon
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import Teacherview from "../teacherHomepage";

const drawerWidth = 240;

// Header inside drawer
const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

// AppBar with dynamic margin
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
        backgroundColor: "#4B2E83",
        color: "#ffffff",
        boxShadow: "none",
        borderBottom: "1px solid #3a2464",
    })
);

export default function TeacherPanelDrawer() {
    const muiTheme = useTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));
    const [open, setOpen] = useState(!isMobile);
    const [anchorEl, setAnchorEl] = useState(null);
    const [courseOpen, setCourseOpen] = useState(false);

    const handleDrawerOpen = () => setOpen(true);
    const handleDrawerClose = () => setOpen(false);
    const toggleCourseDrawer = () => setCourseOpen(!courseOpen);
    const handleMenu = (e) => setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const drawerItemStyles = {
        minHeight: 48,
        px: 2.5,
        borderRadius: 2,
        mx: 1,
        transition: "background 0.3s ease",
        "&:hover": {
            backgroundColor: muiTheme.palette.action.hover,
        },
    };

    const drawerContent = (
        <>
            <DrawerHeader>
                <IconButton onClick={handleDrawerClose}>
                    {muiTheme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
                <ListItem disablePadding sx={{ display: "block" }}>
                    <ListItemButton
                        component={Link}
                        to="/teacherpanel"
                        sx={drawerItemStyles}
                        onClick={() => isMobile && handleDrawerClose()}
                    >
                        <ListItemIcon sx={{ color: "#150b29" }}>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Dashboard" sx={{ color: "#150b29" }} />
                    </ListItemButton>
                </ListItem>

                <ListItemButton onClick={toggleCourseDrawer} sx={drawerItemStyles}>
                    <ListItemIcon sx={{ color: "#150b29" }}>
                        <LibraryBooksIcon />
                    </ListItemIcon>
                    <ListItemText primary="My Courses" sx={{ color: "#150b29" }} />
                </ListItemButton>

                {courseOpen && (
                    <>
                        <ListItemButton
                            component={Link}
                            to="/view-courses"
                            sx={drawerItemStyles}
                            onClick={() => isMobile && handleDrawerClose()}
                        >
                            <ListItemIcon sx={{ color: "#150b29" }}>
                                <LibraryBooksIcon />
                            </ListItemIcon>
                            <ListItemText primary="Courses" sx={{ color: "#150b29" }} />
                        </ListItemButton>

                        <ListItemButton
                            component={Link}
                            to="/view-assignments"
                            sx={drawerItemStyles}
                            onClick={() => isMobile && handleDrawerClose()}
                        >
                            <ListItemIcon sx={{ color: "#150b29" }}>
                                <AssignmentIcon />
                            </ListItemIcon>
                            <ListItemText primary="Assignments" sx={{ color: "#150b29" }} />
                        </ListItemButton>

                        <ListItemButton
                            component={Link}
                            to="/submission-status"
                            sx={drawerItemStyles}
                            onClick={() => isMobile && handleDrawerClose()}
                        >
                            <ListItemIcon sx={{ color: "#150b29" }}>
                                <GradeIcon />
                            </ListItemIcon>
                            <ListItemText primary="Grades" sx={{ color: "#150b29" }} />
                        </ListItemButton>
                    </>
                )}

                <ListItemButton
                    component={Link}
                    to="/classroom"
                    sx={drawerItemStyles}
                    onClick={() => isMobile && handleDrawerClose()}
                >
                    <ListItemIcon sx={{ color: "#150b29" }}>
                        <PeopleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Classroom" sx={{ color: "#150b29" }} />
                </ListItemButton>

                <ListItemButton
                    component={Link}
                    to="/viewtimeslot"
                    sx={drawerItemStyles}
                    onClick={() => isMobile && handleDrawerClose()}
                >
                    <ListItemIcon sx={{ color: "#150b29" }}>
                        <CalendarTodayIcon />
                    </ListItemIcon>
                    <ListItemText primary="Schedule" sx={{ color: "#150b29" }} />
                </ListItemButton>
            </List>

        </>
    );

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
                <CssBaseline />
                <AppBar position="fixed" open={open && !isMobile}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            onClick={handleDrawerOpen}
                            edge="start"
                            sx={{ marginRight: 2, ...(open && !isMobile && { display: "none" }) }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap component="div">Teacher Panel</Typography>
                        <Box sx={{ flexGrow: 1 }} />
                        <IconButton color="inherit" onClick={handleMenu}><AccountCircle /></IconButton>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                            <MenuItem component={Link} to="/profile" onClick={handleClose}>
                                <ListItemIcon><ProfileIcon fontSize="small" /></ListItemIcon>
                                Profile
                            </MenuItem>
                            <MenuItem component={Link} to="/logout" onClick={handleClose}>
                                <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                                Logout
                            </MenuItem>
                        </Menu>
                    </Toolbar>
                </AppBar>

                <Box sx={{ display: "flex", flex: 1 }}>
                    <MuiDrawer
                        variant={isMobile ? "temporary" : "permanent"}
                        open={open}
                        onClose={() => setOpen(false)}
                        ModalProps={{ keepMounted: true }}
                        sx={{
                            width: drawerWidth,
                            flexShrink: 0,
                            "& .MuiDrawer-paper": {
                                width: drawerWidth,
                                borderTopRightRadius: 12,
                                borderBottomRightRadius: 12,
                                backgroundColor: muiTheme.palette.background.default,
                                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                            },
                        }}
                    >
                        {drawerContent}
                    </MuiDrawer>

                    <Box
                        component="main"
                        sx={{
                            flexGrow: 1,
                            px: { xs: 2, sm: 3 },
                            py: 3,
                            width: {
                                xs: "100%",
                                sm: `calc(100% - ${open && !isMobile ? drawerWidth : 0}px)`,
                            },
                            transition: "width 0.3s",
                        }}
                    >
                        <Toolbar />
                        <Teacherview />
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    );
}
