import { createSlice } from '@reduxjs/toolkit';

const loadFavoritesFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem('favorites');
    if (serializedState === null) {
      return [];
    }
    return JSON.parse(serializedState);
  } catch (e) {
    console.warn('Failed to load favorites from localStorage', e);
    return [];
  }
};

const saveFavoritesToLocalStorage = (favorites) => {
  try {
    const serializedState = JSON.stringify(favorites);
    localStorage.setItem('favorites', serializedState);
  } catch (e) {
    console.warn('Failed to save favorites to localStorage', e);
  }
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    items: loadFavoritesFromLocalStorage()
  },
  reducers: {
    toggleFavorite: (state, action) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index === -1) {
        state.items.push(action.payload);
      } else {
        state.items.splice(index, 1);
      }
      saveFavoritesToLocalStorage(state.items);
    },
    setFavorites: (state, action) => {
      state.items = action.payload;
      saveFavoritesToLocalStorage(state.items);
    }
  }
});

export const { toggleFavorite, setFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
