"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useStoredAuth } from "@/redux/authStorage";
import { useLogoutMutation } from "@/redux/features/login";
import { useGetProfileQuery } from "@/redux/features/profile";
import { selectCurrentUser } from "@/redux/slices/authSlice";

const getProfilePayload = (response) => response?.data ?? response ?? null;

const getSubscriptionPlanName = (profile) =>
  String(profile?.SubscriptionPlan || profile?.subscriptionPlan || "").trim();

const hasHomeworkAccess = (profile) => {
  const planName = getSubscriptionPlanName(profile).toLowerCase();

  return Boolean(
    planName &&
    !planName.includes("free") &&
    !planName.includes("no active"),
  );
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { token } = useStoredAuth();
  const authUser = useSelector(selectCurrentUser);
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const { data, isFetching } = useGetProfileQuery(undefined, {
    skip: !token,
  });
  const profile = getProfilePayload(data) || authUser;
  const canUseHomework = hasHomeworkAccess(profile);

  const navItems = [
    { name: "My EMDR", href: "/dashboard" },
    { name: "My Progress", href: "/dashboard/progress" },
    { name: "My Homework ", href: "/dashboard/homework" },
    { name: "My Resources", href: "/dashboard/resources" },
  ];

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {
    } finally {
      router.replace("/authentication/login");
    }
  };

  const handleLockedHomeworkClick = (event) => {
    event.preventDefault();

    if (isFetching) {
      toast("Checking your plan...");
      return;
    }

    toast.error("Please buy a premium plan first to activate My Homework.");
  };

  return (
    <div className="w-64 h-screen   text-white flex flex-col relative overflow-hidden border-r border-white/20">
      <div className="absolute inset-0 bg-[url('/sidebar-bg.png')] opacity-20 pointer-events-none mix-blend-overlay"></div>
      <div className="pt-2 px-6 pb-6 relative z-10 flex flex-col h-full">
        <div className="flex flex-col items-center ">
          <Link href="/" className="w-32 h-32 flex items-center justify-center mb-4 cursor-pointer hover:opacity-80 transition-opacity">
            <img
              src="/homeImage/loginimg.png"
              alt="UK Inkind"
              className="w-full h-full object-contain"
            />
          </Link>
        </div>
        <nav className="space-y-2 flex-1">
          {navItems.map((item) => {
            const isHomeworkItem = item.name.trim() === "My Homework";
            const isHomeworkLocked = isHomeworkItem && !canUseHomework;
            const isActive =
              item.href === "/dashboard"
                ? (pathname === "/dashboard" ||
                  pathname === "/dashboard/assessments" ||
                  pathname.startsWith("/dashboard/new-roadmap") ||
                  pathname.startsWith("/dashboard/EMDRCompanion") ||
                  pathname.startsWith("/dashboard/resources/bilateral") ||
                  pathname.startsWith("/dashboard/AssessmentsF")) &&
                !pathname.startsWith("/dashboard/assessments/activity")
                : item.href === "/dashboard/progress"
                  ? pathname.startsWith("/dashboard/progress") ||
                  pathname.startsWith("/dashboard/assessments/activity") ||
                  pathname.startsWith("/dashboard/results")
                  : item.href === "/dashboard/homework"
                    ? !isHomeworkLocked && (pathname.startsWith("/dashboard/homework") ||
                    pathname.startsWith("/dashboard/emotions") ||
                    pathname.startsWith("/dashboard/behaviours") ||
                    pathname.startsWith("/dashboard/thoughts"))
                    : item.href === "/dashboard/resources"
                      ? pathname.startsWith("/dashboard/resources") && !pathname.startsWith("/dashboard/resources/bilateral")
                      : pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={isHomeworkLocked ? handleLockedHomeworkClick : undefined}
                className={`flex items-center justify-between px-4 py-3 rounded-lg text-[16px] font-medium transition-colors ${isActive
                  ? "bg-[#4A7C59] text-[#FBFBFC] shadow-sm"
                  : "text-black bg-[#FBFBFC] hover:bg-[#6B9071]/50 hover:text-[#FBFBFC]"
                  }`}
              >
                <span>{item.name}</span>
                {isHomeworkItem && (
                  <span className={`${canUseHomework
                    ? "bg-white text-[#4A7C59]"
                    : "bg-[#FFE6C9] text-[#8A4B00]"
                    } text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm`}>
                    {canUseHomework ? "Prime+" : "Locked"}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="mb-50">
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-black bg-white hover:bg-[#6B9071]/50 hover:text-[#FBFBFC] transition-colors w-full rounded-lg shadow-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </div>
  );
}
