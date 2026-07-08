"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useGetFaqQuery } from "@/redux/features/faq";

const getErrorMessage = (error) => {
  if (!error) {
    return "";
  }

  if (typeof error === "string") {
    return error;
  }

  if (typeof error?.message === "string") {
    return error.message;
  }

  if (typeof error?.error === "string") {
    return error.error;
  }

  if (typeof error?.data?.message === "string") {
    return error.data.message;
  }

  if (typeof error?.data?.data?.message === "string") {
    return error.data.data.message;
  }

  return "We could not load the FAQs right now.";
};

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="mb-5">
      <div
        className={`overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0px_2px_8px_rgba(0,0,0,0.04)] transition-all duration-300 ${
          isOpen ? "ring-1 ring-[#568261]/20" : ""
        }`}
      >
        <button
          type="button"
          onClick={onClick}
          className="flex w-full items-center justify-between p-5 text-left md:p-6"
        >
          <span className="font-serif text-lg text-[#2D312D] opacity-90 md:text-xl">
            {question}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="ml-4 shrink-0 text-[#568261]"
          >
            <ChevronDown size={20} strokeWidth={2.5} />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {isOpen ? (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="max-w-[90%] px-6 pb-6 text-base leading-relaxed text-gray-500 md:text-[17px]">
                {answer}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const {
    data: faqData = [],
    error,
    isFetching,
    isLoading,
    refetch,
  } = useGetFaqQuery();

  const activeIndex =
    faqData.length === 0
      ? -1
      : openIndex < 0
        ? -1
        : Math.min(openIndex, faqData.length - 1);

  return (
    <section id="faq" className="bg-[#FCF9F4] px-6 py-20 md:px-12 lg:px-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-serif text-[#2D312D] md:text-5xl"
          >
            Frequently Asked Questions
          </motion.h2>
          {!isLoading && isFetching ? (
            <p className="mt-4 font-sans text-xs font-semibold uppercase tracking-[2px] text-[#568261]">
              Refreshing FAQs...
            </p>
          ) : null}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-[0px_2px_8px_rgba(0,0,0,0.04)]"
              >
                <div className="h-6 w-2/3 animate-pulse rounded-full bg-stone-200" />
                <div className="mt-4 h-4 w-full animate-pulse rounded-full bg-stone-100" />
                <div className="mt-2 h-4 w-5/6 animate-pulse rounded-full bg-stone-100" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-100 bg-white px-6 py-10 text-center shadow-[0px_2px_8px_rgba(0,0,0,0.04)]">
            <p className="font-sans text-sm text-rose-500">
              {getErrorMessage(error)}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-5 rounded-full bg-[#568261] px-5 py-2 font-sans text-sm font-semibold text-white transition hover:bg-[#476e51]"
            >
              Try again
            </button>
          </div>
        ) : faqData.length === 0 ? (
          <div className="rounded-2xl border border-stone-200 bg-white px-6 py-10 text-center shadow-[0px_2px_8px_rgba(0,0,0,0.04)]">
            <p className="font-sans text-sm text-stone-500">
              No FAQs are available right now.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {faqData.map((faq, index) => (
              <motion.div
                key={faq?._id || faq?.displayId || index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <FAQItem
                  question={faq?.question}
                  answer={faq?.answer}
                  isOpen={activeIndex === index}
                  onClick={() =>
                    setOpenIndex(activeIndex === index ? -1 : index)
                  }
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FAQSection;
