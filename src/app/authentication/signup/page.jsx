"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import { useSignupMutation } from "@/redux/features/login";
import { useStoredAuth } from "@/redux/authStorage";
import {
  clearVerificationState,
  persistVerificationState,
} from "@/redux/verificationStorage";

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

  if (error?.status === 400) {
    return "Signup data is invalid. Please check your name, email, password, and privacy checkbox.";
  }

  return "Signup failed. Please try again.";
};

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [formError, setFormError] = useState("");
  const router = useRouter();
  const { token } = useStoredAuth();
  const [signup, { isLoading, error }] = useSignupMutation();

  useEffect(() => {
    if (token) {
      router.replace("/dashboard");
    }
  }, [router, token]);

  if (token) {
    return null;
  }

  const apiErrorMessage = formError || getErrorMessage(error);

  const handleSignup = async (e) => {
    e.preventDefault();
    setFormError("");

    const [firstName = "", ...lastNameParts] = name.trim().split(/\s+/);
    const lastName = lastNameParts.join(" ");
    const normalizedEmail = email.trim().toLowerCase();

    if (!firstName || !lastName) {
      setFormError("Please enter your first and last name.");
      return;
    }

    if (!normalizedEmail) {
      setFormError("Please enter a valid email address.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Password and confirm password must match.");
      return;
    }

    if (!privacyAccepted) {
      setFormError("Please accept the privacy statement to continue.");
      return;
    }

    try {
      const response = await signup({
        firstName,
        lastName,
        email: normalizedEmail,
        password,
        confirmPassword,
        isAcceptPrivacyStatement: privacyAccepted,
      }).unwrap();

      const signupEmail = response?.data?.email || normalizedEmail;

      persistVerificationState({
        email: signupEmail,
        devOtp: response?.data?._dev_otp || null,
      });
      router.push(
        `/authentication/verify-email?email=${encodeURIComponent(signupEmail)}`,
      );
    } catch (signupError) {
      clearVerificationState();
      setFormError(getErrorMessage(signupError));
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 bg-[#4A7C59] flex items-center justify-center px-16 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-[#FFFFFF] text-3xl font-normal mb-2">
              Create an account
            </h1>
            <p className="text-white/90 text-[14px]">
              Already have an account?{" "}
              <Link
                href="/authentication/login"
                className="font-semibold hover:underline text-[18px] text-[#FFE6C9]"
              >
                Login
              </Link>
            </p>
          </div>
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-white text-sm mb-2">
                Enter your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your Name"
                className="w-full px-4 py-3 rounded-lg bg-transparent border border-white/40 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-white text-sm mb-2">
                Enter your e-mail address
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
                Enter your phone number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="w-full px-4 py-3 rounded-lg bg-transparent border border-white/40 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-white text-sm mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your Password"
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
                  placeholder="Confirm your Password"
                  className="w-full px-4 py-3 rounded-lg bg-transparent border border-white/40 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent pr-12"
                  required
                />
              </div>
            </div>
            <div className="flex items-center">
              <input
                id="privacy"
                type="checkbox"
                checked={privacyAccepted}
                onChange={(e) => setPrivacyAccepted(e.target.checked)}
                className="w-4 h-4 text-[#FFE6C9] bg-transparent border-white/40 rounded focus:ring-[#FFE6C9] focus:ring-2"
              />
              <label htmlFor="privacy" className="ml-2 text-sm text-white/90">
                Accept{" "}
                <button type="button" className="underline hover:text-white">
                  privacy statement
                </button>
              </label>
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
              {isLoading ? "Creating account..." : "Sign up"}
            </button>
            <div className="relative flex items-center my-6">
              <div className="flex-grow border-t border-white/30"></div>
              <span className="flex-shrink mx-4 text-white/70 text-sm">
                Or continue with
              </span>
              <div className="flex-grow border-t border-white/30"></div>
            </div>
            <div className="flex gap-3">
              <GoogleAuthButton />
            </div>
          </form>
        </div>
      </div>
      <div className="w-1/2 bg-white">
        <img
          src="/homeImage/loginimg.png"
          alt="Signup"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
