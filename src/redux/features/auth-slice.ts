// redux/features/auth-slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface AuthState {
  userId: string | null;
  name: string | null;
  email: string | null;
  role: string | null;
  sedeId: string | null;
}

const initialState: AuthState = {
  userId: null,
  name: null,
  email: null,
  role: null,
  sedeId: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthData: (state, action: PayloadAction<AuthState>) => {
      console.log("SETTEANDO AUTH STORE: ", action.payload);
      return { ...action.payload };
    },
    logout: () => initialState,
  },
});

// Selector base para el estado de auth
export const selectAuth = (state: RootState) => state.auth;

// Selectores específicos (Útiles para evitar re-renders innecesarios)
export const selectUserId = (state: RootState) => state.auth.userId;
export const selectSedeId = (state: RootState) => state.auth.sedeId;
export const selectUserRole = (state: RootState) => state.auth.role;

export const { setAuthData, logout } = authSlice.actions;
export default authSlice.reducer;
