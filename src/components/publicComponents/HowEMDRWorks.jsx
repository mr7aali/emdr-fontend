


"use client";
import React from "react";
import { motion } from "framer-motion";

const HowEMDRWorks = ({
  desktopImage = "/homeImage/image1.png"
}) => {
  const steps = [
    {
      img: "/homeImage/Vector (1).svg",
      title: "Identify the Target",
      desc: "Focus on the memory, belief, or emotion causing distress.",
    },
    {
      img: "/homeImage/Frame (1).svg",
      title: "Bilateral Stimulation",
      desc: "Guided eye movements, tapping, or sounds activate both sides of the brain.",
    },
    {
      img: "/homeImage/Frame (2).svg",
      title: "Reprocessing",
      desc: "The brain naturally shifts the way the memory is stored, reducing emotional intensity.",
    },
    {
      img: "/homeImage/Frame (3).svg",
      title: "Healing & Relief",
      desc: "Negative beliefs are replaced with positive, empowering thoughts.",
    },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (

    <section className="relative w-full py-10 bg-[#FCF9F4] md:bg-transparent flex flex-col items-center justify-center overflow-hidden">

      <div
        className="absolute inset-0 z-0 hidden md:block bg-cover bg-center bg-no-repeat opacity-30"
        style={{
          backgroundImage: `url(${desktopImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col items-center px-6">
        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-serif text-center text-[#1e293b] pt-10 mb-16"
        >
          How EMDR Works
        </motion.h2>

        {/* Steps Grid */}
        <div className="block md:flex gap-12 mb-20">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="flex flex-col items-center text-center group"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-white shadow-md border border-gray-50 flex items-center justify-center mb-8 overflow-hidden p-5 transition-all duration-300 group-hover:shadow-xl"
              >
                <img
                  src={step.img}
                  alt={step.title}
                  className="w-full h-full object-contain"
                />
              </motion.div>

              <h3 className="text-xl md:text-2xl font-serif text-[#1e293b] mb-4">
                {step.title}
              </h3>
              <p className="text-gray-600 font-light leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="w-full flex flex-col items-center">
          <div className="relative w-full max-w-4xl flex justify-center mb-14 px-4">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="h-[3px] md:h-[4px] w-full bg-[#4a7c59] rounded-full origin-center"
              style={{
                clipPath: "polygon(0% 20%, 100% 0%, 98% 80%, 2% 100%)",
                opacity: 0.7,
              }}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "#3D6346" }}
            whileTap={{ scale: 0.95 }}
            className=" px-10 py-3 text-[#FFFFFF] text-xl font-semibold rounded-2xl border-[2px] border-[#2b2b2b] bg-gradient-to-b from-[#6f8f79] to-[#3e6f55] shadow-[inset_0_2px_4px_rgba(255,255,255,0.25),_0_2px_0_#1f1f1f] hover:brightness-110 active:translate-y-[2px] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),_0_2px_0_#1f1f1f] transition-all duration-150"
            style={{ backgroundColor: "#4A7C59", marginBottom: "20px" }}
          >
            Start Your Journey
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default HowEMDRWorks;