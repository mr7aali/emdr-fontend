"use client";

export default function JourneyCard({ journey }) {
  const { title, date, lastAccessed, progress, sessions, image } = journey;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-stone-100 flex gap-6 relative overflow-hidden group hover:shadow-md transition-shadow">
      {/* Background Image / Texture for the card if needed, or keeping it clean white */}

      {/* Left Image Section with Circular Progress */}
      <div className="relative w-64 h-40 rounded-xl overflow-hidden flex-shrink-0">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Circular Progress Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-20 h-20">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="white"
                strokeWidth="6"
                fill="transparent"
                className="opacity-30"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="white"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={226}
                strokeDashoffset={226 - (226 * progress) / 100}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
              {progress}%
            </div>
          </div>
        </div>

        <div className="absolute bottom-2 left-2 bg-white/90 px-3 py-1 rounded-md text-xs font-semibold text-stone-700 shadow-sm">
          Sessions <br /> <span className="text-sm">{sessions}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col justify-center py-2 pr-4">
        <h3 className="text-2xl font-serif text-[#2C3E2E] mb-2">{title}</h3>

        <div className="flex items-center gap-6 text-xs text-stone-500 mb-6">
          <div className="flex items-center gap-1">
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Created {date}
          </div>
          <div className="flex items-center gap-1">
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Last accessed {lastAccessed}
          </div>
        </div>

        {/* Progress Bar Label */}
        <div className="flex justify-between text-xs text-stone-600 mb-1">
          <span>Overall Progress</span>
          <span>{progress}% Complete</span>
        </div>

        {/* Linear Progress Bar */}
        <div className="w-full h-2 bg-[#E0E7E1] rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-[#5D8F69] rounded-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <button className="w-full bg-[#4A7C59] hover:bg-[#3d6649] text-white py-3 rounded-xl font-medium shadow-sm transition-colors uppercase tracking-wide text-sm">
          Continue Session
        </button>
      </div>
    </div>
  );
}
