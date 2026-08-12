import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../../shared/types";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

function userFromToken(): User | null {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1])) as {
      sub: string;
      email: string;
    };
    return { id: payload.sub, email: payload.email };
  } catch {
    return null;
  }
}

const initialState: AuthState = {
  isAuthenticated: Boolean(userFromToken()),
  user: userFromToken(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{
        user: User;
        accessToken: string;
        refreshToken: string;
      }>,
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
