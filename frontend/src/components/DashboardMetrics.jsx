import React, { useEffect } from "react";
import axios from "axios";
import { Grid, Paper, Typography } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";
import EventIcon from "@mui/icons-material/Event";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import StarIcon from "@mui/icons-material/Star";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

const Metric = ({ title, value, icon }) => (
  <Paper
    sx={{
      p: 2,
      display: "flex",
      flexDirection: "column",
      height: 140,
      justifyContent: "space-between",
    }}
  >
    <Typography component="h1" variant="h5" color="black" gutterBottom>
      {title}
    </Typography>
    <Typography component="p" variant="h4">
      {value}
    </Typography>
    <div style={{ alignSelf: "flex-end" }}>{icon}</div>
  </Paper>
);

const DashboardMetrics = ({ data }) => {
  const metrics = [
    { title: "Total Orders", value: data.orders, icon: <ShoppingCartIcon /> },
    { title: "Total Products", value: data.products, icon: <InventoryIcon /> },
    { title: "Appointments", value: data.appointments, icon: <EventIcon /> },
    { title: "Products Sold", value: data.quantitySold, icon: <LocalOfferIcon /> },
    { title: "Total Reviews", value: data.reviews, icon: <StarIcon /> },
    { title: "Income", value: `₱${data.totalIncome.toLocaleString()}`, icon: <AttachMoneyIcon /> },
  ];

  return (
    <Grid container spacing={3}>
      {metrics.map((metric) => (
        <Grid item xs={12} sm={6} md={4} key={metric.title}>
          <Metric
            title={metric.title}
            value={metric.title === "Total Income" ? `$${metric.value}` : metric.value}
            icon={metric.icon}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardMetrics;
