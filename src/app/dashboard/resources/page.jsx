"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Headphones, SlidersHorizontal } from "lucide-react";

const resources = [
  {
    title: "Calm Place Exercise",
    description: "Access the calm place audio.",
    href: "/dashboard/resources/story",
    cta: "Open Calm Place",
    Icon: Headphones,
    image: "/homeImage/lightstream 1.png",
  },
  {
    title: "Bilateral Settings",
    description: "Customise your visual and audio stimulation preferences.",
    href: "/dashboard/resources/bilateral",
    cta: "Customise Settings",
    Icon: SlidersHorizontal,
    image: "/homeImage/Phase (1).png",
  },
  {
    title: "My Story",
    description: "Review or edit your story.",
    href: "/dashboard/resources/my-story",
    cta: "Review Story",
    Icon: BookOpen,
    image: "/homeImage/img1.jpg",
  },
];

export default function MyResources() {
  return (
    <div className="min-h-screen rounded-3xl border border-white/50 bg-white/20 p-6 shadow-[0_30px_80px_rgba(15,25,18,0.08)] backdrop-blur-md md:p-10">
      <div className="mb-8 max-w-3xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#4A7C59]">
          Support Between Sessions
        </p>
        <h1 className="font-serif text-4xl text-[#0F1912] md:text-5xl">
          My Resources
        </h1>
        <p className="mt-4 text-base leading-7 text-[#4A5A4E]">
          Return to the tools you have built during your EMDR journey. Listen,
          review, and adjust the supports that help you feel steady.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {resources.map(({ title, description, href, cta, Icon, image }) => (
          <Link
            key={title}
            href={href}
            className="group overflow-hidden rounded-3xl border border-white/70 bg-white/75 shadow-[0_18px_45px_rgba(53,90,67,0.12)] transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_24px_60px_rgba(53,90,67,0.18)]"
          >
            <div className="relative h-44 overflow-hidden">
              <img
                src={image}
                alt=""
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1912]/45 via-[#0F1912]/10 to-transparent" />
              <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 text-[#4A7C59] shadow-sm backdrop-blur">
                <Icon size={23} />
              </div>
            </div>

            <div className="p-6">
              <h2 className="font-serif text-2xl text-[#0F1912]">{title}</h2>
              <p className="mt-3 min-h-[56px] text-sm leading-6 text-[#5F6B63]">
                {description}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#4A7C59]">
                {cta}
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
