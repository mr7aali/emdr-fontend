"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { useStoredAuth } from "@/redux/authStorage";

const TRACKERS = [
  {
    trackerType: "anxiety",
    fallbackTitle: "Anxiety Scale",
    color: "#4A7373",
    fillId: "anxietyFill",
    max: 40,
  },
  {
    trackerType: "depression",
    fallbackTitle: "Depression Scale",
    color: "#6B4D5F",
    fillId: "depressionFill",
    max: 40,
  },
  {
    trackerType: "anger",
    fallbackTitle: "Anger",
    color: "#A8553D",
    fillId: "angerFill",
    max: 40,
  },
  {
    trackerType: "social-phobia",
    fallbackTitle: "Social Phobia",
    color: "#5C5E8B",
    fillId: "socialPhobiaFill",
    max: 40,
  },
  {
    trackerType: "ocd",
    fallbackTitle: "OCD",
    color: "#6B7F5F",
    fillId: "ocdFill",
    max: 40,
  },
  {
    trackerType: "specific-phobia",
    fallbackTitle: "Specific Phobia",
    color: "#7D5A3D",
    fillId: "specificPhobiaFill",
    max: 40,
  },
  {
    trackerType: "pain",
    fallbackTitle: "Pain",
    color: "#9B5D52",
    fillId: "painFill",
    max: 40,
  },
  {
    trackerType: "stress-burnout",
    fallbackTitle: "Stress & Burnout",
    color: "#A07238",
    fillId: "stressFill",
    max: 40,
  },
  {
    trackerType: "addiction",
    fallbackTitle: "Addiction",
    color: "#5C4438",
    fillId: "addictionFill",
    max: 40,
  },
  {
    trackerType: "self-esteem",
    fallbackTitle: "Self-Esteem",
    color: "#A38442",
    fillId: "selfEsteemFill",
    max: 40,
  },
  {
    trackerType: "worry",
    fallbackTitle: "Worry",
    color: "#4F627A",
    fillId: "worryFill",
    max: 40,
  },
  {
    trackerType: "trauma",
    fallbackTitle: "Trauma",
    color: "#3F3F47",
    fillId: "traumaFill",
    max: 40,
  },
];

const getSubmissionScore = (submission) => {
  const score = Number(submission?.totalScore ?? 0);
  return Number.isFinite(score) ? score : 0;
};

const formatAxisLabel = (dateValue, index) => {
  if (!dateValue) {
    return `Entry ${index + 1}`;
  }

  const parsedDate = new Date(dateValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return `Entry ${index + 1}`;
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(parsedDate);
};

const formatTooltipLabel = (dateValue, index) => {
  if (!dateValue) {
    return `Entry ${index + 1}`;
  }

  const parsedDate = new Date(dateValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return `Entry ${index + 1}`;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(parsedDate);
};

const ChartTooltip = ({ active, payload, assessment }) => {
  if (!active || !payload?.length) {
    return null;
  }

  const point = payload[0]?.payload;

  return (
    <div className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm shadow-[0_10px_25px_rgba(0,0,0,0.05)]">
      <p className="mb-1 font-semibold text-stone-900">
        {point?.tooltipLabel || point?.label}
      </p>
      <p className="text-stone-700">
        Score:{" "}
        <span className="font-semibold" style={{ color: assessment.color }}>
          {point?.value ?? 0} / {assessment.max}
        </span>
      </p>
      {point?.severity ? (
        <p className="mt-1 text-xs text-stone-500">{point.severity}</p>
      ) : null}
    </div>
  );
};

export default function AssessmentChart() {
  const { token, hasHydrated } = useStoredAuth();
  const rawBaseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || process.env.VITE_BASE_URL || "";
  const baseUrl = rawBaseUrl.endsWith("/")
    ? rawBaseUrl.slice(0, -1)
    : rawBaseUrl;
  const [chartsByType, setChartsByType] = useState(() =>
    Object.fromEntries(
      TRACKERS.map(({ trackerType, fallbackTitle }) => [
        trackerType,
        { title: fallbackTitle, data: [] },
      ]),
    ),
  );

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      if (!hasHydrated) {
        setIsLoading(true);
        return;
      }

      if (!baseUrl) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const nextCharts = Object.fromEntries(
          TRACKERS.map(({ trackerType, fallbackTitle }) => [
            trackerType,
            { title: fallbackTitle, data: [] },
          ]),
        );

        const configResponse = await fetch(
          `${baseUrl}/api/symptom-tracker/configs`,
          {
            cache: "no-store",
            headers: {
              Accept: "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          },
        );

        if (configResponse.ok) {
          const configResult = await configResponse.json();
          const configs = Array.isArray(configResult?.data)
            ? configResult.data
            : [];

          configs.forEach((config) => {
            if (!nextCharts[config?.trackerType]) {
              return;
            }

            nextCharts[config.trackerType].title =
              config?.name || nextCharts[config.trackerType].title;
          });
        }

        if (token) {
          const historyResults = await Promise.all(
            TRACKERS.map(async ({ trackerType }) => {
              const response = await fetch(
                `${baseUrl}/api/symptom-tracker/history?trackerType=${trackerType}&page=1&limit=7`,
                {
                  cache: "no-store",
                  headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                },
              );

              if (!response.ok) {
                return { trackerType, submissions: [] };
              }

              const result = await response.json();

              return {
                trackerType,
                submissions: Array.isArray(result?.data?.submissions)
                  ? result.data.submissions
                  : [],
              };
            }),
          );

          historyResults.forEach(({ trackerType, submissions }) => {
            if (!nextCharts[trackerType]) return;

            nextCharts[trackerType].data = submissions
              .map((submission, index) => {
                const dateValue =
                  submission?.submittedAt || submission?.createdAt;
                const date = new Date(dateValue);

                if (Number.isNaN(date.getTime())) {
                  return null;
                }

                return {
                  label: formatAxisLabel(dateValue, index),
                  tooltipLabel: formatTooltipLabel(dateValue, index),
                  value: getSubmissionScore(submission),
                  severity:
                    submission?.severityBand || submission?.severity || "",
                  submittedAt: dateValue,
                };
              })
              .filter(Boolean)
              .sort(
                (first, second) =>
                  new Date(first.submittedAt) - new Date(second.submittedAt),
              )
              .slice(-7);
          });
        }

        setChartsByType(nextCharts);
      } catch (error) {
        console.error("Failed to load tracker chart data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChartData();
  }, [baseUrl, hasHydrated, token]);

  const assessments = useMemo(
    () =>
      TRACKERS.map((tracker) => ({
        ...tracker,
        title:
          chartsByType[tracker.trackerType]?.title || tracker.fallbackTitle,
        data: chartsByType[tracker.trackerType]?.data || [],
      })),
    [chartsByType],
  );

  return (
    <div className="mt-2">
      <div className="space-y-6">
        {assessments.map((assessment) => (
          <div
            key={assessment.trackerType}
            className="rounded-[28px] border border-stone-200/80 bg-[#F8F7F3]/50 backdrop-blur-md  p-6 shadow-[0_18px_40px_rgba(28,25,23,0.08)] md:p-8"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <h2 className="font-serif text-[22px] font-normal leading-tight text-stone-900 md:text-[26px]">
                {assessment.title}
              </h2>
              <div className="mt-1 flex items-center gap-2 text-[12px] text-stone-500 md:text-[13px]">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: assessment.color }}
                ></div>
                <span>Last 7 entries</span>
              </div>
            </div>

            <div className="h-[180px] md:h-[210px]">
              {isLoading ? (
                <div className="flex h-full flex-col justify-center rounded-[20px] border border-stone-200 bg-white/40 p-5">
                  <div className="mb-4 h-3 w-32 animate-pulse rounded-full bg-stone-200" />
                  <div className="flex h-24 items-end gap-3">
                    {[35, 62, 48, 76, 58, 84, 70].map((height, index) => (
                      <div
                        key={index}
                        className="flex-1 animate-pulse rounded-t-xl bg-stone-200/80"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                  <p className="mt-5 text-sm text-stone-500">
                    Loading your result history...
                  </p>
                </div>
              ) : assessment.data.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={assessment.data}
                    margin={{ top: 10, right: 8, left: -18, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id={assessment.fillId}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={assessment.color}
                          stopOpacity={0.22}
                        />
                        <stop
                          offset="95%"
                          stopColor={assessment.color}
                          stopOpacity={0.02}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="0"
                      stroke="#E7E5E4"
                      vertical={true}
                      horizontal={false}
                    />
                    <XAxis
                      dataKey="label"
                      axisLine={false}
                      tickLine={false}
                      dy={12}
                      tick={{
                        fill: assessment.color,
                        fontSize: 12,
                        fontWeight: "500",
                      }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      dx={-6}
                      tick={{ fill: "#A8A29E", fontSize: 11 }}
                      domain={[0, assessment.max]}
                      ticks={[0, 10, 20, 30, 40]}
                    />
                    <Tooltip
                      content={<ChartTooltip assessment={assessment} />}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={assessment.color}
                      strokeWidth={2.5}
                      fill={`url(#${assessment.fillId})`}
                      connectNulls={true}
                      dot={{
                        r: 4,
                        fill: assessment.color,
                        strokeWidth: 2,
                        stroke: "#fff",
                      }}
                      activeDot={{
                        r: 6,
                        fill: assessment.color,
                        strokeWidth: 2,
                        stroke: "#fff",
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center rounded-[20px] border border-dashed border-stone-200 bg-white/40 text-sm text-stone-500">
                  No results yet for this assessment.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
