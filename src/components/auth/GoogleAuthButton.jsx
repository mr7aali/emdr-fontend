"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useGoogleAuthMutation } from "@/redux/features/login";

const GOOGLE_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

let googleScriptPromise = null;

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

  return "Google sign-in failed. Please try again.";
};

const loadGoogleScript = () => {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google script can only load in the browser."));
  }

  if (window.google?.accounts?.id) {
    return Promise.resolve(window.google);
  }

  if (googleScriptPromise) {
    return googleScriptPromise;
  }

  googleScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(
      `script[src="${GOOGLE_SCRIPT_SRC}"]`,
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(window.google), {
        once: true,
      });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Failed to load Google Sign-In.")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.src = GOOGLE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = () => reject(new Error("Failed to load Google Sign-In."));
    document.head.appendChild(script);
  });

  return googleScriptPromise;
};

export default function GoogleAuthButton({
  redirectTo = "/dashboard",
  label = "Continue with Google",
}) {
  const router = useRouter();
  const buttonContainerRef = useRef(null);
  const buttonWrapperRef = useRef(null);
  const [scriptError, setScriptError] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [googleAuth, { isLoading, error }] = useGoogleAuthMutation();
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (process.env.NODE_ENV !== "development" || typeof window === "undefined") {
      return;
    }

    window.__googleAuthDebug = {
      clientId: clientId || "Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID",
      origin: window.location.origin,
    };

    console.log(
      "[GoogleAuthButton] Client ID:",
      clientId || "Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID",
    );
    console.warn("[GoogleAuthButton] Origin:", window.location.origin);
  }, [clientId]);

  const handleGoogleCredential = useEffectEvent(async (response) => {
    const idToken = response?.credential;

    if (!idToken) {
      setScriptError("Google did not return a valid sign-in token.");
      return;
    }

    setScriptError("");

    try {
      await googleAuth({ idToken }).unwrap();
      router.push(redirectTo);
    } catch (authError) {
      setScriptError(getErrorMessage(authError));
    }
  });

  useEffect(() => {
    let isCancelled = false;

    const initializeGoogle = async () => {
      if (!clientId) {
        setScriptError("Set NEXT_PUBLIC_GOOGLE_CLIENT_ID to enable Google sign-in.");
        return;
      }

      try {
        await loadGoogleScript();

        if (
          isCancelled ||
          !buttonContainerRef.current ||
          !buttonWrapperRef.current ||
          !window.google?.accounts?.id
        ) {
          return;
        }

        buttonContainerRef.current.innerHTML = "";

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCredential,
        });

        window.google.accounts.id.renderButton(buttonContainerRef.current, {
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "rectangular",
          width: Math.max(
            Math.floor(buttonWrapperRef.current.getBoundingClientRect().width),
            220,
          ),
        });

        setIsReady(true);
      } catch (loadError) {
        if (!isCancelled) {
          setScriptError(getErrorMessage(loadError));
        }
      }
    };

    initializeGoogle();

    return () => {
      isCancelled = true;
    };
  }, [clientId]);

  const apiErrorMessage = scriptError || getErrorMessage(error);

  return (
    <div className="w-full">
      <div ref={buttonWrapperRef} className="relative w-full">
        <div
          className={`flex items-center justify-center gap-2 border border-white/30 bg-white/10 px-4 py-2.5 text-white transition-colors duration-200 rounded-lg ${
            isReady && !isLoading
              ? "hover:bg-white/20"
              : "cursor-not-allowed opacity-70"
          }`}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="text-sm">
            {isLoading ? "Signing in..." : label}
          </span>
        </div>
        <div
          className={`absolute inset-0 overflow-hidden rounded-lg ${
            isReady && !isLoading ? "opacity-[0.02]" : "pointer-events-none opacity-0"
          }`}
        >
          <div ref={buttonContainerRef} className="h-full w-full" />
        </div>
      </div>
      {apiErrorMessage ? (
        <p className="mt-3 rounded-lg border border-[#FFB3B3] bg-[#FFF1F1] px-4 py-3 text-sm text-[#B42318]">
          {apiErrorMessage}
        </p>
      ) : null}
    </div>
  );
}
