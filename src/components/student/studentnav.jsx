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
  Assignment,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const primaryColor = "#4B2E83";

  const toggleDrawer = (open) => {
    setDrawerOpen(open);
  };

  const handleLogout = () => {
    console.log("Logout clicked");
  };

  const buttonStyle = {
    color: primaryColor,
    "&:hover": { color: "#6b4fb6" },
    textTransform: "none",
    fontWeight: 500,
  };

  return (
      <>
        <AppBar
            position="static"
            sx={{
              backgroundColor: "#fff",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <img src={logo} alt="Logo" width="50" />



            {isMobile ? (
                <IconButton onClick={() => toggleDrawer(true)} sx={{ color: primaryColor }}>
                  <Menu />
                </IconButton>
            ) : (
                <Box>
                  <Link to="/studentprofile" style={{ textDecoration: "none" }}>
                    <Button startIcon={<AccountCircle />} sx={buttonStyle}>
                      Profile
                    </Button>
                  </Link>
                  <Link to="/StudentDashboard" style={{ textDecoration: "none" }}>
                    <Button startIcon={<Dashboard />} sx={buttonStyle}>
                      Dashboard
                    </Button>
                  </Link>
                  <Link to="/studentpanel" style={{ textDecoration: "none" }}>
                    <Button startIcon={<School />} sx={buttonStyle}>
                      Courses
                    </Button>
                  </Link>
                  <Link to="/StudentAssignment" style={{ textDecoration: "none" }}>
                    <Button startIcon={<Assignment />} sx={buttonStyle}>
                      Assignments
                    </Button>
                  </Link>
                  <Link to="/" onClick={handleLogout} style={{ textDecoration: "none" }}>
                    <Button
                        startIcon={<ExitToApp />}
                        sx={{ ...buttonStyle, "&:hover": { color: "#c82333" }, ml: 2 }}
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
              <Button startIcon={<AccountCircle />} sx={{ ...buttonStyle, width: "100%", mb: 2 }}>
                Profile
              </Button>
            </Link>
            <Link to="/StudentDashboard" style={{ textDecoration: "none" }}>
              <Button startIcon={<Dashboard />} sx={{ ...buttonStyle, width: "100%", mb: 2 }}>
                Dashboard
              </Button>
            </Link>
            <Link to="/studentpanel" style={{ textDecoration: "none" }}>
              <Button startIcon={<School />} sx={{ ...buttonStyle, width: "100%", mb: 2 }}>
                Courses
              </Button>
            </Link>
            <Link to="/StudentAssignment" style={{ textDecoration: "none" }}>
              <Button startIcon={<Assignment />} sx={{ ...buttonStyle, width: "100%", mb: 2 }}>
                Assignments
              </Button>
            </Link>
            <Link to="/" onClick={handleLogout} style={{ textDecoration: "none" }}>
              <Button startIcon={<ExitToApp />} sx={{ ...buttonStyle, width: "100%" }}>
                Logout
              </Button>
            </Link>
          </Box>
        </Drawer>
      </>
  );
};

export default Navbar;
