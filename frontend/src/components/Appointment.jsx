import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Container, Typography, Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import animationgif from '../assets/animation.gif';
import paw1 from '../assets/paw1.png';

const Appointment = () => {
  const [formData, setFormData] = useState({
    email: '',
    contactNo: '',
    date: '',
    time: '',
    price: '',
    groomService: '',
    paymentMethod: '',    
    user: {
      id: parseInt(localStorage.getItem('id'), 10),
    },
  });

  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (!username) {
      alert('You need to log in to book an appointment.');
      navigate('/auth');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const pawPositions = [
    { top: '10%', left: '55%', width: '80px', opacity: 0.2, transform: 'rotate(-20deg)' },
    { top: '20%', left: '35%', width: '80px', opacity: 0.2, transform: 'rotate(-20deg)' },
    { top: '10%', left: '5%', width: '80px', opacity: 0.2, transform: 'rotate(-20deg)' },
    { bottom: '10%', right: '10%', width: '100px', opacity: 0.2, transform: 'rotate(15deg)' },
    { top: '20%', right: '20%', width: '60px', opacity: 0.2, transform: 'rotate(-10deg)' },
    { top: '30%', left: '10%', width: '70px', opacity: 0.2, transform: 'rotate(25deg)' },
    { bottom: '20%', left: '5%', width: '90px', opacity: 0.2, transform: 'rotate(-15deg)' },
    { top: '30%', right: '10%', width: '50px', opacity: 0.2, transform: 'rotate(30deg)' },
    { top: '10%', right: '5%', width: '50px', opacity: 0.2, transform: 'rotate(30deg)' },
    { top: '60%', right: '3%', width: '50px', opacity: 0.2, transform: 'rotate(30deg)' },
    { bottom: '5%', right: '75%', width: '100px', opacity: 0.2, transform: 'rotate(15deg)' },
    { bottom: '3%', right: '45%', width: '100px', opacity: 0.2, transform: 'rotate(15deg)' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loggedInEmail = localStorage.getItem('email'); 

    if (formData.email !== loggedInEmail) {
      toast.error('You can only book an appointment using your registered email.');
      return; 
    }

    const appointmentData = {
      email: formData.email,
      contactNo: formData.contactNo,
      date: formData.date,
      time: formData.time,
      price: formData.price,
      groomService: formData.groomService,
      paymentMethod: formData.paymentMethod,
      user: {
        id: formData.user.id,
      },
    };

    console.log('Appointment Data:', appointmentData);
    try {
      const response = await fetch(
        'http://localhost:8080/api/appointments/postAppointment',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(appointmentData),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log('Appointment created:', result.appId);
        
        toast.success(`Booking Successful!`);
        
        setFormData({
          email: '',
          contactNo: '',
          date: '',
          time: '',
          price: '',
          groomService: '',
          paymentMethod: '',
          user: {
            id: formData.user.id,
          },
        });
      } else {
        toast.error('Failed to Create Appointment');
        console.error('Failed to create appointment:', response.statusText);
      }
    } catch (error) {
      toast.error('Error: ' + error.message);
      console.error('Error:', error);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f7f7f7',
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
        maxWidth="lg"
        sx={{
          padding: '2rem',
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: '#ffffff',
        }}
      >  
       
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 'bold',
                color: '#333',
                marginBottom: 2,
              }}
            >
              Book an Appointment
            </Typography>
            <Typography variant="body1" sx={{ color: '#666', }}>
              Schedule a service for your furry friend today!
            </Typography>
            <img src={animationgif} alt="animation" style={{ width: '100px',height:"100px",objectFit: 'cover'}} />
            <img src={animationgif} alt="animation" style={{ width: '100px',height:"100px",objectFit: 'cover' }} />
            <img src={animationgif} alt="animation" style={{ width: '100px',height:"100px",objectFit: 'cover' }} />
            
          </Grid>
          
          <Grid item xs={12} md={8}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Contact No."
                    type="text"
                    name="contactNo"
                    value={formData.contactNo}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Date"
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Time"
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Price"
                    select
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                    required
                  >
                    <MenuItem value={500}>₱500</MenuItem>
                    <MenuItem value={1000}>₱1000</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Groom Service"
                    select
                    name="groomService"
                    value={formData.groomService}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                    required
                  > 
                    
                    <MenuItem value="Basic Grooming">Grooming</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Payment Method"
                    select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                    required
                  >
                    <MenuItem value="Counter">Over The Counter</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                      mt: 2,
                      backgroundColor: '#ff9800',
                      color: 'white',
                      '&:hover': { backgroundColor: '#f57c00' },
                      fontWeight: 'bold',
                    }}
                  >
                    Book Now
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
         
      </Container>
    </Box>
  );
};

export default Appointment;