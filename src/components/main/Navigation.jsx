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
    <AppBar position="sticky" sx={{ backgroundColor: "#052649" }}>
      <Toolbar>
        {/* Logo & Title */}
        <SchoolIcon sx={{ mr: 1 }} />
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontWeight: "bold",
            textTransform: "uppercase",
            letterSpacing: 2,
          }}
        >
          AI Teaching Assistant
        </Typography>

        {/* Desktop Navigation */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
          <Button color="inherit" startIcon={<HomeIcon />} component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" startIcon={<InfoIcon />} component={Link} to="/about">
            About
          </Button>
          <Button color="inherit" startIcon={<ContactMailIcon />} component={Link} to="/contact">
            Contact Us
          </Button>
          <Button
            color="inherit"
            startIcon={<AccountCircleIcon />}
            onClick={handleDropdownClick}
            sx={{ "&:hover": { textDecoration: "underline" } }}
          >
            Account
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={isDropdownOpen}
            onClose={handleDropdownClose}
          >
            <MenuItem onClick={handleDropdownClose} component={Link} to="/login">
              <LoginIcon sx={{ mr: 1 }} /> Login
            </MenuItem>
            <MenuItem onClick={handleDropdownClose} component={Link} to="/choice">
              <PersonAddIcon sx={{ mr: 1 }} /> Signup
            </MenuItem>
          </Menu>
        </Box>

        {/* Mobile Hamburger Icon */}
        <IconButton
          edge="end"
          color="inherit"
          sx={{ display: { xs: "flex", md: "none" } }}
          onClick={() => toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      {/* Drawer for Mobile */}
      <Drawer anchor="left" open={isDrawerOpen} onClose={() => toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => toggleDrawer(false)}
          onKeyDown={() => toggleDrawer(false)}
        >
          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/">
                <ListItemIcon><HomeIcon /></ListItemIcon>
                <ListItemText primary="Home" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/about">
                <ListItemIcon><InfoIcon /></ListItemIcon>
                <ListItemText primary="About" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/contact">
                <ListItemIcon><ContactMailIcon /></ListItemIcon>
                <ListItemText primary="Contact Us" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/login">
                <ListItemIcon><LoginIcon /></ListItemIcon>
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/choice">
                <ListItemIcon><PersonAddIcon /></ListItemIcon>
                <ListItemText primary="Signup" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
