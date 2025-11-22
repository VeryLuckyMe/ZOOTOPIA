import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Paper,
  Container,
  Divider
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import PetsIcon from '@mui/icons-material/Pets';
import PersonIcon from '@mui/icons-material/Person';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { styled } from '@mui/material/styles';

import logo from '../assets/logo.png';
import animation from '../assets/animation.gif';
import twirlylines from '../assets/twirlylines.png';
import twirlylines2 from '../assets/twirlylines2.png';
import paw1 from '../assets/paw1.png';

const BackgroundBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  backgroundColor: '#bfd5ffff',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  '&::before, &::after, .bg-paw-1, .bg-paw-2, .bg-paw-3, .bg-paw-4': {
    content: '""',
    position: 'absolute',
    backgroundImage: `url(${paw1})`,
    backgroundSize: '60px 60px', // Increased size
    backgroundRepeat: 'no-repeat',
    zIndex: 1,
    opacity: 0.4 // Increased opacity
  },
  '&::before': {
    top: '5%',
    left: '3%',
    transform: 'rotate(15deg)',
    width: '60px',
    height: '60px'
  },
  '&::after': {
    bottom: '10%',
    right: '5%',
    transform: 'rotate(-25deg)',
    width: '60px',
    height: '60px'
  },
  '.bg-paw-1': {
    top: '20%',
    left: '10%',
    transform: 'rotate(45deg)',
    width: '60px',
    height: '60px'
  },
  '.bg-paw-2': {
    bottom: '30%',
    left: '15%',
    transform: 'rotate(-10deg)',
    width: '60px',
    height: '60px'
  },
  '.bg-paw-3': {
    top: '40%',
    right: '8%',
    transform: 'rotate(35deg)',
    width: '60px',
    height: '60px'
  },
  '.bg-paw-4': {
    bottom: '15%',
    right: '20%',
    transform: 'rotate(-45deg)',
    width: '60px',
    height: '60px'
  }
}));

const PetPatternBackground = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 0,
  background: 'linear-gradient(135deg, #a6c2ffff, #fcfcfc)',
  overflow: 'hidden',
  '&::before, &::after, .twirly-1, .twirly-2, .twirly-3': {
    content: '""',
    position: 'absolute',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    opacity: 0.2,
  },
  '&::before': {
    backgroundImage: `url(${twirlylines})`,
    top: '35%',
    left: '2%',
    width: '250px',
    height: '250px',
    transform: 'rotate(10deg)'
  },
  '&::after': {
    backgroundImage: `url(${twirlylines2})`,
    bottom: '5%',
    right: '2%',
    width: '300px',
    height: '300px',
    transform: 'rotate(-15deg)'
  },
  '.twirly-1': {
    backgroundImage: `url(${twirlylines})`,
    top: '25%',
    left: '15%',
    width: '200px',
    height: '200px',
    transform: 'rotate(-5deg)'
  },
  '.twirly-2': {
    backgroundImage: `url(${twirlylines2})`,
    bottom: '25%',
    left: '10%',
    width: '230px',
    height: '230px',
    transform: 'rotate(20deg)'
  },
  '.twirly-3': {
    backgroundImage: `url(${twirlylines})`,
    top: '50%',
    right: '15%',
    width: '250px',
    height: '250px',
    transform: 'rotate(5deg)'
  }
}));

// JSX Usage Example:
<>
    <PetPatternBackground>
      <div className="pawprint" />
      <div className="pawprint2" />
      <div className="pawprint3" />
      <div className="twirly" />
    </PetPatternBackground>
  {/* Other components */}
</>


function Auth({ setUsername, setRole }) {
  const [isSignUp, setIsSignUp] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const endpoint = isSignUp
      ? 'http://localhost:8080/auth/signup'
      : 'http://localhost:8080/auth/login';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });      

      let data;
      const text = await response.text(); 

      try {
        data = JSON.parse(text); 
      } catch (error) {
        data = { message: text }; 
      }

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      if (!isSignUp) {
        setIsLoading(false);
        setIsLoadingPage(true);

        setTimeout(() => {
          setUsername(data.username);
          localStorage.setItem('username', data.username);
          localStorage.setItem('id', data.id);
          localStorage.setItem('email', data.email);

          if (data.role) {
            setRole(data.role);
            localStorage.setItem('role', data.role);
          }
          navigate('/');
        }, 3000);
      } else {
        setIsLoading(false);
        setMessage(data.message || 'Registration successful! Please log in.');
        localStorage.setItem('email', data.email);
      }
    } catch (error) {
      setIsLoading(false);
      setMessage(error.message);
      console.error('Error during authentication:', error);
    }
  };

  const handleToggleForm = () => {
    setIsSignUp(!isSignUp);
    setFormData({
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: ''
    });
    setMessage('');
  };

  if (isLoadingPage) {
    return (
      <BackgroundBox>
        <PetPatternBackground />
        <Container 
          maxWidth="sm" 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100vh', 
            textAlign: 'center', 
            position: 'relative', 
            zIndex: 10 
          }}
        >
          <div 
            style={{
              display: 'flex',
              gap: '20px', // Add spacing between the animations
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* Render three animations */}
            <img 
              src={animation} 
              alt="Loading 1" 
              style={{ 
                width: '150px', 
                height: '150px', 
                objectFit: 'contain', 
                background: 'none', 
                border: 'none', 
                margin: 0, 
                padding: 0
              }} 
            />
            <img 
              src={animation} 
              alt="Loading 2" 
              style={{ 
                width: '150px', 
                height: '150px', 
                objectFit: 'contain', 
                background: 'none', 
                border: 'none', 
                margin: 0, 
                padding: 0
              }} 
            />
            <img 
              src={animation} 
              alt="Loading 3" 
              style={{ 
                width: '150px', 
                height: '150px', 
                objectFit: 'contain', 
                background: 'none', 
                border: 'none', 
                margin: 0, 
                padding: 0
              }} 
            />
          </div>
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#2C3E50', 
              fontWeight: 600,
              mb: 2
            }}
          >
            Preparing Your Pet Care Experience
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#7F8C8D', 
              maxWidth: 400,
              mx: 'auto'
            }}
          >
            We're setting up everything to ensure the best care for your furry friends.
          </Typography>
        </Container>
      </BackgroundBox>
    );
  }  
  
  return (
    <BackgroundBox>
      <BackgroundBox>
        <div className="bg-paw-1" />
        <div className="bg-paw-2" />
        <div className="bg-paw-3" />
        <div className="bg-paw-4" />
      </BackgroundBox>
      <PetPatternBackground />
      <div className="twirly-1" />
        <div className="twirly-2" />
        <div className="twirly-3" />
      <Container maxWidth="lg">
        <Paper 
          elevation={12} 
          sx={{ 
            display: 'flex', 
            borderRadius: 4, 
            overflow: 'hidden',
            position: 'relative',
            zIndex: 10,
            maxWidth: '1100px',
            margin: 'auto'
          }}
        >
          <Box
            sx={{
              width: '60%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 4,
              backgroundColor: 'white',   
              borderRight: '1px solid #E0E0E0',
              position: 'relative'
            }}
          >
            <Box 
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `url(${twirlylines}), url(${twirlylines2})`,
                backgroundPosition: 'top left, bottom right',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '200px, 200px',
                opacity: 0.3,
                zIndex: 1
              }}
            />
            <Box 
              sx={{
                zIndex: 2,
                position: 'relative',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isSignUp ? 'signup' : 'login'}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      mb: 3, 
                      fontWeight: 'bold', 
                      display: 'flex', 
                      alignItems: 'center',
                      color: '#2C3E50' 
                    }}
                  >
                    <PetsIcon sx={{ mr: 2, color: '#573affff' }} />
                    {isSignUp ? 'Create Account' : 'Welcome Back'}
                  </Typography>

                  <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px' }}>
                    {isSignUp && (
                      <>
                        <TextField
                          label="Username"
                          name="username"
                          value={formData.username || ''}
                          onChange={handleChange}
                          fullWidth
                          required
                          margin="normal"
                          variant="outlined"
                          InputProps={{
                            startAdornment: <PersonIcon sx={{ color: '#573affff', mr: 1 }} />
                          }}
                        />
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <TextField
                              label="First Name"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleChange}
                              fullWidth
                              required
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              label="Last Name"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleChange}
                              fullWidth
                              required
                              variant="outlined"
                            />
                          </Grid>
                        </Grid>
                      </>
                    )}

                    <TextField
                      label="Email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleChange}
                      fullWidth
                      required
                      margin="normal"
                      variant="outlined"
                      InputProps={{
                        startAdornment: <MailOutlineIcon sx={{ color: '#573affff', mr: 1 }} />
                      }}
                    />

                    <TextField
                      label="Password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      fullWidth
                      required
                      margin="normal"
                      variant="outlined"
                      InputProps={{
                        startAdornment: <VpnKeyIcon sx={{ color: '#573affff', mr: 1 }} />
                      }}
                    />
                    {isSignUp && (
                      <TextField
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword || ''}
                        onChange={handleChange}
                        fullWidth
                        required
                        margin="normal"
                        variant="outlined"
                        InputProps={{
                          startAdornment: <VpnKeyIcon sx={{ color: '#573affff', mr: 1 }} />
                        }}
                      />
                    )}

                    <Button 
                      type="submit" 
                      fullWidth 
                      variant="contained" 
                      disabled={isLoading}
                      sx={{ 
                        mt: 3, 
                        py: 1.5, 
                        backgroundColor: '#573affff', 
                        '&:hover': { backgroundColor: '#2e0affff' } 
                      }}
                    >
                      {isLoading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        isSignUp ? 'Sign Up' : 'Log In'
                      )}
                    </Button>
                  </form>

                  <Divider sx={{ width: '100%', my: 2 }} />

                  <Typography 
                    variant="body2" 
                    sx={{ 
                      textAlign: 'center', 
                      color: '#34495E' 
                    }}
                  >
                    {isSignUp 
                      ? 'Already have an account?' 
                      : "Don't have an account?"}
                    <Button 
                      color="primary" 
                      onClick={handleToggleForm}
                      sx={{ 
                        ml: 1, 
                        textTransform: 'none', 
                        color: '#573affff',
                        fontWeight: 'bold'
                      }}
                    >
                      {isSignUp ? 'Log In' : 'Sign Up'}
                    </Button>
                  </Typography>

                  {message && (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mt: 2, 
                        textAlign: 'center', 
                        color: isSignUp ? 'green' : 'red' 
                      }}
                    >
                      {message}
                    </Typography>
                  )}
                </motion.div>
              </AnimatePresence>
            </Box>
          </Box>
          
          <Box 
            component="img"
            src={logo}
            alt="Logo"
            sx={{
              width: '400px',
              maxHeight: '400px',
              objectFit: 'contain',
              zIndex: 2,
              position: 'relative',
              marginTop: '30px'
            }}
          />
        </Paper>
      </Container>
    </BackgroundBox>
  );
}

export default Auth;