import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableHead,
  TableRow,
  TableCell,
} from "@mui/material";
import CartItem from "./CartItem";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import EmptyCart from "./EmptyCart";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";

import paw1 from "../assets/paw1.png";
import cart from "../assets/cart.png";

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
          backgroundColor: "#FFFFFF",
          position: "relative",
          overflow: "visible",
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

function Cart() {
  const [cartItems, setCartItem] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [openDialog, setOpenDialog] = useState(false);
  const [openNoAddressDialog, setNoAddressDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [userId, setUserId] = useState(localStorage.getItem("id"));
  const navigate = useNavigate();

  const getCartItems = () => {
    axios
      .get(`http://localhost:8080/api/cart/getCartById/${userId}`)
      .then((res) => {
        const updatedCartItems = res.data.cartItems.map((item) => {
          if (item.quantity > item.product.quantity) {
            axios
              .put(`http://localhost:8080/api/cartItem/systemUpdateCartItem/${item.cartItemId}`, {
                quantity: item.product.quantity,
              })
              .catch((err) => console.error("Error updating quantity:", err));

            return {
              ...item,
              quantity: item.product.quantity,
            };
          }
          return item;
        });

        const sortedCartItems = updatedCartItems.sort((a, b) => {
          return new Date(b.lastUpdated) - new Date(a.lastUpdated);
        });

        setCartItem(sortedCartItems);
      })
      .catch((err) => {
        console.error("Error fetching cart items", err);
        toast.error("Error fetching cart items");
      });
  };

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }
    getCartItems();
  }, []);

  const handleCheckChange = (itemId, isChecked) => {
    const updatedSelectedItems = new Set(selectedItems);
    if (isChecked) {
      updatedSelectedItems.add(itemId);
    } else {
      updatedSelectedItems.delete(itemId);
    }
    setSelectedItems(updatedSelectedItems);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    axios
      .put(`http://localhost:8080/api/cartItem/updateCartItem/${itemId}`, {
        quantity: newQuantity,
      })
      .then(() => {
        setCartItem((prevItems) =>
          prevItems.map((item) => (item.cartItemId === itemId ? { ...item, quantity: newQuantity } : item))
        );
      })
      .catch((err) => {
        console.error("Error updating quantity:", err);
        toast.error("Error updating quantity.");
      });
  };

  const handleDeleteItem = (itemId) => {
    setItemToDelete(itemId);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setNoAddressDialog(false);
  };

  const handleCheckoutClick = () => {
    if (selectedItems.size === 0) {
      toast.error("Please select items to checkout");
      return;
    }

    axios
      .get(`http://localhost:8080/auth/user/findById/${userId}`)
      .then((res) => {
        const userAddress = res.data?.address ?? null;

        if (userAddress === null) {
          setNoAddressDialog(true);
          return;
        }

        const selectedItemsDetails = cartItems.filter((item) => selectedItems.has(item.cartItemId));

        const orderSummary = {
          subtotal: getSubtotal(),
          shippingFee: getShippingFee(),
          total: getTotal(),
        };

        navigate("/checkout", {
          state: { selectedItems: selectedItemsDetails, orderSummary },
        });
      })
      .catch((err) => {
        console.error("Cart: error fetching address", err);
        toast.error("Unexpected error occurred. Please try again later");
      });
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      axios
        .delete(`http://localhost:8080/api/cartItem/deleteCartItem/${itemToDelete}`)
        .then(() => {
          setCartItem((prevItems) => prevItems.filter((item) => item.cartItemId !== itemToDelete));
          setOpenDialog(false);
          toast.success("Item removed from cart");
        })
        .catch((err) => {
          console.error("Error deleting item:", err);
          setOpenDialog(false);
          toast.error("Failed to delete item from cart");
        });
    }
  };

  const handleConfirmCreateAddress = () => {
    navigate("/profile");
  };

  const getSubtotal = () => {
    return cartItems
      .filter((item) => selectedItems.has(item.cartItemId))
      .reduce((total, item) => total + item.product.productPrice * item.quantity, 0)
      .toFixed(2);
  };

  const getTotal = () => {
    const subtotal = parseFloat(getSubtotal());
    if (subtotal == 0) {
      return "0.00";
    }
    return (subtotal + 30).toFixed(2);
  };

  const getShippingFee = () => {
    const subtotal = parseFloat(getSubtotal());
    if (subtotal == 0) {
      return "0.00";
    }
    return "30.00";
  };

  return (
    <ThemeProvider theme={theme}>
      <Toaster position="top-center" duration={2500} />
      <PageWrapper>
        <HeaderWrapper>
          <CartIcon src={cart} alt="Cart Icon" />
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
            Your Shopping Cart
          </Typography>
        </HeaderWrapper>

        <ScatteredPaws />

        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={8}>
            <Card variant="outlined">
              <CardContent>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="right">Product</TableCell>
                      <TableCell align="right" sx={{ marginLeft: "px" }}>
                        Unit Price
                      </TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                </Table>
                {cartItems.length === 0 ? (
                  <EmptyCart />
                ) : (
                  <Grid container spacing={2}>
                    {cartItems.map((item, index) => (
                      <CartItem
                        key={index}
                        price={item.product?.productPrice}
                        title={item.product?.productName}
                        quantity={item.quantity}
                        image={item.product?.productImage}
                        itemId={item.cartItemId}
                        isSelected={selectedItems.has(item.cartItemId)}
                        onCheckChange={handleCheckChange}
                        onQuantityChange={handleQuantityChange}
                        onDelete={handleDeleteItem}
                        availableStock={item.product?.quantity}
                      />
                    ))}
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card variant="outlined" sx={{ position: "sticky", top: "140px" }}>
              <PawPrint src={paw1} alt="Paw Print" sx={{ top: -20, right: -20 }} />
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Order Summary
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1">
                  Subtotal ({selectedItems.size} item/s): ₱{getSubtotal()}
                </Typography>
                <Typography variant="body1">Shipping Fee: ₱{getShippingFee()}</Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6">Total: ₱{getTotal()}</Typography>
                <Typography variant="caption" color="text.secondary">
                  VAT included, where applicable
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={handleCheckoutClick}
                  disabled={selectedItems.size === 0}
                >
                  PROCEED TO CHECKOUT
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to remove this item from your cart?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} color="secondary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openNoAddressDialog} onClose={handleDialogClose}>
          <DialogTitle>No Address Yet</DialogTitle>
          <DialogContent>
            <Typography>Add address to your profile?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmCreateAddress} color="secondary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </PageWrapper>
    </ThemeProvider>
  );
}

export default Cart;
