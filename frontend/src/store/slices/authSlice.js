import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../../api/axios';

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
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
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

export const { logout, setToken } = authSlice.actions;
export default authSlice.reducer;
