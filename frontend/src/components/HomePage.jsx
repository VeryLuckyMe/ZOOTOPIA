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
import { keyframes } from '@mui/system';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import animationImage from '../assets/homeanimation.gif';
import grooming from '../assets/grooming.png';
import paw1 from '../assets/paw1.png';
import petball from '../assets/petball.png';
import catgroom from '../assets/catgroom.png';

// Theme Configuration - Keeping Original Colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#8670ffff',
      light: '#2600ffff',
    },
    secondary: {
      main: '#4c3fffff',
    },
    background: {
      default: '#d2e1ffff',
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
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '12px 28px',
          fontSize: '1rem',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(134, 112, 255, 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          border: '1px solid rgba(134, 112, 255, 0.1)',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 12px 40px rgba(134, 112, 255, 0.2)',
          },
        },
      },
    },
  },
});

// Animations
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.25; }
  50% { transform: scale(1.05); opacity: 0.4; }
`;

// Enhanced Scattered Paws Component
const ScatteredPaws = ({ count = 12 }) => {
  const positions = [
    { top: '8%', left: '5%', delay: '0s' },
    { top: '15%', right: '8%', delay: '0.5s' },
    { bottom: '20%', left: '10%', delay: '1s' },
    { bottom: '12%', right: '6%', delay: '1.5s' },
    { top: '35%', left: '3%', delay: '2s' },
    { bottom: '30%', right: '12%', delay: '2.5s' },
    { top: '45%', left: '7%', delay: '3s' },
    { bottom: '8%', right: '18%', delay: '3.5s' },
    { top: '25%', right: '15%', delay: '4s' },
    { bottom: '35%', left: '15%', delay: '4.5s' },
    { top: '60%', right: '5%', delay: '5s' },
    { bottom: '45%', left: '20%', delay: '5.5s' },
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
            width: '35px',
            height: '35px',
            opacity: 0.25,
            zIndex: 0,
            animation: `${pulse} 4s ease-in-out infinite`,
            animationDelay: pos.delay,
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
      right: '-45px',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 2,
      backgroundColor: theme.palette.primary.main,
      color: 'white',
      minWidth: '48px',
      height: '48px',
      borderRadius: '50%',
      boxShadow: '0 4px 12px rgba(134, 112, 255, 0.3)',
      '&:hover': {
        backgroundColor: theme.palette.primary.light,
        transform: 'translateY(-50%) scale(1.1)',
      },
    }}
  >
    →
  </Button>
);

const CustomPrevArrow = ({ onClick }) => (
  <Button
    onClick={onClick}
    sx={{
      position: 'absolute',
      left: '-45px',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 2,
      backgroundColor: theme.palette.primary.main,
      color: 'white',
      minWidth: '48px',
      height: '48px',
      borderRadius: '50%',
      boxShadow: '0 4px 12px rgba(134, 112, 255, 0.3)',
      '&:hover': {
        backgroundColor: theme.palette.primary.light,
        transform: 'translateY(-50%) scale(1.1)',
      },
    }}
  >
    ←
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

// Stats Section Component
const StatsSection = () => (
  <Box
    sx={{
      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
      borderRadius: 4,
      padding: { xs: 4, md: 6 },
      marginY: 8,
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(134, 112, 255, 0.25)',
    }}
  >
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%)',
      }}
    />
    <Grid container spacing={4} sx={{ position: 'relative', zIndex: 1 }}>
      {[
        { number: '5000+', label: 'Happy Pets' },
        { number: '500+', label: 'Products' },
        { number: '50+', label: 'Expert Groomers' },
        { number: '24/7', label: 'Customer Support' },
      ].map((stat, index) => (
        <Grid item xs={6} md={3} key={index}>
          <Box sx={{ textAlign: 'center', color: 'white' }}>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, fontSize: { xs: '2rem', md: '2.5rem' } }}>
              {stat.number}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.95, fontWeight: 500, fontSize: { xs: '0.9rem', md: '1rem' } }}>
              {stat.label}
            </Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  </Box>
);

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

  const computedSlidesToShow = Math.min(3, Math.max(1, products.length || 1));

  const sliderSettings = {
    dots: true,
    infinite: products.length > computedSlidesToShow,
    speed: 600,
    slidesToShow: computedSlidesToShow,
    slidesToScroll: 1,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, computedSlidesToShow),
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
          width: '100%',
          minHeight: '100vh',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <ScatteredPaws />

        {/* Hero Section - Enhanced with Original Colors */}
        <Box
          sx={{
            background: '#6b9affff',
            position: 'relative',
            overflow: 'hidden',
            paddingY: { xs: 6, md: 8 },
            marginBottom: 8,
            boxShadow: '0 8px 32px rgba(107, 154, 255, 0.3)',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 50%)',
            }}
          />
          
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    animation: `${fadeInUp} 1s ease-out`,
                  }}
                >
                  <Typography
                    variant="h2"
                    sx={{
                      color: '#FFFFFF',
                      mb: 3,
                      fontWeight: 800,
                      fontSize: { xs: '2.5rem', md: '3.5rem' },
                      textShadow: '0 2px 20px rgba(0,0,0,0.15)',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    Welcome to Zootopia!
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      color: 'rgba(255,255,255,0.95)',
                      mb: 4,
                      fontWeight: 400,
                      lineHeight: 1.6,
                      fontSize: { xs: '1.1rem', md: '1.3rem' },
                    }}
                  >
                    Your trusted partner for premium pet care, professional grooming services, and quality products for your beloved companions
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleGoToProducts}
                      sx={{
                        backgroundColor: 'white',
                        color: theme.palette.primary.main,
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.9)',
                        },
                      }}
                    >
                      Shop Products
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={handleBookNow}
                      sx={{
                        borderColor: 'white',
                        color: 'white',
                        borderWidth: 2,
                        '&:hover': {
                          borderColor: 'white',
                          borderWidth: 2,
                          backgroundColor: 'rgba(255,255,255,0.15)',
                        },
                      }}
                    >
                      Book Grooming
                    </Button>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    animation: `${float} 6s ease-in-out infinite`,
                  }}
                >
                  <Box
                    component="img"
                    src={animationImage}
                    alt="Pet Animation"
                    sx={{
                      width: { xs: 280, md: 400 },
                      height: { xs: 280, md: 400 },
                      borderRadius: '50%',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
                      border: '6px solid rgba(255,255,255,0.3)',
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, pb: 8 }}>
          {/* Stats Section */}
          <StatsSection />

          {/* Products Section */}
          <Box sx={{ mb: 10 }}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: theme.palette.primary.main,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  letterSpacing: '-0.01em',
                }}
              >
                Our Featured Products
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', fontWeight: 400 }}>
                Discover our carefully curated selection of premium pet products for your furry friends
              </Typography>
              <Divider sx={{ mt: 3, maxWidth: 100, mx: 'auto', borderWidth: 2, borderColor: theme.palette.primary.main }} />
            </Box>

            <Box sx={{ position: 'relative', px: { xs: 0, md: 6 } }}>
              <Slider {...sliderSettings}>
                {products.map((product, index) => (
                  <Box key={index} sx={{ px: 2 }}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        overflow: 'visible',
                      }}
                    >
                      <Box
                        sx={{
                          position: 'relative',
                          paddingTop: '75%',
                          overflow: 'hidden',
                          backgroundColor: '#F8F9FE',
                        }}
                      >
                        <CardMedia
                          component="img"
                          image={product.productImage}
                          alt={product.productName}
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            height: '80%',
                            width: '80%',
                            objectFit: 'contain',
                            transition: 'transform 0.4s ease',
                            '&:hover': {
                              transform: 'translate(-50%, -50%) scale(1.08)',
                            },
                          }}
                        />
                      </Box>
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Typography
                          variant="overline"
                          sx={{
                            color: theme.palette.secondary.main,
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            letterSpacing: '0.1em',
                          }}
                        >
                          {product.productType}
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            mb: 2,
                            mt: 1,
                            minHeight: '3em',
                            color: theme.palette.text.primary,
                          }}
                        >
                          {product.productName}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 3 }}>
                          <Typography
                            variant="h5"
                            sx={{
                              fontWeight: 700,
                              color: theme.palette.primary.main,
                            }}
                          >
                            ₱{product.price.toFixed(2)}
                          </Typography>
                        </Box>
                        <Button
                          variant="contained"
                          color="secondary"
                          fullWidth
                          onClick={handleGoToProducts}
                        >
                          View Product
                        </Button>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
              </Slider>
            </Box>
          </Box>

          {/* Services Section */}
          <Box sx={{ mb: 8 }}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: theme.palette.primary.main,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  letterSpacing: '-0.01em',
                }}
              >
                Our Premium Services
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', fontWeight: 400 }}>
                Expert care and professional grooming for your beloved companions
              </Typography>
              <Divider sx={{ mt: 3, maxWidth: 100, mx: 'auto', borderWidth: 2, borderColor: theme.palette.primary.main }} />
            </Box>

            <Grid container spacing={4} alignItems="stretch">
              <Grid item xs={12} md={6}>
                <Card
                  sx={{
                    height: '100%',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    p: 4,
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                    Why Choose Zootopia?
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    {[
                      '✓ Certified professional groomers with years of experience',
                      '✓ Premium quality products for your pets',
                      '✓ Comfortable & safe environment',
                      '✓ Personalized pet care plans',
                    ].map((item, idx) => (
                      <Typography key={idx} variant="body1" sx={{ fontSize: '1.05rem', lineHeight: 1.6 }}>
                        {item}
                      </Typography>
                    ))}
                  </Box>
                </Card>
              </Grid>

              {services.map((service, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ position: 'relative', paddingTop: '56.25%', overflow: 'hidden' }}>
                      <CardMedia
                        component="img"
                        image={service.image}
                        alt={service.name}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.5s ease',
                          '&:hover': {
                            transform: 'scale(1.05)',
                          },
                        }}
                      />
                    </Box>
                    <CardContent sx={{ flexGrow: 1, p: 4 }}>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          fontWeight: 700, 
                          mb: 2,
                          color: theme.palette.primary.main,
                        }}
                      >
                        {service.name}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, fontSize: '1.05rem', lineHeight: 1.7 }}>
                        {service.description}
                      </Typography>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        fullWidth
                        onClick={handleBookNow}
                      >
                        Book Appointment
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* CTA Section */}
          <Box
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              borderRadius: 4,
              padding: { xs: 4, md: 6 },
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(134, 112, 255, 0.25)',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 70%)',
              }}
            />
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="h4" sx={{ color: 'white', mb: 2, fontWeight: 700, fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
                Ready to Give Your Pet the Best Care?
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.95)', mb: 4, fontWeight: 400 }}>
                Join thousands of happy pet owners who trust Zootopia
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleGoToProducts}
                  sx={{
                    backgroundColor: 'white',
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.9)',
                    },
                  }}
                >
                  Explore Products
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleBookNow}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    borderWidth: 2,
                    '&:hover': {
                      borderColor: 'white',
                      borderWidth: 2,
                      backgroundColor: 'rgba(255,255,255,0.15)',
                    },
                  }}
                >
                  Schedule Service
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default HomePage;