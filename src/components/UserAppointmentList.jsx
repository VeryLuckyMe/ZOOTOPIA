import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  CircularProgress,
  Button,
  Paper,
  Divider
} from "@mui/material";
import { Toaster, toast } from "sonner";
import paw1 from '../assets/paw1.png';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const UserAppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const email = localStorage.getItem("email");
        if (!email) {
          throw new Error("User not logged in or email not found.");
        }

        const response = await fetch(
          `http://localhost:8080/api/appointments/byUserEmail/${email}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch appointments");
        }

        const data = await response.json();
        setAppointments(data);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);
  const theme = createTheme({
    palette: {
      primary: {
        main: '#8B4513', // Rich Brown
        light: '#D2B48C', // Tan
      },
      secondary: {
        main: '#FFA500', // Vibrant Orange
      },
      background: {
        default: '#FFF5E6', // Soft Cream
        paper: '#FFFFFF',
      },
    },
    typography: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
            },
          },
        },
      },
    },
  });

  const handleCancel = async (appId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/appointments/cancel/${appId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to cancel appointment.");
      }

      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.appId === appId
            ? { ...appointment, canceled: true }
            : appointment
        )
      );

      toast.success("You have canceled the appointment.");
    } catch (err) {
      console.error("Error canceling appointment:", err);
      toast.error(err.message);
    }
  };

  const handleDelete = async (appId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/appointments/deleteAppointment/${appId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete appointment.");
      }

      setAppointments((prevAppointments) =>
        prevAppointments.filter((appointment) => appointment.appId !== appId)
      );

      toast.success("Appointment deleted successfully.");
    } catch (err) {
      console.error("Error deleting appointment:", err);
      toast.error(err.message);
    }
  };

  const handleConfirm = async (appId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/appointments/confirm/${appId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to confirm appointment.");
      }

      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.appId === appId
            ? { ...appointment, confirmed: true }
            : appointment
        )
      );

      toast.success("Your appointment has been confirmed.");
    } catch (err) {
      console.error("Error confirming appointment:", err);
      toast.error(err.message);
    }
  };

  const pawPositions = [
    { top: '5%', left: '5%', width: '80px', opacity: 0.2, transform: 'rotate(-20deg)' },
    { bottom: '10%', right: '10%', width: '100px', opacity: 0.2, transform: 'rotate(15deg)' },
    { top: '40%', right: '20%', width: '60px', opacity: 0.2, transform: 'rotate(-10deg)' },
    { top: '20%', left: '20%', width: '70px', opacity: 0.2, transform: 'rotate(25deg)' },
    { bottom: '20%', left: '15%', width: '90px', opacity: 0.2, transform: 'rotate(-15deg)' },
    { top: '60%', right: '5%', width: '50px', opacity: 0.2, transform: 'rotate(30deg)' }
  ];

  return (
    <ThemeProvider theme={theme}> 
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        justifyContent: "center",
        alignItems: "center",
        // background: '#ffffff',
        padding: "2rem",
        position: 'relative',
        overflow: 'hidden',
        
      }}
    >
      {pawPositions.map((pos, index) => (
        <img
          key={index}
          src={paw1}
          alt="paw"
          style={{
            position: 'absolute',
            ...pos,
            zIndex: 1,
          }}
        />
      ))}
      <Toaster richColors />
      <Container
        maxWidth="sm"
        sx={{
          padding: "2rem",
          borderRadius: 4,
          backgroundColor: "#ffffff",
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          position: 'relative',
          zIndex: 10,
          border: '1px solid #e0e0e0'
        }}
      >
        <Box 
          sx={{
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            mb: 3
          }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 'bold', 
              color: '#333', 
              textAlign: 'center'
            }}
          >
            Your Appointments
          </Typography>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" p={3}>
            <CircularProgress color="warning" />
          </Box>
        ) : error ? (
          <Typography color="error" align="center">
            {error}
          </Typography>
        ) : appointments.length === 0 ? (
          <Typography align="center" sx={{ color: '#666' }}>
            No appointments found.
          </Typography>
        ) : (
          <List>
            {appointments.map((appointment) => (
              <Paper 
                elevation={1} 
                sx={{ 
                  mb: 2, 
                  p: 2, 
                  borderRadius: 2,
                  background: '#f9f9f9',
                  border: '1px solid #e0e0e0',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
                key={appointment.appId}
              >
                <ListItem
                  disableGutters
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    width: '100%'
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600, 
                          color: '#2c3e50',
                          mb: 1
                        }}
                      >
                        {`${appointment.date} at ${appointment.time}`}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ width: '100%' }}>
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ mb: 0.5 }}
                        >
                          <strong>Service:</strong> {appointment.groomService}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ mb: 0.5 }}
                        >
                          <strong>Price:</strong> {appointment.price}
                        </Typography>
                        <Divider sx={{ my: 1, borderColor: '#e0e0e0' }} />
                        <Typography 
                          variant="body2" 
                          color="text.primary"
                        >
                          <strong>Contact:</strong> {appointment.contactNo}
                        </Typography>
                      </Box>
                    }
                    disableTypography
                  />
                  {appointment.canceled ? (
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        width: '100%', 
                        mt: 2 
                      }}
                    >
                      <Typography 
                        color="error" 
                        sx={{ 
                          fontStyle: "italic",
                          fontWeight: 500
                        }}
                      >
                        This Appointment Has Been Cancelled.
                      </Typography>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(appointment.appId)}
                      >
                        Delete
                      </Button>
                    </Box>
                  ) : appointment.confirmed ? (
                    <Box 
                      sx={{
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        mt: 2
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        color="success.main" 
                        sx={{ fontWeight: 600 }}
                      >
                        Appointment Confirmed!
                      </Typography>
                    </Box>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{ 
                        mt: 2,
                        backgroundColor: '#3498db',
                        '&:hover': {
                          backgroundColor: '#2980b9'
                        }
                      }}
                      onClick={() => handleCancel(appointment.appId)}
                    >
                      Cancel Appointment
                    </Button>
                  )}
                </ListItem>
              </Paper>
            ))}
          </List>
        )}
      </Container>
    </Box>
    </ThemeProvider>
  );
};

export default UserAppointmentList;
