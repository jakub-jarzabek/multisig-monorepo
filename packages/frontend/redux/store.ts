import { configureStore } from '@reduxjs/toolkit';
import thunkMiddleware from 'redux-thunk';
import connectionReducer from './slices/connection';
import walletReducer from './slices/wallet';

export const store = configureStore({
  reducer: {
    connection: connectionReducer,
    wallet: walletReducer,
  },
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(thunkMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
