import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Typography,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  AccountCircle,
  Dashboard,
  School,
  Menu,
  ExitToApp,
  Assignment, // Import Assignment icon
} from "@mui/icons-material";
import { Link } from "react-router-dom"; // Import Link and useHistory for navigation

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const toggleDrawer = (open) => {
    setDrawerOpen(open);
  };

  const handleLogout = () => {
    // Implement your logout logic here (e.g., clearing tokens, etc.)
    console.log("Logout clicked");
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#fff", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ color: "#1976d2" }}>
            AI-TA
          </Typography>

          {isMobile ? (
            <IconButton onClick={() => toggleDrawer(true)} sx={{ color: "#1976d2" }}>
              <Menu />
            </IconButton>
          ) : (
            <Box>
              <Link to="/studentprofile" style={{ textDecoration: "none" }}>
                <Button startIcon={<AccountCircle />} sx={{ color: "#003366", "&:hover": { color: "#0056b3" } }}>
                  Profile
                </Button>
              </Link>
              <Link to="/StudentDashboard" style={{ textDecoration: "none" }}>
                <Button startIcon={<Dashboard />} sx={{ color: "#003366", "&:hover": { color: "#0056b3" } }}>
                  Dashboard
                </Button>
              </Link>
              <Link to="/studentpanel" style={{ textDecoration: "none" }}>
                <Button startIcon={<School />} sx={{ color: "#003366", "&:hover": { color: "#0056b3" } }}>
                  Courses
                </Button>
              </Link>
              <Link to="/StudentAssignment" style={{ textDecoration: "none" }}> {/* Add Assignments Link */}
                <Button startIcon={<Assignment />} sx={{ color: "#003366", "&:hover": { color: "#0056b3" } }}>
                  Assignments
                </Button>
              </Link>
              <Link to="/logout" onClick={handleLogout} style={{ textDecoration: "none" }}>
                <Button
                  startIcon={<ExitToApp />}
                  sx={{ color: "#003366", "&:hover": { color: "#c82333" }, marginLeft: 2 }}
                >
                  Logout
                </Button>
              </Link>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={() => toggleDrawer(false)}>
        <Box sx={{ width: 250, padding: 2 }}>
          <Link to="/studentprofile" style={{ textDecoration: "none" }}>
            <Button startIcon={<AccountCircle />} sx={{ color: "#003366", width: "100%", marginBottom: 2 }}>
              Profile
            </Button>
          </Link>
          <Link to="/dashboard" style={{ textDecoration: "none" }}>
            <Button startIcon={<Dashboard />} sx={{ color: "#003366", width: "100%", marginBottom: 2 }}>
              Dashboard
            </Button>
          </Link>
          <Link to="/studentpanel" style={{ textDecoration: "none" }}>
            <Button startIcon={<School />} sx={{ color: "#003366", width: "100%", marginBottom: 2 }}>
              Courses
            </Button>
          </Link>
          <Link to="/StudentAssignment" style={{ textDecoration: "none" }}> {/* Add Assignments Link in Drawer */}
            <Button startIcon={<Assignment />} sx={{ color: "#003366", width: "100%", marginBottom: 2 }}>
              Assignments
            </Button>
          </Link>
          <Link to="/" onClick={handleLogout} style={{ textDecoration: "none" }}>
            <Button
              startIcon={<ExitToApp />}
              sx={{ color: "#003366", width: "100%" }}
            >
              Logout
            </Button>
          </Link>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
