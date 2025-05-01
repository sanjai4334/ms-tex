import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';
import ProductCard from '../../components/Card/Card';
import SearchFilters from '../../components/SearchFilters/SearchFilters';
import TopSearchBar from '../../components/TopSearchBar/TopSearchBar';

const Favorites = () => {
  const favorites = useSelector(state => state.favorites.items);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);

  const maxPrice = useMemo(() => {
    return Math.max(...favorites.map(p => p.price));
  }, [favorites]);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(favorites.map(product => product.category))];
    return uniqueCategories.filter(Boolean);
  }, [favorites]);

  const filteredAndSortedFavorites = useMemo(() => {
    return favorites
      .filter(product => {
        const matchesSearch = product.title.toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesCategory = !filter || product.category === filter;
        const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
        const matchesRating = product.rating.rate >= ratingFilter;
        const matchesStock = !inStockOnly || product.stock > 0;

        return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesStock;
      })
      .sort((a, b) => {
        switch (sortOption) {
          case 'price_asc': return a.price - b.price;
          case 'price_desc': return b.price - a.price;
          case 'rating': return b.rating.rate - a.rating.rate;
          case 'stock': return b.stock - a.stock;
          default: return 0;
        }
      });
  }, [favorites, searchQuery, filter, sortOption, priceRange, ratingFilter, inStockOnly]);

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
    <Box sx={{ height: '100%', display: 'flex' }}>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <TopSearchBar 
          searchQuery={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <Box sx={{
            p: 2,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 3,
          }}>
            {filteredAndSortedFavorites.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Box>
        </Box>
      </Box>

      <SearchFilters
        filter={filter}
        sortOption={sortOption}
        priceRange={priceRange}
        ratingFilter={ratingFilter}
        inStockOnly={inStockOnly}
        maxPrice={maxPrice}
        categories={categories}
        onFilterChange={(e) => setFilter(e.target.value)}
        onSortChange={(e) => setSortOption(e.target.value)}
        onPriceChange={(_, newValue) => setPriceRange(newValue)}
        onRatingChange={(_, newValue) => setRatingFilter(newValue)}
        onInStockChange={(e) => setInStockOnly(e.target.checked)}
        onClearCategory={() => setFilter('')}
        onClearSort={() => setSortOption('')}
        onClearPriceRange={() => setPriceRange([0, maxPrice])}
        onClearRating={() => setRatingFilter(0)}
        onClearInStock={() => setInStockOnly(false)}
      />
    </Box>
  );
};

export default Favorites;
