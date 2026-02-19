"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { CHART_PALETTE } from "@/lib/constants";
import { formatCurrency } from "@/lib/format";

interface CategoryData {
  category: string;
  total_paid: number;
  total_claims: number;
  procedure_count: number;
}

interface Props {
  data: CategoryData[];
  height?: number;
  onCategoryClick?: (category: string) => void;
}

export function CategoryBreakdownChart({
  data,
  height = 400,
  onCategoryClick,
}: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fontSize: 12 }}
          tickFormatter={(v: number) => formatCurrency(v, true)}
        />
        <YAxis
          type="category"
          dataKey="category"
          width={160}
          tick={{ fontSize: 11 }}
        />
        <Tooltip
          formatter={(value: number | undefined) => [
            formatCurrency(value ?? 0),
            "Total Paid",
          ]}
          labelStyle={{ fontWeight: 600 }}
          contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
        />
        <Bar
          dataKey="total_paid"
          radius={[0, 4, 4, 0]}
          cursor={onCategoryClick ? "pointer" : undefined}
          onClick={
            onCategoryClick
              ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (entry: any) => onCategoryClick(entry.category)
              : undefined
          }
        >
          {data.map((_, idx) => (
            <Cell key={idx} fill={CHART_PALETTE[idx % CHART_PALETTE.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
