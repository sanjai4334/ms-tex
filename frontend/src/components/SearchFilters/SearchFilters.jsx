import React from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Typography,
  Slider,
  Rating,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Chip,
  Divider,
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

const SearchFilters = ({
  filter,
  sortOption,
  priceRange,
  ratingFilter,
  inStockOnly,
  maxPrice,
  categories,
  onFilterChange,
  onSortChange,
  onPriceChange,
  onRatingChange,
  onInStockChange,
  onClearCategory,
  onClearSort,
  onClearPriceRange,
  onClearRating,
  onClearInStock,
}) => {
  const handleMinPriceChange = (event) => {
    const newMin = Number(event.target.value);
    if (!isNaN(newMin)) {
      onPriceChange(null, [newMin, priceRange[1]]);
    }
  };

  const handleMaxPriceChange = (event) => {
    const newMax = Number(event.target.value);
    if (!isNaN(newMax)) {
      onPriceChange(null, [priceRange[0], newMax]);
    }
  };

  const hasActiveFilters = filter || sortOption || ratingFilter > 0 || 
    inStockOnly || (priceRange[0] > 0 || priceRange[1] < maxPrice);

  return (
    <Box 
      sx={{ 
        width: '300px',
        height: '100%',
        overflow: 'auto',
        borderLeft: 1,
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,0.2)',
          borderRadius: '4px',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Active Filters
        </Typography>

        {/* Active Filters */}
        {hasActiveFilters ? (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
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
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            No active filters
          </Typography>
        )}

        {/* Divider with label */}
        <Divider sx={{ my: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Filter Options
          </Typography>
        </Divider>

        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Sort By</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl fullWidth size="small">
              <Select value={sortOption} onChange={onSortChange}>
                <MenuItem value="">Relevance</MenuItem>
                <MenuItem value="price_asc">Price: Low to High</MenuItem>
                <MenuItem value="price_desc">Price: High to Low</MenuItem>
                <MenuItem value="rating">Customer Rating</MenuItem>
                <MenuItem value="stock">Stock: High to Low</MenuItem>
              </Select>
            </FormControl>
          </AccordionDetails>
        </Accordion>

        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Category</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl fullWidth size="small">
              <Select value={filter} onChange={onFilterChange}>
                <MenuItem value="">All Categories</MenuItem>
                {categories.map(category => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </AccordionDetails>
        </Accordion>

        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Price Range</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Slider
              value={priceRange}
              onChange={onPriceChange}
              valueLabelDisplay="auto"
              min={0}
              max={maxPrice}
              valueLabelFormat={value => `₹${value.toLocaleString('en-IN')}`}
            />
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <TextField
                size="small"
                label="Min"
                type="number"
                value={priceRange[0]}
                onChange={handleMinPriceChange}
                inputProps={{ min: 0, max: priceRange[1] }}
                fullWidth
              />
              <TextField
                size="small"
                label="Max"
                type="number"
                value={priceRange[1]}
                onChange={handleMaxPriceChange}
                inputProps={{ min: priceRange[0], max: maxPrice }}
                fullWidth
              />
            </Stack>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Customer Rating</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup>
              {[4, 3, 2, 1].map((rating) => (
                <FormControlLabel
                  key={rating}
                  control={
                    <Checkbox
                      checked={ratingFilter <= rating}
                      onChange={() => onRatingChange(null, rating)}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Rating value={rating} readOnly size="small" />
                      <Typography variant="body2" sx={{ ml: 1 }}>& up</Typography>
                    </Box>
                  }
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Availability</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControlLabel
              control={
                <Checkbox
                  checked={inStockOnly}
                  onChange={onInStockChange}
                />
              }
              label="Show In Stock Only"
            />
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
};

export default SearchFilters;
