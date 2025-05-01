import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardMedia, CardContent, Typography, Box, IconButton, Badge } from '@mui/material';
import { Favorite, FavoriteBorder, AddShoppingCart, ShoppingCart } from '@mui/icons-material';
import { toggleFavorite } from '../../store/slices/favoritesSlice';
import { addToCart } from '../../store/slices/cartSlice';

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const favorites = useSelector(state => state.favorites.items);
  const cartItems = useSelector(state => state.cart.items);
  const isFavorite = favorites.some(item => item.id === product.id);
  const cartItem = cartItems.find(item => item.id === product.id);
  const [imgSrc, setImgSrc] = useState(product.image);

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(product));
  };

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  const handleImageError = () => {
    setImgSrc('https://placehold.co/280x250/png?text=Product+Image');
  };

  return (
    <Card sx={{ 
      width: '280px',
      height: '420px', // Increased height to accommodate larger image
      display: 'flex',
      flexDirection: 'column',
      boxShadow: 3,
      m: 'auto'
    }}>
      <Box sx={{ 
        height: '250px', // Increased image container height
        width: '100%',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <IconButton
          onClick={handleToggleFavorite}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
            color: isFavorite ? 'error.main' : 'pink',
            '&:hover': {
              backgroundColor: 'transparent',
            }
          }}
        >
          {isFavorite ? <Favorite /> : <FavoriteBorder />}
        </IconButton>
        <CardMedia
          component="img"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          image={imgSrc}
          alt={product.title}
          onError={handleImageError}
        />
      </Box>
      <CardContent sx={{ 
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 2,
        '&:last-child': { paddingBottom: 2 }
      }}>
        <Typography 
          variant="h6" 
          component="div" 
          color="primary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            mb: 1
          }}
          title={product.title}
        >
          {product.title}
        </Typography>
        <Box>
          <Typography 
            variant="body1" 
            color="success.main" 
            sx={{ mb: 1 }}
          >
            Price: ${product.price.toFixed(2)}
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="body2" color="text.secondary">
              ⭐ {product.rating.rate} ({product.rating.count})
            </Typography>
            <Badge 
              badgeContent={cartItem?.quantity || 0} 
              color="primary"
              sx={{ 
                '& .MuiBadge-badge': {
                  display: cartItem ? 'block' : 'none'
                }
              }}
            >
              <IconButton 
                color={cartItem ? "primary" : "default"}
                size="small"
                sx={{ ml: 1 }}
                onClick={handleAddToCart}
              >
                {cartItem ? <ShoppingCart /> : <AddShoppingCart />}
              </IconButton>
            </Badge>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default ProductCard;
