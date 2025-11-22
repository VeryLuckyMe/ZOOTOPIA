import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Divider,
  Button,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { Toaster, toast } from "sonner";
import StarDisplay from "./StarDisplay";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import petBall from "../assets/petball.png"; // Default fallback image

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

  // Fetch product details and reviews
  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/product/getProduct/${productId}`);
        const data = await res.json();
        setProduct(data);
        setItemQuantity(1); // Reset quantity whenever product changes
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

  // Quantity handlers
  const handleIncreaseQuantity = () => {
    if (!product) return;
    setItemQuantity((prev) => Math.min(prev + 1, product.quantity || 1));
  };

  const handleDecreaseQuantity = () => {
    setItemQuantity((prev) => Math.max(prev - 1, 1));
  };

  // Add to cart
  const handleAddToCart = async () => {
    const cartId = localStorage.getItem("id");
    if (!cartId) {
      toast.warning("You must be logged in to add items to the cart!");
      return;
    }
    if (!product || itemQuantity <= 0) {
      toast.warning("Quantity must be greater than 0!");
      return;
    }

    const cartItem = {
      quantity: itemQuantity,
      cart: { cartId },
      product: { productID: product.productID },
    };

    try {
      const cartRes = await axios.get(`http://localhost:8080/api/cart/getCartById/${cartId}`);
      const existingItem = cartRes.data.cartItems.find(
        (item) => item.product.productID === product.productID
      );

      if (existingItem) {
        const updatedQuantity = existingItem.quantity + itemQuantity;
        if (updatedQuantity > product.quantity) {
          toast.error(
            `You already have ${existingItem.quantity} in your cart. Cannot exceed stock.`
          );
          return;
        }
        await axios.put(
          `http://localhost:8080/api/cartItem/updateCartItem/${existingItem.cartItemId}`,
          { quantity: updatedQuantity }
        );
        toast.success(`Added ${itemQuantity} more to your cart!`);
      } else {
        await axios.post("http://localhost:8080/api/cartItem/postCartItem", cartItem);
        toast.success("Added to cart!");
      }
    } catch (err) {
      console.error("Cart error:", err);
      toast.error("Failed to add to cart. Try again.");
    }
  };

  if (!product)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <Typography>Loading product details...</Typography>
      </Box>
    );

  return (
    <ThemeProvider theme={theme}>
      <PageWrapper>
        <Toaster position="top-center" duration={2500} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            flexDirection: "column",
            mb: 4,
          }}
        >
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: { xs: "90%", sm: "70%", md: "50%" },
              mx: "auto",
              p: 3,
              mb: 4,
            }}
          >
            <CardMedia
              component="img"
              image={product.productImage || petBall}
              alt={product.productName}
              sx={{ width: 300, height: 300, objectFit: "cover", mb: 2 }}
            />
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h5" fontWeight="bold" mb={1}>
                {product.productName}
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={2}>
                {product.description}
              </Typography>
              <Typography variant="h6" color="primary" mb={2}>
                Price: ₱{product.productPrice.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Available Stock: {product.quantity}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
                <IconButton onClick={handleDecreaseQuantity} disabled={itemQuantity <= 1}>
                  <RemoveIcon />
                </IconButton>
                <TextField
                  variant="outlined"
                  size="small"
                  value={itemQuantity}
                  inputProps={{ style: { textAlign: "center" } }}
                  sx={{ width: 60, mx: 1 }}
                />
                <IconButton
                  onClick={handleIncreaseQuantity}
                  disabled={itemQuantity >= (product.quantity || 1)}
                >
                  <AddIcon />
                </IconButton>
              </Box>

              <Tooltip title={product.quantity <= 0 ? "Out of stock" : ""}>
                <span>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddToCart}
                    disabled={product.quantity <= 0}
                  >
                    Add to Cart
                  </Button>
                </span>
              </Tooltip>
            </CardContent>
          </Card>
        </Box>

        <Divider sx={{ mb: 4 }} />
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Reviews
        </Typography>

        <Grid container spacing={2}>
          {reviews.length > 0 ? (
            reviews.map((review, idx) => (
              <Grid item xs={12} key={idx}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {review.username}
                    </Typography>
                    <StarDisplay rating={review.ratings} />
                    <Typography variant="body2">{review.comment}</Typography>
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
      </PageWrapper>
    </ThemeProvider>
  );
};

export default ProductDetail;
