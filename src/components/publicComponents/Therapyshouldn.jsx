"use client";
import React from "react";
import { motion } from "framer-motion";
const Therapyshouldn = () => {
  return (
    <div className="min-h-48 ">
      <main className="container mx-auto px-6 lg:px-12 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="mb-2">
              <p className="text-sm text-[#4A7C59] font-light tracking-wide">
                Built by Someone Who Gets It
              </p>
            </div>
            <h1 className="text-5xl lg:text-6xl font-serif text-[#0F1912] leading-tight mb-10 mt-10">
              Therapy shouldn't feel like therapy.
            </h1>
            <div className="space-y-4 text-[#0F1912] text-lg leading-relaxed">
              <p>
                Created by Dr Jaime Jonsson, a clinical psychologist who
                believes that healing should be accessible, engaging, and devoid
                of the sterile waiting room atmosphere.
              </p>
              <p>
                This is trauma therapy that doesn't traumatise your bank account
                or your dignity. It's CBT exercises that don't feel like
                homework. It's EMDR without the eye-watering session fees.
              </p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-stone-200">
              <div className="text-6xl text-emerald-700 font-serif mb-4">"</div>
              <blockquote className="text-[#000000] text-base leading-relaxed mb-6">
                And every single subscription creates a ripple effect – your
                healing funds someone else's healing, which funds someone else's
                healing..."
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-200 to-rose-300 flex items-center justify-center">
                  <img
                    src="/homeImage/founderImage.png"
                    alt="Dr Jaime Jonsson"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-[#000000]">
                    Dr Jaime Jonsson
                  </p>
                  <p className="text-sm text-[#000000]">
                    Clinical Psychologist & Founder
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-stone-200 to-stone-300">
              <img
                src="/homeImage/founderImage.png"
                alt="Dr Jaime Jonsson"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-emerald-200/30 rounded-full blur-3xl -z-10"></div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Therapyshouldn;
