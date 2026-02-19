"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { CHART_COLORS } from "@/lib/constants";

function CustomLegend() {
  return (
    <div className="flex justify-center gap-6 text-sm">
      <div className="flex items-center gap-1.5">
        <div
          className="h-3 w-3 rounded-sm"
          style={{ backgroundColor: CHART_COLORS.accent }}
        />
        <span className="text-gray-600 dark:text-gray-400">Growth</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div
          className="h-3 w-3 rounded-sm"
          style={{ backgroundColor: CHART_COLORS.danger }}
        />
        <span className="text-gray-600 dark:text-gray-400">Decline</span>
      </div>
    </div>
  );
}

interface DataPoint {
  year: string;
  value: number | null;
}

interface YoYBarChartProps {
  data: DataPoint[];
  height?: number;
}

export function YoYBarChart({ data, height = 250 }: YoYBarChartProps) {
  const filtered = data.filter((d) => d.value !== null) as {
    year: string;
    value: number;
  }[];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={filtered}
        margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
        <XAxis dataKey="year" tick={{ fontSize: 12 }} tickLine={false} />
        <YAxis
          tick={{ fontSize: 12 }}
          tickLine={false}
          tickFormatter={(v: number) => `${v > 0 ? "+" : ""}${v.toFixed(0)}%`}
        />
        <Tooltip
          formatter={(value: number | undefined) => [
            `${(value ?? 0) > 0 ? "+" : ""}${(value ?? 0).toFixed(1)}%`,
            "YoY Change",
          ]}
          contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
        />
        <Legend verticalAlign="top" height={36} content={<CustomLegend />} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {filtered.map((entry, i) => (
            <Cell
              key={i}
              fill={
                entry.value >= 0 ? CHART_COLORS.accent : CHART_COLORS.danger
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
