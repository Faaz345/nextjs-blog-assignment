import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { Tag } from '@/lib/types';

interface TagsState {
  items: Tag[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
}

const initialState: TagsState = {
  items: [],
  status: 'idle',
};

export const fetchTags = createAsyncThunk('tags/fetchAll', async () => {
  const res = await fetch('/api/tags');
  if (!res.ok) throw new Error('Failed to fetch tags');
  const json = await res.json();
  return json.data as Tag[];
});

export const createTagAsync = createAsyncThunk(
  'tags/create',
  async (name: string) => {
    const res = await fetch('/api/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error('Failed to create tag');
    const json = await res.json();
    return json.data as Tag;
  }
);

const tagsSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTags.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createTagAsync.fulfilled, (state, action) => {
        const exists = state.items.find((t) => t.id === action.payload.id);
        if (!exists) state.items.push(action.payload);
        state.items.sort((a, b) => a.name.localeCompare(b.name));
      });
  },
});

export default tagsSlice.reducer;

