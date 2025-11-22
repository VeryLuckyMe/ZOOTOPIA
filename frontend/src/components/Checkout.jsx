import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  createTheme,
  ThemeProvider,
  styled,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from "sonner";

import cart from "../assets/cart.png";
import paw1 from "../assets/paw1.png";
import imagePlaceholder from "../assets/image.png";

const theme = createTheme({
  palette: {
    primary: {
      main: "#8B4513",
      light: "#D2B48C",
    },
    secondary: {
      main: "#FFA500",
    },
    background: {
      default: "#FFF5E6",
      paper: "#FFFFFF",
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
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "translateY(-5px)",
          },
        },
      },
    },
  },
});

const ScatteredPaws = ({ count = 10 }) => {
  const positions = [
    { top: "5%", left: "3%" },
    { top: "10%", right: "5%" },
    { bottom: "15%", left: "7%" },
    { bottom: "10%", right: "3%" },
    { top: "20%", left: "10%" },
    { bottom: "25%", right: "10%" },
    { top: "30%", left: "2%" },
    { bottom: "5%", right: "15%" },
    { top: "15%", right: "12%" },
    { bottom: "20%", left: "15%" },
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
            position: "absolute",
            width: "30px",
            height: "30px",
            opacity: 0.3,
            zIndex: 1,
            ...pos,
          }}
        />
      ))}
    </>
  );
};

const PageWrapper = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.light}20, ${theme.palette.background.default})`,
  minHeight: "100vh",
  padding: theme.spacing(4),
}));

const HeaderWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: theme.spacing(4),
}));

const CartIcon = styled("img")({
  width: "60px",
  height: "60px",
  marginRight: "15px",
});

const PawPrint = styled("img")(({ theme }) => ({
  position: "absolute",
  width: "100px",
  height: "auto",
  opacity: 0.1,
  zIndex: -1,
}));

const CheckoutPage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { selectedItems, orderSummary } = location.state || {
    selectedItems: [],
    orderSummary: {},
  };

  const clearState = () => {
    navigate(location.pathname, { state: { selectedItems: [], orderSummary: {} } });
  };

  useEffect(() => {
    const userId = localStorage.getItem("id");

    if (!userId) {
      navigate("/");
      return;
    }
    if (selectedItems.length === 0) {
      navigate("/cart");
      return;
    }

    axios
      .get(`http://localhost:8080/auth/user/findById/${userId}`)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("id");

    if (selectedItems.length === 0) {
      toast.warning("No items to order. Please go back and add items to the cart.");
      return;
    }

    const orderItems = selectedItems.map((item) => ({
      orderItemName: item.product.productName,
      orderItemImage: item.product.productImage || imagePlaceholder,
      price: item.product.productPrice,
      quantity: item.quantity,
      productId: item.product.productID,
    }));

    const orderDate = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

    const orderData = {
      orderItems,
      orderDate,
      orderStatus: "To Receive",
      paymentMethod: "Cash on Delivery",
      totalPrice: orderSummary.total,
      user: user,
    };

    try {
      const response = await axios.post("http://localhost:8080/api/order/postOrderRecord", orderData);

      if (response.status === 200) {
        toast.success("Order successfully placed!");

        for (let item of selectedItems) {
          const cartItemId = item.cartItemId;
          await axios
            .delete(`http://localhost:8080/api/cartItem/deleteCartItem/${cartItemId}`)
            .then((response) => {
              if (response.status === 200) {
                console.log(`Cart item ${cartItemId} removed from cart`);
              }
            })
            .catch((error) => {
              console.error(`Error removing cart item ${cartItemId}:`, error);
            });
        }

        clearState();

        navigate("/MyPurchases", { state: { orders: response.data } });
      } else {
        toast.error("Failed to place the order. Please try again.");
      }
    } catch (error) {
      console.error("Error placing the order:", error);
      toast.error("An error occurred while placing the order.");
    }
  };

  if (!user) {
    return <Typography variant="h6">Loading user data...</Typography>;
  }

  return (
    <ThemeProvider theme={theme}>
      <PageWrapper>
        <Toaster position="top-center" duration={2500} />
        <HeaderWrapper>
          <CartIcon src={cart} alt="Pet Icon" />
          <Typography
            variant="h3"
            component="h1"
            sx={{
              textAlign: "center",
              fontWeight: 700,
              color: "primary.main",
              textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            Checkout
          </Typography>
        </HeaderWrapper>

        <ScatteredPaws />

        <Box display="flex" justifyContent="flex-start">
          <IconButton color="primary" onClick={() => navigate(-1)} sx={{ marginBottom: 2 }}>
            <ArrowBackIcon />
          </IconButton>
        </Box>

        <Typography variant="h6" gutterBottom color="text.secondary" textAlign="center">
          Complete your purchase by reviewing your order and confirming your details.
        </Typography>

        <Grid container spacing={4}>
          {/* ORDER SUMMARY */}
          <Grid item xs={12} md={7}>
            <Paper elevation={4} sx={{ padding: 4, position: "relative", overflow: "hidden" }}>
              <PawPrint src={paw1} alt="Paw Print" sx={{ top: -20, left: -20 }} />
              <Typography variant="h5" gutterBottom color="primary.main">
                Order Summary
              </Typography>

              <List>
                {selectedItems.map((item, index) => (
                  <ListItem key={index}>
                    <Box
                      component="img"
                      src={item.product.productImage || imagePlaceholder}
                      alt={item.product.productName}
                      sx={{ width: 56, height: 56, objectFit: "contain", marginRight: 2, borderRadius: 1 }}
                    />
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" color="text.primary">
                          {item.product.productName}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          ₱{item.product.productPrice} x {item.quantity}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ marginY: 2 }} />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">Subtotal</Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  ₱{orderSummary.subtotal}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">Shipping Fee</Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  ₱{orderSummary.shippingFee}
                </Typography>
              </Box>
              <Divider sx={{ marginY: 2 }} />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6" color="primary.main">
                  Total
                </Typography>
                <Typography variant="h6" color="primary.main">
                  ₱{orderSummary.total}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* BILLING DETAILS */}
          <Grid item xs={12} md={5}>
            <Paper elevation={4} sx={{ padding: 4, position: "relative", overflow: "hidden" }}>
              <PawPrint src={paw1} alt="Paw Print" sx={{ bottom: -20, right: -20 }} />
              <Typography variant="h5" gutterBottom color="primary.main">
                Billing & Shipping Details
              </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" color="text.primary">
                      <strong>Full Name:</strong> {user.firstName} {user.lastName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" color="text.primary">
                      <strong>Email:</strong> {user.email}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" color="text.primary">
                      <strong>Address:</strong> {user.address?.streetBuildingHouseNo} {user.address?.barangay},{" "}
                      {user.address?.city} City, Region {user.address?.region}, {user.address?.postalCode}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{
                        fontSize: "1rem",
                        padding: 1.5,
                        mt: 2,
                        "&:hover": {
                          backgroundColor: "secondary.main",
                        },
                      }}
                    >
                      Place Order
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </PageWrapper>
    </ThemeProvider>
  );
};

export default CheckoutPage;
