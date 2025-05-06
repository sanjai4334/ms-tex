import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      console.log('🔍 Fetching products from:', apiUrl);

      const response = await fetch(`${apiUrl}/products`);
      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Products received:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching products:', error);
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
