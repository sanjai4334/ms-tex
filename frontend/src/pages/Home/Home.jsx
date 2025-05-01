import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';
import SearchFilters from '../../components/SearchFilters/SearchFilters';
import ProductCard from '../../components/Card/Card';
import { fetchProducts } from '../../store/slices/productSlice';
import TopSearchBar from '../../components/TopSearchBar/TopSearchBar';

const Home = () => {
  const dispatch = useDispatch();
  const { items: products, status, error } = useSelector(state => state.products);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const maxPrice = useMemo(() => {
    return Math.max(...products.map(p => p.price));
  }, [products]);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(product => product.category))];
    return uniqueCategories.filter(Boolean);
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    return products
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
  }, [products, searchQuery, filter, sortOption, priceRange, ratingFilter, inStockOnly]);

  if (status === 'loading') return <Typography>Loading...</Typography>;
  if (status === 'failed') return <Typography color="error">Error: {error}</Typography>;

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
            {filteredAndSortedProducts.map((product) => (
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

export default Home;
