import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthUser } from "../types";
import { STORAGE_KEYS } from "../constants";
import type { RootState } from "./index"

// ============================================================
// Helper: load initial state from localStorage
// ============================================================
function loadAuthFromStorage(): { token: string | null; user: AuthUser | null } {
  try {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    const user = userStr ? (JSON.parse(userStr) as AuthUser) : null;
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
}

// ============================================================
// State interface
// ============================================================
interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

// ============================================================
// Initial state
// ============================================================
const { token, user } = loadAuthFromStorage();

const initialState: AuthState = {
  token,
  user,
  isAuthenticated: !!token && !!user,
  isAdmin: user?.role === "ADMIN",
};

// ============================================================
// Slice
// ============================================================
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ token: string; user: AuthUser }>
    ) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isAdmin = action.payload.user.role === "ADMIN";

      // Persist to localStorage
      localStorage.setItem(STORAGE_KEYS.TOKEN, action.payload.token);
      localStorage.setItem(
        STORAGE_KEYS.USER,
        JSON.stringify(action.payload.user)
      );
    },

    updateUser(state, action: PayloadAction<Partial<AuthUser>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(state.user));
      }
    },

    logout(state) {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.isAdmin = false;

      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    },
  },
});

export const { setCredentials, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;

// ============================================================
// Selectors
// ============================================================
export const selectToken = (state: { auth: AuthState }) => state.auth.token;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
export const selectIsAdmin = (state: { auth: AuthState }) => state.auth.isAdmin;
// Tambahkan ini di authSlice.ts
export const selectCurrentUser = (state: RootState) => state.auth.user;