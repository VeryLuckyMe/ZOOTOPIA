import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import axios from "axios";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    description: "",
    productName: "",
    productPrice: "",
    productType: "",
    quantity: "",
    productImage: null,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/product/getProduct");
      console.log("Fetched products:", response.data);

      if (Array.isArray(response.data)) {
        const productsWithImages = response.data.map((product) => ({
          ...product,
          productImage: product.productImage || "",
        }));
        setProducts(productsWithImages);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleImageUpload = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEdit) {
          setSelectedProduct((prev) => ({
            ...prev,
            productImage: reader.result,
          }));
        } else {
          setNewProduct((prev) => ({
            ...prev,
            productImage: reader.result,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateProduct = async () => {
    try {
      const payload = {
        ...newProduct,
        productPrice: parseFloat(newProduct.productPrice),
        quantity: parseInt(newProduct.quantity, 10),
      };
      console.log("Sending product payload:", payload);

      const response = await axios.post("http://localhost:8080/api/product/postProduct", payload);

      if (response.status === 200 || response.status === 201) {
        console.log("Product created successfully:", response.data);
        fetchProducts();
        resetProductForm();
        setOpenProductDialog(false);
      } else {
        console.error("Failed to create product:", response);
      }
    } catch (error) {
      console.error("Error creating product:", error.response || error.message);
    }
  };

  const handleUpdateProduct = async () => {
    try {
      console.log("Selected Product for Update:", selectedProduct);

      const payload = {
        ...selectedProduct,
        productPrice: parseFloat(selectedProduct.productPrice),
        quantity: parseInt(selectedProduct.quantity, 10),
      };

      console.log("Updating product with payload:", payload);

      const response = await axios.put(
        `http://localhost:8080/api/product/putProduct/${selectedProduct.productID}`,
        payload
      );

      console.log("Response for Product Update:", response);

      if (response.status === 200) {
        console.log("Product updated successfully:", response.data);
        fetchProducts();
        setOpenEditDialog(false);
        setSelectedProduct(null);
      } else {
        console.error("Failed to update product:", response);
      }
    } catch (error) {
      console.error("Error updating product:", error.response || error.message);
    }
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      console.log("Attempting to delete product with ID:", productToDelete.productID);

      const response = await axios.delete(
        `http://localhost:8080/api/product/deleteProduct/${productToDelete.productID}`
      );

      if (response.status === 200 || response.status === 204) {
        console.log("Product deleted successfully");
        fetchProducts();
        setOpenDeleteConfirmDialog(false);
        setProductToDelete(null);
      } else {
        console.error("Failed to delete product:", response);
      }
    } catch (error) {
      console.error("Error deleting product:", error.response || error.message);
    }
  };

  const resetProductForm = () => {
    setNewProduct({
      productId: "",
      description: "",
      productName: "",
      productPrice: "",
      productType: "",
      quantity: "",
    });
  };

  const openDeleteConfirmationDialog = (product) => {
    setProductToDelete(product);
    setOpenDeleteConfirmDialog(true);
  };

  return (
    <Box sx={{ padding: 4, height: "100vh" }}>
      <Typography variant="h4" gutterBottom>
        Inventory Management
      </Typography>

      <Box sx={{ display: "flex", gap: 2, marginBottom: 4 }}>
        <Button variant="contained" color="primary" onClick={() => setOpenProductDialog(true)}>
          Create New Product
        </Button>
      </Box>

      {/* Product Dialog */}
      <Dialog open={openProductDialog} onClose={() => setOpenProductDialog(false)}>
        <DialogTitle>Create New Product</DialogTitle>
        <DialogContent>
          <TextField
            label="Product Name"
            fullWidth
            margin="dense"
            value={newProduct.productName}
            onChange={(e) => setNewProduct({ ...newProduct, productName: e.target.value })}
          />
          <TextField
            label="Description"
            fullWidth
            margin="dense"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          />
          <TextField
            label="Price"
            type="number"
            fullWidth
            margin="dense"
            value={newProduct.productPrice}
            onChange={(e) => setNewProduct({ ...newProduct, productPrice: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Product Type</InputLabel>
            <Select
              value={newProduct.productType}
              onChange={(e) => setNewProduct({ ...newProduct, productType: e.target.value })}
            >
              <MenuItem value="Toys">Toys</MenuItem>
              <MenuItem value="Fur Clothing">Fur Clothing</MenuItem>
              <MenuItem value="Care Products">Care Products</MenuItem>
              <MenuItem value="Food">Food</MenuItem>
              <MenuItem value="Accessory">Accessory</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Quantity"
            type="number"
            fullWidth
            margin="dense"
            value={newProduct.quantity}
            onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
          />
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="raised-button-file"
            type="file"
            onChange={handleImageUpload}
          />
          <label htmlFor="raised-button-file">
            <Button variant="contained" component="span" sx={{ marginTop: 2 }}>
              Upload Product Image
            </Button>
          </label>
          {newProduct.productImage && (
            <img
              src={newProduct.productImage}
              alt="Product Preview"
              style={{ maxWidth: 200, maxHeight: 200, marginTop: 10 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenProductDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateProduct} color="primary" variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <TextField
            label="Product Name"
            fullWidth
            margin="dense"
            value={selectedProduct?.productName || ""}
            onChange={(e) =>
              setSelectedProduct({
                ...selectedProduct,
                productName: e.target.value,
              })
            }
          />
          <TextField
            label="Description"
            fullWidth
            margin="dense"
            value={selectedProduct?.description || ""}
            onChange={(e) =>
              setSelectedProduct({
                ...selectedProduct,
                description: e.target.value,
              })
            }
          />
          <TextField
            label="Price"
            type="number"
            fullWidth
            margin="dense"
            value={selectedProduct?.productPrice || ""}
            onChange={(e) =>
              setSelectedProduct({
                ...selectedProduct,
                productPrice: e.target.value,
              })
            }
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Product Type</InputLabel>
            <Select
              value={selectedProduct?.productType || ""}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  productType: e.target.value,
                })
              }
            >
              <MenuItem value="Toys">Toys</MenuItem>
              <MenuItem value="Care Products">Care Products</MenuItem>
              <MenuItem value="Fur Clothing">Fur Clothing</MenuItem>
              <MenuItem value="Food">Food</MenuItem>
              <MenuItem value="Accessory">Accessory</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Quantity"
            type="number"
            fullWidth
            margin="dense"
            value={selectedProduct?.quantity || ""}
            onChange={(e) =>
              setSelectedProduct({
                ...selectedProduct,
                quantity: e.target.value,
              })
            }
          />
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="raised-button-file-edit"
            type="file"
            onChange={(e) => handleImageUpload(e, true)}
          />
          <label htmlFor="raised-button-file-edit">
            <Button variant="contained" component="span" sx={{ marginTop: 2 }}>
              Update Product Image
            </Button>
          </label>
          {selectedProduct?.productImage && (
            <img
              src={selectedProduct.productImage}
              alt="Product Preview"
              style={{ maxWidth: 200, maxHeight: 200, marginTop: 10 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateProduct} color="primary" variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Product Table */}
      <Typography variant="h5" gutterBottom sx={{ marginTop: 4 }}>
        Products
      </Typography>
      <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product ID</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Sold</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length > 0 ? (
              products.map((product) => (
                <TableRow key={product.productID}>
                  <TableCell>{product.productID}</TableCell>
                  <TableCell>
                    {product.productImage ? (
                      <img
                        src={product.productImage}
                        alt={product.productName}
                        style={{
                          width: 50,
                          height: 50,
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      "No Image"
                    )}
                  </TableCell>
                  <TableCell>{product.productName}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>{product.productPrice}</TableCell>
                  <TableCell>{product.productType}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>{product.quantitySold}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setSelectedProduct(product);
                        setOpenEditDialog(true);
                      }}
                      sx={{ marginRight: 1 }}
                    >
                      Edit
                    </Button>
                    <Button variant="contained" color="secondary" onClick={() => openDeleteConfirmationDialog(product)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No products available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteConfirmDialog} onClose={() => setOpenDeleteConfirmDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this product?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteConfirmDialog(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteProduct} // Call the delete handler here
            color="secondary"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Inventory;
