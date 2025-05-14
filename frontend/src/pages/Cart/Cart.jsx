import React, { useState } from 'react';
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
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { updateQuantity, removeFromCart, clearCart } from '../../store/slices/cartSlice';
import CartCard from '../../components/CartCard/CartCard';
import api from '../../api/axios';
import { selectAuth } from '../../store/slices/authSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const { user, token } = useSelector(selectAuth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handleOrderConfirmation = async () => {
    try {
      console.log('Preparing order data...');
      const orderData = {
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
        items: cartItems.map(item => ({
          productId: item._id || item.id,
          title: item.title,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal,
        shipping,
        total,
      };

      console.log('Sending order data to backend:', orderData);
      const response = await api.post('/orders', orderData);

      if (response.status === 201) {
        console.log('Order created successfully:', response.data);
        await api.post('/user/cart/clear'); // Clear the cart in the backend
        console.log('Cart cleared in backend');
        dispatch(clearCart()); // Clear the cart in Redux
        console.log('Cart cleared in Redux');
        setOrderSuccess(true); // Show the confirmation message
        window.location.href = '/shop'; 
      } else {
        console.error('Failed to create order. Response:', response);
        throw new Error('Failed to create order. Please try again.');
      }
    } catch (error) {
      console.error('Error during order confirmation:', error);
      alert('Error creating order. Please try again.');
    }
  };

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

  const handleOrderClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

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
              onClick={handleOrderClick}
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

      <Modal open={isModalOpen} onClose={orderSuccess ? null : handleCloseModal}>
        <Paper sx={{ 
          maxWidth: '600px', 
          margin: 'auto', 
          mt: '10%', 
          p: 3, 
          outline: 'none', 
          borderRadius: '8px' 
        }}>
          {!orderSuccess ? (
            <>
              <Typography variant="h5" gutterBottom align="center">
                Order Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cartItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.title}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">₹{(item.price * item.quantity).toLocaleString('en-IN')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Subtotal:</Typography>
                <Typography variant="body1">₹{subtotal.toLocaleString('en-IN')}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="primary">₹{subtotal.toLocaleString('en-IN')}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="outlined" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={handleOrderConfirmation}
                >
                  Confirm Order
                </Button>
              </Box>
            </>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h5" gutterBottom color="success.main">
                Order Confirmed!
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Thank you for your purchase. Your order has been placed successfully.
              </Typography>
              <Box
                component="div"
                sx={{
                  width: 80,
                  height: 80,
                  margin: 'auto',
                  borderRadius: '50%',
                  backgroundColor: 'success.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'pulse 1.5s infinite'
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  fill="none"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-check"
                  viewBox="0 0 24 24"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </Box>
            </Box>
          )}
        </Paper>
      </Modal>
    </Box>
  );
};

export default Cart;
