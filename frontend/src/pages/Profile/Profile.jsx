import { useSelector } from 'react-redux';
import { Container, Typography, Box, Button, Avatar } from '@mui/material';

export default function Profile() {
  const { user } = useSelector((state) => state.auth);

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box sx={{ 
        p: 4, 
        boxShadow: 1, 
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Avatar 
          sx={{ width: 100, height: 100, mb: 3 }}
          src="/default-avatar.jpg" 
        />
        
        <Typography variant="h4" gutterBottom>
          {user?.firstName} {user?.lastName}
        </Typography>
        
        <Typography variant="body1" gutterBottom>
          <strong>Email:</strong> {user?.email}
        </Typography>
        
        <Box sx={{ mt: 3, width: '100%' }}>
          <Button 
            fullWidth 
            variant="contained" 
            sx={{ mb: 2 }}
          >
            Order History
          </Button>
          <Button 
            fullWidth 
            variant="outlined"
          >
            Edit Profile
          </Button>
        </Box>
      </Box>
    </Container>
  );
}