"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const EMDRHeroSection = ({
  badgeText = "Transform Your Trauma Into Healing",
  title = "What is EMDR Therapy?",
  description = "EMDR (Eye Movement Desensitisation and Reprocessing) is a powerful therapy that helps people heal from trauma, anxiety, and painful memories by using guided eye movements or other forms of bilateral stimulation. It allows your brain to reprocess memories in a safe and structured way—reducing distress and restoring balance.",
  footerText = "Discover the revolutionary therapy that's helped millions overcome PTSD, depression, anxiety or other mental health problems in weeks, not years.",
  bgImage = "/homeImage/emdrBackroundImage.png",
}) => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[85vh] md:min-h-[85vh] w-full flex items-center justify-center overflow-hidden  py-16 md:py-24 px-6 md:px-12"
    >
      {/* Background Image Layer */}
      <motion.div
        className="absolute inset-0 z-0 scale-105"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          y: yBg,
          marginBottom: "-30px"
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 px-6 py-1.5 border border-gray-400/40 rounded-full bg-white/10 backdrop-blur-[2px]"
        >
          <span className="text-[13px] md:text-sm text-gray-600 font-light tracking-wide italic">
            {badgeText}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-4xl md:text-6xl lg:text-7xl font-serif text-[#1e293b] mb-10 tracking-tight"
        >
          {title}
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-2xl leading-relaxed text-gray-700 font-light max-w-4xl mx-auto mb-12 px-2 md:px-6"
        >
          {description}
        </motion.p>

        <div className="relative w-full max-w-[800px] mb-12 flex justify-center">
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 0.8 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
            className="h-[3%] md:h-[4%] w-full bg-[#4a7c59] rounded-full origin-center"
            style={{
              boxShadow: "0px 1px 2px rgba(0,0,0,0.1)",

              clipPath: "polygon(0% 40%, 100% 0%, 99% 100%, 1% 85%)",
            }}
          />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-sm md:text-lg text-gray-600 font-medium max-w-3xl mx-auto mt-10 leading-snug"
        >
          {footerText}
        </motion.p>
      </div>

      <motion.div
        initial={{ x: -100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.5 }}
        className="absolute bottom-10 left-4 md:left-20 z-20 w-32 md:w-56"
      ></motion.div>

      <div className="absolute inset-0 pointer-events-none bg-white/5 opacity-20 mix-blend-overlay"></div>
    </section>
  );
};

export default EMDRHeroSection;
