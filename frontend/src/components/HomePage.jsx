import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import animationImage from '../assets/homeanimation.gif';
import grooming from '../assets/grooming.png';
import paw1 from '../assets/paw1.png';
import petball from '../assets/petball.png';
import catgroom from '../assets/catgroom.png';

// Theme Configuration
const theme = createTheme({
  palette: {
    primary: {
      main: '#8670ffff', // Rich Brown
      light: '#2600ffff', // Tan
    },
    secondary: {
      main: '#4c3fffff', // Vibrant Orange
    },
    background: {
      default: '#d2e1ffff', // Soft Cream
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

// Scattered Paws Component
const ScatteredPaws = ({ count = 10 }) => {
  const positions = [
    { top: '5%', left: '3%' },
    { top: '10%', right: '5%' },
    { bottom: '15%', left: '7%' },
    { bottom: '10%', right: '3%' },
    { top: '20%', left: '10%' },
    { bottom: '25%', right: '10%' },
    { top: '30%', left: '2%' },
    { bottom: '5%', right: '15%' },
    { top: '15%', right: '12%' },
    { bottom: '20%', left: '15%' },
  ];

  return (
    <>
      {positions.slice(0, count).map((pos, index) => (
        <Box
          key={index}
          component="img"
          src={paw1}
          alt="Paw Icon"
          sx={{
            position: 'absolute',
            width: '30px',
            height: '30px',
            opacity: 0.3,
            zIndex: 1,
            ...pos,
          }}
        />
      ))}
    </>
  );
};

// Custom Navigation Arrows
const CustomNextArrow = ({ onClick }) => (
  <Button
    onClick={onClick}
    sx={{
      position: 'absolute',
      right: '-35px',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 2,
      backgroundColor: theme.palette.primary.light,
      color: 'white',
      minWidth: '40px',
      height: '40px',
      borderRadius: '50%',
      '&:hover': {
        backgroundColor: theme.palette.primary.main,
      },
    }}
  >
    &gt;
  </Button>
);

const CustomPrevArrow = ({ onClick }) => (
  <Button
    onClick={onClick}
    sx={{
      position: 'absolute',
      left: '-35px',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 2,
      backgroundColor: theme.palette.primary.light,
      color: 'white',
      minWidth: '40px',
      height: '40px',
      borderRadius: '50%',
      '&:hover': {
        backgroundColor: theme.palette.primary.main,
      },
    }}
  >
    &lt;
  </Button>
);

// Services Data
const services = [
  {
    name: 'Grooming Services',
    image: grooming,
    description: 'Professional grooming for your beloved pets',
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/product/getProduct');
        if (Array.isArray(response.data)) {
          const processedProducts = response.data.map((product) => ({
            productName: product.productName || 'Unnamed Product',
            price: product.productPrice || 0,
            productImage: product.productImage || '/placeholder-image.png',
            description: product.description || 'No description available.',
            productType: product.productType || 'Uncategorized',
          }));
          setProducts(processedProducts);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleBookNow = () => {
    navigate('/appointments');
  };

  const handleGoToProducts = () => {
    navigate('/products');
  };

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          padding: '2rem',
          minHeight: '100vh',
          paddingBottom: '4rem',
          position: 'relative',
        }}
      >
        <ScatteredPaws />

        {/* Welcome Section */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 5,
            marginTop: -4,
            backgroundColor: '#6b9affff',
            padding: '2rem',
            borderRadius: 2,
            boxShadow: 3,
            width: '100%',
            position: 'relative',
          }}
        >
          <Box
            component="img"
            src={animationImage}
            alt="Welcome Animation"
            sx={{
              width: 430,
              height: 430,
              borderRadius: '50%',
              boxShadow: 3,
              marginRight: 3,
            }}
          />
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                fontFamily: 'Comic Sans MS',
                color: '#333',
                fontSize: '3rem',
              }}
            >
              Welcome To ZOOTOPIA!
            </Typography>
          </Box>
        </Box>

        {/* Products Section */}
        <Container maxWidth="lg" sx={{ textAlign: 'center', mt: 5, position: 'relative' }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              marginBottom: 3,
              color: theme.palette.primary.main,
            }}
          >
            Our Featured Products
          </Typography>
          <Divider sx={{ marginBottom: 3, borderColor: theme.palette.primary.light }} />

          <Box sx={{ position: 'relative', marginBottom: '2rem' }}>
            <Slider {...sliderSettings}>
              {products.map((product, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    padding: '0 15px',
                  }}
                >
                  <Card 
                    sx={{ 
                      boxShadow: 3, 
                      textAlign: 'center', 
                      borderRadius: 2,
                      margin: '10px 0',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={product.productImage}
                      alt={product.productName}
                      sx={{
                        height: 200,
                        width: 'auto',
                        margin: '0 auto',
                        marginTop: 2,
                        objectFit: 'contain',
                      }}
                    />
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 'bold',
                            textAlign: 'center',
                            mb: 1,
                          }}
                        >
                          {product.productName}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ textAlign: 'center', mb: 1 }}
                        >
                          {product.productType}
                        </Typography>
                        <Typography
                          variant="body1"
                          color="primary"
                          sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2 }}
                        >
                          ₱{product.price.toFixed(2)}
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        onClick={handleGoToProducts}
                        sx={{ mt: 'auto' }}
                      >
                        Go to Products
                      </Button>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Slider>
          </Box>

          {/* Services Section */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              marginBottom: 3,
              color: theme.palette.primary.main,
              marginTop: 10,
            }}
          >
            Our Special Services
          </Typography>
          <Divider sx={{ marginBottom: 3, borderColor: theme.palette.primary.light }} />

          <Grid container spacing={4} justifyContent="center" alignItems="stretch">
            <Grid item xs={12} sm={5} md={4}>
              <Box
                sx={{
                  backgroundColor: 'white',
                  borderRadius: 4,
                  padding: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.primary.main,
                    marginBottom: 2,
                  }}
                >
                  Caring for Your Pets
                </Typography>
                <Typography 
                  variant="body1" 
                  color="text.secondary"
                >
                  A happy pet is always clean and well-cared for! Your furry friends deserve top-notch grooming and a safe place to stay.
                </Typography>
              </Box>
            </Grid>

            {services.map((service, index) => (
              <Grid item xs={12} sm={5} md={4} key={index}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <CardMedia
                    component="img"
                    image={service.image}
                    alt={service.name}
                    sx={{
                      height: 150, // Reduced height
                      objectFit: 'cover',
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700,
                        color: theme.palette.primary.main,
                        mb: 2,
                      }}
                    >
                      {service.name}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {service.description}
                    </Typography>
                    <Button
                      variant="contained"
                      color="secondary"
                      fullWidth
                      onClick={handleBookNow}
                      sx={{ mt: 'auto' }}
                    >
                      Book Now
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default HomePage;