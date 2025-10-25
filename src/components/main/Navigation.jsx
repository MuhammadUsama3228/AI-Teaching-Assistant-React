import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  ContactMail as ContactMailIcon,
  AccountCircle as AccountCircleIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
  School as SchoolIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDropdownClick = (event) => {
    setAnchorEl(event.currentTarget);
    setIsDropdownOpen(true);
  };

  const handleDropdownClose = () => {
    setAnchorEl(null);
    setIsDropdownOpen(false);
  };

  const toggleDrawer = (open) => {
    setIsDrawerOpen(open);
  };

  return (
      <AppBar
          position="sticky"
          elevation={0}
          sx={{
            background: "rgba(34, 34, 34)",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Logo & Title */}
          <Box display="flex" alignItems="center">
            <SchoolIcon sx={{ mr: 1, color: "#ffffff" }} />
            <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  letterSpacing: 1,
                  color: "#ffffff",
                  fontSize: "1.1rem",
                }}
            >
              AI Teaching Assistant
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            {[
              { label: "Home", icon: <HomeIcon />, to: "/" },
              { label: "About", icon: <InfoIcon />, to: "/about" },
              { label: "Contact", icon: <ContactMailIcon />, to: "/contact" },
            ].map(({ label, icon, to }) => (
                <Button
                    key={label}
                    startIcon={icon}
                    component={Link}
                    to={to}
                    sx={{
                      color: "#f5f5f5",
                      fontWeight: 500,
                      textTransform: "none",
                      transition: "0.3s",
                      "&:hover": {
                        color: "#ffffff",
                        backgroundColor: "rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                      },
                    }}
                >
                  {label}
                </Button>
            ))}

            <Button
                startIcon={<AccountCircleIcon />}
                onClick={handleDropdownClick}
                sx={{
                  color: "#f5f5f5",
                  fontWeight: 500,
                  textTransform: "none",
                  transition: "0.3s",
                  "&:hover": {
                    color: "#ffffff",
                    backgroundColor: "rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                  },
                }}
            >
              Account
            </Button>
            <Menu anchorEl={anchorEl} open={isDropdownOpen} onClose={handleDropdownClose}>
              <MenuItem onClick={handleDropdownClose} component={Link} to="/login">
                <LoginIcon sx={{ mr: 1 }} /> Login
              </MenuItem>
              <MenuItem onClick={handleDropdownClose} component={Link} to="/choice">
                <PersonAddIcon sx={{ mr: 1 }} /> Signup
              </MenuItem>
            </Menu>
          </Box>

          {/* Mobile Hamburger */}
          <IconButton
              edge="end"
              onClick={() => toggleDrawer(true)}
              sx={{ display: { xs: "flex", md: "none" }, color: "#ffffff" }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>

        {/* Mobile Drawer */}
        <Drawer
            anchor="left"
            open={isDrawerOpen}
            onClose={() => toggleDrawer(false)}
            PaperProps={{
              sx: {
                backgroundColor: "#1f1f1f",
                color: "#f5f5f5",
                backdropFilter: "blur(6px)",
              },
            }}
        >
          <Box sx={{ width: 250 }} onClick={() => toggleDrawer(false)}>
            <List>
              {[
                { text: "Home", icon: <HomeIcon />, to: "/" },
                { text: "About", icon: <InfoIcon />, to: "/about" },
                { text: "Contact", icon: <ContactMailIcon />, to: "/contact" },
              ].map(({ text, icon, to }) => (
                  <ListItem key={text} disablePadding>
                    <ListItemButton component={Link} to={to}>
                      <ListItemIcon sx={{ color: "#ffffff" }}>{icon}</ListItemIcon>
                      <ListItemText primary={text} />
                    </ListItemButton>
                  </ListItem>
              ))}
              <Divider sx={{ my: 1, backgroundColor: "#444" }} />
              {[
                { text: "Login", icon: <LoginIcon />, to: "/login" },
                { text: "Signup", icon: <PersonAddIcon />, to: "/choice" },
              ].map(({ text, icon, to }) => (
                  <ListItem key={text} disablePadding>
                    <ListItemButton component={Link} to={to}>
                      <ListItemIcon sx={{ color: "#ffffff" }}>{icon}</ListItemIcon>
                      <ListItemText primary={text} />
                    </ListItemButton>
                  </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </AppBar>
  );
};

export default Navbar;
