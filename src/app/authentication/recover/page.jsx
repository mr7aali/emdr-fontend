"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSendVerificationOtpMutation } from "@/redux/features/login";
import {
  clearRecoveryState,
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

  return "We could not send the recovery code. Please try again.";
};

export default function RecoverPage() {
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState("");
  const router = useRouter();
  const [sendVerificationOtp, { isLoading, error }] =
    useSendVerificationOtpMutation();

  const apiErrorMessage = formError || getErrorMessage(error);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setFormError("Please enter your email address.");
      return;
    }

    try {
      const response = await sendVerificationOtp({
        email: normalizedEmail,
      }).unwrap();

      persistRecoveryState({
        email: normalizedEmail,
        devOtp: response?.data?._dev_otp || null,
      });
      router.push(
        `/authentication/recover-code?email=${encodeURIComponent(normalizedEmail)}`,
      );
    } catch (sendError) {
      clearRecoveryState();
      setFormError(getErrorMessage(sendError));
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 bg-[#4A7C59] flex items-center justify-center px-16">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-[#FFFFFF] text-3xl font-normal mb-2">
              Recover Account
            </h1>
            <p className="text-white/90 text-[14px]">
              Enter your email and we will send you a recovery code
            </p>
          </div>
          <form onSubmit={handleEmailSubmit} className="space-y-5">
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
            {apiErrorMessage ? (
              <p className="rounded-lg border border-[#FFB3B3] bg-[#FFF1F1] px-4 py-3 text-sm text-[#B42318]">
                {apiErrorMessage}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-xl bg-[#FFE6C9] hover:bg-[#eddcc4] text-stone-900 font-semibold py-3 rounded-lg transition-colors duration-200 mt-4 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? "Sending..." : "Send Recovery Email"}
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
          alt="Recover Account"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
