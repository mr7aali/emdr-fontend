import React, { useEffect, useEffectEvent, useState } from "react";
import { useStoredAuth } from "@/redux/authStorage";
import AudioPlayer from "./AudioPlayer";
import MoodSelector from "./MoodSelector";

const MOOD_SOUND_CATEGORY_NAME = "visual-sounds";

const getMoodSounds = async (token) => {
  const rawBaseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || process.env.VITE_BASE_URL || "";
  const baseUrl = rawBaseUrl.endsWith("/") ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

  if (!baseUrl) throw new Error("Media service is not configured.");
  if (!token) throw new Error("Please sign in again to load sounds.");

  const categoriesResponse = await fetch(`${baseUrl}/api/categories`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` },
  });
  const categoriesResult = await categoriesResponse.json();

  if (!categoriesResponse.ok || !categoriesResult?.success) {
    throw new Error(categoriesResult?.message || "Failed to fetch sound categories.");
  }

  const soundCategory = (categoriesResult?.data || []).find((category) => {
    const name = category?.categoryName?.trim()?.toLowerCase() || "";
    const slug = category?.slug?.trim()?.toLowerCase() || "";
    return name === MOOD_SOUND_CATEGORY_NAME || slug === MOOD_SOUND_CATEGORY_NAME;
  });

  if (!soundCategory?._id) throw new Error("Visual-sounds category was not found.");

  const categoryMediaResponse = await fetch(
    `${baseUrl}/api/categories/${soundCategory._id}/media`,
    { cache: "no-store", headers: { Authorization: `Bearer ${token}` } }
  );
  const categoryMediaResult = await categoryMediaResponse.json();

  if (!categoryMediaResponse.ok || !categoryMediaResult?.success) {
    throw new Error(categoryMediaResult?.message || "Failed to fetch category sounds.");
  }

  return (categoryMediaResult?.data?.media?.musics || []).map((item, index) => ({
    id: item?._id,
    title: item?.name || `Sound ${index + 1}`,
    url: item?.url,
    mediaType: item?.mediaType || "audio",
    categoryName: categoryMediaResult?.data?.category?.name || "",
    categorySlug: categoryMediaResult?.data?.category?.slug || "",
  }));
};

const MoodSetter = ({ selectedSound, onSelectSound, onUploadSound }) => {
  const { token } = useStoredAuth();
  const [showSelector, setShowSelector] = useState(false);
  const [sounds, setSounds] = useState([]);
  const [isLoadingSounds, setIsLoadingSounds] = useState(true);
  const [soundError, setSoundError] = useState("");

  const syncSelectedSound = useEffectEvent((items) => {
    if (!items.length || selectedSound?.source === "upload") return;
    if (!selectedSound?.id) { onSelectSound(items[0]); return; }
    const matched = items.find((item) => item.id === selectedSound.id);
    if (!matched) onSelectSound(items[0]);
  });

  useEffect(() => {
    const fetchSounds = async () => {
      try {
        setIsLoadingSounds(true);
        setSoundError("");
        const items = await getMoodSounds(token);
        setSounds(items);
        syncSelectedSound(items);
      } catch (error) {
        console.error("Error fetching calm-space sounds:", error);
        setSoundError(error?.message || "Unable to load sounds right now.");
        setSounds([]);
      } finally {
        setIsLoadingSounds(false);
      }
    };
    fetchSounds();
  }, [token]);

  const handleUploadChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (onUploadSound) onUploadSound(file);
    event.target.value = "";
  };

  return (
    <>
      <div className="bg-white/40 backdrop-blur-md rounded-3xl p-3 shadow-xl border border-white/20">
        <h2 className="text-xl font-serif mb-3 text-[#0F1912] tracking-tight">
          Set the mood
        </h2>
        {isLoadingSounds ? (
          <div className="rounded-2xl bg-white/70 px-4 py-8 text-center text-stone-700">
            Loading sounds...
          </div>
        ) : soundError ? (
          <div className="rounded-2xl bg-red-50 px-4 py-8 text-center text-red-600">
            {soundError}
          </div>
        ) : selectedSound ? (
          <div className="space-y-3">
            <AudioPlayer
              key={selectedSound.id}
              title={selectedSound.title}
              audioSrc={selectedSound.url}
              isReplaceable={true}
              onReplace={() => setShowSelector(true)}
            />
          </div>
        ) : (
          <div className="rounded-2xl bg-white/70 px-4 py-8 text-center text-stone-700">
            No Visual-sounds audio found.
          </div>
        )}
        {!isLoadingSounds && (
          <label className="mt-3 flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-[#1E3224]/30 bg-white/60 px-4 py-3 text-sm font-medium text-[#0F1912] transition-colors hover:bg-white/80">
            Upload custom sound
            <input type="file" accept="audio/*" onChange={handleUploadChange} className="hidden" />
          </label>
        )}
      </div>

      <MoodSelector
        isOpen={showSelector}
        sounds={sounds}
        isLoading={isLoadingSounds}
        error={soundError}
        selectedSoundId={selectedSound?.id}
        onSelectSound={onSelectSound}
        onClose={() => setShowSelector(false)}
      />
    </>
  );
};

export default MoodSetter;
