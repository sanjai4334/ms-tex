import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import favoritesReducer from './slices/favoritesSlice';
import cartReducer from './slices/cartSlice';

export const store = configureStore({
  reducer: {
    products: productReducer,
    favorites: favoritesReducer,
    cart: cartReducer,
  },
});
