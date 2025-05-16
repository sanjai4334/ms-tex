import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../store/slices/authSlice';

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      dispatch({ type: 'auth/setError', payload: "Passwords don't match" });
      return;
    }
    const result = await dispatch(registerUser(formData));
    if (result.payload) {
      navigate('/shop');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        bgcolor: 'background.paper',
        p: 4,
        borderRadius: 2,
        boxShadow: 1,
        width: '100%',
        maxWidth: 500,
        mx: 'auto'
      }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: 600 }}>
          Create Account
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              name="firstName"
              label="First Name"
              fullWidth
              value={formData.firstName}
              onChange={handleChange}
              required
              autoComplete="given-name"
            />
            <TextField
              name="lastName"
              label="Last Name"
              fullWidth
              value={formData.lastName}
              onChange={handleChange}
              required
              autoComplete="family-name"
            />
          </Box>

          <TextField
            name="email"
            label="Email Address"
            fullWidth
            margin="normal"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />

          <TextField
            name="password"
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />

          <TextField
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={formData.password !== formData.confirmPassword}
            helperText={formData.password !== formData.confirmPassword ? "Passwords don't match" : ""}
            required
            autoComplete="new-password"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={status === 'loading'}
            sx={{ mb: 3, py: 1.5 }}
          >
            {status === 'loading' ? 'Creating Account...' : 'Create Account'}
          </Button>

          <Typography align="center" sx={{ mt: 3 }}>
            Already have an account?{' '}
            <Button 
              component={Link}
              to="/login"
              sx={{ textTransform: 'none' }}
            >
              Sign in
            </Button>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}