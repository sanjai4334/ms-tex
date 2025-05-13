import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const signup = createAsyncThunk(
  'auth/signup',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 409) {
        return rejectWithValue('An account with this email already exists');
      }
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.status = 'idle';
      state.error = null;
      // Remove tokens from storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        // Navigate to shop page
        window.location.href = '/shop'; // Ensure this points to the shop page
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null;
        // Store tokens
        localStorage.setItem('accessToken', action.payload.token);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        // Navigate to shop page
        window.location.href = '/shop'; // Ensure this points to the shop page
      });
  },
});

export const { logout } = authSlice.actions;

// Add selector
export const selectAuth = (state) => ({
  user: state.auth.user,
  isAuthenticated: Boolean(state.auth.user),
  status: state.auth.status
});

export default authSlice.reducer;