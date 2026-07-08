"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const WorkProcess = () => {
  const steps = [
    {
      id: 1,

      imageSrc: "/homeImage/Container (7).svg",
      title: "Session 1-2: Understanding Your Story",
      desc: "Start with our formulation tool which maps out your experiences, identifies patterns, and help you understand your triggers.",
    },
    {
      id: 2,
      imageSrc: "/homeImage/Container (8).svg",
      title: "Session 3-6: Processing & Practicing",
      desc: "Work through EMDR exercises at your own pace. Play brain games when you're ready. Listen to guided journeys before bed. Skip what doesn't resonate.",
    },
    {
      id: 3,
      imageSrc: "/homeImage/Container (9).svg",
      title: "Ongoing: Integration & Growth",
      desc: "Use homework exercises daily. Track your progress. Celebrate small wins. Know that your subscription is literally funding someone else's healing.",
    },
  ];

  return (
    <section className="bg-[#FFF8F0] py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl  mx-auto">
        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-3xl md:text-4xl font-serif text-[#1C2C2E] mb-20"
        >
          How This Actually Works
        </motion.h2>

        <div className="grid grid-cols-1 mb-20 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="bg-[#FBFBFC] p-10 rounded-[20px] border-5 border-[#92B09B] flex flex-col items-start min-h-[380px]"
            >
              <div className=" flex items-center justify-center mb-8 overflow-hidden">
                <div className="relative w-16 h-16">
                  <Image
                    src={step.imageSrc}
                    alt={step.title}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              <h3 className="text-xl font-bold text-[#1C2C2E] mb-5 leading-tight font-serif">
                {step.title}
              </h3>
              <p className="text-[#4A5568] leading-relaxed text-[15px]">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
          style={{ backgroundColor: "#DBE5DE" }} 
          className="mt-16 rounded-[20px] p-10 md:p-14 text-center border border-[#92B09B] shadow-sm"
        >
          <h3 className="text-2xl md:text-4xl font-serif text-[#1C2C2E] mb-4">
            Built by Someone Who Gets It
          </h3>
          <p className="text-[#374151] text-lg md:text-xl max-w-4xl mx-auto leading-relaxed italic">
            Created by Dr Jaime Jonsson, a clinical psychologist who believes
            therapy shouldn’t feel like therapy.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default WorkProcess;
