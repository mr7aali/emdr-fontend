"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Plus, Target } from "lucide-react";
import { useStoredAuth } from "@/redux/authStorage";

const getBaseUrl = () => {
  const rawBaseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || process.env.VITE_BASE_URL || "";

  return rawBaseUrl.endsWith("/") ? rawBaseUrl.slice(0, -1) : rawBaseUrl;
};

const EXPOSURE_PLAN_STORAGE_KEYS = [
  "activeExposurePlanId",
  "currentExposurePlanId",
  "selectedExposurePlanId",
  "exposurePlanId",
];

const getStoredExposurePlanId = () => {
  if (typeof window === "undefined") {
    return "";
  }

  for (const key of EXPOSURE_PLAN_STORAGE_KEYS) {
    const value = window.localStorage.getItem(key);

    if (value) {
      return value;
    }
  }

  return "";
};

const exposureRequest = async ({ baseUrl, token, path, errorMessage }) => {
  const response = await fetch(`${baseUrl}${path}`, {
    method: "GET",
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json().catch(() => null);

  if (!response.ok || !result?.success) {
    throw new Error(result?.message || errorMessage || "Request failed.");
  }

  return result?.data;
};

const resolveLatestPlanId = async ({ baseUrl, token }) => {
  const plansData = await exposureRequest({
    baseUrl,
    token,
    path: "/api/exposure/plans",
    errorMessage: "Unable to load your latest behaviour homework.",
  });

  const plans = Array.isArray(plansData)
    ? plansData
    : Array.isArray(plansData?.plans)
      ? plansData.plans
      : Array.isArray(plansData?.items)
        ? plansData.items
        : [];

  const storedPlanId = getStoredExposurePlanId();

  if (storedPlanId) {
    const matchingPlan = plans.find(
      (item) => (item?._id || item?.id) === storedPlanId,
    );

    if (matchingPlan) {
      return storedPlanId;
    }
  }

  const activePlan =
    plans.find((item) => item?.status === "in_progress") ||
    plans.find((item) => item?.status === "not_started") ||
    plans[0];

  return activePlan?._id || activePlan?.id || "";
};

const normalizeProgress = (plan, review) => {
  const hierarchy = Array.isArray(plan?.hierarchy) ? plan.hierarchy : [];
  const reviewStepsByIndex = new Map(
    (review?.stepReviews || []).map((item) => [item.stepIndex, item]),
  );
  const latestActiveReviewStep = [...(review?.stepReviews || [])]
    .reverse()
    .find((item) => item?.status && item.status !== "not-started");

  const normalized = hierarchy.map((step, index) => {
    const reviewStep = reviewStepsByIndex.get(index);
    const currentSuds =
      typeof reviewStep?.sudsRating === "number"
        ? reviewStep.sudsRating
        : typeof step?.currentSuds === "number"
          ? step.currentSuds
          : null;
    const status =
      reviewStep?.status ||
      (step?.completed
        ? "completed"
        : currentSuds !== null || Number(step?.attempts || 0) > 0
          ? "in-progress"
          : "not-started");
    const mastered =
      typeof step?.mastered === "boolean"
        ? step.mastered
        : status !== "not-started" && currentSuds !== null && currentSuds <= 2;

    return {
      originalSuds: Number(step?.originalSuds ?? step?.suds ?? 0),
      status,
      currentSuds,
      mastered,
      attempts: Number(step?.attempts || 0),
      completed: status === "completed" || Boolean(step?.completed),
    };
  });

  const fallbackActiveStepIndex = normalized.findLastIndex(
    (item) =>
      item.status !== "not-started" ||
      item.currentSuds !== null ||
      item.attempts > 0,
  );
  const activeStepIndex =
    typeof latestActiveReviewStep?.stepIndex === "number"
      ? latestActiveReviewStep.stepIndex
      : fallbackActiveStepIndex >= 0
        ? fallbackActiveStepIndex
        : null;
  const activeStep =
    activeStepIndex !== null ? normalized[activeStepIndex] : null;
  const totalOriginalSuds = normalized.reduce(
    (sum, s) => sum + s.originalSuds,
    0,
  );
  const totalResolvedSuds = normalized.reduce((sum, s) => {
    if (s.currentSuds !== null) {
      return sum + Math.max(0, s.originalSuds - s.currentSuds);
    }
    return sum;
  }, 0);

  const progressPercent =
    totalOriginalSuds > 0
      ? Math.round((totalResolvedSuds / totalOriginalSuds) * 100)
      : 0;

  const practicedStepsCount = normalized.filter(
    (s) => s.currentSuds !== null,
  ).length;
  const averageImprovement =
    practicedStepsCount > 0
      ? (totalResolvedSuds / practicedStepsCount).toFixed(1)
      : "0.0";

  const completedStepsCount = normalized.filter(
    (s) => s.status === "completed",
  ).length;
  const attemptedStepsCount = normalized.filter(
    (s) => s.status !== "not-started",
  ).length;

  return {
    hasActiveStep: activeStepIndex !== null,
    hasCompletedStep: Boolean(activeStep?.completed),
    totalOriginalSuds,
    totalResolvedSuds,
    averageImprovement,
    completedStepsCount,
    attemptedStepsCount,
    progressPercent,
  };
};

export default function BehavioursLandingPage() {
  const { token, hasHydrated } = useStoredAuth();
  const baseUrl = useMemo(() => getBaseUrl(), []);
  const [activeReview, setActiveReview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadActiveReview = async () => {
      if (!hasHydrated) {
        return;
      }

      setIsLoading(true);
      setLoadError("");
      setActiveReview(null);

      if (!token || !baseUrl) {
        setIsLoading(false);
        return;
      }

      try {
        const fallbackPlanId = await resolveLatestPlanId({
          baseUrl,
          token,
        }).catch(() => "");

        if (!fallbackPlanId) {
          throw new Error("Unable to load your latest behaviour homework.");
        }

        const data = await exposureRequest({
          baseUrl,
          token,
          path: `/api/exposure/plan/${fallbackPlanId}/weekly-review`,
          errorMessage: "Unable to load your latest behaviour homework.",
        });

        if (cancelled) {
          return;
        }

        const plan = data?.plan || null;
        const review = data?.review || null;
        const planId = plan?._id || plan?.id || "";

        if (!planId || !Array.isArray(plan?.hierarchy) || !plan.hierarchy.length) {
          setActiveReview(null);
          return;
        }

        const progress = normalizeProgress(plan, review);

        setActiveReview({
          planId,
          selectedBehavior:
            plan?.selectedBehavior || "Avoiding social situations",
          currentWeek: Number(plan?.currentWeek) > 0 ? Number(plan.currentWeek) : 1,
          ...progress,
        });
      } catch (error) {
        if (!cancelled) {
          setLoadError(
            error?.message || "Unable to load your latest behaviour homework.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadActiveReview();

    return () => {
      cancelled = true;
    };
  }, [baseUrl, hasHydrated, token]);

  return (
    <div className="relative flex min-h-[calc(100vh-100px)] w-full p-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[32px]">
        <div className="absolute -left-20 top-0 h-[500px] w-[500px] rounded-full bg-[#4A7C59]/20 " />
        <div className="absolute -right-20 top-20 h-[600px] w-[600px] rounded-full bg-[#DBE5DE]/30" />
        <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-[#4A7C59]/10 " />
      </div>

      <div className="relative z-10 mx-auto flex w-full flex-col items-center justify-center rounded-[32px] border border-white/50 bg-[#FBFBFC]/40 p-8 shadow-[0_30px_80px_rgba(15,25,18,0.08)] backdrop-blur-xl sm:p-12">
        <div className="w-full max-w-2xl">
          <div className="mb-10 rounded-[24px] border border-[#4A7C59]/10 bg-[#E6F7EC]/90 p-8 shadow-sm backdrop-blur-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#4A7C59]/5 bg-[#D1EBD9]/80 shadow-sm">
              <Target className="h-6 w-6 text-[#233229]" />
            </div>
            <h2 className="mb-4 font-serif text-[24px] font-medium text-[#233229]">
              Why Behaviour Matters
            </h2>
            <p className="text-[15px] leading-relaxed text-[#355240]">
              Understanding and changing our behaviour patterns is one of the
              most powerful tools we have for improving our wellbeing. Small,
              intentional changes in what we do can create ripple effects across
              how we think and feel.
            </p>
          </div>

          <div className="mb-10">
            <h3 className="mb-4 pl-1 text-[13px] font-semibold uppercase tracking-wider text-[#4E5A51]">
              Start New
            </h3>
            <Link href="/dashboard/behaviours/review" className="block w-full">
              <button className="flex w-full items-center justify-center gap-3 rounded-[20px] bg-[#4a7b59] py-5 font-medium text-white shadow-lg shadow-[#4a7b59]/25 transition-all hover:-translate-y-0.5 hover:bg-[#3b6648] hover:shadow-[#4a7b59]/35 active:translate-y-0">
                <Plus className="h-6 w-6" />
                Make A New Homework
              </button>
            </Link>
          </div>



          {activeReview && (
            <Link
              href="/dashboard/behaviours/review"
              className="mb-10 block overflow-hidden rounded-[24px] border border-white/40 bg-white/30 shadow-sm backdrop-blur-md transition-all hover:-translate-y-1 hover:bg-white/40"
            >
              <div className="bg-[#4A7C59]/5 px-6 py-8 text-center">
                <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#4A7C59]/70">
                  Weekly Progress Review
                </div>
                <h1 className="mb-1 font-serif text-xl font-light tracking-[-0.02em] text-[#0F1912]">
                  Your Exposure Journey
                </h1>
                <p className="mb-6 text-[11px] font-light text-[#4E5A51]">
                  Continuing for {activeReview.selectedBehavior}
                </p>

                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="inline-flex items-center gap-2 rounded-full bg-[#4A7C59] px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white shadow-lg shadow-[#4A7C59]/20">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                      Week {activeReview.currentWeek}
                    </div>
                    <div className="text-[24px] font-bold text-[#4A7C59]">
                      {activeReview.progressPercent}%
                    </div>
                  </div>

                  <div className="w-full max-w-sm px-4">
                    <div className="mb-1.5 flex justify-between text-[11px] font-medium text-[#4E5A51]">
                      <span>Resolved Marks</span>
                      <span>
                        {activeReview.totalResolvedSuds.toFixed(1)} of{" "}
                        {activeReview.totalOriginalSuds} potential
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#4A7C59]/10">
                      <div
                        className="h-full rounded-full bg-[linear-gradient(90deg,#4A7C59_0%,#79A386_100%)] transition-all duration-700 ease-out"
                        style={{ width: `${activeReview.progressPercent}%` }}
                      />
                    </div>
                    <div className="mt-4 flex justify-between">
                      <div className="rounded-md bg-[#4A7C59]/5 px-2 py-0.5 text-[10px] font-medium text-[#4A7C59]">
                        Avg Impr: -{activeReview.averageImprovement} marks
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-medium text-[#4A7C59]">
                        <span>Continue Review</span>
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
