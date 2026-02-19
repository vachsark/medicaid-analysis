"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CHART_COLORS } from "@/lib/constants";
import { formatCurrency } from "@/lib/format";

interface DataPoint {
  label: string;
  value: number;
}

interface SpendingTrendChartProps {
  data: DataPoint[];
  height?: number;
  color?: string;
  seriesLabel?: string;
}

export function SpendingTrendChart({
  data,
  height = 300,
  color = CHART_COLORS.primary,
  seriesLabel = "Total Spending",
}: SpendingTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} tickLine={false} />
        <YAxis
          tick={{ fontSize: 12 }}
          tickLine={false}
          tickFormatter={(v: number) => formatCurrency(v, true)}
        />
        <Tooltip
          formatter={(value: number | undefined) => [
            formatCurrency(value ?? 0),
            seriesLabel,
          ]}
          labelStyle={{ fontWeight: 600 }}
          contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
        />
        <Legend verticalAlign="top" height={30} formatter={() => seriesLabel} />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          fill={color}
          fillOpacity={0.1}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
