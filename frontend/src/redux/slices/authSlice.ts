import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';
import Api from '../../api/EndPoint';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

export interface User {
  id: number | string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const savedUserCookie = Cookies.get('authUser');
const savedUser = savedUserCookie ? JSON.parse(savedUserCookie) : null;
const savedToken = Cookies.get('accessToken') || null;

const initialState: AuthState = {
  user: savedUser,
  accessToken: savedToken,
  isAuthenticated: Boolean(savedToken),
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(Api.LOGIN, credentials);
      const { user, accessToken } = response.data.data;

      Cookies.set('authUser', JSON.stringify(user), { sameSite: 'lax', secure: window.location.protocol === 'https:' });
      Cookies.set('accessToken', accessToken, { sameSite: 'lax', secure: window.location.protocol === 'https:' });

      toast.success(response.data.message || 'Logged in successfully!');
      return { user, accessToken };
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await apiClient.post(Api.LOGOUT);
  } catch (e) {
    // Ignore error on logout
  } finally {
    Cookies.remove('authUser');
    Cookies.remove('accessToken');
    toast.success('Logged out successfully.');
  }
});

export const fetchProfile = createAsyncThunk('auth/profile', async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get(Api.PROFILE);
    return response.data.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      Cookies.remove('authUser');
      Cookies.remove('accessToken');
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action: PayloadAction<{ user: User; accessToken: string }>) => {
      state.loading = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    });

    // Profile
    builder.addCase(fetchProfile.fulfilled, (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    });
  },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;
