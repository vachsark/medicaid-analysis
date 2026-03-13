"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { StateIndexEntry } from "@/lib/types";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import { DataTable } from "@/components/ui/DataTable";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

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

type MapMetric =
  | "total_paid"
  | "avg_per_claim"
  | "yoy_change"
  | "per_enrollee_spending"
  | "managed_care_pct";

interface Props {
  states: StateIndexEntry[];
}

export function StatesOverview({ states }: Props) {
  const router = useRouter();
  const [metric, setMetric] = useState<MapMetric>("total_paid");

  const mapData = states
    .filter((s) => {
      if (metric === "yoy_change") return s.yoy_change !== null;
      if (metric === "per_enrollee_spending")
        return s.per_enrollee_spending != null;
      if (metric === "managed_care_pct") return s.managed_care_pct != null;
      return true;
    })
    .map((s) => ({
      code: s.code,
      value:
        metric === "total_paid"
          ? s.total_paid
          : metric === "avg_per_claim"
            ? s.avg_per_claim
            : metric === "per_enrollee_spending"
              ? (s.per_enrollee_spending ?? 0)
              : metric === "managed_care_pct"
                ? (s.managed_care_pct ?? 0)
                : (s.yoy_change ?? 0),
    }));

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-gray-200 bg-white p-3 sm:p-4">
        <div className="mb-3 flex flex-wrap items-center gap-2 sm:mb-4">
          {(
            [
              ["total_paid", "Total Spending"],
              ["avg_per_claim", "Avg Cost/Claim"],
              ["yoy_change", "YoY Change"],
              ["per_enrollee_spending", "FFS $/Enrollee"],
              ["managed_care_pct", "Managed Care %"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setMetric(key)}
              aria-pressed={metric === key}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                metric === key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              {label}
            </button>
          ))}
          <Link
            href="/states/compare/"
            className="ml-auto rounded-full bg-gray-900 px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-gray-700"
          >
            Compare States
          </Link>
        </div>
        <ErrorBoundary
          fallback={
            <div className="flex aspect-[8/5] items-center justify-center rounded-lg bg-gray-50 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400">
              Map failed to load. Use the table below to browse states.
            </div>
          }
        >
          <USChoroplethMap
            data={mapData}
            onStateClick={(code) => router.push(`/states/${code}/`)}
          />
        </ErrorBoundary>
      </div>

      <DataTable<StateIndexEntry>
        data={states}
        rowKey={(r) => r.code}
        onRowClick={(r) => router.push(`/states/${r.code}/`)}
        defaultSortKey="total_paid"
        pageSize={60}
        exportFilename="states-overview"
        columns={[
          {
            key: "name",
            label: "State",
            sortKey: (r) => r.name,
            render: (r) => (
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {r.name}
              </span>
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
          {
            key: "enrollment",
            label: "Enrollment",
            align: "right",
            sortKey: (r) => r.enrollment ?? 0,
            render: (r) =>
              r.enrollment != null ? formatNumber(r.enrollment, true) : "—",
            hideOnMobile: true,
          },
          {
            key: "managed_care_pct",
            label: "MC %",
            align: "right",
            sortKey: (r) => r.managed_care_pct ?? -1,
            render: (r) =>
              r.managed_care_pct != null
                ? `${r.managed_care_pct.toFixed(0)}%`
                : "—",
            hideOnMobile: true,
          },
          {
            key: "per_enrollee_spending",
            label: "FFS $/Enrollee",
            align: "right",
            sortKey: (r) => r.per_enrollee_spending ?? 0,
            render: (r) =>
              r.per_enrollee_spending != null
                ? formatCurrency(r.per_enrollee_spending)
                : "—",
            hideOnMobile: true,
          },
          {
            key: "expanded",
            label: "ACA Expanded",
            align: "right",
            sortKey: (r) =>
              r.expanded === true ? 1 : r.expanded === false ? 0 : -1,
            render: (r) => (
              <span
                className={
                  r.expanded === true
                    ? "text-green-600"
                    : r.expanded === false
                      ? "text-red-600"
                      : "text-gray-400"
                }
              >
                {r.expanded === true
                  ? `Yes${r.expansion_year ? ` (${r.expansion_year})` : ""}`
                  : r.expanded === false
                    ? "No"
                    : "—"}
              </span>
            ),
            hideOnMobile: true,
          },
        ]}
      />
    </div>
  );
}
