"use client";

import React from "react";
import { motion } from "framer-motion";

const PathToHealing = () => {
  const steps = [
    {
      title: "Register & Complete Screening",
      description: "Secure registration with GDPR compliance, consent and assessments to understand your needs.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="19" y1="8" x2="19" y2="14" />
          <line x1="22" y1="11" x2="16" y2="11" />
        </svg>
      ),
    },
    {
      title: "Follow Guided EMDR Sessions",
      description: "Step-by-step video instructions, interactive chatbots, and tailored exercises at your own pace.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      ),
    },
    {
      title: "Track Your Progress",
      description: "Secure registration with GDPR compliance, consent and assessments to understand your needs.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-white">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      ),
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <section className="bg-[#FCF9F4] py-24 px-6 md:px-12 lg:px-24 text-center">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-[#2D312D] mb-4">
            Your Path to Healing
          </h2>
          <p className="text-[#568261] font-medium tracking-widest text-sm uppercase">
            What does the evidence say?
          </p>
        </motion.div>


        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16"
        >
          {steps.map((step, index) => (
            <motion.div key={index} variants={itemVariants} className="flex flex-col items-center">

              <div className="relative w-24 h-24 flex items-center justify-center mb-8">

                <div className="absolute inset-0 bg-[#568261] opacity-20 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] scale-110"></div>
                <div className="relative w-16 h-16 bg-[#568261] rounded-[30%_70%_70%_30%/30%_30%_70%_70%] flex items-center justify-center text-white shadow-lg">
                  {step.icon}
                </div>
              </div>

              <h3 className="text-2xl font-serif text-[#2D312D] mb-4 px-4 leading-tight">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-base max-w-[280px]">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PathToHealing;