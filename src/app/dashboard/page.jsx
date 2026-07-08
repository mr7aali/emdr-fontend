"use client";

import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import AnxietyCard from "@/components/dashboard/AnxietyCard";
import { useStoredAuth } from "@/redux/authStorage";
import { useGetProfileQuery } from "@/redux/features/profile";
import { selectCurrentUser } from "@/redux/slices/authSlice";
import {
  getProfilePayload,
  hasPaidPlanAccess,
} from "@/utils/subscriptionAccess";

export default function DashboardPage() {
  const router = useRouter();
  const { token } = useStoredAuth();
  const authUser = useSelector(selectCurrentUser);
  const { data, isFetching } = useGetProfileQuery(undefined, {
    skip: !token,
  });
  const profile = getProfilePayload(data) || authUser;
  const canStartRoadmap = hasPaidPlanAccess(profile);

  const handleStartRoadmap = () => {
    if (isFetching && !profile) {
      toast("Checking your plan...");
      return;
    }

    if (!canStartRoadmap) {
      toast.error("Please buy a premium plan first to start a new roadmap.");
      return;
    }

    router.push("/dashboard/new-roadmap");
  };

  return (
    <div className=" space-y-6  bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/50 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)]">
      {/* Page Header Area */}
      <div className="flex items-center justify-between mb-8 ">
        <div>
          <h1 className="text-[28px] font-semibold text-[#0F1912] mb-5">
            My EMDR
          </h1>
          <p className="text-[#000000] text-sm">Active Journeys</p>
        </div>



        <button
          type="button"
          onClick={handleStartRoadmap}
          className="bg-[#4A7C59] hover:bg-[#3d6649] text-white px-6 py-2.5 rounded-full text-sm font-medium transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
        >
          Start New Roadmap
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-sparkles-icon lucide-sparkles"
          >
            <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
            <path d="M20 2v4" />
            <path d="M22 4h-4" />
            <circle cx="4" cy="20" r="2" />
          </svg>
        </button>
      </div>

      <AnxietyCard />
    </div>
  );
}
