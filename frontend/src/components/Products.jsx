import React, { useState, useEffect } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
} from "@mui/material";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";

import petIcon from "../assets/peticon.png";
import petBall from "../assets/petball.png";
import paw1 from "../assets/paw1.png";

const theme = createTheme({
  palette: {
    primary: {
      main: "#8670ffff",
<<<<<<< HEAD
      light: "#2600ffff",
=======
      light: "#D2B48C",
>>>>>>> 5ce4f3c8c86000d4ef24d867a2b5052d291cd4f9
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
          textAlign: "center",
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

const PetIcon = styled("img")({
  width: "60px",
  height: "60px",
  marginRight: "15px",
  animation: "float 3s ease-in-out infinite",
});

const PawPrint = styled("img")(({ theme }) => ({
  position: "absolute",
  width: "100px",
  height: "auto",
  opacity: 0.1,
  zIndex: -1,
}));

const ProductCategories = styled(ToggleButtonGroup)(({ theme }) => ({
  "& .MuiToggleButton-root": {
    margin: theme.spacing(0, 1),
    borderRadius: 20,
    borderColor: theme.palette.primary.main,
    "&.Mui-selected": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
}));

const Products = () => {
  const [products, setProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [productTypeFilter, setProductTypeFilter] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [visibleProducts, setVisibleProducts] = useState(16);
  const [itemQuantity, setItemQuantity] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/product/getProduct");
        console.log("Fetched products:", response.data);

        if (Array.isArray(response.data)) {
          const processedProducts = response.data.map((product) => ({
            productId: product.productID,
            productName: product.productName || "Unnamed Product",
            price: product.productPrice || 0,
            productImage: product.productImage || "",
            description: product.description || "No description available.",
            productType: product.productType || "Uncategorized",
            stock: product.quantity || 0,
          }));
          setProducts(processedProducts);
          setOriginalProducts(processedProducts);
        } else {
          console.warn("Unexpected response format:", response.data);
          setProducts([]);
          setOriginalProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const filterProducts = () => {
    let filteredProducts = originalProducts;

    if (productTypeFilter) {
      filteredProducts = filteredProducts.filter((product) => product.productType === productTypeFilter);
    }

    if (searchTerm) {
      filteredProducts = filteredProducts.filter((product) =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredProducts;
  };

  const handleProductTypeFilter = (event, newFilter) => {
    setProductTypeFilter(newFilter);
  };

  // const handleViewDetails = (product) => {
  //   setSelectedProduct(product);
  //   setItemQuantity(1);
  // };

  const handleViewDetails = (productId) => {
    navigate(`/productdetails/${productId}`);
  };

  const handleCloseDialog = () => {
    setSelectedProduct(null);
  };

  const handleLoadMore = () => {
    setVisibleProducts((prev) => prev + 8);
  };

  const handleAddToCart = async (selectedProduct, itemQuantity) => {
    const cartId = localStorage.getItem("id");
    if (!cartId) {
      toast.warning("User is not logged in. Please log in and try again");
      return;
    }
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
        productID: selectedProduct.productId,
      },
    };

    try {
      const cartResponse = await axios.get(`http://localhost:8080/api/cart/getCartById/${cartId}`);
      const existingCartItems = cartResponse.data.cartItems;

      const existingCartItem = existingCartItems.find((item) => item.product.productID === selectedProduct.productId);

      if (existingCartItem) {
        const updatedQuantity = existingCartItem.quantity + itemQuantity;
        if (updatedQuantity > selectedProduct.stock) {
          toast.error(
            `You already have ${existingCartItem.quantity} in your cart. Unable to add more as it would exceed the remaining stock`
          );
          return;
        }
        console.log(existingCartItem.cartItemId);
        await axios.put(`http://localhost:8080/api/cartItem/updateCartItem/${existingCartItem.cartItemId}`, {
          quantity: updatedQuantity,
        });

        toast.success(`Added ${itemQuantity} more of this item to the cart`);
      } else {
        const response = await axios.post("http://localhost:8080/api/cartItem/postCartItem", cartItem);

        console.log("Cart item added:", response.data);
        toast.success("Added to cart!");
      }
    } catch (error) {
      console.error("Error handling cart operation:", error);
      toast.error("Failed to add to cart. Please try again.");
    }
  };

  const filteredProducts = filterProducts();
  const displayedProducts = filteredProducts.slice(0, visibleProducts);

  const handleIncreaseQuantity = () => {
    setItemQuantity((prev) => Math.min(prev + 1, selectedProduct.stock));
  };

  const handleDecreaseQuantity = () => {
    setItemQuantity((prev) => Math.max(prev - 1, 1));
  };

  return (
    <ThemeProvider theme={theme}>
      <PageWrapper>
        <Toaster position="top-center" duration={2500} />
        <HeaderWrapper>
          <PetIcon src={petIcon} alt="Pet Icon" />
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
            Pawsome Products
          </Typography>
        </HeaderWrapper>

        <ScatteredPaws />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 4,
          }}
        >
          <TextField
            label="Search Products"
            variant="outlined"
            fullWidth
            sx={{
              maxWidth: 600,
              mb: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: 4,
              },
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <ProductCategories
            value={productTypeFilter}
            exclusive
            onChange={handleProductTypeFilter}
            aria-label="product type filters"
          >
            {["Toys", "Care Products", "Food", "Fur Clothing", "Accessory"].map((category) => (
              <ToggleButton key={category} value={category} aria-label={category}>
                {category}
              </ToggleButton>
            ))}
          </ProductCategories>
        </Box>

        <Grid container spacing={3} justifyContent="center">
          {displayedProducts.length > 0 ? (
            displayedProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.productId}>
                <Card sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "background.paper" }}>
                  <PawPrint src={paw1} alt="Paw Print" sx={{ top: -20, left: -20 }} />
                  <CardMedia
                    component="img"
                    height="150"
                    sx={{ objectFit: "contain", p: 2 }}
                    image={product.productImage || petBall}
                    alt={product.productName}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="div">
                      {product.productName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.productType}
                    </Typography>
                    <Typography variant="h6" color="primary.main" sx={{ mt: 2 }}>
                      ₱{product.price.toFixed(2)}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      variant="contained"
                      fullWidth
                      onClick={() => handleViewDetails(product.productId)}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ textAlign: "center" }}>
                No products found.
              </Typography>
            </Grid>
          )}
        </Grid>

        {displayedProducts.length < filteredProducts.length && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Button variant="contained" color="secondary" onClick={handleLoadMore}>
              Load More
            </Button>
          </Box>
        )}

        <Dialog
          open={Boolean(selectedProduct)}
          onClose={handleCloseDialog}
          fullWidth
          maxWidth="xl"
          PaperProps={{
            style: { height: "80vh" }, // Adjust height as needed
          }}
        >
          {selectedProduct && (
            <>
              <DialogTitle sx={{ textAlign: "center" }}>{selectedProduct.productName}</DialogTitle>
              <Divider />
              <DialogContent>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <CardMedia
                    component="img"
                    image={selectedProduct.productImage || petBall}
                    alt={selectedProduct.productName}
                    sx={{ width: 150, height: 150, objectFit: "contain", borderRadius: 2, mb: 2 }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {selectedProduct.productType}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2, textAlign: "center" }}>
                    {selectedProduct.description}
                  </Typography>
                  <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
                    ₱{selectedProduct.price.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Items available: {selectedProduct.stock}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
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
                    <IconButton onClick={handleIncreaseQuantity} disabled={itemQuantity >= selectedProduct.stock}>
                      <AddIcon />
                    </IconButton>
                  </Box>
                </Box>
              </DialogContent>
              <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
                <Button onClick={handleCloseDialog} color="secondary">
                  Close
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleAddToCart(selectedProduct, itemQuantity)}
                  disabled={selectedProduct && selectedProduct.stock <= 0}
                >
                  Add to Cart
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </PageWrapper>
    </ThemeProvider>
  );
};

export default Products;
