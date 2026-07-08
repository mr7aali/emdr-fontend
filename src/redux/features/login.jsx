import { baseApi } from "../api/baseApi";
import { clearStoredAuth, getStoredTokens } from "../authStorage";
import {
  logout as logoutUser,
  setLogin,
  setTokens,
  updateUser,
} from "../slices/authSlice";

export const AUTH_ENDPOINTS = {
  login: "/api/auth/login",
  google: "/api/auth/google",
  logout: "/api/auth/logout",
  signup: "/api/auth/signup",
  verifyOtp: "/api/auth/verify-otp",
  sendVerificationOtp: "/api/auth/send-verification-otp",
  recoverAccount: "/api/auth/recover-account",
  forgotPassword: "/api/auth/forgot-password",
  resetPassword: "/api/auth/reset-password",
  profile: "/api/profile",
};

const unwrapResponse = (response) => {
  const firstLayer = response?.data ?? response ?? {};
  return firstLayer?.data ?? firstLayer;
};

const normalizeUser = (user) => {
  if (!user) {
    return null;
  }

  const avatar = user.avatar || user.profilePic || "";

  return {
    ...user,
    fullName: user.fullName || user.name || "",
    phoneNumber: user.phoneNumber || "",
    avatar,
    profilePic: user.profilePic || avatar,
  };
};

const getUser = (response) => {
  const payload = unwrapResponse(response);
  return normalizeUser(payload?.user || (payload?.email ? payload : null));
};

const getAccessToken = (response) => {
  const payload = unwrapResponse(response);

  return (
    payload?.session?.accessToken ||
    payload?.tokens?.accessToken ||
    payload?.accessToken ||
    payload?.token ||
    null
  );
};

const getRefreshToken = (response) => {
  const payload = unwrapResponse(response);
  return (
    payload?.session?.refreshToken ||
    payload?.tokens?.refreshToken ||
    payload?.refreshToken ||
    null
  );
};

const syncAuthSession = async (dispatch, data) => {
  const token = getAccessToken(data);

  if (!token) {
    return null;
  }

  const refreshToken = getRefreshToken(data);
  const user = getUser(data);

  if (user) {
    dispatch(
      setLogin({
        user,
        token,
        refreshToken,
      }),
    );

    return user;
  }

  dispatch(
    setTokens({
      token,
      refreshToken,
    }),
  );

  return null;
};

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: AUTH_ENDPOINTS.login,
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
      async onQueryStarted(_credentials, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          await syncAuthSession(dispatch, data);
        } catch {}
      },
    }),
    googleAuth: builder.mutation({
      query: (payload) => ({
        url: AUTH_ENDPOINTS.google,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Auth"],
      async onQueryStarted(_payload, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const user = await syncAuthSession(dispatch, data);

          if (!user) {
            await dispatch(
              authApi.endpoints.getProfile.initiate(undefined, {
                forceRefetch: true,
              }),
            ).unwrap();
          }
        } catch {}
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: AUTH_ENDPOINTS.logout,
        method: "POST",
        body: {
          refreshToken: getStoredTokens().refreshToken,
        },
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {
        } finally {
          clearStoredAuth();
          dispatch(logoutUser());
        }
      },
    }),
    signup: builder.mutation({
      query: (payload) => ({
        url: AUTH_ENDPOINTS.signup,
        method: "POST",
        body: payload,
      }),
    }),
    verifyOtp: builder.mutation({
      query: (payload) => ({
        url: AUTH_ENDPOINTS.verifyOtp,
        method: "POST",
        body: payload,
      }),
    }),
    sendVerificationOtp: builder.mutation({
      query: (payload) => ({
        url: AUTH_ENDPOINTS.sendVerificationOtp,
        method: "POST",
        body: payload,
      }),
    }),
    verifyRecoveryOtp: builder.mutation({
      query: (payload) => ({
        url: AUTH_ENDPOINTS.sendVerificationOtp,
        method: "POST",
        body: payload,
      }),
    }),
    recoverAccount: builder.mutation({
      query: ({ accessToken, ...payload }) => ({
        url: AUTH_ENDPOINTS.recoverAccount,
        method: "POST",
        body: payload,
        headers: accessToken
          ? {
              authorization: `Bearer ${accessToken}`,
            }
          : undefined,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (payload) => ({
        url: AUTH_ENDPOINTS.forgotPassword,
        method: "POST",
        body: typeof payload === "string" ? { email: payload } : payload,
      }),
    }),
    resetPassword: builder.mutation({
      query: (payload) => ({
        url: AUTH_ENDPOINTS.resetPassword,
        method: "POST",
        body: payload,
      }),
    }),
    updateProfile: builder.mutation({
      query: (payload) => ({
        url: AUTH_ENDPOINTS.profile,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Auth"],
      async onQueryStarted(_payload, { dispatch, getState, queryFulfilled }) {
        try {
          const previousUser = getState()?.auth?.user ?? null;
          const { data } = await queryFulfilled;
          const nextUser = getUser(data);

          if (!nextUser) {
            return;
          }

          const mergedUser = {
            ...(previousUser ?? {}),
            ...nextUser,
          };

          dispatch(updateUser(mergedUser));
          dispatch(
            authApi.util.updateQueryData("getProfile", undefined, (draft) => {
              if (!draft || typeof draft !== "object") {
                return;
              }

              if ("data" in draft) {
                draft.data = {
                  ...(draft.data ?? {}),
                  ...mergedUser,
                };
                return;
              }

              Object.assign(draft, mergedUser);
            }),
          );
        } catch {}
      },
    }),
    getProfile: builder.query({
      query: () => ({
        url: AUTH_ENDPOINTS.profile,
        method: "GET",
      }),
      providesTags: ["Auth"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const user = getUser(data);

          if (user) {
            dispatch(updateUser(user));
          }
        } catch {}
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useForgotPasswordMutation,
  useGetProfileQuery,
  useGoogleAuthMutation,
  useLoginMutation,
  useLogoutMutation,
  useRecoverAccountMutation,
  useResetPasswordMutation,
  useUpdateProfileMutation,
  useSendVerificationOtpMutation,
  useSignupMutation,
  useVerifyRecoveryOtpMutation,
  useVerifyOtpMutation,
} = authApi;

export default authApi;
