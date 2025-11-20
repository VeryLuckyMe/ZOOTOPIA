import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Divider,
  IconButton,
  createTheme,
  ThemeProvider,
  styled,
  Button,
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import order from "../assets/order.png";
import paw1 from "../assets/paw1.png";

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
    MuiCard: {
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
  zIndex: 0,
}));

const OrderDetails = () => {
  const { orderID } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("id");
    if (!userId) {
      navigate("/");
      return;
    }
    if (orderID) {
      axios
        .get(`http://localhost:8080/api/order/getOrderDetails/${orderID}`)
        .then((response) => {
          setOrderDetails(response.data);
        })
        .catch((error) => {
          console.error("Error fetching order details:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [orderID, navigate]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!orderDetails) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h5" color="error">
          Order not found.
        </Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <PageWrapper>
        <HeaderWrapper>
          <CartIcon src={order} alt="Pet Icon" />
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
            Order Details
          </Typography>
        </HeaderWrapper>

        <ScatteredPaws />

        <Box maxWidth="800px" mx="auto">
          <Box display="flex" alignItems="center" gap={2} mb={4}>
            <IconButton onClick={() => navigate(-1)} color="primary">
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" fontWeight="bold" color="primary.main">
              Order #{orderDetails.orderID}
            </Typography>
          </Box>

          <Box
            sx={{
              backgroundColor: "background.paper",
              padding: 3,
              borderRadius: 2,
              boxShadow: 1,
              mb: 4,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <PawPrint src={paw1} alt="Paw Print" sx={{ top: -20, right: -20 }} />
            <Card sx={{ mb: 3, borderRadius: 2 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
                      Order ID:
                    </Typography>
                    <Typography>{orderDetails.orderID}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
                      Order Date:
                    </Typography>
                    <Typography>{orderDetails.orderDate}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 2,
                        backgroundColor: "rgba(139, 69, 19, 0.1)",
                        padding: "8px",
                        borderRadius: 2,
                        color: "primary.main",
                      }}
                    >
                      <LocalShippingIcon />
                      Status: {orderDetails.orderStatus}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sx={{ mt: 2 }}>
                    <Typography variant="h6" fontWeight="bold" color="primary.main">
                      Delivery Address
                    </Typography>
                    <Typography variant="body2">
                      <strong>Name:</strong> {orderDetails.user.firstName} {orderDetails.user.lastName}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Email:</strong> {orderDetails.user.email}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Address:</strong> {orderDetails.user.address.streetBuildingHouseNo}{" "}
                      {orderDetails.user.address.barangay}, {orderDetails.user.address.city} City,{" "}
                      {orderDetails.user.address.province}, Region {orderDetails.user.address.region},{" "}
                      {orderDetails.user.address.postalCode}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight="bold" mb={2} color="primary.main">
                Order Items
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {orderDetails.orderItems.map((item, index) => (
                <Box
                  key={index}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={2}
                  sx={{ backgroundColor: "background.default", padding: 2, borderRadius: 2 }}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <img
                      src={item.orderItemImage}
                      alt={item.orderItemName}
                      style={{ width: 60, height: 60, borderRadius: 8, objectFit: "cover" }}
                    />
                    <Box>
                      <Typography variant="body1" fontWeight="bold" color="primary.main">
                        {item.orderItemName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Quantity: {item.quantity}
                      </Typography>
                    </Box>
                  </Box>
                  <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1}>
                    <Typography variant="body1" fontWeight="bold" color="primary.main">
                      ₱{item.price.toFixed(2)}
                    </Typography>

                    {/* {orderDetails.orderStatus === "Completed" && item.rated === false && (
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => navigate(`/rate-product/${item.productId}`, { state: item })}
                      >
                        Rate Product
                      </Button>
                    )} */}

                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => navigate(`/rate-product/${item.productId}`)}
                    >
                      Rate Product
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>

            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography color="text.secondary">Shipping Fee</Typography>
                  <Typography fontWeight="bold">₱30.00</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box display="flex" justifyContent="space-between" fontWeight="bold">
                  <Typography variant="h6" color="primary.main">
                    Total
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary.main">
                    ₱{orderDetails.totalPrice.toFixed(2)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </PageWrapper>
    </ThemeProvider>
  );
};

export default OrderDetails;
