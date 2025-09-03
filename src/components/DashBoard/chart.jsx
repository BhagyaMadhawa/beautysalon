import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceDot
} from "recharts";

// Sample data (replace with API data as needed)
const data = [
  { day: "MON", value: 3500 },
  { day: "TUE", value: 900 },
  { day: "WED", value: 1150 },
  { day: "THU", value: 800 },
  { day: "FRI", value: 1500 },
  { day: "SAT", value: 3200 },
  { day: "SUN", value: 2100 },
];

// Custom tooltip for styling
function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black text-white text-xs rounded px-2 py-1 shadow">
        {payload[0].value.toLocaleString()}
      </div>
    );
  }
  return null;
}

export default function WeeklyClicksChart() {
  // Highlight WED (index 2) as in your screenshot
  const highlightIndex = 2;
  const highlight = data[highlightIndex];

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm w-full max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-2">
        <div>
          <span className="font-semibold text-base text-gray-900">Weekly Clicks</span>
          <div className="text-xs text-gray-400">Last updated: 23 Oct, 2023</div>
        </div>
        <span className="text-xs text-green-600 font-semibold">
          1.3% <span className="text-gray-400">VS LAST WEEK</span>
        </span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ left: 0, right: 0, top: 20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 12, fill: "#A0AEC0" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 4000]}
            ticks={[0, 1_000, 2_000, 3_000, 4_000]}
            tick={{ fontSize: 12, fill: "#A0AEC0" }}
            axisLine={false}
            tickLine={false}
            width={30}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: "#E11D48", strokeDasharray: "4 4" }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#E11D48"
            strokeWidth={2}
            dot={{
              stroke: "#E11D48",
              strokeWidth: 2,
              fill: "#fff",
              r: 5,
            }}
            activeDot={{
              stroke: "#E11D48",
              strokeWidth: 2,
              fill: "#fff",
              r: 7,
            }}
          />
          {/* Highlight the WED point with a ReferenceDot and dashed line */}
          <ReferenceDot
            x={highlight.day}
            y={highlight.value}
            r={6}
            fill="#fff"
            stroke="#E11D48"
            strokeWidth={2}
            isFront
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
