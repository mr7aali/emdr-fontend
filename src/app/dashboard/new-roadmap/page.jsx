"use client";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import CreateJourney from "@/components/dashboard/RoadmapSelectionCard";
import { useStoredAuth } from "@/redux/authStorage";
import { useGetProfileQuery } from "@/redux/features/profile";
import { selectCurrentUser } from "@/redux/slices/authSlice";
import {
  getProfilePayload,
  hasPaidPlanAccess,
} from "@/utils/subscriptionAccess";

export default function NewRoadmapPage() {
  const { token } = useStoredAuth();
  const authUser = useSelector(selectCurrentUser);
  const { data, isFetching, isLoading } = useGetProfileQuery(undefined, {
    skip: !token,
  });
  const profile = getProfilePayload(data) || authUser;
  const isCheckingPlan = (isLoading || isFetching) && !profile;
  const canCreateJourney = hasPaidPlanAccess(profile);

  if (isCheckingPlan) {
    return (
      <div className="rounded-2xl border border-white/50 bg-white/70 p-8 text-center shadow-sm">
        <p className="text-sm font-semibold text-[#0F1912]">
          Checking your plan...
        </p>
      </div>
    );
  }

  if (!canCreateJourney) {
    return (
      <div className="rounded-2xl border border-white/50 bg-white/80 p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-[#0F1912]">
          Roadmap access requires a premium plan
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-[#364153]">
          Free plan users cannot create a new journey. Please buy a premium
          plan first to start a new roadmap.
        </p>
        <Link
          href="/dashboard/profile"
          className="mt-6 inline-flex rounded-full bg-[#4A7C59] px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#3d6649]"
        >
          View Plans
        </Link>
      </div>
    );
  }

  return <CreateJourney />;
}
