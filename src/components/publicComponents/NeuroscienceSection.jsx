"use client";
import React from "react";
import { motion } from "framer-motion";

const NeuroscienceSection = () => {
  const neuroscienceData = {
    title: "The Neuroscience of Rapid Healing",
    subtitle: "Understanding how EMDR transforms trauma at the brain level",
    cards: [
      {
        icon: "/homeImage/Frame (2).svg",
        title: "Your Brain's Natural Processing System",
        description:
          "Your brain has an incredible built-in system for processing difficult experiences—the Adaptive Information Processing system. Normally, disturbing events are naturally processed during REM sleep. But when experiences are overwhelming, this system can freeze, leaving memories stuck in their original, disturbing form.",
      },
      {
        icon: "/homeImage/Container (10).svg",
        title: "What Brain Scans Reveal",
        points: [
          "Decreased amygdala activation",
          "Increased prefrontal cortex activity",
          "Enhanced hemisphere communication",
        ],
        highlight: true,
      },
      {
        icon: "/homeImage/Frame (1).svg",
        title: "The Bilateral Stimulation Effect",
        description:
          "EMDR's bilateral stimulation isn't just distraction—it actively engages both brain hemispheres, mimicking the natural processing that occurs during REM sleep. This dual attention allows you to stay grounded in the present whilst reprocessing past trauma.",
      },
    ],
  };

  return (
    <section className="relative w-full py-20 bg-[#FCF9F4] overflow-hidden px-6">
      <div className="max-w-7xl mx-auto w-full flex flex-col items-center">
        {/* Title & Subtitle */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-serif text-[#1e293b] mb-4"
          >
            {neuroscienceData.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-[#4a7c59] font-light text-lg italic"
          >
            {neuroscienceData.subtitle}
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch w-full">
          {neuroscienceData.cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className={`relative p-8 md:p-10 rounded-2xl flex flex-col items-center text-center transition-all duration-300 ${
                card.highlight
                  ? "bg-white border-2 border-[#1e293b] shadow-xl z-10"
                  : "bg-white/50 border border-gray-100 shadow-md"
              }`}
            >
              {/* Icon Container */}
              {/* Icon Container */}
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${
                  card.highlight ? "bg-[#f0fdf4]" : "bg-white shadow-sm"
                }`}
              >
                <img
                  src={card.icon}
                  alt="icon"

                  className={`${
                    card.highlight ? "w-25 h-25" : "w-10 h-10"
                  } object-contain transition-all duration-300`}
                />
              </div>

              {/* Card Title */}
              <h3 className="text-xl font-serif text-[#1e293b] mb-4 leading-tight">
                {card.title}
              </h3>

              {/* Description or Points */}
              {card.description ? (
                <p className="text-gray-600 font-light text-sm md:text-base leading-relaxed">
                  {card.description}
                </p>
              ) : (
                <ul className="space-y-3">
                  {card.points.map((point, i) => (
                    <li
                      key={i}
                      className="text-gray-700 font-medium text-sm md:text-base"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NeuroscienceSection;
