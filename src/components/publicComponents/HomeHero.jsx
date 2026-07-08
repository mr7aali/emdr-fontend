"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const HomeHero = () => {
  const videoRef = useRef(null);

  const handleSlowMotion = () => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5;
    }
  };

  useEffect(() => {
    handleSlowMotion();
  }, []);

  return (
    <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#fdfdfb]">
      {/* Background Video Section */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          onEnded={() => {
            if (videoRef.current) {
              videoRef.current.currentTime = 0;
              videoRef.current.play();
              handleSlowMotion();
            }
          }}
          onPlay={handleSlowMotion}
          onLoadedData={handleSlowMotion}
          className="w-full h-full object-cover"
        >
          <source src="/animation (2).mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]"></div>
      </div>

      {/* Content Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex flex-col items-center justify-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif text-[#1a2e24] leading-[1.1] max-w-5xl"
          >
            Transform Your{" "}
            <span className="relative inline-block text-[#56825e]">
              Healing
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="absolute -bottom-2 left-0 h-1.5 bg-[#56825e]/60 rounded-full"
              ></motion.span>
            </span>
            <br /> Journey with EMDR Therapy
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-8 text-lg md:text-xl text-[#3d4d44] max-w-2xl font-medium leading-relaxed"
          >
            Accessible, guided EMDR therapy designed to support your mental
            health and recovery – anytime, anywhere.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-10"
          >
            <Link href="/GetStarted">
              <button className=" px-10 py-3 text-[#FFFFFF] text-xl font-semibold rounded-2xl border-[2px] border-[#2b2b2b] bg-gradient-to-b from-[#6f8f79] to-[#3e6f55] shadow-[inset_0_2px_4px_rgba(255,255,255,0.25),_0_2px_0_#1f1f1f] hover:brightness-110 active:translate-y-[2px] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),_0_2px_0_#1f1f1f] transition-all duration-150">
                Get Started Today
              </button>
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-[#fdfdfb] to-transparent z-0"></div>
    </section>
  );
};

export default HomeHero;
