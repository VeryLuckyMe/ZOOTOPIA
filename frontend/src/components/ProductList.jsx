import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'sonner';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Container,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const theme = createTheme({
  palette: {
    primary: {
      main: '#8670ffff',
      light: '#2600ffff',
    },
    secondary: {
      main: '#3735b3ff',
    },
    background: {
      default: '#cadbffff',
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
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 12px 40px rgba(134, 112, 255, 0.2)',
          },
        },
      },
    },
  },
});

const ProductList = ({ userId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartResponse, setCartResponse] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('http://localhost:8080/api/product/getProduct');
        
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          setError('Unexpected response format from server');
          setProducts([]);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message || 'Failed to fetch products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (product) => {
    if (!userId) {
      toast.error('User ID is required. Please pass userId prop to ProductList component.');
      return;
    }

    try {
      setAddingToCart(product.productID);

      const response = await axios.post(
        'http://localhost:8080/api/cart/items',
        {},
        {
          params: {
            userId,
            productId: product.productID,
            quantity: 1,
          },
        }
      );

      setCartResponse(response.data);
      toast.success(`${product.productName} added to cart!`);
      console.log('Cart response:', response.data);
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(null);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh', py: 4 }}>
        <Toaster position="top-center" duration={2500} richColors />
        
        <Container maxWidth="lg">
          <Typography variant="h3" component="h1" sx={{ mb: 4, fontWeight: 700, color: 'primary.main' }}>
            Products
          </Typography>

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
              <CircularProgress size={60} sx={{ color: 'primary.main' }} />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                Error loading products
              </Typography>
              <Typography variant="body2">{error}</Typography>
            </Alert>
          )}

          {cartResponse && (
            <Alert severity="success" sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                Cart Updated Successfully
              </Typography>
              <Box sx={{ backgroundColor: 'rgba(255,255,255,0.3)', p: 1.5, borderRadius: 1, fontFamily: 'monospace', fontSize: '0.85rem' }}>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {JSON.stringify(cartResponse, null, 2)}
                </pre>
              </Box>
            </Alert>
          )}

          {!loading && products.length === 0 && !error && (
            <Alert severity="info">No products available</Alert>
          )}

          {!loading && products.length > 0 && (
            <Grid container spacing={3}>
              {products.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.productID}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardMedia
                      component="img"
                      height="240"
                      image={product.productImage || '/placeholder.png'}
                      alt={product.productName}
                      sx={{ objectFit: 'contain', p: 2, backgroundColor: '#F8F9FE' }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="div" sx={{ fontWeight: 600, mb: 1 }}>
                        {product.productName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: '3em' }}>
                        {product.description}
                      </Typography>
                      <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 700 }}>
                        ₱{(product.productPrice || 0).toFixed(2)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                        Stock: {product.quantity || 0}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<ShoppingCartIcon />}
                        fullWidth
                        onClick={() => handleAddToCart(product)}
                        disabled={addingToCart === product.productID || (product.quantity || 0) === 0}
                        sx={{ py: 1 }}
                      >
                        {addingToCart === product.productID ? 'Adding...' : 'Add to Cart'}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default ProductList;
