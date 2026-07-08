"use client";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

export default function EarningSummary() {
  const data = [
    { month: "May", value: 280 },
    { month: "Jun", value: 150 },
    { month: "Jul", value: 260 },
    { month: "Aug", value: 180 },
    { month: "Sep", value: 130 },
    { month: "Oct", value: 280 },
    { month: "Nov", value: 250 },
    { month: "Dec", value: 220 },
    { month: "Jan", value: 280 },
    { month: "Feb", value: 220 },
    { month: "Mar", value: 200 },
    { month: "Apr", value: 250 },
  ];

  return (
    <div className="">
      <div className="">
        {/* Charts Container */}
        <div className="space-y-6">
          {/* Chart 1 - PHQ-9 Depression Scale */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-stone-900">
                PHQ-9 Depression Scale (Session 1)
              </h2>
              <div className="flex items-center gap-2 text-sm text-stone-600">
                <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
                <span>Last 6 months</span>
              </div>
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6b8b7a" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6b8b7a" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="0"
                  stroke="#e5e7eb"
                  vertical={true}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  domain={[0, 300]}
                  ticks={[0, 100, 200, 300]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#5a7a6a"
                  strokeWidth={2}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

        
        </div>
      </div>
    </div>
  );
}
