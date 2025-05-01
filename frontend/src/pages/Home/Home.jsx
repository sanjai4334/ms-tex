import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, TextField, Select, MenuItem, Grid, Typography, InputLabel, FormControl } from '@mui/material';
import ProductCard from '../../components/Card/Card';
import { fetchProducts } from '../../store/slices/productSlice';

const Home = () => {
  const dispatch = useDispatch();
  const { items: products, status, error } = useSelector(state => state.products);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('');
  const [sortOption, setSortOption] = useState('');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleFilterChange = (e) => setFilter(e.target.value);
  const handleSortChange = (e) => setSortOption(e.target.value);

  const filteredAndSortedProducts = useMemo(() => {
    return products
      .filter(product => {
        // Apply search filter
        const matchesSearch = product.title.toLowerCase()
          .includes(searchQuery.toLowerCase());

        // Apply category filter
        const matchesCategory = !filter || product.category === filter;

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        // Apply sorting
        if (!sortOption) return 0;
        
        if (sortOption === 'asc') {
          return a.price - b.price;
        } else if (sortOption === 'desc') {
          return b.price - a.price;
        }
        return 0;
      });
  }, [products, searchQuery, filter, sortOption]);

  // Get unique categories from products
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(product => product.category))];
    return uniqueCategories.filter(Boolean); // Remove any undefined/null values
  }, [products]);

  if (status === 'loading') {
    return <Typography>Loading...</Typography>;
  }

  if (status === 'failed') {
    return <Typography color="error">Error: {error}</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          display: 'flex',
          gap: '1rem',
          p: 1.5,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <TextField
          size="small"
          label="Search products"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ flex: 1, minWidth: '200px' }}
        />
        <FormControl size="small" sx={{ flex: 1, minWidth: '150px' }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={filter}
            onChange={handleFilterChange}
            label="Category"
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map(category => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ flex: 1, minWidth: '150px' }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortOption}
            onChange={handleSortChange}
            label="Sort By"
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="asc">Price: Low to High</MenuItem>
            <MenuItem value="desc">Price: High to Low</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ overflow: 'auto', flex: 1, p: 2 }}>
        {filteredAndSortedProducts.length === 0 ? (
          <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
            No products found matching your criteria
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {filteredAndSortedProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default Home;
