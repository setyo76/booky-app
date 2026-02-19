import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Book } from "../types";

// ============================================================
// State interface
// ============================================================
interface CartItem {
  bookId: number;
  book: Book;
}

interface CartState {
  items: CartItem[];
}

// ============================================================
// Initial state
// ============================================================
const initialState: CartState = {
  items: [],
};

// ============================================================
// Slice
// ============================================================
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<Book>) {
      const exists = state.items.find(
        (item) => item.bookId === action.payload.id
      );
      if (!exists) {
        state.items.push({
          bookId: action.payload.id,
          book: action.payload,
        });
      }
    },

    removeItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter(
        (item) => item.bookId !== action.payload
      );
    },

    clearCart(state) {
      state.items = [];
    },

    // Sync cart from API response
    setCartItems(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
    },
  },
});

export const { addItem, removeItem, clearCart, setCartItems } =
  cartSlice.actions;
export default cartSlice.reducer;

// ============================================================
// Selectors
// ============================================================
interface CartStateWrapper {
  cart: CartState;
}

export const selectCartItems = (state: CartStateWrapper) => state.cart.items;
export const selectCartCount = (state: CartStateWrapper) =>
  state.cart.items.length;
export const selectIsInCart = (bookId: number) => (state: CartStateWrapper) =>
  state.cart.items.some((item) => item.bookId === bookId);