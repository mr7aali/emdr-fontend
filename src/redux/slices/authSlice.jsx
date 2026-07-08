import { createSlice } from "@reduxjs/toolkit";
import { loadStoredAuth } from "../authStorage";

const createEmptyAuthState = () => ({
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
});

export const loadAuthFromStorage = () => {
  if (typeof window === "undefined") {
    return createEmptyAuthState();
  }

  try {
    const parsedAuth = loadStoredAuth();

    return {
      ...createEmptyAuthState(),
      ...parsedAuth,
      isAuthenticated: Boolean(parsedAuth?.token || parsedAuth?.isAuthenticated),
    };
  } catch {
    return createEmptyAuthState();
  }
};

const initialState = createEmptyAuthState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrateAuth: (_state, action) => {
      const payload = action.payload ?? {};

      return {
        ...createEmptyAuthState(),
        ...payload,
        isAuthenticated: Boolean(payload?.token || payload?.isAuthenticated),
      };
    },
    setLogin: (state, action) => {
      const { user = null, token = null, refreshToken = null } =
        action.payload ?? {};

      state.user = user;
      state.token = token;
      state.refreshToken = refreshToken;
      state.isAuthenticated = Boolean(token);
    },
    setTokens: (state, action) => {
      const { token = null, refreshToken = state.refreshToken } =
        action.payload ?? {};

      state.token = token;
      state.refreshToken = refreshToken;
      state.isAuthenticated = Boolean(token);
    },
    updateUser: (state, action) => {
      state.user = action.payload ?? null;
    },
    logout: () => createEmptyAuthState(),
  },
});

export const { hydrateAuth, setLogin, setTokens, updateUser, logout } =
  authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export default authSlice.reducer;
