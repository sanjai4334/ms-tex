import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      console.log('🚀 Starting API call...');
      console.log('📍 API URL:', apiUrl);
      
      if (!apiUrl) {
        throw new Error('API URL not configured. Check .env file.');
      }

      const response = await fetch(`${apiUrl}/products`);
      
      console.log('📡 Response received:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries([...response.headers.entries()]),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Parsed data:', data);
      return data;
    } catch (error) {
      console.error('❌ Fetch error:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      return rejectWithValue(error.message);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        console.log('🔄 Fetching products...');
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        console.log('✅ Fetch succeeded:', action.payload);
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        console.error('❌ Fetch failed:', action.payload);
        state.status = 'failed';
        state.error = action.payload || 'Unknown error occurred';
      });
  },
});

export default productSlice.reducer;
