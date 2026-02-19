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
import { CHART_PALETTE } from "@/lib/constants";
import { CHART_COLORS } from "@/lib/constants";

interface ParetoTier {
  provider_tier: string;
  provider_count: number;
  pct_of_total: number;
}

interface ConcentrationChartProps {
  data: ParetoTier[];
  height?: number;
}

export function ConcentrationChart({
  data,
  height = 250,
}: ConcentrationChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
        <XAxis
          dataKey="provider_tier"
          tick={{ fontSize: 12 }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          tickLine={false}
          tickFormatter={(v: number) => `${v}%`}
        />
        <Tooltip
          formatter={(value: number | undefined) => [
            `${(value ?? 0).toFixed(1)}%`,
            "Share of Spending",
          ]}
          contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
        />
        <Legend
          verticalAlign="top"
          height={30}
          formatter={() => "Share of Total Spending"}
        />
        <Bar
          dataKey="pct_of_total"
          name="Share of Total Spending"
          radius={[4, 4, 0, 0]}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={CHART_PALETTE[i % CHART_PALETTE.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
