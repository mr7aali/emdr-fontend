"use client";

import { useSyncExternalStore } from "react";

export const AUTH_STORAGE_KEY = "auth";
const EMPTY_AUTH_STATE = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  hasHydrated: false,
};
let cachedAuthRaw = null;
let cachedAuthSnapshot = EMPTY_AUTH_STATE;

const isBrowser = () => typeof window !== "undefined";

const normalizeAuthState = (authState) => ({
  ...EMPTY_AUTH_STATE,
  ...(authState ?? {}),
  isAuthenticated: Boolean(authState?.token || authState?.isAuthenticated),
  hasHydrated: true,
});

export const loadStoredAuth = () => {
  if (!isBrowser()) {
    return EMPTY_AUTH_STATE;
  }

  try {
    const storedAuth = window.localStorage.getItem(AUTH_STORAGE_KEY);

    if (storedAuth === cachedAuthRaw) {
      return cachedAuthSnapshot;
    }

    cachedAuthRaw = storedAuth;
    cachedAuthSnapshot = storedAuth
      ? normalizeAuthState(JSON.parse(storedAuth))
      : {
        ...EMPTY_AUTH_STATE,
        hasHydrated: true,
      };

    return cachedAuthSnapshot;
  } catch {
    cachedAuthRaw = null;
    cachedAuthSnapshot = {
      ...EMPTY_AUTH_STATE,
      hasHydrated: true,
    };
    return cachedAuthSnapshot;
  }
};

export const persistAuthState = (authState) => {
  if (!isBrowser()) {
    return;
  }

  const normalizedAuthState = normalizeAuthState(authState);

  if (normalizedAuthState.token) {
    const serializedAuthState = JSON.stringify(normalizedAuthState);

    window.localStorage.setItem(
      AUTH_STORAGE_KEY,
      serializedAuthState
    );
    cachedAuthRaw = serializedAuthState;
    cachedAuthSnapshot = normalizedAuthState;
    window.dispatchEvent(new Event("auth-storage-changed"));
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  cachedAuthRaw = null;
  cachedAuthSnapshot = {
    ...EMPTY_AUTH_STATE,
    hasHydrated: true,
  };
  window.dispatchEvent(new Event("auth-storage-changed"));
};

export const clearStoredAuth = () => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  cachedAuthRaw = null;
  cachedAuthSnapshot = {
    ...EMPTY_AUTH_STATE,
    hasHydrated: true,
  };
  window.dispatchEvent(new Event("auth-storage-changed"));
};

export const getStoredTokens = () => {
  const authState = loadStoredAuth();

  return {
    token: authState.token,
    refreshToken: authState.refreshToken,
  };
};

const subscribeToAuthStorage = (callback) => {
  if (!isBrowser()) {
    return () => {};
  }

  const handleStorageChange = (event) => {
    if (
      event?.type === "storage" &&
      event.key &&
      event.key !== AUTH_STORAGE_KEY
    ) {
      return;
    }

    callback();
  };

  window.addEventListener("storage", handleStorageChange);
  window.addEventListener("auth-storage-changed", handleStorageChange);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
    window.removeEventListener("auth-storage-changed", handleStorageChange);
  };
};

export const useStoredAuth = () =>
  useSyncExternalStore(subscribeToAuthStorage, loadStoredAuth, () => EMPTY_AUTH_STATE);
