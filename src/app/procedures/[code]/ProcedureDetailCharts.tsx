"use client";

import { useRouter } from "next/navigation";
import type { ProcedureProfile } from "@/lib/types";
import { formatCurrency, formatNumber } from "@/lib/format";
import { getStateName } from "@/lib/states";
import { SpendingTrendChart } from "@/components/charts/SpendingTrendChart";
import { DataTable } from "@/components/ui/DataTable";

interface Props {
  data: ProcedureProfile;
}

type StateEntry = ProcedureProfile["top_states"][number];
type ProvEntry = ProcedureProfile["top_providers"][number];

export function ProcedureDetailCharts({ data }: Props) {
  const router = useRouter();

  const yearlyChart = data.yearly.map((y) => ({
    label: y.year,
    value: y.total_paid,
  }));

  return (
    <div className="space-y-10">
      {yearlyChart.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Yearly Spending Trend
          </h2>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <SpendingTrendChart data={yearlyChart} />
          </div>
        </section>
      )}

      {data.top_states.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Top States
          </h2>
          <DataTable<StateEntry>
            data={data.top_states}
            rowKey={(r) => r.state}
            onRowClick={(r) => router.push(`/states/${r.state}/`)}
            defaultSortKey="total_paid"
            columns={[
              {
                key: "state",
                label: "State",
                sortKey: (r) => r.state,
                render: (r) => (
                  <span className="font-medium text-gray-900">
                    {getStateName(r.state)}
                  </span>
                ),
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
              {
                key: "avg_per_claim",
                label: "Avg/Claim",
                align: "right",
                sortKey: (r) => r.total_paid / r.total_claims,
                render: (r) => formatCurrency(r.total_paid / r.total_claims),
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

      {data.top_providers.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Top Providers
          </h2>
          <DataTable<ProvEntry>
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
                      {getStateName(r.state)}
                    </div>
                  </div>
                ),
                className: "min-w-[250px]",
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
              {
                key: "avg_per_claim",
                label: "Avg/Claim",
                align: "right",
                sortKey: (r) => r.total_paid / r.total_claims,
                render: (r) => formatCurrency(r.total_paid / r.total_claims),
              },
            ]}
          />
        </section>
      )}
    </div>
  );
}
