import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  Button,
  CircularProgress,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Toaster, toast } from "sonner";

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        console.log("Sending request to API: http://localhost:8080/api/appointments/getAppointment");

        const response = await fetch("http://localhost:8080/api/appointments/getAppointment");
        console.log("API response status:", response.status);

        if (!response.ok) {
          let errorMessage;
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
          } catch {
            errorMessage = `HTTP error! status: ${response.status}`;
          }
          throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log("Fetched appointments:", data);
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

  const handleCancelAppointment = async (appId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/appointments/cancel/${appId}`, {
        method: "PUT",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to cancel the appointment.");
      }

      toast.success("Appointment canceled successfully.");

      // Update the local state to remove the canceled appointment
      setAppointments((prev) => prev.filter((appointment) => appointment.appId !== appId));
    } catch (err) {
      console.error("Error canceling appointment:", err);
      toast.error(err.message);
    } finally {
      setDialogOpen(false);
      setSelectedAppointmentId(null);
    }
  };

  const handleConfirmAppointment = async (appId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/appointments/confirm/${appId}`, {
        method: "PUT",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to confirm the appointment.");
      }

      toast.success("Appointment confirmed successfully.");

      // Update the local state to reflect the confirmed status
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.appId === appId ? { ...appointment, confirmed: true } : appointment
        )
      );
    } catch (err) {
      console.error("Error confirming appointment:", err);
      toast.error(err.message);
    }
  };

  const filteredAppointments = appointments.filter((appointment) =>
    appointment.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (appId) => {
    setSelectedAppointmentId(appId);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedAppointmentId(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f7f7f7",
        padding: "2rem",
      }}
    >
      <Toaster richColors />
      <Container
        maxWidth="md"
        sx={{
          padding: "2rem",
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "#ffffff",
        }}
      >
        <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", color: "#333" }}>
          My Appointments
        </Typography>

        <TextField
          fullWidth
          label="Search by Email"
          variant="outlined"
          sx={{ mb: 3 }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" p={3}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center">
            {error}
          </Typography>
        ) : filteredAppointments.length === 0 ? (
          <Typography align="center">No appointments found.</Typography>
        ) : (
          <List>
            {filteredAppointments.map((appointment) => (
              <ListItem
                key={appointment.appId}
                sx={{
                  borderBottom: "1px solid #ddd",
                  padding: "1rem 0",
                  "&:last-child": {
                    borderBottom: "none",
                  },
                }}
              >
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
                      {`Date: ${appointment.date}, Time: ${appointment.time}`}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" component="span">
                        Email: {appointment.email}
                      </Typography>
                      <Typography variant="body2" component="span">
                        Contact: {appointment.contactNo}
                      </Typography>
                      <Typography variant="body2" component="span">
                        Service: {appointment.groomService}
                      </Typography>
                      <Typography variant="body2" component="span">
                        Price: ₱{appointment.price}
                      </Typography>
                      <Typography variant="body2" component="span">
                        Payment Method: {appointment.paymentMethod}
                      </Typography>
                    </>
                  }
                />
                {appointment.canceled && (
                  <Typography color="error" sx={{ fontStyle: "italic", marginTop: 1 }}>
                    This appointment has been canceled.
                  </Typography>
                )}
                {appointment.confirmed ? (
                  <Typography color="success" sx={{ fontStyle: "italic", marginTop: 1 }}>
                    This appointment has been confirmed.
                  </Typography>
                ) : (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleConfirmAppointment(appointment.appId)}
                    sx={{ ml: 2 }}
                  >
                    Confirm
                  </Button>
                )}
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleOpenDialog(appointment.appId)}
                  sx={{ ml: 2 }}
                >
                  Cancel
                </Button>
              </ListItem>
            ))}
          </List>
        )}
      </Container>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Cancelation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel this appointment? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            No
          </Button>
          <Button onClick={() => handleCancelAppointment(selectedAppointmentId)} color="error" autoFocus>
            Yes, Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppointmentList;
