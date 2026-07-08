"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useSendVerificationOtpMutation,
  useVerifyRecoveryOtpMutation,
} from "@/redux/features/login";
import {
  loadRecoveryState,
  persistRecoveryState,
} from "@/redux/recoveryStorage";

const getErrorMessage = (error) => {
  if (!error) {
    return "";
  }

  if (typeof error === "string") {
    return error;
  }

  if (typeof error?.message === "string") {
    return error.message;
  }

  if (typeof error?.error === "string") {
    return error.error;
  }

  if (error?.error && typeof error.error?.message === "string") {
    return error.error.message;
  }

  if (typeof error?.data?.message === "string") {
    return error.data.message;
  }

  if (typeof error?.data?.data?.message === "string") {
    return error.data.data.message;
  }

  if (typeof error?.data?.error === "string") {
    return error.data.error;
  }

  if (typeof error?.data?.error?.message === "string") {
    return error.data.error.message;
  }

  return "We could not verify the recovery code. Please try again.";
};

function RecoverCodePageContent() {
  const [otp, setOtp] = useState("");
  const [formError, setFormError] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRecoveryState = loadRecoveryState();
  const [email, setEmail] = useState(
    () => searchParams.get("email")?.trim() || initialRecoveryState.email || "",
  );
  const [verifyRecoveryOtp, { isLoading, error }] =
    useVerifyRecoveryOtpMutation();
  const [sendVerificationOtp, { isLoading: isResending }] =
    useSendVerificationOtpMutation();

  useEffect(() => {
    if (!email) {
      router.replace("/authentication/recover");
    }
  }, [email, router]);

  const apiErrorMessage = formError || getErrorMessage(error);

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    setFormError("");
    setResendMessage("");

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedOtp = otp.trim();

    if (!normalizedEmail) {
      setFormError("Please enter your email address.");
      return;
    }

    if (!normalizedOtp) {
      setFormError("Please enter the recovery code.");
      return;
    }

    try {
      const response = await verifyRecoveryOtp({
        email: normalizedEmail,
        otp: normalizedOtp,
      }).unwrap();

      persistRecoveryState({
        accessToken: response?.data?.accessToken || null,
        devOtp: null,
        email: normalizedEmail,
      });
      router.push("/authentication/reset-password");
    } catch (verifyError) {
      setFormError(getErrorMessage(verifyError));
    }
  };

  const handleResendCode = async () => {
    setFormError("");
    setResendMessage("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setFormError("Please start again and enter your email address.");
      return;
    }

    try {
      const response = await sendVerificationOtp({
        email: normalizedEmail,
      }).unwrap();

      persistRecoveryState({
        ...loadRecoveryState(),
        accessToken: null,
        devOtp: response?.data?._dev_otp || null,
        email: normalizedEmail,
      });
      setResendMessage(response?.data?.message || "A new code has been sent.");
    } catch (resendError) {
      setFormError(getErrorMessage(resendError));
    }
  };

  const storedRecoveryState = loadRecoveryState();

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 bg-[#4A7C59] flex items-center justify-center px-16">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-[#FFFFFF] text-3xl font-normal mb-2">
              Recover Account
            </h1>
            <p className="text-white/90 text-[14px]">
              Enter the recovery code sent to {email || "your email"}.
            </p>
          </div>
          <form onSubmit={handleOtpSubmit} className="space-y-5">
            <div>
              <label className="block text-white text-sm mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your e-mail address"
                className="w-full px-4 py-3 rounded-lg bg-transparent border border-white/40 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-white text-sm mb-2">
                Recovery Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Recovery Code"
                className="w-full px-4 py-3 rounded-lg bg-transparent border border-white/40 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                required
              />
            </div>
            {/* {storedRecoveryState.devOtp ? (
              <p className="rounded-lg border border-[#FFE6C9] bg-[#FFF7ED] px-4 py-3 text-sm text-[#9A3412]">
                Development OTP: {storedRecoveryState.devOtp}
              </p>
            ) : null} */}
            {apiErrorMessage ? (
              <p className="rounded-lg border border-[#FFB3B3] bg-[#FFF1F1] px-4 py-3 text-sm text-[#B42318]">
                {apiErrorMessage}
              </p>
            ) : null}
            {resendMessage ? (
              <p className="rounded-lg border border-[#B7E4C7] bg-[#F0FFF4] px-4 py-3 text-sm text-[#276749]">
                {resendMessage}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-xl bg-[#FFE6C9] hover:bg-[#eddcc4] text-stone-900 font-semibold py-3 rounded-lg transition-colors duration-200 mt-4 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? "Verifying..." : "Next"}
            </button>
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isResending}
                className="text-white/90 text-sm hover:underline"
              >
                {isResending ? "Sending..." : "Didn't receive the code? Resend"}
              </button>
            </div>

            <Link
              href="/authentication/login"
              className="flex items-center justify-center gap-2 text-white/90 hover:text-white transition-colors mt-6 text-sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Login
            </Link>
          </form>
        </div>
      </div>

      <div className="w-1/2 bg-white">
        <img
          src="/homeImage/loginimg.png"
          alt="Recover Account"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

export default function RecoverCodePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#4A7C59] text-white">
          Loading recovery...
        </div>
      }
    >
      <RecoverCodePageContent />
    </Suspense>
  );
}
