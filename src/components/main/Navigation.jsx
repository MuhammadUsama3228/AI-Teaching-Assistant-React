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
  ListItemText,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { Link } from "react-router-dom"; // Import Link for routing

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
        {/* Logo/Title */}
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

        {/* Desktop Navigation Links */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/about">
            About
          </Button>
          <Button color="inherit" component={Link} to="/contact">
            Contact Us
          </Button>

          {/* Dropdown for Account (Desktop) */}
          <Button
            color="inherit"
            onClick={handleDropdownClick}
            sx={{
              position: "relative",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Account
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={isDropdownOpen}
            onClose={handleDropdownClose}
          >
            <MenuItem onClick={handleDropdownClose}>
              <Link to="/login">Login</Link>
            </MenuItem>
            <MenuItem onClick={handleDropdownClose}>
              <Link to="/choice">Signup</Link>
            </MenuItem>
          </Menu>
        </Box>

        {/* Mobile Icon Button for Drawer */}
        <IconButton
          edge="end"
          color="inherit"
          sx={{ display: { xs: "flex", md: "none" } }}
          onClick={() => toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      {/* Drawer for Mobile Navigation */}
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={() => toggleDrawer(false)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => toggleDrawer(false)}
          onKeyDown={() => toggleDrawer(false)}
        >
          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/">
                <ListItemText primary="Home" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/about">
                <ListItemText primary="About" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/contact">
                <ListItemText primary="Contact Us" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/login">
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/signup">
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
