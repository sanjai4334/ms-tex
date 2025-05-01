import React from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { Cancel as CancelIcon } from '@mui/icons-material';

const ActiveFilters = ({
  searchQuery,
  filter,
  sortOption,
  priceRange,
  ratingFilter,
  inStockOnly,
  maxPrice,
  onClearSearch,
  onClearCategory,
  onClearSort,
  onClearPriceRange,
  onClearRating,
  onClearInStock,
}) => {
  const hasActiveFilters = searchQuery || filter || sortOption || ratingFilter > 0 || 
    inStockOnly || (priceRange[0] > 0 || priceRange[1] < maxPrice);

  if (!hasActiveFilters) return null;

  return (
    <Box sx={{ p: 2, backgroundColor: 'background.paper' }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Active Filters:
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {searchQuery && (
          <Chip
            label={`Search: ${searchQuery}`}
            onDelete={onClearSearch}
            deleteIcon={<CancelIcon />}
            size="small"
          />
        )}
        {filter && (
          <Chip
            label={`Category: ${filter}`}
            onDelete={onClearCategory}
            deleteIcon={<CancelIcon />}
            size="small"
          />
        )}
        {sortOption && (
          <Chip
            label={`Sort: ${sortOption.replace('_', ' ').toUpperCase()}`}
            onDelete={onClearSort}
            deleteIcon={<CancelIcon />}
            size="small"
          />
        )}
        {ratingFilter > 0 && (
          <Chip
            label={`${ratingFilter}★ & up`}
            onDelete={onClearRating}
            deleteIcon={<CancelIcon />}
            size="small"
          />
        )}
        {inStockOnly && (
          <Chip
            label="In Stock Only"
            onDelete={onClearInStock}
            deleteIcon={<CancelIcon />}
            size="small"
          />
        )}
        {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
          <Chip
            label={`₹${priceRange[0].toLocaleString('en-IN')} - ₹${priceRange[1].toLocaleString('en-IN')}`}
            onDelete={onClearPriceRange}
            deleteIcon={<CancelIcon />}
            size="small"
          />
        )}
      </Box>
    </Box>
  );
};

export default ActiveFilters;
