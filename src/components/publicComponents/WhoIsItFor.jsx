"use client";

import React from "react";
import { motion } from "framer-motion";

const WhoIsItFor = () => {
  const data = [
    {
      title: "PTSD/Trauma",
      percentage: "90%",
      subText: "treatment response rate",
      description: "Strongly recommended by WHO, NICE, and ISTSS guidelines",
      icon: "/homeImage/Container1.svg",
    },
    {
      title: "Depression",
      percentage: "71%",
      subText: "achieved remission",
      description:
        "74% relapse-free at 12 months. 2x more likely to achieve remission vs CBT",
      icon: "/homeImage/Container (1).svg",
    },
    {
      title: "Anxiety Disorders",
      percentage: "100%",
      subText: "of GAD patients recovered",
      description: "Large effect sizes across anxiety conditions (small study)",
      icon: "/homeImage/Container (2).svg",
    },
    {
      title: "OCD",
      percentage: "30-62%",
      subText: "significant improvement",
      description: "Equivalent to CBT (gold-standard treatment)",
      icon: "/homeImage/Container1.svg",
    },
    {
      title: "Chronic Pain",
      percentage: "High",
      subText: "effect sizes (-1.12 to -6.87)",
      description: "All patients reported decreased pain levels",
      icon: " /homeImage/Container (3).svg",
    },
    {
      title: "Grief & Bereavement",
      percentage: "67%",
      subText: "show significant improvement",
      description: "Effective for processing loss and complex grief",
      icon: "/homeImage/Container (4).svg",
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
          className="text-4xl md:text-5xl font-serif text-[#2D312D] mb-4"
        >
          Who is it for?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-gray-500 font-medium mb-16 uppercase tracking-widest text-sm"
        >
          What does the evidence say?
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
              className="bg-[#FBFBFC] p-10 rounded-[30px] border-5 border-[#92B09B] shadow-sm flex flex-col items-center text-center space-y-4 hover:shadow-xl hover:border-[#568261]/50 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-full  overflow-hidden mb-2">
                <img
                  src={item.icon}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) =>
                    (e.target.src = "https://via.placeholder.com/150")
                  }
                />
              </div>

              <h3 className="text-2xl font-bold text-[#2D312D]">
                {item.title}
              </h3>

              <div className="flex flex-col">
                <span className="text-3xl font-bold text-[#2D312D]">
                  {item.percentage}
                </span>
                <span className="text-gray-500 text-sm font-medium">
                  {item.subText}
                </span>
              </div>

              <p className="text-gray-600 leading-relaxed text-[15px]">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhoIsItFor;
