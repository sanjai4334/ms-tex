import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Box, 
  Grid, 
  Typography, 
  Card, 
  CardContent,
  Button,
  Divider,
  Stack,
} from '@mui/material';
import { updateQuantity, removeFromCart } from '../../store/slices/cartSlice';
import CartCard from '../../components/CartCard/CartCard';

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  
  const handleQuantityChange = (product, newQuantity) => {
    if (newQuantity >= 1) {
      dispatch(updateQuantity({ id: product.id, quantity: newQuantity }));
    }
  };

  const handleRemove = (productId) => {
    dispatch(removeFromCart({ id: productId }));
  };

  const subtotal = cartItems.reduce((sum, item) => 
    sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <Box sx={{ 
        p: 3, 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2
      }}>
        <Typography variant="h5" color="text.secondary">
          Your cart is empty
        </Typography>
        <Button variant="contained" color="primary" href="/shop">
          Continue Shopping
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, height: '100vh', overflow: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Shopping Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
      </Typography>

      <Card 
        elevation={0} 
        sx={{ 
          border: '1px solid', 
          borderColor: 'divider',
          mb: 2,
          width: '100%'
        }}
      >
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1
              }}>
                <Typography variant="body1" color="text.secondary">
                  Subtotal ({cartItems.length} items)
                </Typography>
                <Typography variant="body1">
                  ₹{subtotal.toLocaleString('en-IN')}
                </Typography>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center' 
              }}>
                <Typography variant="body1" color="text.secondary">
                  Total with shipping
                </Typography>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h6" color="primary.main">
                    ₹{total.toLocaleString('en-IN')}
                  </Typography>
                  {subtotal < 10000 && (
                    <Typography variant="caption" color="success.main" sx={{ display: 'block' }}>
                      Add ₹{(10000 - subtotal).toLocaleString('en-IN')} for free shipping
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
            <Button 
              variant="contained" 
              color="primary"
              sx={{ 
                height: '45px',
                width: '180px',
                whiteSpace: 'nowrap'
              }}
            >
              Order
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        {cartItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <CartCard
              item={item}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemove}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Cart;
