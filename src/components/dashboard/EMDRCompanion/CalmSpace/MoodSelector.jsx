import React from "react";
import AudioPlayer from "./AudioPlayer";

const VISUAL_SOUNDS_CATEGORY_NAME = "visual-sounds";

const MoodSelector = ({
  isOpen,
  onClose,
  sounds,
  isLoading,
  error,
  selectedSoundId,
  onSelectSound,
}) => {
  const handleSelect = (sound) => {
    onSelectSound(sound);
    onClose();
  };

  const filteredSounds = sounds.filter((sound) => {
    const name = sound?.categoryName?.trim()?.toLowerCase() || "";
    const slug = sound?.categorySlug?.trim()?.toLowerCase() || "";
    const type = sound?.mediaType?.trim()?.toLowerCase() || "";
    return (name === VISUAL_SOUNDS_CATEGORY_NAME || slug === VISUAL_SOUNDS_CATEGORY_NAME) && type === "audio";
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-xl bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200/60">
          <div>
            <h2 className="text-2xl font-serif text-[#0F1912]">Select Mood</h2>
            <p className="text-sm text-stone-500 mt-0.5">Choose a sound for your calm space</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors text-lg font-light"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="py-12 text-center text-stone-600">Loading sounds...</div>
          ) : error ? (
            <div className="py-12 text-center text-red-500 text-sm">{error}</div>
          ) : filteredSounds.length === 0 ? (
            <div className="py-12 text-center text-stone-500 text-sm">No sounds available</div>
          ) : (
            <div className="space-y-3">
              {filteredSounds.map((sound) => {
                const isSelected = selectedSoundId === sound.id;
                return (
                  <div
                    key={sound.id}
                    className={`rounded-2xl border transition-all ${
                      isSelected
                        ? "border-[#4A7C59] bg-[#4A7C59]/5 shadow-sm"
                        : "border-stone-200 bg-white hover:border-[#4A7C59]/40 hover:bg-stone-50"
                    }`}
                  >
                    <div className="flex items-center gap-3 p-3">
                      <div className="flex-1 min-w-0">
                        <AudioPlayer
                          title={sound.title}
                          audioSrc={sound.url}
                          isReplaceable={false}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSelect(sound)}
                        className={`shrink-0 px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                          isSelected
                            ? "bg-[#4A7C59] text-white"
                            : "bg-stone-100 text-stone-700 hover:bg-[#4A7C59] hover:text-white"
                        }`}
                      >
                        {isSelected ? "✓ Selected" : "Select"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodSelector;
