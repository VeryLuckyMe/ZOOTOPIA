import React from "react";
import { Box, Card, CardContent, Typography, Button } from "@mui/material";
import image from "../assets/peticon.png";
import { useNavigate } from "react-router-dom";

export default function EmptyCart() {
  const navigate = useNavigate();
  const handleClickToshop = () => {
    navigate("/products");
  };

  return (
    <Box
      sx={{
        minHeight: "400px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 400,
          padding: 4,
          boxShadow: 0,
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 3,
          }}
        >
          {/* Image */}
          <Box
            component="img"
            src={image}
            alt="Cat and Dog image"
            sx={{
              width: 160,
              height: 160,
              objectFit: "contain",
            }}
          />
          {/* Text */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "text.secondary",
            }}
          >
            You haven&apos;t added anything here
          </Typography>
          {/* Button */}
          <Button
            variant="contained"
            size="large"
            onClick={handleClickToshop}
            sx={{
              width: "100%",
              maxWidth: 200,
            }}
          >
            Go Shopping
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
