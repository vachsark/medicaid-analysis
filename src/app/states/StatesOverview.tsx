"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import type { StateIndexEntry } from "@/lib/types";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import { DataTable } from "@/components/ui/DataTable";

const USChoroplethMap = dynamic(
  () =>
    import("@/components/charts/USChoroplethMap").then((m) => ({
      default: m.USChoroplethMap,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="aspect-[8/5] animate-pulse rounded-lg bg-gray-100" />
    ),
  },
);

type MapMetric = "total_paid" | "avg_per_claim" | "yoy_change";

interface Props {
  states: StateIndexEntry[];
}

export function StatesOverview({ states }: Props) {
  const router = useRouter();
  const [metric, setMetric] = useState<MapMetric>("total_paid");

  const mapData = states
    .filter((s) => {
      if (metric === "yoy_change") return s.yoy_change !== null;
      return true;
    })
    .map((s) => ({
      code: s.code,
      value:
        metric === "total_paid"
          ? s.total_paid
          : metric === "avg_per_claim"
            ? s.avg_per_claim
            : (s.yoy_change ?? 0),
    }));

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-gray-200 bg-white p-3 sm:p-4">
        <div className="mb-3 flex flex-wrap gap-2 sm:mb-4">
          {(
            [
              ["total_paid", "Total Spending"],
              ["avg_per_claim", "Avg Cost/Claim"],
              ["yoy_change", "YoY Change"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setMetric(key)}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                metric === key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <USChoroplethMap
          data={mapData}
          onStateClick={(code) => router.push(`/states/${code}/`)}
        />
      </div>

      <DataTable<StateIndexEntry>
        data={states}
        rowKey={(r) => r.code}
        onRowClick={(r) => router.push(`/states/${r.code}/`)}
        defaultSortKey="total_paid"
        pageSize={60}
        columns={[
          {
            key: "name",
            label: "State",
            sortKey: (r) => r.name,
            render: (r) => (
              <span className="font-medium text-gray-900">{r.name}</span>
            ),
          },
          {
            key: "total_paid",
            label: "Total Spending",
            align: "right",
            sortKey: (r) => r.total_paid,
            render: (r) => formatCurrency(r.total_paid, true),
          },
          {
            key: "total_claims",
            label: "Claims",
            align: "right",
            sortKey: (r) => r.total_claims,
            render: (r) => formatNumber(r.total_claims, true),
            hideOnMobile: true,
          },
          {
            key: "provider_count",
            label: "Providers",
            align: "right",
            sortKey: (r) => r.provider_count,
            render: (r) => formatNumber(r.provider_count),
            hideOnMobile: true,
          },
          {
            key: "avg_per_claim",
            label: "Avg/Claim",
            align: "right",
            sortKey: (r) => r.avg_per_claim,
            render: (r) => formatCurrency(r.avg_per_claim),
            hideOnMobile: true,
          },
          {
            key: "yoy_change",
            label: "YoY Change",
            align: "right",
            sortKey: (r) => r.yoy_change ?? -999,
            render: (r) => (
              <span
                className={
                  r.yoy_change !== null && r.yoy_change > 0
                    ? "text-red-600"
                    : r.yoy_change !== null && r.yoy_change < 0
                      ? "text-green-600"
                      : ""
                }
              >
                {formatPercent(r.yoy_change)}
              </span>
            ),
          },
        ]}
      />
    </div>
  );
}
