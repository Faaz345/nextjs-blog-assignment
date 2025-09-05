import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { Author } from '@/lib/types';

interface AuthorsState {
  items: Author[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
}

const initialState: AuthorsState = {
  items: [],
  status: 'idle',
};

export const fetchAuthors = createAsyncThunk('authors/fetchAll', async () => {
  const res = await fetch('/api/authors');
  if (!res.ok) throw new Error('Failed to fetch authors');
  const json = await res.json();
  return json.data as Author[];
});

export const createAuthorAsync = createAsyncThunk(
  'authors/create',
  async ({ name, bio }: { name: string; bio?: string }) => {
    const res = await fetch('/api/authors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, bio }),
    });
    if (!res.ok) throw new Error('Failed to create author');
    const json = await res.json();
    return json.data as Author;
  }
);

const authorsSlice = createSlice({
  name: 'authors',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthors.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAuthors.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchAuthors.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createAuthorAsync.fulfilled, (state, action) => {
        const exists = state.items.find((a) => a.id === action.payload.id);
        if (!exists) state.items.push(action.payload);
        state.items.sort((a, b) => a.name.localeCompare(b.name));
      });
  },
});

export default authorsSlice.reducer;

