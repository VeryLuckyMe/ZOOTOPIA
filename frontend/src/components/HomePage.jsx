import React, { useState, useEffect, useRef } from 'react';
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
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import { keyframes } from '@mui/system';
import { ChevronLeft, ChevronRight, CheckCircle, Star, ShoppingBag, Schedule } from '@mui/icons-material';

import animationImage from '../assets/homeanimation.gif';
import grooming from '../assets/grooming.png';
import paw1 from '../assets/paw1.png';

// Theme Configuration
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
    fontFamily: '"Inter", "Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    body1: {
      lineHeight: 1.7,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '14px 32px',
          fontSize: '1rem',
          transition: 'all 0.2s ease-in-out',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(134, 112, 255, 0.2)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          transition: 'all 0.3s ease-in-out',
          border: '1px solid rgba(0, 0, 0, 0.06)',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(134, 112, 255, 0.12)',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          letterSpacing: '0.02em',
        },
      },
    },
  },
});

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.25; }
  50% { transform: scale(1.05); opacity: 0.4; }
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

// Scattered Paws Component
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

// Professional Product Card Component
const ProductCard = ({ product, onProductClick }) => {
  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Product Type Badge */}
      <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 2 }}>
        <Chip
          label={product.productType}
          size="small"
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            fontWeight: 600,
            fontSize: '0.7rem',
          }}
        />
      </Box>

      {/* Rating Badge */}
      <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 2 }}>
        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: 2,
            px: 1.5,
            py: 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <Star sx={{ fontSize: 16, color: '#FFA726' }} />
          <Typography variant="caption" fontWeight={600}>
            {product.rating}
          </Typography>
        </Box>
      </Box>

      {/* Product Image */}
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
            height: '75%',
            width: '75%',
            objectFit: 'contain',
            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translate(-50%, -50%) scale(1.1)',
            },
          }}
        />
      </Box>

      <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 1,
            fontSize: '1.1rem',
            minHeight: '2.5em',
            color: theme.palette.text.primary,
          }}
        >
          {product.productName}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ 
            mb: 3, 
            flexGrow: 1,
            fontSize: '0.9rem',
            lineHeight: 1.6,
          }}
        >
          {product.description.length > 100 
            ? `${product.description.substring(0, 100)}...` 
            : product.description}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: theme.palette.primary.main,
              fontSize: '1.5rem',
            }}
          >
            ₱{product.price.toFixed(2)}
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="secondary"
          fullWidth
          startIcon={<ShoppingBag />}
          onClick={(e) => {
            e.stopPropagation();
            onProductClick(product.id); // FIX: Pass only the product ID
          }}
          sx={{
            py: 1.5,
            fontWeight: 600,
          }}
        >
          Go to Products
        </Button>
      </CardContent>
    </Card>
  );
};

// Carousel Navigation Arrows
const CarouselArrow = ({ direction, onClick, disabled = false }) => {
  const ArrowIcon = direction === 'next' ? ChevronRight : ChevronLeft;
  
  return (
    <IconButton
      onClick={onClick}
      disabled={disabled}
      sx={{
        position: 'absolute',
        [direction === 'next' ? 'right' : 'left']: { xs: '-15px', md: '-25px' },
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 10,
        backgroundColor: theme.palette.primary.main,
        color: 'white',
        width: { xs: '44px', md: '56px' },
        height: { xs: '44px', md: '56px' },
        '&:hover': {
          backgroundColor: theme.palette.primary.light,
          transform: 'translateY(-50%) scale(1.1)',
        },
        '&.Mui-disabled': {
          backgroundColor: 'rgba(134, 112, 255, 0.3)',
        },
        boxShadow: '0 4px 12px rgba(134, 112, 255, 0.3)',
      }}
    >
      <ArrowIcon sx={{ fontSize: { xs: '24px', md: '30px' } }} />
    </IconButton>
  );
};

// Stats Section Component
const StatsSection = () => (
  <Box
    sx={{
      background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FE 100%)',
      borderRadius: 3,
      padding: { xs: 5, md: 6 },
      marginY: 10,
      boxShadow: '0 4px 20px rgba(134, 112, 255, 0.08)',
      border: '1px solid rgba(134, 112, 255, 0.1)',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
      },
    }}
  >
    <Grid container spacing={4}>
      {[
        { number: '5,000+', label: 'Happy Customers', sublabel: 'And growing', icon: '😊' },
        { number: '500+', label: 'Premium Products', sublabel: 'Carefully curated', icon: '⭐' },
        { number: '50+', label: 'Expert Staff', sublabel: 'Certified professionals', icon: '👨‍⚕️' },
        { number: '24/7', label: 'Support Available', sublabel: 'Always here for you', icon: '🕒' },
      ].map((stat, index) => (
        <Grid item xs={6} md={3} key={index}>
          <Box 
            sx={{ 
              textAlign: 'center', 
              py: 2,
              animation: `${slideIn} 0.5s ease-out ${index * 0.1}s both`,
            }}
          >
            <Box sx={{ fontSize: '2rem', mb: 1 }}>
              {stat.icon}
            </Box>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 800, 
                mb: 1, 
                fontSize: { xs: '2rem', md: '2.5rem' },
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {stat.number}
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                mb: 0.5,
                color: theme.palette.text.primary,
              }}
            >
              {stat.label}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: theme.palette.text.secondary,
                fontSize: '0.875rem',
              }}
            >
              {stat.sublabel}
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoSwiping, setIsAutoSwiping] = useState(true);
  const autoSlideRef = useRef(null);

  useEffect(() => {
    // Fetch products from backend
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/product/getProduct');
        if (Array.isArray(response.data)) {
          const processedProducts = response.data.map((product) => ({
            id: product._id,
            productName: product.productName || 'Unnamed Product',
            price: product.productPrice || 0,
            productImage: product.productImage || '/placeholder-image.png',
            description: product.description || 'No description available.',
            productType: product.productType || 'Uncategorized',
            rating: product.rating || 4.5,
          }));
          setProducts(processedProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Auto-swipe functionality
  useEffect(() => {
    if (!isAutoSwiping || products.length <= 3) return;

    autoSlideRef.current = setInterval(() => {
      setCurrentSlide((prev) => 
        prev >= Math.max(1, products.length - 3) ? 0 : prev + 1
      );
    }, 5000); // Change slide every 5 seconds

    return () => {
      if (autoSlideRef.current) {
        clearInterval(autoSlideRef.current);
      }
    };
  }, [isAutoSwiping, products.length]);

  const handleBookNow = () => {
    navigate('/appointments');
  };

  const handleGoToProducts = () => {
    navigate('/products');
  };

  const handleProductClick = () => {
    navigate(`/products`);
  };

  const nextSlide = () => {
    if (products.length > 3) {
      setCurrentSlide((prev) => 
        prev >= Math.max(1, products.length - 3) ? 0 : prev + 1
      );
    }
  };

  const prevSlide = () => {
    if (products.length > 3) {
      setCurrentSlide((prev) => 
        prev <= 0 ? Math.max(1, products.length - 3) : prev - 1
      );
    }
  };

  // Handle mouse enter/leave for auto-swipe pause
  const handleMouseEnter = () => setIsAutoSwiping(false);
  const handleMouseLeave = () => setIsAutoSwiping(true);

  const visibleProducts = products.slice(currentSlide, currentSlide + 3);

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

        {/* Hero Section */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #6b9affff 0%, #8670ffff 100%)',
            position: 'relative',
            overflow: 'hidden',
            paddingY: { xs: 10, md: 14 },
            marginBottom: 8,
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
                <Box sx={{ animation: `${fadeInUp} 0.8s ease-out` }}>
                  <Typography
                    variant="overline"
                    sx={{
                      color: 'rgba(255,255,255,0.9)',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      letterSpacing: '0.1em',
                      mb: 2,
                      display: 'block',
                    }}
                  >
                    PREMIUM PET CARE SERVICES
                  </Typography>
                  <Typography
                    variant="h2"
                    sx={{
                      color: '#FFFFFF',
                      mb: 3,
                      fontWeight: 800,
                      fontSize: { xs: '2.5rem', md: '3.5rem' },
                      lineHeight: 1.2,
                    }}
                  >
                    Welcome to Zootopia!
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'rgba(255,255,255,0.95)',
                      mb: 5,
                      fontWeight: 400,
                      lineHeight: 1.6,
                      fontSize: { xs: '1.1rem', md: '1.25rem' },
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
                        px: 4,
                        fontWeight: 700,
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.95)',
                        },
                      }}
                    >
                      Browse Products
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={handleBookNow}
                      startIcon={<Schedule />}
                      sx={{
                        borderColor: 'white',
                        color: 'white',
                        px: 4,
                        borderWidth: 2,
                        fontWeight: 700,
                        '&:hover': {
                          borderColor: 'white',
                          borderWidth: 2,
                          backgroundColor: 'rgba(255,255,255,0.1)',
                        },
                      }}
                    >
                      Book Service
                    </Button>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
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
                      border: '8px solid rgba(255,255,255,0.3)',
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, pb: 10 }}>
          {/* Stats Section */}
          <StatsSection />

          {/* Featured Products Section - Enhanced with Auto-Swipe */}
          <Box sx={{ mb: 12 }}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  mb: 2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontSize: { xs: '2rem', md: '2.5rem' },
                }}
              >
                Featured Products
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ 
                  maxWidth: 600, 
                  mx: 'auto',
                  fontSize: '1.1rem',
                  mb: 1,
                }}
              >
                Discover our carefully curated selection of premium pet products
              </Typography>
              <Divider sx={{ 
                mt: 4, 
                width: 80, 
                mx: 'auto', 
                borderWidth: 3, 
                borderColor: theme.palette.primary.main,
                borderRadius: 2,
              }} />
            </Box>

            {products.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  Loading products...
                </Typography>
              </Box>
            ) : (
              <Box 
                sx={{ 
                  position: 'relative', 
                  px: { xs: 0, md: 4 },
                  mx: 'auto',
                  maxWidth: '1400px',
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {/* Carousel Indicators */}
                {products.length > 3 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 4 }}>
                    {Array.from({ length: Math.max(1, products.length - 2) }).map((_, index) => (
                      <Box
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          backgroundColor: index === currentSlide 
                            ? theme.palette.primary.main 
                            : 'rgba(134, 112, 255, 0.2)',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: theme.palette.primary.light,
                          },
                        }}
                      />
                    ))}
                  </Box>
                )}

                {/* Products Grid */}
                <Grid container spacing={4} sx={{ minHeight: '500px' }}>
                  {visibleProducts.map((product, index) => (
                    <Grid item xs={12} sm={6} md={4} key={product.id}>
                      <Box
                        onClick={() => handleProductClick(product.id)} // FIX: Pass only the product ID
                        sx={{ 
                          cursor: 'pointer',
                          animation: `${fadeInUp} 0.5s ease-out ${index * 0.1}s both`,
                        }}
                      >
                        <ProductCard 
                          product={product}
                          onProductClick={handleProductClick}
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                {/* Navigation Arrows */}
                {products.length > 3 && (
                  <>
                    <CarouselArrow 
                      direction="prev" 
                      onClick={prevSlide}
                      disabled={currentSlide === 0}
                    />
                    <CarouselArrow 
                      direction="next" 
                      onClick={nextSlide}
                      disabled={currentSlide >= Math.max(1, products.length - 3)}
                    />
                  </>
                )}
              </Box>
            )}
          </Box>

          {/* Services Section */}
          <Box sx={{ mb: 12 }}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  mb: 2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontSize: { xs: '2rem', md: '2.5rem' },
                }}
              >
                Professional Grooming Services
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ 
                  maxWidth: 600, 
                  mx: 'auto',
                  fontSize: '1.1rem',
                }}
              >
                Expert care delivered with compassion and professionalism
              </Typography>
            </Box>

            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Card
                  sx={{
                    height: '100%',
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FE 100%)',
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, color: theme.palette.primary.main }}>
                    Why Choose Our Services
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    {[
                      'Certified and experienced professional groomers',
                      'Premium quality products and equipment',
                      'Safe, clean, and comfortable facilities',
                      'Personalized care plans for each pet',
                      'Emergency veterinary care available',
                      'Satisfaction guaranteed',
                    ].map((item, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <CheckCircle sx={{ color: theme.palette.primary.main, fontSize: 24, mt: 0.2 }} />
                        <Typography variant="body1" sx={{ flex: 1, fontWeight: 500 }}>
                          {item}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', overflow: 'hidden' }}>
                  <Box
                    component="img"
                    src={grooming}
                    alt="Grooming Services"
                    sx={{
                      width: '100%',
                      height: 280,
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                  />
                  <CardContent sx={{ p: 4 }}>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 800, 
                        mb: 2,
                        color: theme.palette.primary.main,
                      }}
                    >
                      Professional Grooming
                    </Typography>
                    <Typography 
                      variant="body1" 
                      color="text.secondary" 
                      sx={{ mb: 3, lineHeight: 1.7 }}
                    >
                      Our certified groomers provide top-quality services tailored to your pets specific needs, 
                      ensuring they look and feel their best in a safe and comfortable environment.
                    </Typography>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="large"
                      fullWidth
                      startIcon={<Schedule />}
                      onClick={handleBookNow}
                      sx={{
                        py: 1.5,
                        fontWeight: 700,
                      }}
                    >
                      Schedule Appointment
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* CTA Section */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FE 100%)',
              borderRadius: 3,
              padding: { xs: 6, md: 8 },
              textAlign: 'center',
              boxShadow: '0 4px 20px rgba(134, 112, 255, 0.12)',
              border: `2px solid ${theme.palette.primary.main}`,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              },
            }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 2, 
                fontWeight: 800, 
                fontSize: { xs: '1.75rem', md: '2.125rem' },
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Ready to Get Started?
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ 
                mb: 4,
                fontSize: '1.1rem',
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Join thousands of satisfied pet owners who trust Zootopia for their pet care needs
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleGoToProducts}
                sx={{ 
                  px: 4,
                  fontWeight: 700,
                }}
              >
                Shop Products
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={handleBookNow}
                startIcon={<Schedule />}
                sx={{ 
                  px: 4,
                  fontWeight: 700,
                  borderWidth: 2,
                }}
              >
                Book Service
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default HomePage;