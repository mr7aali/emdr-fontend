"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const ClinicCTA = () => {

  const clinicData = {
    title: "Want traditional face-to-face or online therapy?",
    description:
      "Visit the InKind National Psychology Clinic for private therapy appointments with Dr Jonsson and our team of experienced clinical psychologists. We work with all major insurance companies and offer both online and in-person sessions depending on location.",
    buttonText: "Visit our clinic",
    link: "#",
  };

  return (
    <section style={{ backgroundColor: "#FCF9F4" }} className="py-16 px-6">
      <div className="max-w-7xl mx-auto ">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            backgroundColor: "#D9E4DD",
            borderRadius: "24px",
            border: "1px solid #A8C2B1",
          }}
          className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 items-center justify-between gap-8"
        >

          <div className=" text-left">
            <h2
              style={{ color: "#2D312D" }}
              className="text-2xl md:text-4xl font-serif mb-6 leading-tight"
            >
              {clinicData.title}
            </h2>
            <p
              style={{ color: "#4A4A4A" }}
              className="text-lg md:text-xl leading-relaxed font-light max-w-2xl"
            >
              {clinicData.description}
            </p>
          </div>

          {/* Action Button */}
          <motion.a
            href={clinicData.link}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "14px 28px",
              borderRadius: "12px",
              border: "1.5px solid #4A7C59",
              color: "#4A7C59",
              backgroundColor: "transparent",
              textDecoration: "none",
            }}
            className="font-medium whitespace-nowrap transition-colors hover:bg-white/30"
          >
            <MapPin size={20} />
            {clinicData.buttonText}
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default ClinicCTA;
