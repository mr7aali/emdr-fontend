"use client";
import { motion } from "framer-motion";
export default function EmdrMayBe() {
  const leftItems = [
    "Have experienced trauma - recent or decades old",
    "Battle with OCD, intrusive thoughts or obsessive thinking",
    "Experience low self-esteem or negative self-beliefs",
    "Haven't found relief through traditional therapy",
    "Haven't found relief through traditional therapy",
    "Prefer a structured approach with clear endpoints",
  ];
  const rightItems = [
    "Struggle with PTSD, depression, anxiety, or panic attacks",
    "Are processing grief, loss, or complicated bereavement",
    "Deal with addiction or substance use issues",
    "Find it difficult to talk about traumatic experiences",
    "Have limited time or energy for extensive therapy",
    "Experience physical symptoms linked to emotional trauma",
  ];
  return (
    <div className="min-h-screen  flex items-center justify-center px-6 py-16">
      <div className="max-w-6xl w-full">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl lg:text-5xl font-serif text-center text-[#0F1912] mb-12 leading-tight"
        >
          EMDR May Be Your Ideal Solution If You:
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-sm p-10 lg:p-14 mb-8"
        >
          <h2 className="text-center text-xl font-semibold text-[#0F1912] mb-10">
            EMDR Therapy
          </h2>
          <div className="grid lg:grid-cols-2 gap-x-16 gap-y-6">
            {/* Left Column */}
            <div className="space-y-6">
              {leftItems.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <svg
                      className="w-5 h-5 text-[#6b8268]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-[#0F1912] text-base leading-relaxed">
                    {item}
                  </p>
                </div>
              ))}
            </div>
            <div className="space-y-6">
              {rightItems.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <svg
                      className="w-5 h-5 text-[#6b8268]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-stone-800 text-base leading-relaxed">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <button className="bg-[#4A7C59] hover:bg-[#4A7C59] text-[#FFFFFF] px-8 py-4 rounded-lg text-[16px] font-normal transition-colors duration-200 shadow-sm">
            Start Your Healing Journey
          </button>
        </motion.div>
      </div>
    </div>
  );
}
