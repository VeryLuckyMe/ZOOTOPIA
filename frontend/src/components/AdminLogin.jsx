import React, { useState } from "react";
import { useAdminAuth } from "./AdminAuthProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Avatar,
  CircularProgress,
} from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import VpnKeyIcon from "@mui/icons-material/VpnKey";

import paw1 from "../assets/paw1.png";
import doggrooming from "../assets/doggrooming.png";
import dogbath from "../assets/dogbath.png";
import twirlylines from "../assets/twirlylines.png";
import twirlylines2 from "../assets/twirlylines2.png";
import { Toaster, toast } from "sonner";

const AdminLogin = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    try {
      const response = await axios.post(
        "http://localhost:8080/admin/login",
        null,
        {
          params: { user, password },
        }
      );
      if (response.status === 200) {
        login(user);
        navigate("/admin/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.warning("Invalid username or password");
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const pawPositions = [
    { top: "5%", left: "5%", width: "80px", opacity: 0.5 },
    { bottom: "10%", right: "10%", width: "100px", opacity: 0.6 },
    { top: "40%", right: "20%", width: "60px", opacity: 0.7 },
    { top: "20%", left: "20%", width: "70px", opacity: 0.4 },
    { bottom: "20%", left: "15%", width: "90px", opacity: 0.5 },
    { top: "60%", right: "5%", width: "50px", opacity: 0.6 },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#F5F5DC",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Toaster position="top-center" duration={2500} />
      <img
        src={twirlylines}
        alt="decorative lines"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "50%",
          opacity: 0.3,
          zIndex: 0,
        }}
      />
      <img
        src={twirlylines2}
        alt="decorative lines"
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: "50%",
          opacity: 0.3,
          zIndex: 0,
        }}
      />

      {pawPositions.map((pos, index) => (
        <img
          key={index}
          src={paw1}
          alt="paw"
          style={{
            position: "absolute",
            ...pos,
            zIndex: 1,
          }}
        />
      ))}

      <img
        src={doggrooming}
        alt="dog grooming"
        style={{
          position: "absolute",
          bottom: "0",
          left: "0",
          width: "250px",
          opacity: 0.8,
          zIndex: 1,
        }}
      />
      <img
        src={dogbath}
        alt="dog bath"
        style={{
          position: "absolute",
          top: "0",
          right: "0",
          width: "250px",
          opacity: 0.8,
          zIndex: 1,
        }}
      />

      <Container
        component="main"
        maxWidth="sm"
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: "15px",
          padding: "2rem",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
          position: "relative",
          zIndex: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "#8b4513", width: 60, height: 60 }}>
            <PetsIcon fontSize="large" />
          </Avatar>
          <Typography component="h1" variant="h4" sx={{ color: "#8b4513" }}>
            Tails & Whiskers Admin
          </Typography>
          <Typography component="p" sx={{ mb: 2, color: "#6b4e16" }}>
            Welcome back! Manage your pet store with ease.
          </Typography>
          <Box
            component="form"
            onSubmit={handleLogin}
            noValidate
            sx={{ mt: 1, width: "100%" }}
          >
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="user"
              label="Username"
              name="user"
              autoComplete="username"
              autoFocus
              value={user}
              onChange={(e) => setUser(e.target.value)}
              InputProps={{
                startAdornment: (
                  <AccountCircleIcon sx={{ mr: 1, color: "#8b4513" }} />
                ),
              }}
              sx={{
                backgroundColor: "white",
                borderRadius: "5px",
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: <VpnKeyIcon sx={{ mr: 1, color: "#8b4513" }} />,
              }}
              sx={{
                backgroundColor: "white",
                borderRadius: "5px",
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: "#8b4513",
                "&:hover": { backgroundColor: "#6b4e16" },
                color: "white",
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Login"
              )}
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default AdminLogin;
