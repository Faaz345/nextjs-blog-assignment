import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { FiltersState, ID, SortBy, SortOrder } from '@/lib/types';

const initialState: FiltersState = {
  q: '',
  categoryIds: [],
  tagIds: [],
  authorId: null,
  sortBy: 'date',
  sortOrder: 'desc',
  page: 1,
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.q = action.payload;
      state.page = 1;
    },
    setCategoryIds(state, action: PayloadAction<ID[]>) {
      state.categoryIds = action.payload;
      state.page = 1;
    },
    setTagIds(state, action: PayloadAction<ID[]>) {
      state.tagIds = action.payload;
      state.page = 1;
    },
    setAuthorId(state, action: PayloadAction<ID | null>) {
      state.authorId = action.payload;
      state.page = 1;
    },
    setSort(
      state,
      action: PayloadAction<{ sortBy: SortBy; sortOrder: SortOrder }>
    ) {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
      state.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = Math.max(1, action.payload);
    },
    resetFilters() {
      return initialState;
    },
  },
});

export const { setQuery, setCategoryIds, setTagIds, setAuthorId, setSort, setPage, resetFilters } = filtersSlice.actions;
export default filtersSlice.reducer;

