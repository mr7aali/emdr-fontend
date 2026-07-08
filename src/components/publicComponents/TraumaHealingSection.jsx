"use client";
import React from "react";
import { motion } from "framer-motion";

const TraumaHealingSection = ({ bgImage = "/homeImage/image2.png" }) => {
  const content = {
    leftSide: {
      title: "Transform Your Trauma Into Healing",
      subtitle:
        "A scientifically proven approach that works with your brain's natural healing ability",
      description:
        "Eye Movement Desensitisation and Reprocessing (EMDR) represents one of the most significant breakthroughs in psychotherapy of the past 50 years. Developed by Dr. Francine Shapiro in 1987, this innovative therapy has transformed from an accidental discovery to a gold-standard treatment endorsed by the World Health Organisation, American Psychiatric Association, and the UK's National Institute for Health and Care Excellence.",
    },
    rightSide: {
      cardTitle: "The Revolutionary Difference",
      bullet1:
        "Unlike traditional talk therapy requiring you to relive and discuss traumatic experiences in detail, EMDR works through bilateral stimulation e.g. rhythmic eye movements, sounds, or taps whilst briefly focusing on disturbing memories. This unique approach means minimal talking and often dramatic results in just a handful of sessions.",
      bullet2:
        "With over 35 randomised controlled trials and millions of success stories worldwide, EMDR isn't just another therapy—it's a paradigm shift in how we understand and treat not only trauma, but also depression, anxiety, OCD, grief, addiction, self-esteem issues, and many other mental health challenges.",
    },
  };

  return (
    <section className="relative w-full py-16 md:py-25 px-6 md:px-12 flex items-center justify-center overflow-hidden bg-[#FDFBF7]">
      <div
        className="absolute inset-0 z-0 hidden md:block bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.6,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left Side Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col space-y-6"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-[#1e293b] leading-tight">
            {content.leftSide.title}
          </h2>
          <p
            style={{ color: "#4A7C59" }}
            className="font-medium text-lg italic"
          >
            {content.leftSide.subtitle}
          </p>
          <p className="text-gray-600 leading-relaxed text-base md:text-lg font-light">
            {content.leftSide.description}
          </p>
        </motion.div>

        {/* Right Side Card Content */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-[#6E967A] backdrop-blur-sm p-8 md:p-12 rounded-3xl border border-[#6E967A] shadow-xl "
        >
          <h3 className="text-2xl font-serif text-[#1e293b] mb-6">
            {content.rightSide.cardTitle}
          </h3>
          <div className="space-y-6 text-gray-600 leading-relaxed font-light text-base md:text-lg">
            <p>{content.rightSide.bullet1}</p>
            <p>{content.rightSide.bullet2}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TraumaHealingSection;
