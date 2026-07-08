import React from "react";
import AudioPlayer from "./AudioPlayer";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&fit=crop&q=80";

const PreviewPane = ({ description, backgroundUrl, audioTitle, audioSrc }) => {
  const bg = backgroundUrl || FALLBACK_IMAGE;

  return (
    <div className="rounded-[40px] shadow-2xl h-full flex flex-col relative overflow-hidden border border-white/30">
      {/* Background image — clearly visible */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Light overlay — just enough to read text */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50" />

      <div className="relative z-10 flex flex-col h-full p-8">
        {/* Title */}
        <h2 className="text-2xl font-serif mb-1 text-white tracking-tight drop-shadow">
          Your Calm Space
        </h2>
        <p className="text-white/70 text-sm mb-6 font-sans">Preview</p>

        {/* Description */}
        {description ? (
          <div className="flex-1 flex items-center">
            <p className="text-white/90 text-base leading-relaxed font-serif italic drop-shadow-sm">
              &ldquo;{description}&rdquo;
            </p>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-white/40 text-sm font-sans italic text-center">
              Describe your calm place to see it here...
            </p>
          </div>
        )}

        {/* Audio player at bottom */}
        <div className="mt-6">
          <AudioPlayer
            title={audioTitle || "No sound selected"}
            audioSrc={audioSrc}
            isReplaceable={false}
          />
        </div>
      </div>
    </div>
  );
};

export default PreviewPane;
