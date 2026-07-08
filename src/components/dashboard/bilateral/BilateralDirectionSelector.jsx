"use client";
import React from "react";
import {
  MoveHorizontal,
  MoveVertical,
  MoveUpRight,
  MoveDownRight,
} from "lucide-react";

const directions = [
  { id: "horizontal", name: "Horizontal", Icon: MoveHorizontal },
  { id: "vertical", name: "Vertical", Icon: MoveVertical },
  { id: "diagonal-up", name: "Diagonal Up", Icon: MoveUpRight },
  { id: "diagonal-down", name: "Diagonal Down", Icon: MoveDownRight },
];

export default function BilateralDirectionSelector({ selectedId, onSelect }) {
  return (
    <div className="bg-white/40 backdrop-blur-md rounded-3xl p-6 border border-white/20 h-full">
      <h3 className="text-xl font-serif text-[#0F1912] mb-4">Direction</h3>
      <div className="flex gap-4">
        {directions.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`flex-1 flex flex-col items-center justify-center p-4 aspect-square rounded-2xl cursor-pointer transition-all ${
              selectedId === item.id
                ? "bg-white shadow-md scale-95 border-transparent"
                : "bg-white/50 hover:bg-white/80 border-transparent"
            }`}
          >
            <item.Icon
              size={24}
              className={`mb-2 transition-colors duration-300 ${
                selectedId === item.id ? "text-[#4A7C59]" : "text-stone-500"
              }`}
            />
            <span className={`text-xs font-bold leading-tight text-center transition-colors duration-300 ${
                selectedId === item.id ? "text-[#4A7C59]" : "text-stone-700"
              }`}>
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
