import React, { useState, useEffect } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
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
  Chip,
  InputAdornment,
  Fade,
  Zoom,
} from "@mui/material";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import { keyframes } from "@mui/system";

import petIcon from "../assets/peticon.png";
import petBall from "../assets/petball.png";
import paw1 from "../assets/paw1.png";

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
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: "none",
          fontWeight: 600,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          border: "1px solid rgba(134, 112, 255, 0.1)",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: "0 12px 40px rgba(134, 112, 255, 0.2)",
          },
        },
      },
    },
  },
});

// Animations
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.25; }
  50% { transform: scale(1.05); opacity: 0.35; }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ScatteredPaws = ({ count = 12 }) => {
  const positions = [
    { top: "5%", left: "3%", delay: "0s" },
    { top: "10%", right: "5%", delay: "0.5s" },
    { bottom: "15%", left: "7%", delay: "1s" },
    { bottom: "10%", right: "3%", delay: "1.5s" },
    { top: "20%", left: "10%", delay: "2s" },
    { bottom: "25%", right: "10%", delay: "2.5s" },
    { top: "30%", left: "2%", delay: "3s" },
    { bottom: "5%", right: "15%", delay: "3.5s" },
    { top: "15%", right: "12%", delay: "4s" },
    { bottom: "20%", left: "15%", delay: "4.5s" },
    { top: "50%", right: "8%", delay: "5s" },
    { bottom: "40%", left: "5%", delay: "5.5s" },
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
            width: "35px",
            height: "35px",
            opacity: 0.25,
            zIndex: 0,
            animation: `${pulse} 4s ease-in-out infinite`,
            animationDelay: pos.delay,
            pointerEvents: "none",
            ...pos,
          }}
        />
      ))}
    </>
  );
};

const PageWrapper = styled(Box)(({ theme }) => ({
  background: theme.palette.background.default,
  minHeight: "100vh",
  padding: theme.spacing(4),
  position: "relative",
  overflow: "hidden",
}));

const HeaderWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: theme.spacing(5),
  animation: `${fadeInUp} 0.8s ease-out`,
}));

const PetIcon = styled("img")({
  width: "70px",
  height: "70px",
  marginRight: "20px",
  animation: `${float} 4s ease-in-out infinite`,
  filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))",
});

const ProductCategories = styled(ToggleButtonGroup)(({ theme }) => ({
  flexWrap: "wrap",
  justifyContent: "center",
  gap: theme.spacing(1),
  "& .MuiToggleButton-root": {
    margin: theme.spacing(0.5),
    borderRadius: 24,
    padding: "8px 24px",
    border: `2px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main,
    fontWeight: 600,
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: `${theme.palette.primary.main}15`,
      transform: "translateY(-2px)",
    },
    "&.Mui-selected": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
      border: `2px solid ${theme.palette.primary.main}`,
      "&:hover": {
        backgroundColor: theme.palette.primary.light,
      },
    },
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.background.paper,
  position: "relative",
  overflow: "visible",
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

  const handleViewDetails = (productId) => {
    navigate(`/productdetails/${productId}`);
  };

  const handleCloseDialog = () => {
    setSelectedProduct(null);
    setItemQuantity(1);
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
      handleCloseDialog();
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
        <Toaster position="top-center" duration={2500} richColors />
        <ScatteredPaws />

        {/* Header Section */}
        <HeaderWrapper>
          <PetIcon src={petIcon} alt="Pet Icon" />
          <Box>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                textAlign: "center",
                fontWeight: 800,
                color: "primary.main",
                fontSize: { xs: "2rem", md: "2.5rem" },
                letterSpacing: "-0.02em",
                mb: 0.5,
              }}
            >
              Pawsome Products
            </Typography>
            <Typography
              variant="body1"
              sx={{
                textAlign: "center",
                color: "text.secondary",
                fontWeight: 500,
              }}
            >
              Discover amazing products for your furry friends
            </Typography>
          </Box>
        </HeaderWrapper>

        {/* Search and Filter Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 5,
            position: "relative",
            zIndex: 1,
          }}
        >
          <TextField
            placeholder="Search for products..."
            variant="outlined"
            fullWidth
            sx={{
              maxWidth: 700,
              mb: 4,
              "& .MuiOutlinedInput-root": {
                borderRadius: 4,
                backgroundColor: "white",
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 4px 20px rgba(134, 112, 255, 0.15)",
                },
                "&.Mui-focused": {
                  boxShadow: "0 4px 20px rgba(134, 112, 255, 0.25)",
                },
              },
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "primary.main" }} />
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ mb: 2 }}>
            <Typography
              variant="body2"
              sx={{
                textAlign: "center",
                color: "text.secondary",
                mb: 2,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontSize: "0.75rem",
              }}
            >
              Filter by Category
            </Typography>
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

          {productTypeFilter && (
            <Chip
              label={`Showing: ${productTypeFilter}`}
              onDelete={() => setProductTypeFilter(null)}
              color="primary"
              sx={{ mt: 2, fontWeight: 600 }}
            />
          )}
        </Box>

        {/* Products Grid */}
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Grid container spacing={3} justifyContent="center">
            {displayedProducts.length > 0 ? (
              displayedProducts.map((product, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.productId}>
                  <Zoom in={true} style={{ transitionDelay: `${index * 50}ms` }}>
                    <StyledCard>
                      <Box
                        sx={{
                          position: "relative",
                          paddingTop: "75%",
                          overflow: "hidden",
                          backgroundColor: "#F8F9FE",
                          borderRadius: "20px 20px 0 0",
                        }}
                      >
                        <CardMedia
                          component="img"
                          image={product.productImage || petBall}
                          alt={product.productName}
                          sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            height: "75%",
                            width: "75%",
                            objectFit: "contain",
                            transition: "transform 0.4s ease",
                            "&:hover": {
                              transform: "translate(-50%, -50%) scale(1.08)",
                            },
                          }}
                        />
                        {product.stock <= 5 && product.stock > 0 && (
                          <Chip
                            label="Low Stock"
                            size="small"
                            sx={{
                              position: "absolute",
                              top: 12,
                              right: 12,
                              backgroundColor: "#ff9800",
                              color: "white",
                              fontWeight: 600,
                            }}
                          />
                        )}
                        {product.stock === 0 && (
                          <Chip
                            label="Out of Stock"
                            size="small"
                            sx={{
                              position: "absolute",
                              top: 12,
                              right: 12,
                              backgroundColor: "#f44336",
                              color: "white",
                              fontWeight: 600,
                            }}
                          />
                        )}
                      </Box>

                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Chip
                          label={product.productType}
                          size="small"
                          sx={{
                            mb: 1.5,
                            backgroundColor: `${theme.palette.primary.main}15`,
                            color: theme.palette.primary.main,
                            fontWeight: 600,
                            fontSize: "0.7rem",
                          }}
                        />
                        <Typography
                          gutterBottom
                          variant="h6"
                          component="div"
                          sx={{
                            fontWeight: 600,
                            fontSize: "1.1rem",
                            minHeight: "2.6em",
                            lineHeight: 1.3,
                            color: "text.primary",
                          }}
                        >
                          {product.productName}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "baseline", mt: 2 }}>
                          <Typography
                            variant="h5"
                            sx={{
                              fontWeight: 700,
                              color: "primary.main",
                            }}
                          >
                            ₱{product.price.toFixed(2)}
                          </Typography>
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "text.secondary",
                            display: "block",
                            mt: 1,
                          }}
                        >
                          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                        </Typography>
                      </CardContent>

                      <CardActions sx={{ p: 2, pt: 0 }}>
                        <Button
                          size="medium"
                          color="primary"
                          variant="contained"
                          fullWidth
                          onClick={() => handleViewDetails(product.productId)}
                          disabled={product.stock === 0}
                          sx={{
                            py: 1.2,
                            fontSize: "0.95rem",
                            boxShadow: "0 4px 12px rgba(134, 112, 255, 0.3)",
                            "&:hover": {
                              boxShadow: "0 6px 20px rgba(134, 112, 255, 0.4)",
                            },
                          }}
                        >
                          View Details
                        </Button>
                      </CardActions>
                    </StyledCard>
                  </Zoom>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Box
                  sx={{
                    textAlign: "center",
                    py: 8,
                    backgroundColor: "white",
                    borderRadius: 4,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  }}
                >
                  <Typography variant="h6" sx={{ color: "text.secondary", mb: 1 }}>
                    No products found
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Try adjusting your search or filters
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>

        {/* Load More Button */}
        {displayedProducts.length < filteredProducts.length && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 6, position: "relative", zIndex: 1 }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={handleLoadMore}
              sx={{
                px: 5,
                py: 1.5,
                fontSize: "1rem",
                boxShadow: "0 4px 12px rgba(55, 53, 179, 0.3)",
                "&:hover": {
                  boxShadow: "0 6px 20px rgba(55, 53, 179, 0.4)",
                },
              }}
            >
              Load More Products
            </Button>
          </Box>
        )}

        {/* Product Details Dialog */}
        <Dialog
          open={Boolean(selectedProduct)}
          onClose={handleCloseDialog}
          fullWidth
          maxWidth="md"
          TransitionComponent={Fade}
          PaperProps={{
            sx: {
              borderRadius: 4,
              maxHeight: "90vh",
            },
          }}
        >
          {selectedProduct && (
            <>
              <DialogTitle
                sx={{
                  textAlign: "center",
                  fontWeight: 700,
                  fontSize: "1.5rem",
                  color: "primary.main",
                  pb: 2,
                }}
              >
                {selectedProduct.productName}
              </DialogTitle>
              <Divider />
              <DialogContent sx={{ py: 4 }}>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={5}>
                    <Box
                      sx={{
                        position: "relative",
                        paddingTop: "100%",
                        backgroundColor: "#F8F9FE",
                        borderRadius: 3,
                        overflow: "hidden",
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={selectedProduct.productImage || petBall}
                        alt={selectedProduct.productName}
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          height: "80%",
                          width: "80%",
                          objectFit: "contain",
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={7}>
                    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                      <Chip
                        label={selectedProduct.productType}
                        sx={{
                          mb: 2,
                          alignSelf: "flex-start",
                          backgroundColor: `${theme.palette.primary.main}15`,
                          color: theme.palette.primary.main,
                          fontWeight: 600,
                        }}
                      />
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 700,
                          color: "primary.main",
                          mb: 3,
                        }}
                      >
                        ₱{selectedProduct.price.toFixed(2)}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          mb: 3,
                          lineHeight: 1.7,
                          color: "text.secondary",
                        }}
                      >
                        {selectedProduct.description}
                      </Typography>
                      <Box
                        sx={{
                          backgroundColor: "#F8F9FE",
                          borderRadius: 2,
                          p: 2,
                          mb: 3,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          <strong>Availability:</strong>{" "}
                          {selectedProduct.stock > 0 ? (
                            <span style={{ color: theme.palette.primary.main }}>
                              {selectedProduct.stock} items available
                            </span>
                          ) : (
                            <span style={{ color: "#f44336" }}>Out of Stock</span>
                          )}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 600, color: "text.primary" }}>
                          Quantity
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              border: "2px solid",
                              borderColor: "primary.main",
                              borderRadius: 3,
                              overflow: "hidden",
                            }}
                          >
                            <IconButton
                              onClick={handleDecreaseQuantity}
                              disabled={itemQuantity <= 1}
                              sx={{
                                borderRadius: 0,
                                color: "primary.main",
                                "&:hover": {
                                  backgroundColor: `${theme.palette.primary.main}10`,
                                },
                              }}
                            >
                              <RemoveIcon />
                            </IconButton>
                            <TextField
                              variant="standard"
                              size="small"
                              value={itemQuantity}
                              inputProps={{
                                style: { textAlign: "center", fontWeight: 600 },
                                readOnly: true,
                              }}
                              sx={{
                                width: 60,
                                "& .MuiInput-underline:before": { borderBottom: "none" },
                                "& .MuiInput-underline:after": { borderBottom: "none" },
                                "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                                  borderBottom: "none",
                                },
                              }}
                            />
                            <IconButton
                              onClick={handleIncreaseQuantity}
                              disabled={itemQuantity >= selectedProduct.stock}
                              sx={{
                                borderRadius: 0,
                                color: "primary.main",
                                "&:hover": {
                                  backgroundColor: `${theme.palette.primary.main}10`,
                                },
                              }}
                            >
                              <AddIcon />
                            </IconButton>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            Max: {selectedProduct.stock}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </DialogContent>
              <Divider />
              <DialogActions sx={{ justifyContent: "space-between", px: 3, py: 2.5 }}>
                <Button onClick={handleCloseDialog} color="secondary" size="large">
                  Close
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<ShoppingCartIcon />}
                  onClick={() => handleAddToCart(selectedProduct, itemQuantity)}
                  disabled={selectedProduct && selectedProduct.stock <= 0}
                  sx={{
                    px: 4,
                    boxShadow: "0 4px 12px rgba(134, 112, 255, 0.3)",
                    "&:hover": {
                      boxShadow: "0 6px 20px rgba(134, 112, 255, 0.4)",
                    },
                  }}
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