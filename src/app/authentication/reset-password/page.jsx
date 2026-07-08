"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRecoverAccountMutation } from "@/redux/features/login";
import { clearRecoveryState, loadRecoveryState } from "@/redux/recoveryStorage";

const getErrorMessage = (error) => {
  const extractMessage = (value) => {
    if (!value) {
      return "";
    }

    if (typeof value === "string") {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map(extractMessage).filter(Boolean).join(", ");
    }

    if (typeof value === "object") {
      if (typeof value.message === "string") {
        return value.message;
      }

      const nestedMessages = Object.values(value)
        .map(extractMessage)
        .filter(Boolean);

      return nestedMessages[0] || "";
    }

    return "";
  };

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

  const detailedMessage = extractMessage(
    error?.data?.errors ||
      error?.data?.details ||
      error?.data?.data?.errors ||
      error?.data?.message ||
      error?.data?.error,
  );

  if (detailedMessage) {
    return detailedMessage;
  }

  return "We could not reset your password. Please try again.";
};

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const router = useRouter();
  const [recoverAccount, { isLoading, error }] = useRecoverAccountMutation();
  const recoveryState = loadRecoveryState();

  useEffect(() => {
    if (!recoveryState.accessToken) {
      router.replace("/authentication/login");
    }
  }, [recoveryState.accessToken, router]);

  if (!recoveryState.accessToken) {
    return null;
  }

  const apiErrorMessage = formError || getErrorMessage(error);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (newPassword !== confirmPassword) {
      setFormError("New password and confirm password must match.");
      return;
    }

    try {
      await recoverAccount({
        accessToken: recoveryState.accessToken,
        newPassword,
        confirmPassword,
      }).unwrap();
      clearRecoveryState();
      router.push("/authentication/login?reset=1");
    } catch (recoverError) {
      setFormError(getErrorMessage(recoverError));
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
              Set a new password for {recoveryState.email || "your account"}.
            </p>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <div>
              <label className="block text-white text-sm mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  className="w-full px-4 py-3 rounded-lg bg-transparent border border-white/40 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {showPassword ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-white text-sm mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className="w-full px-4 py-3 rounded-lg bg-transparent border border-white/40 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent pr-12"
                  required
                />
              </div>
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
              {isLoading ? "Resetting..." : "Set New Password"}
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
