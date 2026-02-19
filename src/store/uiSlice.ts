import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// ============================================================
// State interface
// ============================================================
interface UIState {
  // Book list filters
  searchQuery: string;
  selectedCategoryId: number | null;
  selectedAuthorId: number | null;
  minRating: number | null;
  currentPage: number;

  // Global UI
  isSidebarOpen: boolean;
  isCartOpen: boolean;
}

// ============================================================
// Initial state
// ============================================================
const initialState: UIState = {
  searchQuery: "",
  selectedCategoryId: null,
  selectedAuthorId: null,
  minRating: null,
  currentPage: 1,
  isSidebarOpen: false,
  isCartOpen: false,
};

// ============================================================
// Slice
// ============================================================
const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
      state.currentPage = 1; // Reset to page 1 on new search
    },

    setSelectedCategory(state, action: PayloadAction<number | null>) {
      state.selectedCategoryId = action.payload;
      state.currentPage = 1;
    },

    setSelectedAuthor(state, action: PayloadAction<number | null>) {
      state.selectedAuthorId = action.payload;
      state.currentPage = 1;
    },

    setMinRating(state, action: PayloadAction<number | null>) {
      state.minRating = action.payload;
      state.currentPage = 1;
    },

    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },

    resetFilters(state) {
      state.searchQuery = "";
      state.selectedCategoryId = null;
      state.selectedAuthorId = null;
      state.minRating = null;
      state.currentPage = 1;
    },

    toggleSidebar(state) {
      state.isSidebarOpen = !state.isSidebarOpen;
    },

    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.isSidebarOpen = action.payload;
    },

    toggleCart(state) {
      state.isCartOpen = !state.isCartOpen;
    },

    setCartOpen(state, action: PayloadAction<boolean>) {
      state.isCartOpen = action.payload;
    },
  },
});

export const {
  setSearchQuery,
  setSelectedCategory,
  setSelectedAuthor,
  setMinRating,
  setCurrentPage,
  resetFilters,
  toggleSidebar,
  setSidebarOpen,
  toggleCart,
  setCartOpen,
} = uiSlice.actions;

export default uiSlice.reducer;

// ============================================================
// Selectors
// ============================================================
interface UIStateWrapper {
  ui: UIState;
}

export const selectSearchQuery = (state: UIStateWrapper) =>
  state.ui.searchQuery;
export const selectSelectedCategoryId = (state: UIStateWrapper) =>
  state.ui.selectedCategoryId;
export const selectSelectedAuthorId = (state: UIStateWrapper) =>
  state.ui.selectedAuthorId;
export const selectMinRating = (state: UIStateWrapper) => state.ui.minRating;
export const selectCurrentPage = (state: UIStateWrapper) =>
  state.ui.currentPage;
export const selectIsSidebarOpen = (state: UIStateWrapper) =>
  state.ui.isSidebarOpen;
export const selectIsCartOpen = (state: UIStateWrapper) => state.ui.isCartOpen;


// Combined selector for book query params
export const selectBookFilters = (state: UIStateWrapper) => ({
  q: state.ui.searchQuery || undefined,
  categoryId: state.ui.selectedCategoryId ?? undefined,
  authorId: state.ui.selectedAuthorId ?? undefined,
  minRating: state.ui.minRating ?? undefined,
  page: state.ui.currentPage,
});