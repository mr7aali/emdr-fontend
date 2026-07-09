"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Headphones, KeyRound, Save } from "lucide-react";
import { useStoredAuth } from "@/redux/authStorage";
import {
  checkSessionAccess,
  updateSessionProgress,
} from "@/utils/sessionProgress";
import AudioPlayer from "@/components/dashboard/EMDRCompanion/CalmSpace/AudioPlayer";

const CALM_PLACE_AUDIO_SRC = "/voice/calm place.wav";
const CALM_PLACE_STORAGE_KEY = "latestCalmPlaceSetup";

const getBaseUrl = () => {
  const rawBaseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || process.env.VITE_BASE_URL || "";
  return rawBaseUrl.endsWith("/") ? rawBaseUrl.slice(0, -1) : rawBaseUrl;
};

const getCalmPlaceAudioFile = async () => {
  const response = await fetch(CALM_PLACE_AUDIO_SRC);

  if (!response.ok) {
    throw new Error("Calm place audio could not be loaded.");
  }

  const blob = await response.blob();
  return new File([blob], "calm-place.wav", {
    type: blob.type || "audio/wav",
  });
};

const getPlaceholderImageFile = () => {
  const binary = atob(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=",
  );
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new File([bytes], "calm-place-placeholder.png", {
    type: "image/png",
  });
};

const createCalmPlacePayload = async ({ description, pincode }) => {
  const payload = new FormData();
  payload.append("describe", description.trim());
  payload.append("pincode", pincode.trim());
  payload.append("pinCode", pincode.trim());
  payload.append("image", getPlaceholderImageFile());
  payload.append("sound", await getCalmPlaceAudioFile());
  return payload;
};

export default function CalmSpacePage() {
  const router = useRouter();
  const { token } = useStoredAuth();
  const [description, setDescription] = useState("");
  const [pincode, setPincode] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const hasCheckedAccessRef = useRef(false);

  useEffect(() => {
    if (hasCheckedAccessRef.current || !token) return;

    const checkAccess = async () => {
      const baseUrl = getBaseUrl();
      const activeJourneyId = localStorage.getItem("activeJourneyId");

      if (!baseUrl || !activeJourneyId) return;

      hasCheckedAccessRef.current = true;
      const access = await checkSessionAccess({
        baseUrl,
        token,
        journeyId: activeJourneyId,
        requiredSession: 3,
      });

      if (!access.allowed && access.redirectTo) {
        router.replace(access.redirectTo);
      }
    };

    checkAccess();
  }, [router, token]);

  const saveLocally = () => {
    localStorage.setItem(
      CALM_PLACE_STORAGE_KEY,
      JSON.stringify({
        pincode: pincode.trim(),
        description: description.trim(),
        soundLink: CALM_PLACE_AUDIO_SRC,
        createdAt: new Date().toISOString(),
      }),
    );
  };

  const handleSave = async () => {
    const baseUrl = getBaseUrl();

    if (!description.trim()) {
      setSaveError("Please describe your calm place before saving.");
      return;
    }

    if (!pincode.trim()) {
      setSaveError("Please add a pincode or short cue word for this calm place.");
      return;
    }

    if (!baseUrl || !token) {
      saveLocally();
      router.push("/dashboard/EMDRCompanion");
      return;
    }

    try {
      setIsSaving(true);
      setSaveError("");

      const payload = await createCalmPlacePayload({ description, pincode });
      const response = await fetch(`${baseUrl}/api/calm-place`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: payload,
      });
      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || "Failed to save your calm place.");
      }

      saveLocally();

      const activeJourneyId = localStorage.getItem("activeJourneyId");
      if (activeJourneyId) {
        await updateSessionProgress({
          baseUrl,
          token,
          journeyId: activeJourneyId,
          compledSession: 3,
        });
      }

      router.push("/dashboard/EMDRCompanion");
    } catch (error) {
      console.error("Error saving calm place:", error);
      setSaveError(
        error?.message || "Unable to save your calm place right now.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen rounded-3xl bg-white/35 p-6 shadow-2xl md:p-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DBE5DE] text-[#4A7C59]">
            <Headphones size={28} />
          </div>
          <h1 className="font-serif text-4xl text-[#0F1912]">
            Calm Place
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-stone-600">
            Listen to the calm place audio, then add the short pincode or cue
            word you want to use to return to this feeling during EMDR.
          </p>
        </div>

        <div className="space-y-5 rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-md md:p-8">
          <AudioPlayer
            title="Calm place audio"
            audioSrc={CALM_PLACE_AUDIO_SRC}
            isReplaceable={false}
          />

          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#314238]">
              <KeyRound size={16} />
              Pincode or cue word
            </span>
            <input
              value={pincode}
              onChange={(event) => setPincode(event.target.value)}
              placeholder="e.g. beach, safe room, forest, blue"
              className="w-full rounded-2xl border border-[#D8E1DA] bg-white px-4 py-3 text-stone-800 outline-none transition focus:border-[#4A7C59] focus:ring-2 focus:ring-[#4A7C59]/15"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#314238]">
              Describe your calm place
            </span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What do you notice there? What helps your body feel safe or settled?"
              className="h-40 w-full resize-none rounded-2xl border border-[#D8E1DA] bg-white px-4 py-3 text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-[#4A7C59] focus:ring-2 focus:ring-[#4A7C59]/15"
            />
          </label>

          {saveError ? (
            <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {saveError}
            </div>
          ) : null}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isSaving}
              className="rounded-2xl border border-stone-200 bg-white px-6 py-3 font-medium text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#4A7C59] px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-[#3d6649] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={18} />
              {isSaving ? "Saving..." : "Save Calm Place"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
