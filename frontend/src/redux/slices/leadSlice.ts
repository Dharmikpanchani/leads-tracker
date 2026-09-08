import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';
import Api from '../../api/EndPoint';
import toast from 'react-hot-toast';

export interface Lead {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'lost';
  source?: string;
  notesCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface LeadStats {
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  lost: number;
}

interface LeadState {
  leads: Lead[];
  currentLead: Lead | null;
  stats: LeadStats;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
}

const initialState: LeadState = {
  leads: [],
  currentLead: null,
  stats: { total: 0, new: 0, contacted: 0, qualified: 0, lost: 0 },
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
  loading: false,
  actionLoading: false,
  error: null,
};

// Fetch Leads list with query filters
export const fetchLeads = createAsyncThunk(
  'leads/fetchAll',
  async (
    params: { search?: string; status?: string; page?: number; limit?: number } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.get(Api.LEADS, { params });
      return {
        leads: response.data.data,
        meta: response.data.meta,
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch leads');
    }
  }
);

// Fetch Lead Stats
export const fetchLeadStats = createAsyncThunk('leads/fetchStats', async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get(Api.LEAD_STATS);
    return response.data.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message);
  }
});

// Fetch Single Lead
export const fetchLeadById = createAsyncThunk(
  'leads/fetchById',
  async (id: string | number, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(Api.LEAD_BY_ID(id));
      return response.data.data;
    } catch (err: any) {
      toast.error('Lead not found');
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

// Create Lead
export const createLead = createAsyncThunk(
  'leads/create',
  async (leadData: Partial<Lead>, { rejectWithValue, dispatch }) => {
    try {
      const response = await apiClient.post(Api.LEADS, leadData);
      toast.success(response.data.message || 'Lead created successfully!');
      dispatch(fetchLeadStats());
      return response.data.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to create lead';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// Update Lead
export const updateLead = createAsyncThunk(
  'leads/update',
  async ({ id, data }: { id: number | string; data: Partial<Lead> }, { rejectWithValue, dispatch }) => {
    try {
      const response = await apiClient.patch(Api.LEAD_BY_ID(id), data);
      toast.success(response.data.message || 'Lead updated successfully!');
      dispatch(fetchLeadStats());
      return response.data.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to update lead';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// Delete Lead
export const deleteLead = createAsyncThunk(
  'leads/delete',
  async (id: number | string, { rejectWithValue, dispatch }) => {
    try {
      const response = await apiClient.delete(Api.LEAD_BY_ID(id));
      toast.success(response.data.message || 'Lead deleted successfully.');
      dispatch(fetchLeadStats());
      return id;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to delete lead';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const leadSlice = createSlice({
  name: 'lead',
  initialState,
  reducers: {
    setCurrentLead: (state, action: PayloadAction<Lead | null>) => {
      state.currentLead = action.payload;
    },
    resetLeadList: (state) => {
      state.leads = [];
      state.loading = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch All
    builder.addCase(fetchLeads.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchLeads.fulfilled, (state, action) => {
      state.loading = false;
      state.leads = action.payload.leads;
      if (action.payload.meta) {
        state.total = action.payload.meta.total;
        state.page = action.payload.meta.page;
        state.limit = action.payload.meta.limit;
        state.totalPages = action.payload.meta.totalPages;
      }
    });
    builder.addCase(fetchLeads.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Stats
    builder.addCase(fetchLeadStats.fulfilled, (state, action) => {
      state.stats = action.payload;
    });

    // Single Lead
    builder.addCase(fetchLeadById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchLeadById.fulfilled, (state, action) => {
      state.loading = false;
      state.currentLead = action.payload;
    });
    builder.addCase(fetchLeadById.rejected, (state) => {
      state.loading = false;
    });

    // Create / Update Action Loading
    builder.addCase(createLead.pending, (state) => {
      state.actionLoading = true;
    });
    builder.addCase(createLead.fulfilled, (state, action) => {
      state.actionLoading = false;
      state.leads.unshift(action.payload);
      state.total += 1;
    });
    builder.addCase(createLead.rejected, (state) => {
      state.actionLoading = false;
    });

    builder.addCase(updateLead.pending, (state) => {
      state.actionLoading = true;
    });
    builder.addCase(updateLead.fulfilled, (state, action) => {
      state.actionLoading = false;
      const index = state.leads.findIndex((l) => l.id === action.payload.id);
      if (index !== -1) {
        state.leads[index] = action.payload;
      }
      if (state.currentLead?.id === action.payload.id) {
        state.currentLead = action.payload;
      }
    });
    builder.addCase(updateLead.rejected, (state) => {
      state.actionLoading = false;
    });

    // Delete
    builder.addCase(deleteLead.pending, (state) => {
      state.actionLoading = true;
    });
    builder.addCase(deleteLead.fulfilled, (state, action) => {
      state.actionLoading = false;
      state.leads = state.leads.filter((l) => String(l.id) !== String(action.payload));
      state.total -= 1;
    });
    builder.addCase(deleteLead.rejected, (state) => {
      state.actionLoading = false;
    });
  },
});

export const { setCurrentLead, resetLeadList } = leadSlice.actions;
export default leadSlice.reducer;
