import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Grid, Container, Paper, Card, CardContent } from "@mui/material";
import { useAdminAuth } from "./AdminAuthProvider";
import DashboardMetrics from "./DashboardMetrics";

const AdminDashboard = () => {
  const { admin } = useAdminAuth();
  const [dashboardData, setDashboardData] = useState({
    orders: 0,
    products: 0,
    appointments: 0,
    quantitySold: 0,
    reviews: 0,
    totalIncome: 0,
  });

  const fetchData = async () => {
    try {
      const data = await axios.all([
        axios.get(`http://localhost:8080/api/order/getAllOrders`),
        axios.get(`http://localhost:8080/api/product/getProduct`),
        axios.get(`http://localhost:8080/api/appointments/getAppointment`),
        axios.get(`http://localhost:8080/api/product/getTotalQuantitySold`),
        axios.get(`http://localhost:8080/api/review/getReview`),
        axios.get(`http://localhost:8080/api/order/get-total-income`),
      ]);

      // Using axios.spread to handle multiple responses
      axios.spread((orders, products, appointments, quantitySold, reviews, totalIncome) => {
        setDashboardData({
          orders: orders.data.length,
          products: products.data.length,
          appointments: appointments.data.length,
          quantitySold: quantitySold.data,
          reviews: reviews.data.length,
          totalIncome: totalIncome.data,
        });
      })(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log("Dashboard data updated:", dashboardData);
  }, [dashboardData]); // This effect will run whenever the `dashboardData` state changes

  return (
    <Box sx={{ height: "100vh", flexGrow: 1, bgcolor: "background.default", py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
          Welcome, {admin?.user}!
        </Typography>
        <Typography variant="subtitle1" gutterBottom sx={{ marginBottom: 5 }}>
          This is a protected page only accessible to logged-in admins.
        </Typography>

        <DashboardMetrics data={dashboardData} />
      </Container>
    </Box>
  );
};

export default AdminDashboard;
