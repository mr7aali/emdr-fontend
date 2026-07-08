"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

const EMDRSection = ({
  title = "What is EMDR Therapy?",
  description1 = "Eye Movement Desensitisation and Reprocessing (EMDR) is an evidence based therapy for all types of mental health problems.",
  description2 = "Our program combines professional guidance, AI-assisted tools, and personalised support to make EMDR therapy accessible in a safe and structured way.",
  videoSrc = "/Video 1.mp4",
  thumbnailSrc = "/Container.png",
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section
      style={{
        backgroundImage: "url('/Subtract.png')",
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
      }}
      className="relative w-full min-h-[550px] flex items-center justify-center py-20 px-6 md:px-12 lg:px-24 overflow-hidden"
    >
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-[#2D312D] leading-tight">
            {title}
          </h2>

          <div className="space-y-5 text-gray-700 text-lg leading-relaxed max-w-xl">
            <p>{description1}</p>
            <p>{description2}</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#568261] text-white px-10 py-3.5 rounded-lg text-lg font-medium shadow-md hover:bg-[#456a4e] transition-all"
          >
            Learn more
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative group"
        >
          <div className="relative aspect-video  rounded-[20px] border-[5px] border-black bg-[#568261] flex items-center justify-center shadow-2xl overflow-hidden transition-transform duration-500 hover:scale-[1.02]">
            {!isPlaying ? (
              <div
                className="absolute inset-0 flex items-center justify-center cursor-pointer z-20"
                onClick={() => setIsPlaying(true)}
              >
                <img
                  src={thumbnailSrc}
                  alt="Video Thumbnail"
                  className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

              </div>
            ) : (
              <video
                src={videoSrc}
                poster={thumbnailSrc}
                autoPlay
                controls
                className="w-full h-full object-cover z-10"
              />
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EMDRSection;
