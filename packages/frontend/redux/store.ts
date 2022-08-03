import { configureStore } from '@reduxjs/toolkit';
import thunkMiddleware from 'redux-thunk';
import connectionReducer from './slices/connection';

export const store = configureStore({
  reducer: {
    connection: connectionReducer,
  },
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(thunkMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
