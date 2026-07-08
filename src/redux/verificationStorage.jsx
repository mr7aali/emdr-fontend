"use client";

export const VERIFICATION_STORAGE_KEY = "email-verification";

const EMPTY_VERIFICATION_STATE = {
  devOtp: null,
  email: "",
};

const isBrowser = () => typeof window !== "undefined";

const normalizeVerificationState = (state) => ({
  ...EMPTY_VERIFICATION_STATE,
  ...(state ?? {}),
  email: typeof state?.email === "string" ? state.email : "",
});

export const loadVerificationState = () => {
  if (!isBrowser()) {
    return EMPTY_VERIFICATION_STATE;
  }

  try {
    const storedState = window.sessionStorage.getItem(VERIFICATION_STORAGE_KEY);
    return storedState
      ? normalizeVerificationState(JSON.parse(storedState))
      : EMPTY_VERIFICATION_STATE;
  } catch {
    return EMPTY_VERIFICATION_STATE;
  }
};

export const persistVerificationState = (state) => {
  if (!isBrowser()) {
    return;
  }

  const normalizedState = normalizeVerificationState(state);

  if (!normalizedState.email && !normalizedState.devOtp) {
    window.sessionStorage.removeItem(VERIFICATION_STORAGE_KEY);
    return;
  }

  window.sessionStorage.setItem(
    VERIFICATION_STORAGE_KEY,
    JSON.stringify(normalizedState),
  );
};

export const clearVerificationState = () => {
  if (!isBrowser()) {
    return;
  }

  window.sessionStorage.removeItem(VERIFICATION_STORAGE_KEY);
};
