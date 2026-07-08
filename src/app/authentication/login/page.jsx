"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import { useLoginMutation } from "@/redux/features/login";
import { useStoredAuth } from "@/redux/authStorage";

const getErrorMessage = (error) => {
  if (!error) {
    return "";
  }

  if (typeof error === "string") {
    return error;
  }

  if (error?.status === 429 || error?.code === 429) {
    return "Too many requests. Please wait a bit and try again.";
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

  if (error?.data?.error?.code === 429) {
    return "Too many requests. Please wait a bit and try again.";
  }

  if (typeof error?.data?.error?.message === "string") {
    return error.data.error.message;
  }

  return "Login failed. Please check your credentials and try again.";
};

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(
    () => searchParams.get("email")?.trim() || "",
  );
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const { token, hasHydrated } = useStoredAuth();
  const [login, { isLoading, error }] = useLoginMutation();
  const verified = searchParams.get("verified") === "1";
  const passwordReset = searchParams.get("reset") === "1";

  useEffect(() => {
    if (hasHydrated && token) {
      const redirectTo = searchParams.get("redirect") || "/dashboard";
      router.replace(redirectTo);
    }
  }, [hasHydrated, router, token, searchParams]);

  if (!hasHydrated || token) {
    return null;
  }

  const apiErrorMessage = formError || getErrorMessage(error);

  const handleLogin = async (e) => {
    e.preventDefault();

    setFormError("");

    try {
      await login({ email, password }).unwrap();
      const redirectTo = searchParams.get("redirect") || "/dashboard";
      router.push(redirectTo);
    } catch (apiError) {
      setFormError(getErrorMessage(apiError));
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 bg-[#4A7C59] flex items-center justify-center px-16">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-[#FFFFFF] text-3xl font-normal mb-2">
              Login to your account
            </h1>
            <p className="text-white/90 text-[14px]">
              Don&apos;t have an account?{" "}
              <Link
                href="/authentication/signup"
                className="font-semibold hover:underline text-[18px] text-[#FFE6C9]"
              >
                Sign Up
              </Link>
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            {verified ? (
              <p className="rounded-lg border border-[#B7E4C7] bg-[#F0FFF4] px-4 py-3 text-sm text-[#276749]">
                Email verified successfully. Please log in to continue.
              </p>
            ) : null}
            {passwordReset ? (
              <p className="rounded-lg border border-[#B7E4C7] bg-[#F0FFF4] px-4 py-3 text-sm text-[#276749]">
                Password reset successful. Please log in with your new password.
              </p>
            ) : null}
            <div>
              <label className="block text-white text-sm mb-2">
                Enter your e-mail address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="Enter your e-mail address"
                className="w-full px-4 py-3 rounded-lg bg-transparent border border-white/40 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-white text-sm mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="Password"
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
            <div className="text-left">
              <Link
                href="/authentication/recover"
                className="text-[#FF8787] text-sm hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
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
              {isLoading ? "Logging in..." : "Login"}
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
          alt="Login"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#4A7C59] text-white">
          Loading login...
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
