"use client";

import { useRouter } from "next/navigation";
import type {
  StateDetail,
  ProviderSummary,
  ProcedureSummary,
  ClassificationEntry,
} from "@/lib/types";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import { SpendingTrendChart } from "@/components/charts/SpendingTrendChart";
import { YoYBarChart } from "@/components/charts/YoYBarChart";
import { ConcentrationChart } from "@/components/charts/ConcentrationChart";
import { DataTable } from "@/components/ui/DataTable";
import { ProcedureTooltip } from "@/components/ui/ProcedureTooltip";

interface Props {
  data: StateDetail;
}

export function StateDetailCharts({ data }: Props) {
  const router = useRouter();

  const yearlyChart = data.yearly.map((y) => ({
    label: y.year,
    value: y.total_paid,
  }));

  const yoyChart = data.yoy_growth.map((y) => ({
    year: y.year,
    value: y.yoy_paid_growth_pct,
  }));

  const suppl = data.supplementary;

  return (
    <div className="space-y-6 sm:space-y-10">
      {/* FFS Caveat Banner */}
      {suppl?.ffs_caveat && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800 dark:bg-amber-950/30">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            <strong>Data Coverage Note:</strong> {data.name} has{" "}
            {suppl.managed_care_pct
              ? `${suppl.managed_care_pct.toFixed(0)}%`
              : "a majority"}{" "}
            of Medicaid enrollees in managed care. This data covers{" "}
            <strong>only fee-for-service (FFS) claims</strong>
            {suppl.ffs_pct
              ? ` (est. ${suppl.ffs_pct.toFixed(0)}% of enrollees)`
              : ""}
            . Actual total Medicaid spending in {data.name} is significantly
            higher than shown.
          </p>
        </div>
      )}

      {/* Supplementary Info Cards */}
      {suppl && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {suppl.enrollment_trend?.length > 0 && (
            <div className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Enrollment (Latest)
              </div>
              <div className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                {formatNumber(
                  suppl.enrollment_trend[suppl.enrollment_trend.length - 1]
                    ?.enrollment ?? 0,
                  true,
                )}
              </div>
            </div>
          )}
          {suppl.managed_care_pct != null && (
            <div className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Managed Care
              </div>
              <div className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                {suppl.managed_care_pct.toFixed(0)}%
              </div>
            </div>
          )}
          <div className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              ACA Expansion
            </div>
            <div
              className={`mt-1 text-lg font-bold ${suppl.expanded ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
            >
              {suppl.expanded === null
                ? "N/A"
                : suppl.expanded
                  ? `Yes${suppl.expansion_year ? ` (${suppl.expansion_year})` : ""}`
                  : "Not Expanded"}
            </div>
          </div>
          {suppl.enrollment_trend?.length > 0 &&
            suppl.enrollment_trend[suppl.enrollment_trend.length - 1]
              ?.per_enrollee != null && (
              <div className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  FFS $/Enrollee
                </div>
                <div className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                  {formatCurrency(
                    suppl.enrollment_trend[suppl.enrollment_trend.length - 1]
                      ?.per_enrollee ?? 0,
                  )}
                </div>
              </div>
            )}
        </div>
      )}

      <section>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white sm:mb-4 sm:text-xl">
          Yearly Spending Trend
        </h2>
        <div className="rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-gray-900 sm:p-4">
          <SpendingTrendChart data={yearlyChart} />
        </div>
      </section>

      {yoyChart.length > 1 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100 sm:mb-4 sm:text-xl">
            Year-over-Year Growth
          </h2>
          <div className="rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-gray-900 sm:p-4">
            <YoYBarChart data={yoyChart} />
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100 sm:mb-4 sm:text-xl">
          Top Providers
        </h2>
        <DataTable<ProviderSummary>
          data={data.top_providers}
          rowKey={(r) => r.npi}
          onRowClick={(r) => router.push(`/providers/${r.npi}/`)}
          defaultSortKey="total_paid"
          exportFilename={`${data.name.toLowerCase().replace(/\s+/g, "-")}-providers`}
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
                    {r.classification}
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
          ]}
        />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100 sm:mb-4 sm:text-xl">
          Top Procedures
        </h2>
        <DataTable<ProcedureSummary>
          data={data.top_procedures}
          rowKey={(r) => r.code}
          onRowClick={(r) => router.push(`/procedures/${r.code}/`)}
          defaultSortKey="total_paid"
          exportFilename={`${data.name.toLowerCase().replace(/\s+/g, "-")}-procedures`}
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
              sortKey: (r) => r.total_paid / r.total_claims,
              render: (r) => formatCurrency(r.total_paid / r.total_claims),
              hideOnMobile: true,
            },
          ]}
        />
      </section>

      {data.classification.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100 sm:mb-4 sm:text-xl">
            Provider Classification Breakdown
          </h2>
          <DataTable<ClassificationEntry>
            data={data.classification}
            rowKey={(r) => r.classification}
            defaultSortKey="total_paid"
            columns={[
              {
                key: "classification",
                label: "Classification",
                sortKey: (r) => r.classification,
              },
              {
                key: "total_paid",
                label: "Total Paid",
                align: "right",
                sortKey: (r) => r.total_paid,
                render: (r) => formatCurrency(r.total_paid, true),
              },
              {
                key: "provider_count",
                label: "Providers",
                align: "right",
                sortKey: (r) => r.provider_count,
                render: (r) => formatNumber(r.provider_count),
              },
            ]}
          />
        </section>
      )}

      {data.concentration.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100 sm:mb-4 sm:text-xl">
            Spending Concentration
          </h2>
          <div className="rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-gray-900 sm:p-4">
            <ConcentrationChart data={data.concentration} />
          </div>
        </section>
      )}
    </div>
  );
}
