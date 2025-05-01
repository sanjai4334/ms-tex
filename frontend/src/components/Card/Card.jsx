import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardMedia, CardContent, Typography, Box, IconButton, Badge, Chip } from '@mui/material';
import { Favorite, FavoriteBorder, AddShoppingCart, ShoppingCart } from '@mui/icons-material';
import { toggleFavorite } from '../../store/slices/favoritesSlice';
import { addToCart } from '../../store/slices/cartSlice';
import { useNavigate } from 'react-router-dom';

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const handleCardClick = (e) => {
    // Prevent navigation if clicking on action buttons
    if (e.target.closest('button')) {
      return;
    }
    navigate(`/product/${product.id}`);
  };

  return (
    <Card 
      sx={{ 
        width: '300px',
        height: '420px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 3,
        m: 'auto',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 6
        }
      }}
      onClick={handleCardClick}
    >
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
        <Chip
          label={product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          color={product.stock > 0 ? "success" : "error"}
          size="small"
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            backgroundColor: theme => 
              `${product.stock > 0 
                ? theme.palette.success.main 
                : theme.palette.error.main}80`, // 80 is hex for 50% opacity
            color: 'white',
            fontWeight: 'bold',
            backdropFilter: 'blur(4px)',
          }}
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
            Price: ₹{product.price.toLocaleString('en-IN')}
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 1
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
