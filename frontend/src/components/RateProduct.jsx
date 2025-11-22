import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  CardMedia,
} from '@mui/material';
import axios from 'axios';
import { Toaster, toast } from 'sonner';
import { useParams } from 'react-router-dom';
import StarRating from './StarRating'; // Import the StarRating component

const RateProduct = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

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

    fetchProductDetails();
  }, [productId]);

  const handleRatingChange = (newValue) => {
    setRating(newValue);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
        toast.error('Please provide a star rating.');
        return;
    }

    const parsedProductId = parseInt(productId);
    const userId = localStorage.getItem("id");

    if (isNaN(parsedProductId) || parsedProductId <= 0 || isNaN(parseInt(userId)) || parseInt(userId) <= 0) {
        toast.error('Invalid product or user ID');
        return;
    }

    const review = {
        ratings: rating,
        comment: comment || "",
        product: {
            productID: parsedProductId
        },
        user: {
            id: parseInt(userId) // Ensure this matches the backend expectation
        }
    };

    console.log('Review Payload:', review);

    try {
        const response = await axios({
            method: 'POST',
            url: 'http://localhost:8080/api/review/postReview',
            data: review,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('Review submission response:', response);
        toast.success('Review submitted successfully!');
        setRating(0);
        setComment('');
    } catch (error) {
          console.error('Error submitting review:', error.response?.data || error.message);
          toast.error(error.response?.data?.message || 'Failed to submit review. Please try again.');
      }
  };

  
  if (!product) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ p: 4, maxWidth: 600, margin: 'auto' }}>
      <Toaster position="top-center" duration={2500}/>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Rate {product.productName}
          </Typography>
          <CardMedia
            component="img"
            sx={{ width: "100%", height: "auto", objectFit: "cover", mb: 2 }}
            image={product.productImage || "/placeholder-image.png"}
            alt={product.productName}
          />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography component="legend">Rating</Typography>
              <StarRating rating={rating} onRatingChange={handleRatingChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Comment"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Submit Review
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RateProduct;
