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

      {provider.top_procedures.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
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
