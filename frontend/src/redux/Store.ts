import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import leadReducer from './slices/leadSlice';
import noteReducer from './slices/noteSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    lead: leadReducer,
    note: noteReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
