"use client";

export const RECOVERY_STORAGE_KEY = "password-recovery";

const EMPTY_RECOVERY_STATE = {
  accessToken: null,
  devOtp: null,
  email: "",
};

const isBrowser = () => typeof window !== "undefined";

const normalizeRecoveryState = (state) => ({
  ...EMPTY_RECOVERY_STATE,
  ...(state ?? {}),
  email: typeof state?.email === "string" ? state.email : "",
});

export const loadRecoveryState = () => {
  if (!isBrowser()) {
    return EMPTY_RECOVERY_STATE;
  }

  try {
    const storedState = window.sessionStorage.getItem(RECOVERY_STORAGE_KEY);
    return storedState
      ? normalizeRecoveryState(JSON.parse(storedState))
      : EMPTY_RECOVERY_STATE;
  } catch {
    return EMPTY_RECOVERY_STATE;
  }
};

export const persistRecoveryState = (state) => {
  if (!isBrowser()) {
    return;
  }

  const normalizedState = normalizeRecoveryState(state);

  if (
    !normalizedState.email &&
    !normalizedState.accessToken &&
    !normalizedState.devOtp
  ) {
    window.sessionStorage.removeItem(RECOVERY_STORAGE_KEY);
    return;
  }

  window.sessionStorage.setItem(
    RECOVERY_STORAGE_KEY,
    JSON.stringify(normalizedState),
  );
};

export const clearRecoveryState = () => {
  if (!isBrowser()) {
    return;
  }

  window.sessionStorage.removeItem(RECOVERY_STORAGE_KEY);
};
