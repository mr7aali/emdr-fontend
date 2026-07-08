"use client";
import React from "react";
import { motion } from "framer-motion";
const WhatIncluded = () => {
  const data = [
    {
      title: "Full EMDR Program",
      percentage: "90%",
      subText: "treatment response rate",
      description:
        "An immersive experience with beautiful, customisable graphics and sounds will take you through your individualised problem area.",
      icon: "/homeImage/Container.png",
    },
    {
      title: "Progress Tracking",
      percentage: "71%",
      subText: "achieved remission",
      description:
        "Check-ins using validated tools that track your progress. We'll explain what your scores mean in plain English.",
      icon: "/homeImage/Container.png",
    },
    {
      title: "Calming Resources",
      percentage: "100%",
      subText: "of GAD patients recovered",
      description:
        "Build your personal safe space you can return to anytime alongside other exercises. All narrated by Dr Jaime Jonsson.",
      icon: "/homeImage/Container.png",
    },
    {
      title: "My Story Map",
      percentage: "30-62%",
      subText: "significant improvement",
      description:
        "Connect the dots between your past and present with our interactive tool that helps you understand why you react the way you do.",
      icon: "/homeImage/Container.png",
    },
    {
      title: "Extra Assignments",
      percentage: "High",
      subText: "effect sizes (-1.12 to -6.87)",
      description:
        "Work specifically on thoughts, feelings and behaviours with engaging exercises that take your journey further.",
      icon: "/homeImage/Container.png",
    },

    
    {
      title: "EMDR 2.0 - Brain Training That Actually Helps",
      percentage: "67%",
      subText: "show significant improvement",
      description:
        "Play Tetris Take a Stroop test. These cognitive games create 'working memory overload' that helps your brain reprocess trauma.",
      icon: "/homeImage/Container.png",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };
  return (
    <section className="bg-[#FFF8F0] py-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-serif text-[#0F1912] mb-4"
        >
          What's Included in the Platform
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[#6E967A] font-normal mb-16  tracking-widest text-md"
        >
          Flexible pricing options to support your healing journey – cancel
          anytime.
        </motion.p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {data.map((item, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="bg-[#FBFBFC] p-10 rounded-[30px] border-5 border-[#DBE5DE] shadow-sm flex flex-col text-left space-y-4 hover:shadow-xl hover:border-[#568261]/50 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-full  bg-white overflow-hidden mb-2">
                <img
                  src={item.icon}
                  alt={item.title}
                  className="w-full h-full  bg-white object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-[#0F1912]">
                {item.title}
              </h3>
              <p className="text-[#0F1912] leading-relaxed text-[15px]">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
export default WhatIncluded;
