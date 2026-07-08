"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useStoredAuth } from "@/redux/authStorage";
import {
  buildCbtFormulationNodes,
  flattenCbtFormulationNodes,
  getCbtFormulationEntryValues,
} from "@/utils/cbtFormulationConfig";
import {
  formatDate,
  getCbtFormulations,
  hasContent,
} from "./storyUtils";

const buildPreviewText = (entryValues) => {
  const { value, extraValue } = entryValues || {};

  if (Array.isArray(value)) {
    if (!value.length && !hasContent(extraValue)) {
      return "No answer saved yet";
    }

    const joinedValue = value.join(", ");
    const suffix = hasContent(extraValue) ? `, ${extraValue}` : "";
    const fullText = `${joinedValue}${suffix}`.trim();

    if (fullText.length <= 90) {
      return fullText;
    }

    return `${fullText.slice(0, 90).trim()}...`;
  }

  if (hasContent(value)) {
    const trimmedValue = value.trim();

    if (trimmedValue.length <= 90) {
      return trimmedValue;
    }

    return `${trimmedValue.slice(0, 90).trim()}...`;
  }

  if (hasContent(extraValue)) {
    return extraValue.trim();
  }

  return "No answer saved yet";
};

const ReadOnlyAnswer = ({ entryValues, content }) => {
  const { value, extraValue } = entryValues || {};

  if (Array.isArray(value)) {
    return (
      <div className="space-y-4">
        {value.length ? (
          <div className="flex flex-wrap gap-2">
            {value.map((item) => (
              <span
                key={item}
                className="rounded-full bg-[#E8F3EC] px-3 py-1 text-sm font-medium text-[#355A43]"
              >
                {item}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#7A7A7A]">No answer saved yet.</p>
        )}

        {hasContent(extraValue) ? (
          <div className="rounded-lg bg-stone-50 p-4">
            <p className="mb-2 text-sm font-medium text-stone-700">
              {content?.otherLabel || "Other"}
            </p>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#7A7A7A]">
              {extraValue}
            </p>
          </div>
        ) : null}
      </div>
    );
  }

  if (hasContent(value)) {
    return (
      <div className="rounded-lg bg-stone-50 p-4">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#7A7A7A]">
          {value}
        </p>
      </div>
    );
  }

  return <p className="text-sm text-[#7A7A7A]">No answer saved yet.</p>;
};

export default function MyStoryPage() {
  const { token, hasHydrated } = useStoredAuth();
  const currentNodeRef = useRef(null);
  const reactSectionRef = useRef(null);
  const consequencesRef = useRef(null);
  const superpowersRef = useRef(null);
  const [activeModal, setActiveModal] = useState(null);
  const [entry, setEntry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const formulationNodes = useMemo(() => buildCbtFormulationNodes(), []);
  const timelineNodes = formulationNodes.timeline;
  const reactNodes = formulationNodes.react;
  const allNodes = useMemo(
    () => flattenCbtFormulationNodes(formulationNodes),
    [formulationNodes],
  );

  const getNodeById = (nodeId) =>
    allNodes.find((node) => node.id === nodeId);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (!token) {
      setEntry(null);
      setError("Please sign in again to load your story.");
      setIsLoading(false);
      return;
    }

    const fetchLatestEntry = async () => {
      try {
        setIsLoading(true);
        setError("");

        const items = await getCbtFormulations(token);
        setEntry(items[0] || null);
      } catch (fetchError) {
        console.error("Error fetching latest story:", fetchError);
        setError(fetchError?.message || "Unable to load your story right now.");
        setEntry(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestEntry();
  }, [hasHydrated, token]);

  const activeNode = getNodeById(activeModal);
  const activeContent = activeNode?.modalContent;
  const activeEntryValues = entry
    ? getCbtFormulationEntryValues(entry, activeModal)
    : null;

  return (
    <div className="min-h-screen bg-white/30 rounded-2xl">
      <div className="relative z-10 min-h-screen overflow-y-auto rounded-2xl">
        <div className="sticky top-0 z-20 px-8 pb-4 pt-8 backdrop-blur-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-serif text-stone-900">
                My CBT Formulation
              </h1>
              {entry ? (
                <p className="mt-1 text-sm text-stone-600">
                  Saved on {formatDate(entry?.createdAt)}
                </p>
              ) : null}
            </div>
            <Link
              href="/dashboard/resources"
              className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-[#355A43] transition-colors hover:bg-stone-50"
            >
              Back to resources
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-8 py-16">
          {isLoading ? (
            <div className="rounded-2xl bg-white/90 px-5 py-10 text-center text-stone-700 shadow-lg">
              Loading your story...
            </div>
          ) : error ? (
            <div className="rounded-2xl bg-red-50 px-5 py-10 text-center text-red-600 shadow-lg">
              {error}
            </div>
          ) : !entry ? (
            <div className="rounded-2xl bg-white/90 px-5 py-10 text-center text-stone-700 shadow-lg">
              No CBT formulation has been saved yet.
            </div>
          ) : (
            <>
              {timelineNodes.map((node, index) => {
                const entryValues = getCbtFormulationEntryValues(entry, node.id);

                return (
                  <motion.div
                    key={node.id}
                    ref={index === 0 ? currentNodeRef : null}
                    initial={{ opacity: 0, y: 80 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="relative mb-8"
                  >
                    <div className="mb-4 mt-6 text-center">
                      <h2 className="text-xl font-serif text-[#0F1912]">
                        {node.section}
                      </h2>
                    </div>

                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={() => setActiveModal(node.id)}
                        className="relative w-full max-w-2xl transition-all duration-300 hover:scale-[1.01]"
                      >
                        <div className="rounded-3xl border-4 border-[#4A7C59] bg-white px-8 py-8 text-center text-xl text-[#0F1912] shadow-2xl transition-all duration-500 backdrop-blur-sm">
                          <h3 className="mb-2 text-3xl font-serif text-stone-900">
                            {node.title}
                          </h3>
                          <p className="text-lg italic text-stone-600">
                            {node.subtitle}
                          </p>
                          <div className="mt-5 rounded-2xl bg-stone-50 p-4 text-left">
                            <p className="text-sm font-medium text-stone-700">
                              {buildPreviewText(entryValues)}
                            </p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </motion.div>
                );
              })}

              <motion.div
                ref={reactSectionRef}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, ease: "easeOut" }}
                className="mt-10 pb-10"
              >
                <div className="mb-8 flex justify-center">
                  <div className="h-20 w-0.5 bg-[#4A7C59]" />
                </div>

                <div className="mb-20 text-center">
                  <h2 className="text-3xl font-serif text-stone-900">
                    How I React
                  </h2>
                </div>

                <div className="relative mx-auto mb-16 mt-8 min-h-[380px] w-full max-w-2xl rounded-2xl px-6 py-8 md:min-h-[420px] md:px-10 md:py-10">
                  <svg
                    className="pointer-events-none absolute inset-0 z-0 h-full w-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <defs>
                      <marker
                        id="arrowhead-responsive-story"
                        markerWidth="4"
                        markerHeight="2.5"
                        refX="2"
                        refY="1.25"
                        orient="auto"
                      >
                        <polygon points="0 0, 4 1.25, 0 2.5" fill="#4A7C59" />
                      </marker>
                    </defs>

                    <motion.path
                      d="M50 20 Q42 38 24 72"
                      vectorEffect="non-scaling-stroke"
                      fill="transparent"
                      stroke="#4A7C59"
                      strokeWidth="3"
                      markerEnd="url(#arrowhead-responsive-story)"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                    />
                    <motion.path
                      d="M24 72 Q50 88 76 72"
                      vectorEffect="non-scaling-stroke"
                      fill="transparent"
                      stroke="#4A7C59"
                      strokeWidth="3"
                      markerEnd="url(#arrowhead-responsive-story)"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
                    />
                    <motion.path
                      d="M76 72 Q58 38 50 20"
                      vectorEffect="non-scaling-stroke"
                      fill="transparent"
                      stroke="#4A7C59"
                      strokeWidth="3"
                      markerEnd="url(#arrowhead-responsive-story)"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 1, ease: "easeInOut", delay: 0.4 }}
                    />
                  </svg>

                  {reactNodes.slice(0, 3).map((node, index) => {
                    const entryValues = getCbtFormulationEntryValues(entry, node.id);
                    const positions = [
                      "absolute left-1/2 top-0 z-20 flex w-[90%] -translate-x-1/2 justify-center md:w-auto",
                      "absolute bottom-8 left-0 z-20 flex w-[45%] justify-start pl-2 md:pl-4",
                      "absolute bottom-8 right-0 z-30 flex w-[45%] justify-end pr-2 md:pr-4",
                    ];

                    return (
                      <div key={node.id} className={positions[index]}>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.75,
                            ease: "easeOut",
                            delay: index * 0.15,
                          }}
                          className="w-full max-w-[280px]"
                        >
                          <button
                            type="button"
                            onClick={() => setActiveModal(node.id)}
                            className="relative z-10 w-full transition-all duration-300 hover:scale-105"
                          >
                            <div className="flex aspect-[3/2] w-full flex-col items-center justify-center rounded-3xl border-4 border-[#4A7C59] bg-white px-3 py-5 text-center shadow-xl transition-all duration-500">
                              <h3 className="mb-1 text-2xl font-serif text-stone-900 md:mb-2 md:text-3xl">
                                {node.title}
                              </h3>
                              <p className="text-sm italic text-stone-600 md:text-lg">
                                {node.subtitle}
                              </p>
                              <p className="mt-3 line-clamp-3 text-xs text-stone-700">
                                {buildPreviewText(entryValues)}
                              </p>
                            </div>
                          </button>
                        </motion.div>
                      </div>
                    );
                  })}
                </div>

                {["consequences", "superpowers"].map((nodeId, index) => {
                  const node = getNodeById(nodeId);
                  const entryValues = getCbtFormulationEntryValues(entry, nodeId);

                  return (
                    <div
                      key={nodeId}
                      ref={index === 0 ? consequencesRef : superpowersRef}
                      className="flex flex-col items-center justify-center px-8 py-10"
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="w-full max-w-lg"
                      >
                        <button
                          type="button"
                          onClick={() => setActiveModal(nodeId)}
                          className="relative w-full transition-all duration-300 hover:scale-[1.03]"
                        >
                          <div className="rounded-3xl border-4 border-[#4A7C59] bg-white p-5 text-center shadow-2xl transition-all duration-500">
                            <h3 className="mb-4 text-4xl font-serif text-[#0F1912]">
                              {node.title}
                            </h3>
                            <p className="text-xl italic text-stone-600">
                              {node.subtitle}
                            </p>
                            <div className="mt-5 rounded-2xl bg-stone-50 p-4 text-left">
                              <p className="text-sm font-medium text-stone-700">
                                {buildPreviewText(entryValues)}
                              </p>
                            </div>
                          </div>
                        </button>
                      </motion.div>
                    </div>
                  );
                })}
              </motion.div>
            </>
          )}
        </div>
      </div>

      {activeModal && activeContent ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-stone-200 p-6">
              <h2 className="text-2xl font-serif text-stone-900">
                Your Journey Guide
              </h2>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-stone-400 hover:text-stone-600"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4 p-6">
              <h3 className="text-xl font-semibold text-stone-900">
                {activeContent.title}
              </h3>
              <p className="text-sm italic text-stone-600">
                {activeContent.description}
              </p>
              <p className="text-sm text-stone-700">{activeContent.question}</p>

              {activeContent.bullets && (
                <ul className="space-y-2 text-sm text-stone-800">
                  {activeContent.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2">
                      <span className="mt-1 text-stone-900">-</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}

              {activeContent.example && (
                <div className="rounded-lg bg-stone-50 p-4">
                  <p className="text-sm text-stone-700">
                    <span className="font-medium">Example:</span>{" "}
                    {activeContent.example}
                  </p>
                </div>
              )}

              <ReadOnlyAnswer
                entryValues={activeEntryValues}
                content={activeContent}
              />
            </div>

            <div className="border-t border-stone-200 p-6">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-full rounded-lg bg-[#4A7C59] px-6 py-3 font-medium text-white transition-colors hover:bg-[#3d6649]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
