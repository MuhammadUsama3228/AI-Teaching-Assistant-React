import React, { useState } from "react";
import {
    Box, CssBaseline, Toolbar, Typography, Divider, IconButton,
    Drawer as MuiDrawer, AppBar as MuiAppBar, List, ListItem, ListItemIcon, ListItemText,
    useMediaQuery
} from "@mui/material";
import { styled, useTheme, ThemeProvider } from "@mui/material/styles";
import {
    Menu as MenuIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    Visibility as VisibilityIcon,
    School as SchoolIcon,
    Dashboard as DashboardIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import WeekAnnouncementView from "../../../components/teacher/courses/week_announcement/week_announcement_view";
import theme from "../../../components/Theme.jsx";

const drawerWidth = 240;

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar)(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    background: "linear-gradient(90deg, #4B2E83, #1C1C3A)",
}));

export default function WeekAnnViewPage() {
    const muiTheme = useTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    const drawerItemStyles = {
        minHeight: 48,
        px: 2.5,
        borderRadius: 2,
        mx: 1,
        transition: "background 0.3s ease",
        color: muiTheme.palette.text.primary,
        '&:hover': {
            backgroundColor: muiTheme.palette.action.hover,
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        },
    };

    const drawerContent = (
        <Box>
            <DrawerHeader>
                {isMobile && (
                    <IconButton onClick={handleDrawerToggle}>
                        {muiTheme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                )}
            </DrawerHeader>
            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItem button component={Link} to="/dashboard" sx={drawerItemStyles}>
                        <ListItemIcon>
                            <DashboardIcon sx={{ color: muiTheme.palette.text.primary }} />
                        </ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItem>
                </ListItem>
                <ListItem disablePadding>
                    <ListItem button component={Link} to="/view-courses" sx={drawerItemStyles}>
                        <ListItemIcon>
                            <SchoolIcon sx={{ color: muiTheme.palette.text.primary }} />
                        </ListItemIcon>
                        <ListItemText primary="View Courses" />
                    </ListItem>
                </ListItem>
                <ListItem disablePadding>
                    <ListItem button component={Link} to="/courses/course/1/weeks/1/announcements" sx={drawerItemStyles}>
                        <ListItemIcon>
                            <VisibilityIcon sx={{ color: muiTheme.palette.text.primary }} />
                        </ListItemIcon>
                        <ListItemText primary="Announcements" />
                    </ListItem>
                </ListItem>
            </List>
            <Divider />
        </Box>
    );

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: "flex", minHeight: "100vh" }}>
                <CssBaseline />

                {/* Top AppBar */}
                <AppBar position="fixed">
                    <Toolbar>
                        {isMobile && (
                            <IconButton
                                color="inherit"
                                edge="start"
                                onClick={handleDrawerToggle}
                                sx={{ mr: 2 }}
                            >
                                <MenuIcon />
                            </IconButton>
                        )}
                        <Typography variant="h6" noWrap>
                            Course Management Panel
                        </Typography>
                    </Toolbar>
                </AppBar>

                {/* Responsive Drawer */}
                {isMobile ? (
                    <MuiDrawer
                        variant="temporary"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        ModalProps={{ keepMounted: true }}
                        sx={{ '& .MuiDrawer-paper': { width: drawerWidth } }}
                    >
                        {drawerContent}
                    </MuiDrawer>
                ) : (
                    <MuiDrawer
                        variant="permanent"
                        open
                        sx={{
                            width: drawerWidth,
                            flexShrink: 0,
                            '& .MuiDrawer-paper': {
                                width: drawerWidth,
                                boxSizing: 'border-box',
                                borderTopRightRadius: 12,
                                borderBottomRightRadius: 12,
                                backgroundColor: muiTheme.palette.background.paper,
                                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                            },
                        }}
                    >
                        {drawerContent}
                    </MuiDrawer>
                )}

                {/* Main Content */}
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        px: { xs: 2, sm: 3 },
                        py: 4,
                        mt: 8,
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "start",
                        bgcolor: "background.default",
                    }}
                >
                    <Box sx={{ width: "100%", maxWidth: "900px" }}>
                        <WeekAnnouncementView />
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    );
}
