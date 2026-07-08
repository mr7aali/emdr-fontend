"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Mail } from "lucide-react";

export default function TermsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/terms/active`);
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        }
      } catch (error) {
        console.error("Error fetching terms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTerms();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FCF9F4]">
        <Loader2 className="w-10 h-10 animate-spin text-[#4A7C59]" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FCF9F4] text-center px-4">
        <h2 className="text-2xl font-serif text-[#1C2C2E] mb-4">Terms & Conditions Not Available</h2>
        <p className="text-[#6E8B7A]">We are currently updating our terms. Please check back later.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-[#4A7C59] text-white rounded-lg hover:bg-[#3d664a] transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#FCF9F4] min-h-screen py-20 px-6 md:px-10">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-serif text-[#1C2C2E] mb-6">
            Terms & Conditions
          </h1>
        </motion.div>

        {/* Content Body */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-gray-100"
        >
          {/* Dynamic Sections */}
          <div className="space-y-12">
            {data.sections.sort((a, b) => a.order - b.order).map((section, index) => (
              <motion.section
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="text-xl font-bold text-[#101828] mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#E8F0EA] text-[#4A7C59] flex items-center justify-center text-sm font-bold shrink-0">
                    {index + 1}
                  </span>
                  {section.title}
                </h3>
                <div className="pl-11">
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {section.content}
                  </p>
                </div>
              </motion.section>
            ))}
          </div>

          {/* Contact Info */}
          {/* <div className="mt-16 pt-10 border-t border-gray-100">
            <div className="bg-[#F8FAF9] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="text-lg font-bold text-[#101828] mb-2">Have questions?</h4>
                <p className="text-gray-600 text-sm">Our legal team is here to help you understand our terms of service.</p>
              </div>
              <a
                href={`mailto:${data.contactEmail}`}
                className="flex items-center gap-3 px-6 py-3 bg-[#1C2C2E] text-white rounded-xl hover:bg-[#2d464a] transition-all font-medium whitespace-nowrap"
              >
                <Mail className="w-5 h-5" />
                Contact {data.contactName}
              </a>
            </div>
          </div> */}
        </motion.div>

        {/* Timestamp Footer */}
        {/* <div className="text-center mt-10 text-gray-500 text-xs">
          Last Updated: {new Date(data.lastUpdated).toLocaleString()}
        </div> */}
      </div>
    </div>
  );
}
