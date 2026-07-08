"use client";
import React, { useEffect, useState } from "react";
import { useStoredAuth } from "@/redux/authStorage";

const BILATERAL_CATEGORY_NAME = "bilateral stimulation img";

export const getBilateralEnvironments = async (token) => {
  const rawBaseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || process.env.VITE_BASE_URL || "";
  const baseUrl = rawBaseUrl.endsWith("/")
    ? rawBaseUrl.slice(0, -1)
    : rawBaseUrl;

  if (!baseUrl) {
    throw new Error("Image service is not configured.");
  }

  if (!token) {
    throw new Error("Please sign in again to load visual environments.");
  }

  const allMedia = [];
  let currentPage = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(`${baseUrl}/api/media?page=${currentPage}`, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();

    if (!response.ok || !result?.success) {
      throw new Error("Failed to fetch bilateral environments.");
    }

    const pageMedia = result?.data?.media || [];
    allMedia.push(...pageMedia);

    const totalPages = Number(result?.data?.pagination?.totalPages || 0);
    const hasNextPage = Boolean(result?.data?.pagination?.hasNextPage);
    hasMore = totalPages > 0 ? currentPage < totalPages : hasNextPage;

    currentPage += 1;
  }

  return allMedia
    .filter(
      (item) =>
        item?.mediaType === "image" &&
        item?.status === "active" &&
        item?.categoryId?.categoryName?.trim()?.toLowerCase() ===
          BILATERAL_CATEGORY_NAME
    )
    .map((item, index) => ({
      id: item?._id,
      name: item?.name || `Environment ${index + 1}`,
      image: item?.url,
    }));
};

export default function VisualEnvironmentSelector({ selectedId, onSelect }) {
  const { token } = useStoredAuth();
  const [environments, setEnvironments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEnvironments = async () => {
      try {
        setIsLoading(true);
        setError("");

        const items = await getBilateralEnvironments(token);

        setEnvironments(items);
      } catch (fetchError) {
        console.error("Error fetching bilateral environments:", fetchError);
        setError(fetchError.message || "Unable to load visual environments.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnvironments();
  }, [token]);

  useEffect(() => {
    if (!selectedId && environments[0]?.id) {
      onSelect(environments[0].id);
    }
  }, [environments, onSelect, selectedId]);

  return (
    <div className="bg-white/40 backdrop-blur-md rounded-3xl p-6 border border-white/20">
      <h3 className="text-xl font-serif text-[#0F1912] mb-4">Visual</h3>
      {isLoading ? (
        <div className="rounded-2xl bg-white/70 px-4 py-8 text-center text-stone-700">
          Loading visual environments...
        </div>
      ) : error ? (
        <div className="rounded-2xl bg-red-50 px-4 py-8 text-center text-red-600">
          {error}
        </div>
      ) : environments.length === 0 ? (
        <div className="rounded-2xl bg-white/70 px-4 py-8 text-center text-stone-700">
          No bilateral environment images found.
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
          {environments.map((env) => (
            <div
              key={env.id}
              onClick={() => onSelect(env.id)}
              className={`flex-shrink-0 w-48 h-32 rounded-2xl overflow-hidden relative cursor-pointer border-2 transition-all ${
                selectedId === env.id
                  ? "border-[#4A7C59] scale-95"
                  : "border-transparent opacity-80 hover:opacity-100"
              }`}
            >
              <img
                src={env.image}
                alt={env.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-2 text-center">
                <span className="text-white text-sm font-medium">
                  {env.name}
                </span>
              </div>
              {selectedId === env.id && (
                <div className="absolute top-2 right-2 bg-[#4A7C59] rounded-full p-1">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
