import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';
import Api from '../../api/EndPoint';
import toast from 'react-hot-toast';

export interface Note {
  id: string | number;
  leadId: string | number;
  content: string;
  createdBy: string;
  createdAt: string;
}

interface NoteState {
  notes: Note[];
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
}

const initialState: NoteState = {
  notes: [],
  loading: false,
  actionLoading: false,
  error: null,
};

// Fetch Notes for Lead
export const fetchNotesByLead = createAsyncThunk(
  'notes/fetchByLead',
  async (leadId: string | number, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(Api.LEAD_NOTES(leadId));
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch notes');
    }
  }
);

// Add Note
export const addNote = createAsyncThunk(
  'notes/add',
  async (
    { leadId, content }: { leadId: string | number; content: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post(Api.LEAD_NOTES(leadId), { content });
      toast.success(response.data.message || 'Note added successfully!');
      return response.data.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to add note';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// Delete Note
export const deleteNote = createAsyncThunk(
  'notes/delete',
  async (
    { leadId, noteId }: { leadId: string | number; noteId: string | number },
    { rejectWithValue }
  ) => {
    try {
      await apiClient.delete(Api.DELETE_NOTE(leadId, noteId));
      toast.success('Note removed.');
      return noteId;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to delete note';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const noteSlice = createSlice({
  name: 'note',
  initialState,
  reducers: {
    clearNotes: (state) => {
      state.notes = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch
    builder.addCase(fetchNotesByLead.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchNotesByLead.fulfilled, (state, action: PayloadAction<Note[]>) => {
      state.loading = false;
      state.notes = action.payload;
    });
    builder.addCase(fetchNotesByLead.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Add
    builder.addCase(addNote.pending, (state) => {
      state.actionLoading = true;
    });
    builder.addCase(addNote.fulfilled, (state, action: PayloadAction<Note>) => {
      state.actionLoading = false;
      state.notes.unshift(action.payload);
    });
    builder.addCase(addNote.rejected, (state) => {
      state.actionLoading = false;
    });

    // Delete
    builder.addCase(deleteNote.pending, (state) => {
      state.actionLoading = true;
    });
    builder.addCase(deleteNote.fulfilled, (state, action) => {
      state.actionLoading = false;
      state.notes = state.notes.filter((n) => String(n.id) !== String(action.payload));
    });
    builder.addCase(deleteNote.rejected, (state) => {
      state.actionLoading = false;
    });
  },
});

export const { clearNotes } = noteSlice.actions;
export default noteSlice.reducer;
