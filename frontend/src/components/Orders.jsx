import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Divider,
  CircularProgress,
  createTheme,
  ThemeProvider,
  styled,
} from "@mui/material";

import order from '../assets/order.png';
import paw1 from '../assets/paw1.png';

const theme = createTheme({
  palette: {
    primary: {
      main: '#8B4513',
      light: '#D2B48C',
    },
    secondary: {
      main: '#FFA500',
    },
    background: {
      default: '#FFF5E6',
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
          borderRadius: 16,
          boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
          transition: 'transform 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
          },
        },
      },
    },
  },
});

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

const PageWrapper = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.light}20, ${theme.palette.background.default})`,
  minHeight: '100vh',
  padding: theme.spacing(4),
}));

const HeaderWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(4),
}));

const OrderIcon = styled('img')({
  width: '60px',
  height: '60px',
  marginRight: '15px',
});

const PawPrint = styled('img')(({ theme }) => ({
  position: 'absolute',
  width: '100px',
  height: 'auto',
  opacity: 0.1,
  zIndex: 0,
}));

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('id');
    axios
      .get(`http://localhost:8080/api/order/getAllOrdersByUserId`, {
        params: { userId },
      })
      .then((response) => {
        console.log("Orders fetched from backend:", response.data);
        setOrders(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setLoading(false);
      });
}, []);

  const calculateTotal = (items) => {
    const shippingFee = 30;
    let itemsTotal = 0;

    if (items) {
      items.forEach((item) => {
        console.log("Item details in calculateTotal:", item);
        if (item.price && item.quantity) {
          itemsTotal += item.price * item.quantity;
          console.log("Item price:", item.price);
          console.log("Item quantity:", item.quantity);
        }
      });
    }

    return itemsTotal + shippingFee;
  };

  return (
    <ThemeProvider theme={theme}>
      <PageWrapper>
        <HeaderWrapper>
          <OrderIcon src={order} alt="Order Icon" />
          <Typography
            variant="h3"
            component="h1"
            sx={{ 
              textAlign: "center", 
              fontWeight: 700, 
              color: 'primary.main',
              textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
            }}
          >
            My Orders
          </Typography>
        </HeaderWrapper>

        <ScatteredPaws />

        <Box sx={{ maxWidth: 800, margin: 'auto' }}>
          {loading ? (
            <Box textAlign="center">
              <CircularProgress />
              <Typography mt={2}>Loading orders...</Typography>
            </Box>
          ) : orders.length === 0 ? (
            <Typography textAlign="center">No orders available.</Typography>
          ) : (
            orders.map((order) => {
              console.log("Order data:", order);
              const total = calculateTotal(order.orderItems || []);

              return (
                <Card
                  key={order.orderID}
                  sx={{
                    mb: 4,
                    p: 3,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <PawPrint src={paw1} alt="Paw Print" sx={{ top: -20, right: -20 }} />
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Typography variant="h6" color="primary.main">
                      {order.orderDate}
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        color:
                          order.status === "DELIVERED"
                            ? "green"
                            : order.status === "SHIPPED"
                            ? "orange"
                            : "red",
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        padding: '4px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      {order.orderStatus}
                    </Typography>
                  </Box>

                  <CardContent>
                    {order.orderItems && order.orderItems.length > 0 ? (
                      order.orderItems.map((item, index) => (
                        <Box
                          key={index}
                          display="flex"
                          alignItems="center"
                          sx={{
                            mb: 2,
                            pb: 2,
                            borderBottom: index !== order.orderItems.length - 1 ? "1px solid #ddd" : "none",
                          }}
                        >
                          <CardMedia
                            component="img"
                            image={item.orderItemImage}
                            alt={item.orderItemName}
                            sx={{
                              width: 80,
                              height: 80,
                              objectFit: "cover",
                              borderRadius: 2,
                              mr: 2,
                            }}
                          />
                          <Box flex={1}>
                            <Typography color="text.primary" fontWeight="bold">
                              {item.orderItemName}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                            >
                              Quantity: {item.quantity}
                            </Typography>
                          </Box>
                          <Typography
                            fontWeight="bold"
                            color="primary.main"
                          >
                            ₱{item.price.toFixed(2)}
                          </Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography>No items available for this order.</Typography>
                    )}
                  </CardContent>

                  <Box
                    display="flex"
                    justifyContent="space-between"
                    mt={2}
                  >
                    <Typography color="text.secondary">Shipping Fee</Typography>
                    <Typography fontWeight="bold">₱30.00</Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="h6" fontWeight="bold">Total</Typography>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      color="primary.main"
                    >
                      ₱{total.toFixed(2)}
                    </Typography>
                  </Box>

                  <Box textAlign="right" mt={3}>
                    <Link
                      to={`/MyPurchases/${order.orderID}`}
                      style={{ textDecoration: "none" }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{
                          '&:hover': {
                            backgroundColor: "secondary.main",
                          },
                          height: "50px",
                          width: "140px",
                          fontSize: "16px"
                        }}
                      >
                        View Order
                      </Button>
                    </Link>
                  </Box>
                </Card>
              );
            })
          )}
        </Box>
      </PageWrapper>
    </ThemeProvider>
  );
}

export default OrderList;