import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import { keyframes } from "@mui/system";
import defaultProfileImage from "../assets/default_profile.png";
import paw1 from "../assets/paw1.png";
import elogo from "../assets/elogo.png";

// Animations
const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.2; }
  50% { transform: scale(1.05); opacity: 0.3; }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export default function Header({ username, role, userId }) {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(defaultProfileImage);

  useEffect(() => {
    if (userId) {
      const storedImage = localStorage.getItem("profileImage");
      if (storedImage) {
        setProfileImage(storedImage);
      } else {
        fetchProfileImage(userId);
      }
    }
  }, [userId]);

  const pawPositions = [
    { top: "8%", left: "25%", width: "70px", opacity: 0.15, transform: "rotate(-20deg)", animationDelay: "0s" },
    { bottom: "10%", right: "15%", width: "85px", opacity: 0.15, transform: "rotate(15deg)", animationDelay: "0.5s" },
    { top: "30%", right: "25%", width: "55px", opacity: 0.15, transform: "rotate(-10deg)", animationDelay: "1s" },
    { top: "45%", left: "45%", width: "65px", opacity: 0.15, transform: "rotate(25deg)", animationDelay: "1.5s" },
    { bottom: "25%", left: "20%", width: "80px", opacity: 0.15, transform: "rotate(-15deg)", animationDelay: "2s" },
    { top: "60%", right: "10%", width: "50px", opacity: 0.15, transform: "rotate(30deg)", animationDelay: "2.5s" },
  ];

  const fetchProfileImage = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/auth/users/${id}/profile-image`);
      if (response.ok) {
        const profileImageUrl = await response.text();
        const imageUrl = profileImageUrl || defaultProfileImage;
        setProfileImage(imageUrl);
        localStorage.setItem("profileImage", imageUrl);
      } else {
        setProfileImage(defaultProfileImage);
      }
    } catch (error) {
      console.error("Error fetching profile image:", error);
      setProfileImage(defaultProfileImage);
    }
  };

  const handleDrawerToggle = () => {
    setDrawerOpen((prev) => {
      if (prev) {
        document.getElementById("drawer-toggle-button")?.focus();
      }
      return !prev;
    });
  };

  const handleMenuOptionClick = (route) => {
    setDrawerOpen(false);
    navigate(route);
  };

  const handleLogout = () => {
    localStorage.clear();
    setDrawerOpen(false);
    navigate("/auth");
  };

  const menuItems = [
    ...(role === "ADMIN" ? [{ text: "Inventory", route: "/inventory", icon: "📦" }] : []),
    { text: "Profile", route: "/profile", icon: "👤" },
    { text: "Cart", route: "/cart", icon: "🛒" },
    { text: "My Purchases", route: "/MyPurchases", icon: "📋" },
    { text: "Appointments", route: "/appointmentslist", icon: "📅" },
  ];

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: "100%",
          backgroundColor: "#63a4ff",
          boxShadow: "0 4px 20px rgba(99, 164, 255, 0.25)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 64, md: 70 }, px: { xs: 2, md: 4 } }}>
          {/* Logo */}
          <Box
            sx={{
              cursor: "pointer",
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
            onClick={() => navigate("/")}
          >
            <img
              src={elogo}
              alt="Zootopia Logo"
              style={{ 
                width: "200px", 
                height: "auto", 
                marginRight: "auto",
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
              }}
            />
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Navigation Links */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, alignItems: "center" }}>
            {[
              { label: "Home", path: "/" },
              { label: "Products", path: "/products" },
              { label: "About Us", path: "/aboutus" },
            ].map((item) => (
              <Button
                key={item.path}
                sx={{
                  color: "white",
                  textTransform: "none",
                  fontSize: "16px",
                  fontWeight: 500,
                  px: 2.5,
                  py: 1,
                  borderRadius: 2,
                  transition: "all 0.3s ease",
                  position: "relative",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    transform: "translateY(-2px)",
                  },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: 8,
                    left: "50%",
                    transform: "translateX(-50%) scaleX(0)",
                    width: "60%",
                    height: "2px",
                    backgroundColor: "white",
                    transition: "transform 0.3s ease",
                  },
                  "&:hover::after": {
                    transform: "translateX(-50%) scaleX(1)",
                  },
                }}
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* User Profile or Login */}
          {username ? (
            <Box sx={{ ml: 3, display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  display: { xs: "none", md: "block" },
                  textAlign: "right",
                  mr: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: "white",
                    fontWeight: 600,
                    fontSize: "14px",
                    lineHeight: 1.2,
                  }}
                >
                  {username}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontSize: "12px",
                  }}
                >
                  {role === "ADMIN" ? "Administrator" : "Member"}
                </Typography>
              </Box>
              <IconButton
                onClick={handleDrawerToggle}
                id="drawer-toggle-button"
                sx={{
                  p: 0,
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.1)",
                  },
                }}
              >
                <Avatar
                  src={profileImage}
                  alt={username}
                  sx={{
                    width: 42,
                    height: 42,
                    border: "3px solid white",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    cursor: "pointer",
                  }}
                />
              </IconButton>
            </Box>
          ) : (
            <Button
              variant="contained"
              sx={{
                ml: 3,
                backgroundColor: "white",
                color: "#63a4ff",
                textTransform: "none",
                fontSize: "16px",
                fontWeight: 600,
                px: 3,
                py: 1,
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
                },
              }}
              onClick={() => navigate("/auth")}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        disableEnforceFocus
        sx={{
          "& .MuiDrawer-paper": {
            width: 300,
            background: "linear-gradient(180deg, #9ec6ff 0%, #b8d7ff 100%)",
            boxShadow: "-4px 0 20px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <Box
          sx={{
            width: 300,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Drawer Header */}
          <Box
            sx={{
              p: 3,
              pb: 2,
              background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)",
              backdropFilter: "blur(10px)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
              position: "relative",
              zIndex: 2,
              animation: `${slideIn} 0.4s ease-out`,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                src={profileImage}
                alt={username}
                sx={{
                  width: 60,
                  height: 60,
                  border: "3px solid white",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                  mr: 2,
                }}
              />
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: "#2d3748",
                    fontSize: "18px",
                    lineHeight: 1.2,
                    mb: 0.5,
                  }}
                >
                  {username}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#4a5568",
                    fontSize: "13px",
                    fontWeight: 500,
                    backgroundColor: "rgba(255, 255, 255, 0.6)",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    display: "inline-block",
                  }}
                >
                  {role === "ADMIN" ? "Administrator" : "Member"}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Menu Items */}
          <List
            sx={{
              pt: 2,
              pb: 2,
              position: "relative",
              zIndex: 2,
              flexGrow: 1,
            }}
          >
            {menuItems.map((item, index) => (
              <ListItem
                key={item.text}
                button
                onClick={() => handleMenuOptionClick(item.route)}
                sx={{
                  mx: 1.5,
                  mb: 1,
                  borderRadius: 2,
                  transition: "all 0.3s ease",
                  animation: `${slideIn} ${0.3 + index * 0.1}s ease-out`,
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.4)",
                    transform: "translateX(-4px)",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, fontSize: "20px" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: 500,
                    fontSize: "15px",
                    color: "#2d3748",
                  }}
                />
              </ListItem>
            ))}

            <Divider sx={{ my: 2, mx: 2, borderColor: "rgba(255, 255, 255, 0.4)" }} />

            <ListItem
              button
              onClick={handleLogout}
              sx={{
                mx: 1.5,
                borderRadius: 2,
                backgroundColor: "rgba(239, 68, 68, 0.15)",
                transition: "all 0.3s ease",
                animation: `${slideIn} ${0.3 + menuItems.length * 0.1}s ease-out`,
                "&:hover": {
                  backgroundColor: "rgba(239, 68, 68, 0.25)",
                  transform: "translateX(-4px)",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, fontSize: "20px" }}>
                🚪
              </ListItemIcon>
              <ListItemText
                primary="Log Out"
                primaryTypographyProps={{
                  fontWeight: 600,
                  fontSize: "15px",
                  color: "#dc2626",
                }}
              />
            </ListItem>
          </List>

          {/* Decorative Paws */}
          {pawPositions.map((pos, index) => (
            <img
              key={index}
              src={paw1}
              alt="paw decoration"
              style={{
                position: "absolute",
                ...pos,
                zIndex: 1,
                animation: `${pulse} 4s ease-in-out infinite`,
                animationDelay: pos.animationDelay,
                pointerEvents: "none",
              }}
            />
          ))}
        </Box>
      </Drawer>

      <Box sx={{ mt: { xs: 8, md: 9 } }} />
    </>
  );
}