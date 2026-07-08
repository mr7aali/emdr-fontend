import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { baseApi } from "./api/baseApi";
import { persistAuthState } from "./authStorage";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

setupListeners(store.dispatch);

if (typeof window !== "undefined") {
  let currentAuthState = store.getState().auth;

  store.subscribe(() => {
    const nextAuthState = store.getState().auth;

    if (nextAuthState === currentAuthState) {
      return;
    }

    currentAuthState = nextAuthState;

    persistAuthState(nextAuthState);
  });
}
