import React from "react";
import { Box, Typography, Avatar, Grid, Container, createTheme, ThemeProvider, styled } from "@mui/material";

import animationImage from "../assets/homeanimation.gif";
import dogcat from "../assets/dogcat.jpg";
import mikel from "../assets/mikel.png";
import carlos from "../assets/carlos.png";
import clark from "../assets/clark.png";
import petIcon from '../assets/peticon.png';
import paw1 from '../assets/paw1.png';

const theme = createTheme({
  palette: {
    primary: {
      main: '#8670ffff',
      light: '#2600ffff',
    },
    secondary: {
      main: '#4c3fffff',
    },
    background: {
      default: '#d2e1ffff',
      paper: '#FFFFFF',
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
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
          transition: 'transform 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
          },
        },
      },
    },
  },
});

const PageWrapper = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.light}20, ${theme.palette.background.default})`,
  minHeight: '100vh',
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "96vw",
}));

const HeaderWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(4),
}));

const PetIcon = styled('img')({
  width: '60px',
  height: '60px',
  marginRight: '15px',
  animation: 'float 3s ease-in-out infinite',
  '@keyframes float': {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-10px)' },
  },
});

const PawPrint = styled('img')(({ theme }) => ({
  position: 'absolute',
  width: '100px',
  height: 'auto',
  opacity: 0.1,
  zIndex: 0,
}));

const AboutUs = () => {
  return (
    <ThemeProvider theme={theme}>
      <PageWrapper>
        {/* Welcome Section - Keeping the original structure */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 5,
            marginTop: -4,
            backgroundColor: "#6b9affff",
            padding: "2rem",
            borderRadius: 2,
            boxShadow: 3,
            width: "100%",
          }}
        >
          <Box
            component="img"
            src={animationImage}
            alt="Welcome Animation"
            sx={{
              width: 430,
              height: 430,
              borderRadius: "50%",
              boxShadow: 3,
              marginRight: 3,
            }}
          />
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                fontFamily: "Comic Sans MS",
                color: "#333",
                fontSize: "3rem",
              }}
            >
              About ZOOTOPIA!
            </Typography>
          </Box>
        </Box>

        <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", padding: "40px 20px" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "background.paper",
              padding: "20px",
              borderRadius: 4,
              width: "80%",
              boxShadow: 3,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <PawPrint src={paw1} alt="Paw Print" sx={{ top: -20, right: -20 }} />
            <Avatar
              src={dogcat}
              alt="Pet Image"
              sx={{
                width: 200,
                height: 200,
                marginRight: "20px",
              }}
            />
            <Typography
              variant="body1"
              sx={{
                color: "text.primary",
                fontSize: "1.2rem",
                lineHeight: "1.8",
                textAlign: "left",
              }}
            >
              At ZOOTOPIA, pets are family. Our mission is to provide top-quality products that make caring for your pets simple and joyful. From healthy food to toys and grooming essentials, we've got everything to keep your furry, feathered, or scaly friends happy.
            </Typography>
          </Box>
        </Container>

        <Container sx={{ padding: "40px 20px" }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "20px",
              color: "primary.main",
            }}
          >
            Behind ZOOTOPIA
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {[
              { name: "Clarence", email: "clarencekirk.macapobre@cit.edu", id: "22-6110-652", image: clark },
              { name: "Carlos", email: "carlosrogel.lofranco@cit.edu", id: "22-1381-643", image: carlos },
              { name: "Mikel", email: "mikeljosh.nicer@cit.edu", id: "22-672-178", image: mikel },
            ].map((member, index) => (
              <Grid item xs={12} sm={6} md={4} key={index} textAlign="center">
                <Box sx={{ 
                  boxShadow: 3, 
                  padding: 2, 
                  textAlign: "center",
                  borderRadius: 4,
                  backgroundColor: "background.paper",
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  <PawPrint src={paw1} alt="Paw Print" sx={{ top: -20, right: -20 }} />
                  <Avatar
                    src={member.image}
                    alt={member.name}
                    sx={{
                      width: 120,
                      height: 120,
                      margin: "0 auto",
                      "&:hover": {
                        transform: "scale(1.05)",
                        transition: "0.3s",
                      },
                    }}
                  />
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "bold", marginTop: "10px", color: "primary.main" }}
                  >
                    {member.email}
                  </Typography>
                  <Typography variant="body2" sx={{color: "text.secondary"}}>{member.id}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </PageWrapper>
    </ThemeProvider>
  );
};

export default AboutUs;