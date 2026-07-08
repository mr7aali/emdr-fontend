"use client";
import React from 'react';
import { motion } from 'framer-motion';

const InKindSection = ({
  title = "What InKind Actually Is",
  description = "Think of it as therapy that escaped from the clinic and learned how to have fun. We’ve taken evidence-based treatments that usually cost £100+ per session and turned them into an interactive digital experience that feels more like using your favourite wellness app than sitting in a waiting room.",
  bgImage = "/homeImage/inkindImage.png"
}) => {

  return (
    <section className="relative w-full min-h-[75vh] md:min-h-[75vh] flex items-center justify-center  py-20 px-6">


      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105"
        style={{ backgroundImage: `url(${bgImage})`, backgroundRepeat: "no-repeat", backgroundSize: "cover", }}
      >
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">

        <motion.div
          initial={{ x: -150, y: 50, opacity: 0, rotate: -20 }}
          whileInView={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="flex justify-center mb-6"
        >

        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-3xl md:text-5xl lg:text-6xl font-serif text-[#1e293b]  mb-10 tracking-tight"
        >
          {title}
        </motion.h2>


        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-2xl leading-[1.6] text-[#334155] font-normal max-w-4xl pt-10  mx-auto px-4"
        >
          {description}
        </motion.p>

      </div>

      <motion.div
        initial={{ x: -100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.6 }}
        className="absolute bottom-0 left-0 hidden md:block"
      >

      </motion.div>

    </section>
  );
};

export default InKindSection;