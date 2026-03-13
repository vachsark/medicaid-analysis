"use client";

import { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { ProviderAnomaly } from "@/lib/types";
import { formatCurrency, formatNumber } from "@/lib/format";
import { DataTable } from "@/components/ui/DataTable";

interface Props {
  anomalies: ProviderAnomaly[];
  profileNpis: string[];
}

export function AnomaliesClient({ anomalies, profileNpis }: Props) {
  const router = useRouter();

  const npiSet = useMemo(() => new Set(profileNpis), [profileNpis]);
  const isRowClickable = useCallback(
    (r: ProviderAnomaly) => npiSet.has(r.npi),
    [npiSet],
  );

  return (
    <DataTable<ProviderAnomaly>
      data={anomalies}
      rowKey={(r) => r.npi}
      onRowClick={(r) => router.push(`/providers/${r.npi}/`)}
      isRowClickable={isRowClickable}
      defaultSortKey="zscore"
      pageSize={25}
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
                {r.city}, {r.state}
              </div>
            </div>
          ),
          className: "min-w-[200px] sm:min-w-[250px]",
        },
        {
          key: "classification",
          label: "Specialty",
          sortKey: (r) => r.classification,
          hideOnMobile: true,
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
        {
          key: "total_claims",
          label: "Claims",
          align: "right",
          sortKey: (r) => r.total_claims,
          render: (r) => formatNumber(r.total_claims, true),
          hideOnMobile: true,
        },
      ]}
    />
  );
}
