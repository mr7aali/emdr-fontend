"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Music } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function SpiralTechniquePage() {
  const images = [
    "/images/I want a beautiful, whimsical, illustrated watercolour painting of a person holding their brain in their hands, watching all different thoughts with situations in, pop out..jpg",
    "/images/I want a beautiful, whimsical, illustrated watercolour painting of a person looking and holding their brain in their hands, watching all different thoughts with situations in, pop out. (1).jpg",
    "/images/I want a beautiful, whimsical, illustrated watercolour painting of a person looking and holding their brain in their hands, watching all different thoughts with situations in, pop out..jpg",
    "/images/I want a beautiful, whimsical, illustrated watercolour painting of a woman holding their brain in front of her face, with all different thoughts with situations in, pop out..jpg",
    "/images/I want a beautiful, whimsical, illustrated watercolour painting of a woman holding their brain in their hands, watching all different thoughts with situations in, pop out..jpg",
    "/images/I want a beautiful, whimsical, illustrated watercolour painting of a woman holding their brain out, in front of her face, with all different thoughts with situations in, pop out..jpg",
    "/images/I want a beautiful, whimsical, illustrated watercolour painting of a woman holding their brain, with all different thoughts with situations in, pop out. (1).jpg",
    "/images/I want a beautiful, whimsical, illustrated watercolour painting of a woman holding their brain, with all different thoughts with situations in, pop out..jpg",
    "/images/Untitled design (8).png",
  ];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#292524] font-serif">
              Spiral Technique
            </h1>
            <p className="text-[#383634] text-sm">
              Visualizing calmness and grounding
            </p>
          </div>
        </div>




        {/* Content Frame */}
        <div className="bg-white/20 backdrop-blur-md rounded-[40px] border border-white/50 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {images.map((src, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group relative aspect-square rounded-[32px] overflow-hidden bg-white/40 border border-white/50 shadow-soft hover:shadow-xl transition-all duration-500"
              >
                <img
                  src={src}
                  alt={`Spiral Technique illustration ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap");

        .font-serif {
          font-family: "Playfair Display", serif;
        }
      `}</style>
    </div>
  );
}
