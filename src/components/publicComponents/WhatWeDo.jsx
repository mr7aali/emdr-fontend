"use client";

import React from "react";
import { motion } from "framer-motion";

const WhatWeDo = () => {
  const features = [
    {
      id: 1,
      title: "Our Mission",
      description:
        "We believe everyone deserves the chance to heal from trauma, regardless of their financial circumstances. That's why InKind EMDR operates on a 'buy one, pay it forward' social enterprise model. When you subscribe to one of our premium tiers, you're not just investing in your own healing journey, you're funding free access for someone who needs it most, including refugees, domestic violence survivors, young people, emergency service workers and low-income families.",
      icon: "/homeImage/Container (5).svg",
      bgColor: "#DBE5DE", 
      borderColor: "#4A7C59",
      textColor: "text-black" 
    },
    {
      id: 2,
      title: "Evidence-Based Innovation",
      description:
        "Dr Jonsson, from her 30 years experience as a clinical psychologist, has developed this digital EMDR platform to combine the gold-standard therapy she uses in clinical practice with creative and innovative digital tools that make the process more engaging and accessible. You'll find everything from our interactive 'My Story' CBT formulation tool to comprehensive mental health assessments, guided EMDR techniques, and mindfulness exercises, all designed with the same care and clinical rigour you'd expect from in-person therapy.",
      icon: "/homeImage/Container (6).svg",
      bgColor: "#FBFBFC",
      borderColor: "#4A7C59",
      textColor: "text-black"
    },
  ];

  return (
    <section className="py-20 px-6 bg-[#FCF9F4]">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-4xl md:text-5xl font-serif text-[#2D312D] mb-16"
        >
          What We Do
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {features.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              whileHover={{ y: -10 }}
              style={{ 
                backgroundColor: item.bgColor, 
                borderColor: item.borderColor 
              }}
              className="relative p-8 md:p-12 rounded-[40px] border-3 shadow-sm flex flex-col items-start transition-shadow hover:shadow-xl"
            >
              <div className="flex items-center justify-center mb-8 overflow-hidden">
                <img 
                  src={item.icon} 
                  alt={item.title} 
                  className="w-12 h-12 object-contain" 
                />
              </div>

              <h3 className={`text-2xl md:text-3xl font-bold font-serif mb-6 ${item.textColor}`}>
                {item.title}
              </h3>
              <p className={`text-lg leading-relaxed font-light ${item.id === 1 ? 'text-white/90' : 'text-[#4A4A4A]'}`}>
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;