import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Grid,
  IconButton,
  Snackbar,
  TextField,
  Button,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EditIcon from '@mui/icons-material/Edit';
import defaultProfileImage from '../assets/default_profile.png';
import paw1 from '../assets/paw1.png';

const Profile = ({ onProfileImageUpdate }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileImage, setProfileImage] = useState(defaultProfileImage);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [address, setAddress] = useState({
    region: '',
    province: '',
    city: '',
    barangay: '',
    postalCode: '',
    streetBuildingHouseNo: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const pawPositions = [
    { top: '5%', left: '5%', width: '80px', opacity: 0.2, transform: 'rotate(-20deg)' },
    { bottom: '10%', right: '10%', width: '100px', opacity: 0.2, transform: 'rotate(15deg)' },
    { top: '40%', right: '20%', width: '60px', opacity: 0.2, transform: 'rotate(-10deg)' },
    { top: '20%', left: '10%', width: '70px', opacity: 0.2, transform: 'rotate(25deg)' },
    { bottom: '20%', left: '15%', width: '90px', opacity: 0.2, transform: 'rotate(-15deg)' },
    { top: '60%', right: '5%', width: '50px', opacity: 0.2, transform: 'rotate(30deg)' }
  ];

  useEffect(() => {
    const fetchUser = async () => {
      const id = localStorage.getItem('id');
      if (!id) {
        console.error('User ID is missing in localStorage');
        setError('User ID not found. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8080/auth/users/${id}`);
        setUser(response.data);

        const storedAddress = localStorage.getItem(`userAddress_${id}`);
        if (storedAddress) {
          setAddress(JSON.parse(storedAddress));
        } else {
          setAddress(response.data.address || {});
        }

        const storedImage = localStorage.getItem(`profileImage_${id}`);
        setProfileImage(storedImage || defaultProfileImage);

        if (onProfileImageUpdate) {
          onProfileImageUpdate(response.data.profileImage);
        }
      } catch (err) {
        console.error('Error fetching user:', err.response || err);
        setError('Error fetching user data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [onProfileImageUpdate]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    const updatedAddress = {
      ...address,
      [name]: value,
    };
    setAddress(updatedAddress);

    const id = localStorage.getItem('id');
    localStorage.setItem(`userAddress_${id}`, JSON.stringify(updatedAddress));
  };

  const handleSaveAddress = async () => {
    setIsSubmitting(true);

    const id = localStorage.getItem('id');
    try {
      await axios.put(`http://localhost:8080/auth/users/${id}/address`, address);
      
      localStorage.setItem(`userAddress_${id}`, JSON.stringify(address));
      
      setSnackbarMessage('Address updated successfully!');
      setOpenSnackbar(true);
      setIsEditMode(false);
    } catch (err) {
      console.error('Error updating address:', err.response || err);
      setSnackbarMessage('Error updating address. Please try again.');
      setOpenSnackbar(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleImageUpload = async () => {
    const id = localStorage.getItem('id');
    if (!imageFile) {
      setSnackbarMessage('No image selected. Please select a file first.');
      setOpenSnackbar(true);
      return;
    }
  
    const formData = new FormData();
    formData.append('profileImage', imageFile);
  
    try {
      const response = await axios.post(
        `http://localhost:8080/auth/users/${id}/upload-profile-pic`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      const updatedImage = `data:image/png;base64,${response.data.profileImage}`;
      if (response.data.profileImage) {
        const imageKey = `profileImage_${id}`;
        localStorage.setItem(imageKey, updatedImage);
  
        setProfileImage(updatedImage);
  
        if (onProfileImageUpdate) {
          onProfileImageUpdate(updatedImage);
        }
      } else {
        throw new Error('Image not returned correctly');
      }
  
      setSnackbarMessage('Profile picture updated successfully!');
      setOpenSnackbar(true);
    } catch (err) {
      console.error('Error uploading profile picture:', err.response || err);
      setSnackbarMessage('Error uploading profile picture. Please try again.');
      setOpenSnackbar(true);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Grid container spacing={4}>
          {/* Profile Image Section */}
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Box sx={{ position: 'relative', width: 200, height: 200, margin: '0 auto', mb: 2 }}>
              
              <img
                src={profileImage}
                alt="Profile"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '50%',
                  border: '3px solid #3f51b5'
                }}
              />
              
              <IconButton
                color="primary"
                component="label"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: 'white',
                  '&:hover': { backgroundColor: 'white' }
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFileChange}
                />
                <CloudUploadIcon />
              </IconButton>
            </Box>
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
            <Button 
              variant="contained" 
              onClick={handleImageUpload}
              startIcon={<CloudUploadIcon />}
              sx={{ mt: 2 }}
            >
              Upload Picture
            </Button>
          </Grid>

          {/* User Details Section */}
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h3">Profile</Typography>
              <IconButton onClick={() => setIsEditMode(!isEditMode)}>
                <EditIcon />
              </IconButton>
            </Box>

            <Grid container spacing={3}>
              {[
                { label: 'Username', value: user?.username },
                { label: 'First Name', value: user?.firstName },
                { label: 'Last Name', value: user?.lastName },
                { label: 'Email', value: user?.email }
              ].map((field, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Typography variant="subtitle1" color="textSecondary">
                    {field.label}
                  </Typography>
                  <Typography variant="h6">{field.value || 'Not provided'}</Typography>
                </Grid>
              ))}
            </Grid>

            
            <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
              Address
            </Typography>
            <Grid container spacing={2}>
              {[
                { name: 'region', label: 'Region' },
                { name: 'province', label: 'Province' },
                { name: 'city', label: 'City' },
                { name: 'barangay', label: 'Barangay' },
                { name: 'postalCode', label: 'Postal Code' },
                { name: 'streetBuildingHouseNo', label: 'Street Name, Building, House No.' }
              ].map((field) => (
                <Grid item xs={12} sm={6} key={field.name}>
                  <TextField
                    fullWidth
                    name={field.name}
                    label={field.label}
                    variant="outlined"
                    value={address[field.name] || ''}
                    onChange={handleAddressChange}
                    disabled={!isEditMode}
                    size="small"
                  />
                </Grid>
              ))}
            </Grid>

            {isEditMode && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveAddress}
                sx={{ mt: 3 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Address'}
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarMessage.includes('Error') ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile;