import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import logo from '../assets/logo.png';

function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: '#F9F6E7',
        padding: '20px',
        borderTop: '1px solid black',
        textAlign: 'center',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box
        component="img"
        src={logo}
        alt="Tails & Whiskers Logo"
        sx={{ height: '300px', marginBottom: '-50px', marginTop: '-100px' }} 
      />
      <Typography variant="body2" sx={{ mt: 1, color: 'black' }}>
        © All Rights Reserved
      </Typography>
      <Box sx={{ position: 'absolute', top: '20px', right: '20px', textAlign: 'right', color: 'black' }}>
        <Typography variant="body2">Phone: +63 999 999 9999</Typography>
        <Typography variant="body2">Address: Cebu, PH</Typography>
      </Box>
    </Box>
  );
}

export default Footer;
