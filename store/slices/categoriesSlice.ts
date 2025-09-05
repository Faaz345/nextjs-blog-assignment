import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { Category } from '@/lib/types';

interface CategoriesState {
  items: Category[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
}

const initialState: CategoriesState = {
  items: [],
  status: 'idle',
};

export const fetchCategories = createAsyncThunk('categories/fetchAll', async () => {
  const res = await fetch('/api/categories');
  if (!res.ok) throw new Error('Failed to fetch categories');
  const json = await res.json();
  return json.data as Category[];
});

export const createCategoryAsync = createAsyncThunk(
  'categories/create',
  async (name: string) => {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error('Failed to create category');
    const json = await res.json();
    return json.data as Category;
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createCategoryAsync.fulfilled, (state, action) => {
        const exists = state.items.find((c) => c.id === action.payload.id);
        if (!exists) state.items.push(action.payload);
        state.items.sort((a, b) => a.name.localeCompare(b.name));
      });
  },
});

export default categoriesSlice.reducer;

