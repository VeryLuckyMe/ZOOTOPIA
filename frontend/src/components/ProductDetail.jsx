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

const theme = createTheme({
  palette: {
    primary: {
      main: "#8670ffff",
      light: "#2600ffff",
    },
    secondary: {
      main: "#3735b3ff",
    },
    background: {
      default: "#cadbffff",
      paper: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
  },
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
    const fetchProductDetails = async () => {
      if (!productId) {
        console.error("Product ID is missing.");
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/api/product/getProduct/${productId}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/review/getReviewsByProductId/${productId}`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setReviews(data);
        } else {
          console.error("Expected an array but got:", data);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchProductDetails();
    fetchReviews();
  }, [productId]);

  const handleIncreaseQuantity = () => {
    setItemQuantity((prev) => Math.min(prev + 1, product.quantity));
  };

  const handleDecreaseQuantity = () => {
    setItemQuantity((prev) => Math.max(prev - 1, 1));
  };

  const handleAddToCart = async () => {
    const cartId = localStorage.getItem("id");
    if (itemQuantity <= 0) {
      toast.warning("Quantity must be greater than 0!");
      return;
    }
    const cartItem = {
      quantity: itemQuantity,
      cart: {
        cartId: cartId,
      },
      product: {
        productID: product.productID,
      },
    };

    try {
      const cartResponse = await axios.get(`http://localhost:8080/api/cart/getCartById/${cartId}`);
      const existingCartItems = cartResponse.data.cartItems;

      const existingCartItem = existingCartItems.find((item) => item.product.productID === product.productID);

      if (existingCartItem) {
        const updatedQuantity = existingCartItem.quantity + itemQuantity;
        if (updatedQuantity > product.quantity) {
          toast.error(
            `You already have ${existingCartItem.quantity} in your cart. Unable to add more as it would exceed the remaining stock`
          );
          return;
        }
        await axios.put(`http://localhost:8080/api/cartItem/updateCartItem/${existingCartItem.cartItemId}`, {
          quantity: updatedQuantity,
        });

        toast.success(`Added ${itemQuantity} more of this item to the cart`);
      } else {
        const response = await axios.post("http://localhost:8080/api/cartItem/postCartItem", cartItem);

        toast.success("Added to cart!");
      }
    } catch (error) {
      toast.error("Failed to add to cart. Please try again.");
    }
  };

  if (!product) return <Typography>Loading...</Typography>;

  return (
    <ThemeProvider theme={theme}>
      <PageWrapper>
        <Toaster position="top-center" duration={2500} />

        {/* Wrapper Box to center the card */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh", // Makes the parent container take the full height of the viewport
          }}
        >
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              mb: 4,
              width: "50%",
            }}
          >
            <CardMedia
              component="img"
              sx={{ width: "300px", height: "300px", objectFit: "cover", mb: 2 }}
              image={product.productImage || "/placeholder-image.png"}
              alt={product.productName}
            />
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
                {product.productName}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {product.description}
              </Typography>
              <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                Price: ₱{product.productPrice.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
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
                <IconButton onClick={handleIncreaseQuantity} disabled={itemQuantity >= product.quantity}>
                  <AddIcon />
                </IconButton>
              </Box>
              <Tooltip title={product?.quantity <= 0 ? "Out of stock" : ""}>
                <span>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddToCart}
                    disabled={product.quantity <= 0}
                    sx={{ display: "block", marginLeft: "auto", marginRight: "auto" }}
                  >
                    Add to Cart
                  </Button>
                </span>
              </Tooltip>
            </CardContent>
          </Card>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
          Reviews
        </Typography>
        <Grid container spacing={2}>
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <Grid item xs={12} key={index}>
                <Card>
                  <CardContent>
                    <Typography variant="body2"> {review.username}</Typography>
                    <br />
                    <StarDisplay rating={review.ratings} /> {/* Display star rating */}
                    <Typography variant="body2">Comment: {review.comment}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography>No reviews available for this product.</Typography>
          )}
        </Grid>
      </PageWrapper>
    </ThemeProvider>
  );
};

export default ProductDetail;
