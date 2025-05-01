import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Grid, Typography } from '@mui/material';
import ProductCard from '../../components/Card/Card';

const Favorites = () => {
  const favorites = useSelector(state => state.favorites.items);

  if (favorites.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5" color="text.secondary">
          No favorites yet
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, height: '100vh', overflow: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        My Favorites
      </Typography>
      <Grid container spacing={3}>
        {favorites.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Favorites;
