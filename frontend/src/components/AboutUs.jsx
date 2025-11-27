import React from "react";
import { Box, Typography, Avatar, Grid, Container, createTheme, ThemeProvider, styled, Card, CardContent } from "@mui/material";

import animationImage from "../assets/homeanimation.gif";
import dogcat from "../assets/dogcat.jpg";
import mikel from "../assets/mikel.png";
import carlos from "../assets/carlos.png";
import clark from "../assets/clark.png";

const theme = createTheme({
  palette: {
    primary: {
      main: '#2E3B55',
      light: '#4A5F8C',
    },
    secondary: {
      main: '#FF6B35',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '3.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2.5rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    body1: {
      fontSize: '1.1rem',
      lineHeight: 1.7,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease',
          border: '1px solid rgba(0,0,0,0.05)',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          },
        },
      },
    },
  },
});

const PageWrapper = styled(Box)(({ theme }) => ({
  background: theme.palette.background.default,
  minHeight: '100vh',
  padding: theme.spacing(6),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

const SectionContainer = styled(Container)(({ theme }) => ({
  marginBottom: theme.spacing(8),
}));

const AboutUs = () => {
  return (
    <ThemeProvider theme={theme}>
      <PageWrapper>
        <SectionContainer maxWidth="lg">
          <Typography
            variant="h1"
            sx={{
              textAlign: "center",
              marginBottom: 4,
              background: 'linear-gradient(135deg, #2E3B55 0%, #4A5F8C 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            About Us
          </Typography>

          <Card sx={{ mb: 6 }}>
            <CardContent sx={{ p: 6 }}>
              <Grid container spacing={6} alignItems="center">
                <Grid item xs={12} md={4}>
                  <Box
                    component="img"
                    src={animationImage}
                    alt="Pet Care Animation"
                    sx={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: 3,
                      boxShadow: 3,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <Typography
                    variant="h4"
                    sx={{
                      color: "primary.main",
                      marginBottom: 3,
                    }}
                  >
                    Welcome to Zootopia
                  </Typography>
                  <Typography variant="body1" sx={{ color: "text.secondary" }}>
                    At Zootopia, we believe pets are family. Our mission is to provide exceptional 
                    products and services that enhance the lives of pets and their owners. With a 
                    commitment to quality, safety, and innovation, we strive to be your trusted 
                    partner in pet care.
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: 6 }}>
              <Grid container spacing={6} alignItems="center" flexDirection="row-reverse">
                <Grid item xs={12} md={4}>
                  <Avatar
                    src={dogcat}
                    alt="Our Mission"
                    sx={{
                      width: '100%',
                      height: 'auto',
                      maxWidth: 280,
                      aspectRatio: '1',
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <Typography
                    variant="h4"
                    sx={{
                      color: "primary.main",
                      marginBottom: 3,
                    }}
                  >
                    Our Commitment
                  </Typography>
                  <Typography variant="body1" sx={{ color: "text.secondary", mb: 3 }}>
                    We are passionate pet lovers dedicated to providing the highest standard of care 
                    for your furry companions. Our team meticulously selects every product to ensure 
                    it meets our rigorous quality and safety standards.
                  </Typography>
                  <Typography variant="body1" sx={{ color: "text.secondary" }}>
                    From premium nutrition to engaging toys and essential grooming supplies, 
                    we are committed to making pet ownership a rewarding and joyful experience 
                    for every family.
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </SectionContainer>

        <SectionContainer maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              textAlign: "center",
              marginBottom: 8,
              color: "primary.main",
            }}
          >
            Our Team
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {[
              { name: "Clarence Kirk Macapobre", role: "Founder", email: "clarencekirk.macapobre@cit.edu", id: "22-6110-652", image: clark },
              { name: "Carlos Rogel Lofranco", role: "Co-Founder", email: "carlosrogel.lofranco@cit.edu", id: "22-1381-643", image: carlos },
              { name: "Mikel Josh Nicer", role: "Co-Founder", email: "mikeljosh.nicer@cit.edu", id: "22-672-178", image: mikel },
            ].map((member, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ height: '100%', textAlign: 'center' }}>
                  <CardContent sx={{ p: 4 }}>
                    <Avatar
                      src={member.image}
                      alt={member.name}
                      sx={{
                        width: 140,
                        height: 140,
                        margin: '0 auto 24px',
                        border: '4px solid',
                        borderColor: 'primary.light',
                      }}
                    />
                    <Typography
                      variant="h4"
                      sx={{ 
                        fontWeight: 600, 
                        marginBottom: 1,
                        color: "primary.main",
                      }}
                    >
                      {member.name}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "secondary.main",
                        fontWeight: 500,
                        marginBottom: 2,
                      }}
                    >
                      {member.role}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.primary",
                        marginBottom: 1,
                        wordBreak: 'break-word',
                      }}
                    >
                      {member.email}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: "text.secondary",
                        fontFamily: 'monospace',
                      }}
                    >
                      {member.id}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </SectionContainer>
      </PageWrapper>
    </ThemeProvider>
  );
};

export default AboutUs;