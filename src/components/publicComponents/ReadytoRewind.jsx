"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const ReadytoRewind = ({
  title = "Ready to Rewind and Reprocess?",
  subtitle = "Think of it as therapy that escaped from the clinic and learned how to have fun. Evidence-based EMDR treatment turned into an interactive digital experience.",
  buttonText = "Register & Start",
  bgImage = "/homeImage/emdr backround image 3 1.png"
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

      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center gap-4 md:gap-6"
        >


          <h1 className="max-w-2xl mx-auto text-4xl md:text-7xl lg:text-7xl font-serif text-[#0F1912] leading-wide">
            {title}
          </h1>

          <p className="max-w-4xl mx-auto text-[24px] md:text-2xl text-[#0F1912] font-normal tracking-wide">
            {subtitle}
          </p>
        </motion.div>
        <Link href="/authentication/login">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className=" px-8 py-3 mt-3 text-white text-xl font-semibold rounded-2xl border-[2px] border-[#2b2b2b] bg-gradient-to-b from-[#6f8f79] to-[#3e6f55] shadow-[inset_0_2px_4px_rgba(255,255,255,0.25),_0_2px_0_#1f1f1f] hover:brightness-110 active:translate-y-[2px] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),_0_2px_0_#1f1f1f] transition-all duration-150"
          >
            {buttonText}
          </motion.button>
        </Link>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent pointer-events-none" />
    </section>
  );
};

export default ReadytoRewind;