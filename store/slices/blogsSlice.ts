import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { Blog } from '@/lib/types';

interface BlogsState {
  items: Blog[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
}

const initialState: BlogsState = {
  items: [],
  status: 'idle',
};

export const fetchBlogs = createAsyncThunk('blogs/fetchAll', async () => {
  const res = await fetch('/api/blogs');
  if (!res.ok) throw new Error('Failed to fetch blogs');
  const json = await res.json();
  return json.data as Blog[];
});

export const deleteBlog = createAsyncThunk(
  'blogs/delete',
  async (slug: string) => {
    const res = await fetch(`/api/blogs/${encodeURIComponent(slug)}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete blog');
    return slug;
  }
);

const blogsSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.items = state.items.filter((b) => b.slug !== action.payload);
      });
  },
});

export default blogsSlice.reducer;

