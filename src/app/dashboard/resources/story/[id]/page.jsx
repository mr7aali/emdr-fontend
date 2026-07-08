"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useStoredAuth } from "@/redux/authStorage";
import AudioPlayer from "@/components/dashboard/EMDRCompanion/CalmSpace/AudioPlayer";

const getBaseUrl = () => {
  const rawBaseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || process.env.VITE_BASE_URL || "";

  return rawBaseUrl.endsWith("/") ? rawBaseUrl.slice(0, -1) : rawBaseUrl;
};

const getCalmPlaces = async (token) => {
  const baseUrl = getBaseUrl();

  if (!baseUrl) {
    throw new Error("Calm place service is not configured.");
  }

  if (!token) {
    throw new Error("Please sign in again to load this calm place.");
  }

  const response = await fetch(`${baseUrl}/api/calm-place`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const result = await response.json();

  if (!response.ok || !result?.success) {
    throw new Error(result?.message || "Failed to fetch calm place entries.");
  }

  return result?.data || [];
};

const formatEntryDate = (value) => {
  if (!value) {
    return "Saved calm place";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Saved calm place";
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(parsedDate);
};

export default function CalmPlaceDetailPage() {
  const params = useParams();
  const calmPlaceId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const { token, hasHydrated } = useStoredAuth();
  const [calmPlace, setCalmPlace] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (!token) {
      setCalmPlace(null);
      setError("Please sign in again to load this calm place.");
      setIsLoading(false);
      return;
    }

    const fetchCalmPlace = async () => {
      try {
        setIsLoading(true);
        setError("");

        const items = await getCalmPlaces(token);
        const matchedItem = items.find((item) => item?._id === calmPlaceId);

        if (!matchedItem) {
          throw new Error("This calm place entry was not found.");
        }

        setCalmPlace(matchedItem);
      } catch (fetchError) {
        console.error("Error fetching calm place detail:", fetchError);
        setError(fetchError?.message || "Unable to load this calm place.");
        setCalmPlace(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCalmPlace();
  }, [calmPlaceId, hasHydrated, token]);

  return (
    <div className=" rounded-2xl bg-[#ece6d8]/60 p-4">
      <section className="relative overflow-hidden rounded-2xl border border-white/50 bg-[#efe9dc] shadow-[0_20px_50px_rgba(31,41,55,0.18)] p-3">
        {isLoading ? (
          <div className="flex min-h-[70vh] items-center justify-center px-6 text-center text-stone-700">
            Loading calm place...
          </div>
        ) : error ? (
          <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-red-600">{error}</p>
            <Link
              href="/dashboard/resources/story"
              className="rounded-full bg-[#4A7C59] px-5 py-2 text-sm font-medium text-white"
            >
              Back to list
            </Link>
          </div>
        ) : calmPlace ? (
          <>
            <div className="absolute inset-0">
              <Image
                src={calmPlace.image}
                alt={calmPlace.describe || "Calm place image"}
                fill
                unoptimized
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(240,236,227,0.56),rgba(240,236,227,0.28),rgba(240,236,227,0.18))]" />
            </div>

            <div className="relative z-10 p-4 md:p-6">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h1 className="font-serif text-2xl text-[#2f3027] md:text-3xl">
                    Calm Place Exercise
                  </h1>
                  <p className="mt-1 text-sm text-[#3e3a36]">
                    {formatEntryDate(calmPlace.createdAt)}
                  </p>
                </div>
                <Link
                  href="/dashboard/resources/story"
                  className="rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-[#355A43] shadow-sm backdrop-blur-md"
                >
                  Back
                </Link>
              </div>

              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.9fr)]">
                <div className="overflow-hidden rounded-3xl border border-white/50 bg-white/35 shadow-[0_18px_38px_rgba(31,41,55,0.18)] backdrop-blur-[2px]">
                  <div className="relative h-[500px] w-full">
                    <Image
                      src={calmPlace.image}
                      alt={calmPlace.describe || "Calm place image"}
                      fill
                      unoptimized
                      sizes="(min-width: 1024px) 55vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-[#bfc8bb] bg-white/90 p-4 shadow-[0_8px_18px_rgba(53,90,67,0.12)]">
                    <AudioPlayer
                      title="Calm Place Audio"
                      audioSrc={calmPlace.soundLink}
                      isReplaceable={false}
                    />
                  </div>

                  <div className="rounded-2xl border border-[#bfc8bb] bg-white/85 p-5 shadow-[0_8px_18px_rgba(53,90,67,0.12)]">
                    <h2 className="font-serif text-xl text-[#2d2a26]">
                      Description
                    </h2>
                    <p className="mt-3 whitespace-pre-line text-base leading-7 text-[#3e3a36]">
                      {calmPlace.describe || "No description was added for this calm place."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </section>
    </div>
  );
}
