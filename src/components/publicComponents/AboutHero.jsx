


"use client";

import React from "react";
import { motion } from "framer-motion";

const AboutHero = ({ 
  title = "Our Mission", 
  subtitle = "Making Healing Accessible for Everyone", 
  buttonText = "About InKind EMDR",
  bgImage = "/homeImage/lightstream 1 (1).png" 
}) => {
  return (
    <section className="relative w-full min-h-[85vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#fdfdfb]">

      <div
        style={{
          backgroundImage: `url('${bgImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="absolute inset-0 z-0 scale-105" 
      />

      {/* Content Overlay */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center gap-4 md:gap-6"
        >

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-white/70 backdrop-blur-md border border-gray-200 rounded-full text-sm font-medium text-gray-700 shadow-sm transition-all"
          >
            {buttonText}
          </motion.button>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-[#2D312D] leading-tight">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-2xl text-[#4A7256] font-medium tracking-wide">
            {subtitle}
          </p>
        </motion.div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent pointer-events-none" />
    </section>
  );
};

export default AboutHero;