import React from "react";
const PlaceDescription = ({ description, onDescriptionChange }) => {
  return (
    <div className="bg-white/40 backdrop-blur-md rounded-3xl p-3 shadow-xl ">
      <h2 className="text-xl font-serif mb-3 text-[#0F1912] tracking-tight">
        Describe this place
      </h2>
      <div className="relative group">
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Why does this place make you feel safe? E.g., 'The air is crisp and I can hear the wind in the trees'..."
          className="w-full h-40 p-3 bg-white/50 backdrop-blur-sm rounded-3xl resize-none outline-none focus:ring-2 focus:ring-[#4A7C59]/30 focus:border-[#4A7C59] transition-all duration-300 font-sans text-stone-700 leading-relaxed placeholder:text-stone-400"
        />
      </div>
    </div>
  );
};

export default PlaceDescription;
