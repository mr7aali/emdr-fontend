import React from "react";

const VisualCard = ({ image, alt, label, isActive, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`relative w-40 h-28 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 group
        ${
          isActive
            ? "ring-4 ring-[#4A7C59] scale-105"
            : "hover:scale-105 hover:ring-2 hover:ring-[#4A7C59]/50"
        }
      `}
    >
      <img src={image} alt={alt} className="w-full h-full object-cover" />
      {label && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center backdrop-blur-[1px]">
          <span className="text-white font-serif text-sm tracking-wide">
            {label}
          </span>
        </div>
      )}
      <div
        className={`absolute inset-0 bg-[#4A7C59]/10 opacity-0 group-hover:opacity-100 transition-opacity`}
      />
    </div>
  );
};

export default VisualCard;
