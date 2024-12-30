// store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // default is localStorage

import authReducer from './slices/authSlice'; // Import the slices you will create
import cartReducer from './slices/cartSlice'; 
import homeReducer from './slices/homeSlice';

// Persist configurations for each reducer
const authPersistConfig = {
  key: 'auth',
  storage,
};

const cartPersistConfig = {
  key: 'cart',
  storage,
};

const homePersistConfig = {
  key: 'home',
  storage,
};

// Apply persistReducer to each slice
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);
const persistedHomeReducer = persistReducer(homePersistConfig, homeReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    cart: persistedCartReducer,
    home: persistedHomeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['register'],
        // Ignore these paths in the state
        ignoredPaths: ['register'],
      },
    }),
});

export const persistor = persistStore(store);
export default store;