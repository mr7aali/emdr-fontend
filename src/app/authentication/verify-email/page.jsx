"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useStoredAuth } from "@/redux/authStorage";
import { useVerifyOtpMutation } from "@/redux/features/login";
import {
  clearVerificationState,
  loadVerificationState,
} from "@/redux/verificationStorage";

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

  return "Verification failed. Please try again.";
};

function VerifyEmailPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialVerificationState = loadVerificationState();
  const [email, setEmail] = useState(
    () =>
      searchParams.get("email")?.trim() || initialVerificationState.email || "",
  );
  const [otp, setOtp] = useState("");
  const [formError, setFormError] = useState("");
  const { token } = useStoredAuth();
  const [verifyOtp, { isLoading, error }] = useVerifyOtpMutation();
  const verificationState = loadVerificationState();

  useEffect(() => {
    if (token) {
      router.replace("/dashboard");
    }
  }, [router, token]);

  useEffect(() => {
    if (!email) {
      router.replace("/authentication/signup");
    }
  }, [email, router]);

  if (token || !email) {
    return null;
  }

  const apiErrorMessage = formError || getErrorMessage(error);

  const handleVerify = async (e) => {
    e.preventDefault();
    setFormError("");

    const normalizedEmail = email.trim();
    const normalizedOtp = otp.trim();

    if (!normalizedEmail) {
      setFormError("Please enter your email address.");
      return;
    }

    if (!normalizedOtp) {
      setFormError("Please enter the verification code.");
      return;
    }

    try {
      await verifyOtp({
        email: normalizedEmail,
        otp: normalizedOtp,
      }).unwrap();
      clearVerificationState();
      router.push(
        `/authentication/login?verified=1&email=${encodeURIComponent(normalizedEmail)}`,
      );
    } catch (verifyError) {
      setFormError(getErrorMessage(verifyError));
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 bg-[#4A7C59] flex items-center justify-center px-16 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-[#FFFFFF] text-3xl font-normal mb-2">
              Verify your email
            </h1>
            <p className="text-white/90 text-[14px]">
              Enter the code sent to your email address to activate your
              account.
            </p>
          </div>
          <form onSubmit={handleVerify} className="space-y-5">
            <div>
              <label className="block text-white text-sm mb-2">
                Email address
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
                Verification code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter your OTP"
                className="w-full px-4 py-3 rounded-lg bg-transparent border border-white/40 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                required
              />
            </div>
            {/* {verificationState.devOtp ? (
              <p className="rounded-lg border border-[#FFE6C9] bg-[#FFF7ED] px-4 py-3 text-sm text-[#9A3412]">
                Development OTP: {verificationState.devOtp}
              </p>
            ) : null} */}
            {apiErrorMessage ? (
              <p className="rounded-lg border border-[#FFB3B3] bg-[#FFF1F1] px-4 py-3 text-sm text-[#B42318]">
                {apiErrorMessage}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-xl bg-[#FFE6C9] hover:bg-[#eddcc4] text-stone-900 font-semibold py-3 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? "Verifying..." : "Verify Email"}
            </button>
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
          alt="Verify Email"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#4A7C59] text-white">
          Loading verification...
        </div>
      }
    >
      <VerifyEmailPageContent />
    </Suspense>
  );
}
