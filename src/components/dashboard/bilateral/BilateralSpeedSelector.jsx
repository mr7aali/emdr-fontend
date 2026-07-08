"use client";
import React from "react";

const speeds = [
  {
    id: "slow",
    name: "Slow",
    detail: "8s/pass",
    img: "/homeImage/Ellipse 1002.png",
  },
  {
    id: "medium",
    name: "Medium",
    detail: "4s/pass",
    img: "/homeImage/Ellipse 1002.png",
  },
  {
    id: "fast",
    name: "Fast",
    detail: "2s/pass",
    img: "/homeImage/Ellipse 1002.png",
  },
];

export default function BilateralSpeedSelector({ selectedId, onSelect }) {
  return (
    <div className="bg-white/40 backdrop-blur-md rounded-3xl p-4 sm:p-6 border border-white/20 h-full">
      <h3 className="text-lg sm:text-xl font-serif text-[#0F1912] mb-4">
        Speed
      </h3>

      {/* ✅ Responsive grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {speeds.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`flex flex-col items-center justify-center p-4 aspect-square rounded-2xl cursor-pointer transition-all
              ${selectedId === item.id
                ? "bg-white shadow-md border-2 border-dashed border-[#4A7C59] scale-95"
                : "bg-white/60 hover:bg-white/80"
              }
            `}
          >
            {/* Image */}
            <div className="w-8 h-8 flex items-center justify-center mb-2">
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Name */}
            <span className={`text-sm font-bold transition-colors duration-300 ${
              selectedId === item.id ? "text-[#4A7C59]" : "text-stone-900"
            }`}>
              {item.name}
            </span>

            {/* Detail */}
            <span className={`text-[10px] transition-colors duration-300 ${
              selectedId === item.id ? "text-[#4A7C59]/80" : "text-stone-500"
            }`}>
              {item.detail}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
