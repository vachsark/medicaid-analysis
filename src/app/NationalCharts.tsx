"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type {
  NationalData,
  ProviderSummary,
  ProcedureSummary,
  ProviderAnomaly,
  ProcedureCategory,
} from "@/lib/types";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import { SpendingTrendChart } from "@/components/charts/SpendingTrendChart";
import { YoYBarChart } from "@/components/charts/YoYBarChart";
import { ConcentrationChart } from "@/components/charts/ConcentrationChart";
import { CategoryBreakdownChart } from "@/components/charts/CategoryBreakdownChart";
import { DataTable } from "@/components/ui/DataTable";
import { ProcedureTooltip } from "@/components/ui/ProcedureTooltip";

interface Props {
  data: NationalData;
}

export function NationalCharts({ data }: Props) {
  const router = useRouter();
  const [anomalies, setAnomalies] = useState<ProviderAnomaly[]>([]);
  const [categories, setCategories] = useState<ProcedureCategory[]>([]);

  useEffect(() => {
    fetch("/data/providers/anomalies.json")
      .then((r) => r.json())
      .then(setAnomalies)
      .catch(() => {});
    fetch("/data/procedures/categories.json")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  const monthlyChart = data.monthly
    .filter((m) => m.month !== "2024-11" && m.month !== "2024-12")
    .map((m) => ({
      label: m.month,
      value: m.total_paid,
    }));

  const yoyChart = data.yoy_growth.map((y) => ({
    year: y.year,
    value: y.yoy_paid_growth_pct,
  }));

  return (
    <div className="space-y-6 sm:space-y-10">
      {/* Monthly Spending Trend */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100 sm:mb-4 sm:text-xl">
          Monthly Spending Trend
        </h2>
        <div className="rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-gray-900 sm:p-4">
          <SpendingTrendChart data={monthlyChart} height={280} />
          <p className="mt-3 text-xs text-amber-700 bg-amber-50 rounded px-3 py-2 dark:text-amber-300 dark:bg-amber-950">
            Note: November and December 2024 have been trimmed from this chart
            due to claims processing lag — many late-2024 claims had not yet
            been submitted when this dataset was published (Feb 2026).
          </p>
        </div>
      </section>

      {/* YoY Growth */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100 sm:mb-4 sm:text-xl">
          Year-over-Year Spending Growth
        </h2>
        <div className="rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-gray-900 sm:p-4">
          <YoYBarChart data={yoyChart} />
        </div>
      </section>

      {/* Top 10 Providers */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100 sm:mb-4 sm:text-xl">
          Top 10 Providers by Spending
        </h2>
        <DataTable<ProviderSummary>
          data={data.top_providers.slice(0, 10)}
          rowKey={(r) => r.npi}
          onRowClick={(r) => router.push(`/providers/${r.npi}/`)}
          defaultSortKey="total_paid"
          exportFilename="national-providers"
          columns={[
            {
              key: "name",
              label: "Provider",
              sortKey: (r) => r.name,
              render: (r) => (
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {r.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {r.city}, {r.state} &middot; {r.classification}
                  </div>
                </div>
              ),
              className: "min-w-[200px] sm:min-w-[250px]",
            },
            {
              key: "total_paid",
              label: "Total Paid",
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
              key: "avg_per_claim",
              label: "Avg/Claim",
              align: "right",
              sortKey: (r) => r.total_paid / r.total_claims,
              render: (r) => formatCurrency(r.total_paid / r.total_claims),
              hideOnMobile: true,
            },
            {
              key: "distinct_procedures",
              label: "Procedures",
              align: "right",
              sortKey: (r) => r.distinct_procedures,
              render: (r) => formatNumber(r.distinct_procedures),
              hideOnMobile: true,
            },
          ]}
        />
      </section>

      {/* Top 10 Procedures */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100 sm:mb-4 sm:text-xl">
          Top 10 Procedures by Spending
        </h2>
        <DataTable<ProcedureSummary>
          data={data.top_procedures.slice(0, 10)}
          rowKey={(r) => r.code}
          onRowClick={(r) => router.push(`/procedures/${r.code}/`)}
          defaultSortKey="total_paid"
          exportFilename="national-procedures"
          columns={[
            {
              key: "code",
              label: "Code",
              sortKey: (r) => r.code,
            },
            {
              key: "description",
              label: "Description",
              sortKey: (r) => r.description,
              render: (r) => (
                <ProcedureTooltip code={r.code} description={r.description} />
              ),
              className: "min-w-[150px] sm:min-w-[200px]",
            },
            {
              key: "total_paid",
              label: "Total Paid",
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
              key: "avg_per_claim",
              label: "Avg/Claim",
              align: "right",
              sortKey: (r) => r.avg_per_claim,
              render: (r) => formatCurrency(r.avg_per_claim),
              hideOnMobile: true,
            },
          ]}
        />
      </section>

      {/* Spending by Category */}
      {categories.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100 sm:mb-4 sm:text-xl">
            Spending by Procedure Category
          </h2>
          <div className="rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-gray-900 sm:p-4">
            <CategoryBreakdownChart
              data={categories}
              onCategoryClick={() => router.push("/procedures/")}
            />
          </div>
        </section>
      )}

      {/* Outlier Providers */}
      {anomalies.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100 sm:mb-4 sm:text-xl">
            Outlier Providers (Unusually High Per-Claim Cost)
          </h2>
          <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
            Providers whose average cost per claim is significantly above their
            specialty peers (z-score &gt; 2). This may indicate billing
            anomalies, high-acuity patients, or specialty services.
          </p>
          <DataTable<ProviderAnomaly>
            data={anomalies.slice(0, 20)}
            rowKey={(r) => r.npi}
            onRowClick={(r) => router.push(`/providers/${r.npi}/`)}
            defaultSortKey="zscore"
            exportFilename="outlier-providers"
            columns={[
              {
                key: "name",
                label: "Provider",
                sortKey: (r) => r.name,
                render: (r) => (
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {r.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {r.city}, {r.state} &middot; {r.classification}
                    </div>
                  </div>
                ),
                className: "min-w-[200px] sm:min-w-[250px]",
              },
              {
                key: "avg_per_claim",
                label: "Avg/Claim",
                align: "right",
                sortKey: (r) => r.avg_per_claim,
                render: (r) => formatCurrency(r.avg_per_claim),
              },
              {
                key: "classification_avg_per_claim",
                label: "Peer Avg",
                align: "right",
                sortKey: (r) => r.classification_avg_per_claim,
                render: (r) => formatCurrency(r.classification_avg_per_claim),
                hideOnMobile: true,
              },
              {
                key: "zscore",
                label: "Z-Score",
                align: "right",
                sortKey: (r) => r.zscore,
                render: (r) => (
                  <span className="font-mono text-red-600 dark:text-red-400">
                    {r.zscore.toFixed(1)}
                  </span>
                ),
              },
              {
                key: "total_paid",
                label: "Total Paid",
                align: "right",
                sortKey: (r) => r.total_paid,
                render: (r) => formatCurrency(r.total_paid, true),
                hideOnMobile: true,
              },
            ]}
          />
        </section>
      )}

      {/* Concentration */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100 sm:mb-4 sm:text-xl">
          Spending Concentration
        </h2>
        <div className="rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-gray-900 sm:p-4">
          <ConcentrationChart data={data.pareto} />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {data.pareto.map((tier) => (
            <div
              key={tier.provider_tier}
              className="rounded border border-gray-200 bg-white px-3 py-2 text-center dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {tier.provider_tier}
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {tier.pct_of_total}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {formatNumber(tier.provider_count)} providers
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
