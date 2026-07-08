"use client";

import React from "react";
import { motion } from "framer-motion";

const FounderSection = () => {
  const founderData = {
    title: "Founded by Dr Jaime Jonsson",
    description1:
      "Eye Movement Desensitisation and Reprocessing (EMDR) is an evidence based therapy for all types of mental health problems.",
    description2:
      "Our program combines professional guidance, AI-assisted tools, and personalised support to make EMDR therapy accessible in a safe and structured way.",
    image: "/homeImage/founderImage.png",
  };

  return (
    <section className="bg-[#FCF9F4] py-16 md:py-24 px-6 md:px-12 lg:px-24 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12 lg:gap-20">

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 space-y-6 w-full"
        >
          <div className="relative inline-block">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#2D312D]">
              {founderData.title}
            </h2>

            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="h-1 bg-[#568261] mt-2 rounded-full opacity-60"
            ></motion.div>
          </div>

          <p className="text-[#2D312D] text-lg md:text-xl leading-relaxed font-medium max-w-2xl">
            {founderData.description1}
          </p>

          <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-2xl">
            {founderData.description2}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 relative w-full max-w-[500px] md:max-w-none"
        >

          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 10, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -inset-6 bg-[#568261]/10 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] -z-10"
          ></motion.div>

          <div className="absolute -inset-2 bg-[#568261]/5 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] -z-10"></div>

          <motion.div
            animate={{
              y: [0, -15, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative overflow-hidden rounded-[40px]  border-8 border-white"
          >
            <img
              src={founderData.image}
              alt="Dr Jaime Jonsson"
              className="w-full h-full object-cover aspect-[4/5] md:aspect-square lg:aspect-[4/5]"
              onError={(e) =>
                (e.target.src = "https://via.placeholder.com/600x800")
              }
            />
          </motion.div>


          <motion.div
            animate={{
              x: [0, 15, 0],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="absolute -bottom-10 -right-6 w-32 h-32 bg-[#568261]/20 rounded-full blur-3xl"
          ></motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FounderSection;
