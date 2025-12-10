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
    primary: { main: "#63a4ff", light: "#95caff" },
    secondary: { main: "#FFA500" },
    background: { default: "#e6f0ff", paper: "#FFFFFF" },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const PageWrapper = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.light}20, ${theme.palette.background.default})`,
  minHeight: "100vh",
  padding: theme.spacing(4),
  position: "relative",
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
  // Cart state: each item has { productId, quantity, lastUpdated, product: { ...productData } }
  const [cartItems, setCartItem] = useState([]);
  // selectedItems holds productId values (numbers/strings) as unique keys
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [openDialog, setOpenDialog] = useState(false);
  const [openNoAddressDialog, setNoAddressDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [userId] = useState(localStorage.getItem("id"));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Loads cart -> then fetches product details per cart item
  const getCartItems = async () => {
    try {
      setLoading(true);
      const cartRes = await axios.get(`http://localhost:8080/api/cart/getCartById/${userId}`);
      const cartItemsData = cartRes.data.cartItems || [];

      // fetch product details for each productId
      const itemsWithProducts = await Promise.all(
        cartItemsData.map(async (item) => {
          try {
            const productRes = await axios.get(
              `http://localhost:8080/api/product/getProduct/${item.productId}`
            );
            return { ...item, product: productRes.data };
          } catch (err) {
            console.error(`Error fetching product ${item.productId}:`, err);
            // fallback product object (so UI does not crash)
            return {
              ...item,
              product: {
                productID: item.productId,
                productName: "Product not found",
                productPrice: 0,
                quantity: 0,
                productImage: "",
              },
            };
          }
        })
      );

      // sort by lastUpdated if present
      const sorted = itemsWithProducts.sort(
        (a, b) => new Date(b.lastUpdated || 0) - new Date(a.lastUpdated || 0)
      );

      setCartItem(sorted);
    } catch (err) {
      console.error("Error fetching cart items", err);
      toast.error("Error fetching cart items");
      setCartItem([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }
    getCartItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheckChange = (productId, isChecked) => {
    const updated = new Set(selectedItems);
    if (isChecked) updated.add(productId);
    else updated.delete(productId);
    setSelectedItems(updated);
  };

  const handleQuantityChange = (productId, newQuantity) => {
  const cartId = userId;

    axios
    .put(
      `http://localhost:8080/api/cart/${cartId}/items`,
      {},
      {
        params: {
          productId: productId,
          quantity: newQuantity,
        },
      }
    )
    .then(() => {
      setCartItem((prev) =>
        prev.map((it) =>
          it.productId === productId ? { ...it, quantity: newQuantity } : it
        )
      );
      toast.success("Quantity updated");
    })
    .catch((err) => {
      console.error("Error updating quantity:", err);
      toast.error("Error updating quantity.");
    });
};

  const handleDeleteItem = (productId) => {
    setProductToDelete(productId);
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
        if (!userAddress) {
          setNoAddressDialog(true);
          return;
        }

        const selectedItemsDetails = cartItems.filter((item) => selectedItems.has(item.productId));

        const orderSummary = {
          subtotal: getSubtotal(),
          shippingFee: getShippingFee(),
          total: getTotal(),
        };

        navigate("/checkout", { state: { selectedItems: selectedItemsDetails, orderSummary } });
      })
      .catch(() => toast.error("Unexpected error occurred. Please try again later"));
  };

  const handleConfirmDelete = () => {
    if (!productToDelete) return;

    axios.delete(
  `http://localhost:8080/api/cart/${userId}/items`,
  {
    params: {
      productId: productToDelete,
    },
  }
)
      .then(() => {
        setCartItem((prev) => prev.filter((item) => item.productId !== productToDelete));
        setSelectedItems((prev) => {
          const next = new Set(prev);
          next.delete(productToDelete);
          return next;
        });
        setOpenDialog(false);
        toast.success("Item removed from cart");
      })
      .catch((err) => {
        console.error("Failed to delete item:", err);
        toast.error("Failed to delete item from cart");
      });
  };

  const handleConfirmCreateAddress = () => navigate("/profile");

  const getSubtotal = () =>
    cartItems
      .filter((item) => selectedItems.has(item.productId))
      .reduce((total, item) => total + (item.product?.productPrice || 0) * item.quantity, 0)
      .toFixed(2);

  const getShippingFee = () => (parseFloat(getSubtotal()) === 0 ? "0.00" : "30.00");

  const getTotal = () =>
    parseFloat(getSubtotal()) === 0 ? "0.00" : (parseFloat(getSubtotal()) + 30).toFixed(2);

  return (
    <ThemeProvider theme={theme}>
      <Toaster position="top-center" duration={2500} />
      <PageWrapper>
        <HeaderWrapper>
          <CartIcon src={cart} alt="Cart Icon" />
          <Typography variant="h3" component="h1" sx={{ fontWeight: 700, color: "primary.main" }}>
            Your Shopping Cart
          </Typography>
        </HeaderWrapper>

        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={8}>
            <Card variant="outlined">
              <CardContent>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="right">Product</TableCell>
                      <TableCell align="right">Unit Price</TableCell>
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
                        key={item.productId ?? index}
                        price={item.product?.productPrice}
                        title={item.product?.productName}
                        quantity={item.quantity}
                        image={item.product?.productImage}
                        itemId={item.productId} // now productId is the identifier
                        isSelected={selectedItems.has(item.productId)}
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
