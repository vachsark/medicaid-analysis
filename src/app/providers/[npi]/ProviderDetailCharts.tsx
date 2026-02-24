"use client";

import { useRouter } from "next/navigation";
import type { ProviderProfile } from "@/lib/types";
import { formatCurrency, formatNumber } from "@/lib/format";
import { SpendingTrendChart } from "@/components/charts/SpendingTrendChart";
import { DataTable } from "@/components/ui/DataTable";

interface Props {
  provider: ProviderProfile;
}

type ProcEntry = ProviderProfile["top_procedures"][number];

export function ProviderDetailCharts({ provider }: Props) {
  const router = useRouter();

  const yearlyChart = provider.yearly.map((y) => ({
    label: y.year,
    value: y.total_paid,
  }));

  const monthlyChart = provider.monthly?.map((m) => ({
    label: m.month,
    value: m.total_paid,
  }));

  const medicare = provider.medicare;

  return (
    <div className="space-y-10">
      {/* Anomaly badge */}
      {provider.avg_per_claim_zscore !== null &&
        provider.avg_per_claim_zscore > 2 && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800 dark:bg-amber-950">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Outlier Alert:</strong> This provider&apos;s average cost
              per claim ({formatCurrency(provider.avg_per_claim)}) is{" "}
              {provider.avg_per_claim_zscore.toFixed(1)}x standard deviations
              above the average for {provider.classification} providers (
              {formatCurrency(provider.classification_avg_per_claim ?? 0)}).
            </p>
          </div>
        )}

      {/* Medicare Crosswalk */}
      {medicare && (
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
            Medicare Comparison (2023)
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            <div className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Medicare Payment
              </div>
              <div className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                {formatCurrency(medicare.payment, true)}
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Medicaid Payment
              </div>
              <div className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                {formatCurrency(provider.total_paid, true)}
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Medicare Beneficiaries
              </div>
              <div className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                {formatNumber(medicare.beneficiaries, true)}
              </div>
            </div>
            {medicare.dual_eligible != null && (
              <div className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Dual-Eligible
                </div>
                <div className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                  {formatNumber(medicare.dual_eligible, true)}
                </div>
              </div>
            )}
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Medicare data from CMS Physician &amp; Other Practitioners PUF
            (2023). Medicare type: {medicare.provider_type}.
          </p>
        </section>
      )}

      {yearlyChart.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
            Yearly Spending Trend
          </h2>
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <SpendingTrendChart data={yearlyChart} />
          </div>
        </section>
      )}

      {monthlyChart && monthlyChart.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
            Monthly Spending Trend
          </h2>
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <SpendingTrendChart
              data={monthlyChart}
              height={250}
              seriesLabel="Monthly Spending"
            />
          </div>
        </section>
      )}

      {provider.top_procedures.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
            Top Procedures
          </h2>
          <DataTable<ProcEntry>
            data={provider.top_procedures}
            rowKey={(r) => r.code}
            onRowClick={(r) => router.push(`/procedures/${r.code}/`)}
            defaultSortKey="total_paid"
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
                className: "min-w-[200px]",
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
              },
            ]}
          />
        </section>
      )}
    </div>
  );
}
