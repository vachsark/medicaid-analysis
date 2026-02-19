"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CHART_COLORS } from "@/lib/constants";
import { formatCurrency } from "@/lib/format";

interface DataPoint {
  name: string;
  value: number;
}

interface TopBarChartProps {
  data: DataPoint[];
  height?: number;
  color?: string;
  layout?: "horizontal" | "vertical";
}

export function TopBarChart({
  data,
  height = 300,
  color = CHART_COLORS.primary,
  layout = "horizontal",
}: TopBarChartProps) {
  if (layout === "horizontal") {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={CHART_COLORS.grid}
            horizontal={false}
          />
          <XAxis
            type="number"
            tick={{ fontSize: 11 }}
            tickLine={false}
            tickFormatter={(v: number) => formatCurrency(v, true)}
          />
          <YAxis
            dataKey="name"
            type="category"
            tick={{ fontSize: 11 }}
            tickLine={false}
            width={180}
          />
          <Tooltip
            formatter={(value: number | undefined) => [
              formatCurrency(value ?? 0),
              "Total Paid",
            ]}
            contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
          />
          <Bar dataKey="value" fill={color} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} />
        <YAxis
          tick={{ fontSize: 11 }}
          tickLine={false}
          tickFormatter={(v: number) => formatCurrency(v, true)}
        />
        <Tooltip
          formatter={(value: number | undefined) => [
            formatCurrency(value ?? 0),
            "Total Paid",
          ]}
          contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
        />
        <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
