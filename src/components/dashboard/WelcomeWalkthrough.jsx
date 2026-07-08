"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, HeartPulse, ArrowRight, Map, Compass, BookOpen, Activity } from "lucide-react";
import { useStoredAuth } from "@/redux/authStorage";
import { useRouter } from "next/navigation";

export default function WelcomeWalkthrough() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, hasHydrated } = useStoredAuth();
  const router = useRouter();

  useEffect(() => {
    // Show the popup every time they log in / land on the dashboard
    if (hasHydrated && isAuthenticated) {
      setIsOpen(true);
    }
  }, [hasHydrated, isAuthenticated]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleStartRoadmap = () => {
    setIsOpen(false);
    router.push("/dashboard/EMDRCompanion");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col"
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-8 md:p-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4 shadow-inner">
              <HeartPulse className="w-8 h-8 text-[#4A7C59]" />
            </div>

            <h2 className="text-2xl md:text-3xl font-serif text-gray-900 mb-2 text-center">
              Welcome to UK Inkind
            </h2>

            <p className="text-gray-600 text-base md:text-lg text-center mb-8">
              To start your EMDR journey, click Start Roadmap and follow the sessions. Here is a quick guide to your dashboard:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-8">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Map className="w-6 h-6 text-[#4A7C59]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">EMDR Companion</h3>
                  <p className="text-sm text-gray-500 mt-1">Your step-by-step roadmap and active healing sessions.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Activity className="w-6 h-6 text-[#4A7C59]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">New Roadmap</h3>
                  <p className="text-sm text-gray-500 mt-1">Discover how your personalized healing journey is created and how new sessions will appear as you progress.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <BookOpen className="w-6 h-6 text-[#4A7C59]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Homework</h3>
                  <p className="text-sm text-gray-500 mt-1">Exercises and tasks assigned to reinforce your therapy sessions.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Compass className="w-6 h-6 text-[#4A7C59]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Resources</h3>
                  <p className="text-sm text-gray-500 mt-1">Access calming tools, bilateral stimulation, and helpful materials.</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-10 py-3 bg-[#4A7C59] text-white font-medium rounded-xl hover:bg-[#3d6849] active:scale-95 transition-all"
            >
              OK
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
