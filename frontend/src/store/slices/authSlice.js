import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../../api/axios';
import { setFavorites } from './favoritesSlice';
import { setCart } from './cartSlice';

// Helper functions to get and set user info in localStorage
const getUserFromLocalStorage = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

const setUserToLocalStorage = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

const removeUserFromLocalStorage = () => {
  localStorage.removeItem('user');
};

// Async actions
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);

      // Fetch user favorites and cart data after login
      const userDataResponse = await axios.get('/user/data', {
        headers: { Authorization: `Bearer ${data.token}` }
      });
      const { favorites, cart } = userDataResponse.data;

      // Transform cart items to match cartSlice expected format
      const transformedCart = cart.map(item => ({
        id: item.product._id,
        quantity: item.quantity,
        ...item.product
      }));

      dispatch(setFavorites(favorites));
      dispatch(setCart(transformedCart));

      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/auth/register', userData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

// Async thunk to save favorites and cart data on logout
export const saveUserDataOnLogout = createAsyncThunk(
  'auth/saveUserDataOnLogout',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.token;
      const favorites = state.favorites.items;
      const cart = state.cart.items;
      if (!token) {
        return rejectWithValue('No auth token found');
      }
      await axios.post('/user/data', { favorites, cart }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to save user data');
    }
  }
);

const initialState = {
  user: getUserFromLocalStorage(),
  token: localStorage.getItem('token') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  status: 'idle',
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      // Note: We cannot dispatch async thunk here directly, so this should be handled in the component before dispatching logout
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      removeUserFromLocalStorage();
    },
    setToken(state, action) {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const user = {
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          email: action.payload.email
        };
        state.user = user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        setUserToLocalStorage(user);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const user = {
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          email: action.payload.email
        };
        state.user = user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        setUserToLocalStorage(user);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const selectAuth = (state) => ({
  ...state.auth,
  isAuthenticated: Boolean(state.auth.token)
});

export const { logout, setToken } = authSlice.actions;
export default authSlice.reducer;
