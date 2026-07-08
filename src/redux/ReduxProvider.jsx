"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { hydrateAuth, loadAuthFromStorage } from "./slices/authSlice";

export default function ReduxProvider({ children }) {
  useEffect(() => {
    store.dispatch(hydrateAuth(loadAuthFromStorage()));
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
