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

  return (
    <div className="space-y-6 sm:space-y-10">
      <section>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 sm:mb-4 sm:text-xl">
          Yearly Spending Trend
        </h2>
        <div className="rounded-lg border border-gray-200 bg-white p-2 sm:p-4">
          <SpendingTrendChart data={yearlyChart} />
        </div>
      </section>

      {yoyChart.length > 1 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-gray-900 sm:mb-4 sm:text-xl">
            Year-over-Year Growth
          </h2>
          <div className="rounded-lg border border-gray-200 bg-white p-2 sm:p-4">
            <YoYBarChart data={yoyChart} />
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 sm:mb-4 sm:text-xl">
          Top Providers
        </h2>
        <DataTable<ProviderSummary>
          data={data.top_providers}
          rowKey={(r) => r.npi}
          onRowClick={(r) => router.push(`/providers/${r.npi}/`)}
          defaultSortKey="total_paid"
          columns={[
            {
              key: "name",
              label: "Provider",
              sortKey: (r) => r.name,
              render: (r) => (
                <div>
                  <div className="font-medium text-gray-900">{r.name}</div>
                  <div className="text-xs text-gray-500">
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
        <h2 className="mb-3 text-lg font-semibold text-gray-900 sm:mb-4 sm:text-xl">
          Top Procedures
        </h2>
        <DataTable<ProcedureSummary>
          data={data.top_procedures}
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
          <h2 className="mb-3 text-lg font-semibold text-gray-900 sm:mb-4 sm:text-xl">
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
          <h2 className="mb-3 text-lg font-semibold text-gray-900 sm:mb-4 sm:text-xl">
            Spending Concentration
          </h2>
          <div className="rounded-lg border border-gray-200 bg-white p-2 sm:p-4">
            <ConcentrationChart data={data.concentration} />
          </div>
        </section>
      )}
    </div>
  );
}
