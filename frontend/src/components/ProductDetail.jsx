import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button,
  IconButton,
  TextField,
  Tooltip,
  Rating,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { Toaster, toast } from "sonner";
import StarDisplay from "./StarDisplay";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import petBall from "../assets/petball.png";

const theme = createTheme({
  palette: {
    primary: { main: "#8670ffff", light: "#2600ffff" },
    secondary: { main: "#3735b3ff", light: "#D2B48C" },
    background: { default: "#cadbffff", paper: "#FFFFFF" },
  },
  typography: { fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif' },
});

const PageWrapper = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.light}20, ${theme.palette.background.default})`,
  minHeight: "100vh",
  padding: theme.spacing(4),
}));

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [itemQuantity, setItemQuantity] = useState(1);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/product/getProduct/${productId}`);
        const data = await res.json();
        setProduct(data);
        setItemQuantity(1);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/review/getReviewsByProductId/${productId}`
        );
        const data = await res.json();
        if (Array.isArray(data)) setReviews(data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    fetchProduct();
    fetchReviews();
  }, [productId]);

  const handleIncreaseQuantity = () => {
    if (!product) return;
    setItemQuantity((prev) => Math.min(prev + 1, product.quantity || 1));
  };

  const handleDecreaseQuantity = () => {
    setItemQuantity((prev) => Math.max(prev - 1, 1));
  };

  const handleAddToCart = async () => {
    const userId = localStorage.getItem("id");
    if (!userId) {
      toast.warning("You must be logged in to add items to the cart!");
      return;
    }
    if (!product || itemQuantity <= 0) {
      toast.warning("Quantity must be greater than 0!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/cart/items",
        null,
        {
          params: {
            userId: userId,
            productId: product.productID,
            quantity: itemQuantity,
          },
        }
      );

      toast.success(`Added ${itemQuantity} to your cart!`);
      console.log("Cart updated:", response.data);
      setItemQuantity(1);
    } catch (err) {
      console.error("Cart error:", err);
      const errorMsg = err.response?.data || err.message;
      toast.error(`Failed to add to cart: ${errorMsg}`);
    }
  };

  // Calculate average rating
  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.ratings, 0);
    return sum / reviews.length;
  };

  if (!product)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <Typography>Loading product details...</Typography>
      </Box>
    );

  const avgRating = calculateAverageRating();

  return (
    <ThemeProvider theme={theme}>
      <PageWrapper>
        <Toaster position="top-center" duration={2500} />

        {/* Main Product Section */}
        <Card
          sx={{
            maxWidth: 900,
            mx: "auto",
            mb: 4,
            p: 3,
          }}
        >
          <Grid container spacing={4}>
            {/* Left: Product Image */}
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#e0e0e0",
                  height: 300,
                  borderRadius: 1,
                }}
              >
                <CardMedia
                  component="img"
                  image={product.productImage || petBall}
                  alt={product.productName}
                  sx={{ 
                    maxWidth: "100%", 
                    maxHeight: "100%", 
                    objectFit: "contain" 
                  }}
                />
              </Box>
            </Grid>

            {/* Right: Product Info */}
            <Grid item xs={12} md={7}>
              <Typography variant="h4" fontWeight="bold" mb={2}>
                {product.productName}
              </Typography>
              
              <Typography variant="h5" color="primary" fontWeight="bold" mb={2}>
                ₱{product.productPrice.toFixed(2)}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                <IconButton 
                  onClick={handleDecreaseQuantity} 
                  disabled={itemQuantity <= 1}
                  sx={{ border: "1px solid #ddd" }}
                >
                  <RemoveIcon />
                </IconButton>
                <TextField
                  variant="outlined"
                  size="small"
                  value={itemQuantity}
                  inputProps={{ 
                    style: { textAlign: "center" },
                    readOnly: true 
                  }}
                  sx={{ width: 60 }}
                />
                <IconButton
                  onClick={handleIncreaseQuantity}
                  disabled={itemQuantity >= (product.quantity || 1)}
                  sx={{ border: "1px solid #ddd" }}
                >
                  <AddIcon />
                </IconButton>
                <Tooltip title={product.quantity <= 0 ? "Out of stock" : ""}>
                  <span>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddToCart}
                      disabled={product.quantity <= 0}
                      sx={{ ml: 2, px: 4 }}
                    >
                      Buy now
                    </Button>
                  </span>
                </Tooltip>
              </Box>

              <Typography variant="body2" color="text.secondary" mb={1}>
                Available Stock: {product.quantity}
              </Typography>
            </Grid>
          </Grid>
        </Card>

        {/* Description Section */}
        <Card sx={{ maxWidth: 900, mx: "auto", mb: 4, p: 3 }}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Description
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {product.description}
          </Typography>
        </Card>

        {/* Product Ratings Section */}
        <Card sx={{ maxWidth: 900, mx: "auto", p: 3 }}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Product Ratings
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight="bold">
              {avgRating.toFixed(1)} out of 5 ({reviews.length})
            </Typography>
            <Rating value={avgRating} precision={0.1} readOnly />
          </Box>

          {/* Reviews List */}
          <Grid container spacing={3}>
            {reviews.length > 0 ? (
              reviews.map((review, idx) => (
                <Grid item xs={12} md={6} key={idx}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <StarDisplay rating={review.ratings} />
                        <Typography variant="caption" sx={{ ml: 1 }}>
                          ({review.ratings}/5)
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {review.comment}
                      </Typography>
                      <Typography variant="caption" fontWeight="bold">
                        - {review.username}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography>No reviews available for this product.</Typography>
              </Grid>
            )}
          </Grid>
        </Card>
      </PageWrapper>
    </ThemeProvider>
  );
};

export default ProductDetail;