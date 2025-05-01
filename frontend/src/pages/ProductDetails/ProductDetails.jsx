import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Rating, 
  Chip,
  Paper,
  Divider,
  Skeleton,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  AddShoppingCart, 
  Favorite, 
  FavoriteBorder,
  ArrowBack,
  LocalShipping,
  VerifiedUser,
  Loop
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import { toggleFavorite } from '../../store/slices/favoritesSlice';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [imgSrc, setImgSrc] = useState('');
  const [imgLoading, setImgLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const product = useSelector(state => 
    state.products.items.find(p => p.id === parseInt(id))
  );
  
  const isFavorite = useSelector(state => 
    state.favorites.items.some(item => item.id === product?.id)
  );

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    setSnackbar({
      open: true,
      message: 'Added to cart successfully!',
      severity: 'success'
    });
  };

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(product));
    setSnackbar({
      open: true,
      message: isFavorite ? 'Removed from favorites' : 'Added to favorites',
      severity: 'success'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleImageLoad = () => {
    setImgLoading(false);
  };

  const handleImageError = () => {
    setImgSrc('https://placehold.co/600x400/png?text=Product+Image');
    setImgLoading(false);
  };

  if (!product) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Product not found</Typography>
      </Box>
    );
  }

  // Ensure image is loaded
  if (imgSrc === '') {
    setImgSrc(product.image);
  }

  return (
    <Box sx={{ 
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      maxWidth: '100%' // Ensure no horizontal overflow
    }}>
      <Box sx={{ p: 2 }}>
        <IconButton onClick={() => navigate(-1)} aria-label="back">
          <ArrowBack />
        </IconButton>
      </Box>

      <Box sx={{ 
        flex: 1,
        display: 'flex',
        p: { xs: 1, sm: 2 }, // Responsive padding
        gap: 2,
        overflow: 'hidden',
        minHeight: 0, // Important for proper flex behavior
        maxWidth: '100%' // Contain width
      }}>
        {/* Left side - Image */}
        <Paper 
          elevation={3} 
          sx={{ 
            flex: '0 0 35%', // Reduced from 40% to 35%
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            minHeight: 0, // Important for proper flex behavior
            maxWidth: '35%' // Ensure paper doesn't grow beyond flex basis
          }}
        >
          {imgLoading && (
            <Skeleton variant="rectangular" width="100%" height="100%" />
          )}
          <Box
            component="img"
            src={imgSrc}
            alt={product.title}
            onLoad={handleImageLoad}
            onError={handleImageError}
            sx={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              display: imgLoading ? 'none' : 'block'
            }}
          />
        </Paper>

        {/* Right side - Details */}
        <Paper 
          elevation={3} 
          sx={{ 
            flex: '0 0 65%', // Increased from 60% to 65%
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0, // Important for proper flex behavior
            overflow: 'hidden',
            maxWidth: '65%' // Ensure paper doesn't grow beyond flex basis
          }}
        >
          <Box sx={{ 
            p: { xs: 2, sm: 3 }, // Responsive padding
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
            flex: 1,
            gap: 2, // Add consistent spacing between elements
            '& > *': { // Add margin to all direct children
              mx: 1 // Horizontal margin
            }
          }}>
            <Chip 
              label={product.category} 
              color="primary" 
              size="small" 
              sx={{ alignSelf: 'flex-start', mb: 1 }}
            />
            
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: 1.2,
                wordBreak: 'break-word', // Handle long words
                mb: 1
              }}
            >
              {product.title}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Rating value={product.rating.rate} precision={0.1} readOnly />
              <Typography variant="body2" color="text.secondary">
                {product.rating.rate} ({product.rating.count} reviews)
              </Typography>
            </Box>
            
            <Typography variant="h4" color="primary" sx={{ mb: 2 }}>
              ${product.price.toFixed(2)}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ 
                overflow: 'auto',
                flex: '1 1 auto',
                minHeight: 0,
                wordBreak: 'break-word', // Handle long words
                pr: 2, // Add right padding for scrollbar
                pb: 2  // Add bottom padding for spacing
              }}
            >
              {product.description}
            </Typography>

            <Box sx={{ 
              mt: 'auto',
              pt: 2,
              borderTop: 1,
              borderColor: 'divider',
              backgroundColor: 'background.paper',
              px: 1 // Add horizontal padding
            }}>
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 2,
                mb: 3
              }}>
                {/* Benefits section */}
                <Box sx={{ textAlign: 'center' }}>
                  <LocalShipping sx={{ color: 'text.secondary' }} />
                  <Typography 
                    variant="caption" 
                    display="block"
                    sx={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    Free shipping over $100
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <VerifiedUser sx={{ color: 'text.secondary' }} />
                  <Typography variant="caption" display="block">
                    Secure payment
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Loop sx={{ color: 'text.secondary' }} />
                  <Typography variant="caption" display="block">
                    30-day returns
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ 
                display: 'flex',
                gap: 2,
                mt: 2
              }}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<AddShoppingCart />}
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={isFavorite ? <Favorite /> : <FavoriteBorder />}
                  onClick={handleToggleFavorite}
                  color={isFavorite ? "error" : "primary"}
                >
                  {isFavorite ? 'Remove' : 'Favorite'}
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductDetails;
