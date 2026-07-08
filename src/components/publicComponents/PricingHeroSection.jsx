"use client";
import React from "react";
import { motion } from "framer-motion";

const PricingHeroSection = ({
  title = "Therapy That Doesn't Traumatise Your Bank Account",
  badge = "The Platform & Prices",
  bgImage = "/homeImage/PricingHeroSection.png",
}) => {
  return (
    <div className="relative w-full  min-h-[85vh] md:min-h-[85vh] flex items-center overflow-hidden font-sans">
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-white/10" />
      </motion.div>

      <div className="container mx-auto px-6 md:px-16 z-10">
        <div className="max-w-2xl">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block px-4 py-1 mb-6 rounded-full border border-gray-300 bg-white/40 backdrop-blur-sm shadow-sm"
          >
            <p className="text-[10px] md:text-xs font-semibold text-gray-800 tracking-tighter uppercase">
              {badge}
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl font-serif lg:text-7xl font-medium text-[#1a1a1a] leading-[1.1] tracking-tight"
          >
            {title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-10"
          ></motion.div>
        </div>
      </div>

      <div className="absolute bottom-20 right-20 hidden lg:block"></div>
    </div>
  );
};

export default PricingHeroSection;
