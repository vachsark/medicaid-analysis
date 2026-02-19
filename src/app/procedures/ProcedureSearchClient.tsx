"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import type { ProcedureIndexEntry } from "@/lib/types";
import { formatCurrency, formatNumber } from "@/lib/format";
import { DataTable } from "@/components/ui/DataTable";
import { ProcedureTooltip } from "@/components/ui/ProcedureTooltip";

const FUSE_OPTIONS = {
  keys: ["code", "description"],
  threshold: 0.3,
  distance: 100,
  minMatchCharLength: 2,
};

export function ProcedureSearchClient() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [allData, setAllData] = useState<ProcedureIndexEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/procedures/_index.json")
      .then((r) => r.json())
      .then(setAllData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const fuse = useMemo(
    () => (allData.length > 0 ? new Fuse(allData, FUSE_OPTIONS) : null),
    [allData],
  );

  const results = useMemo(() => {
    if (!query.trim()) return allData.slice(0, 100);
    if (!fuse) return [];
    return fuse.search(query, { limit: 100 }).map((r) => r.item);
  }, [query, allData, fuse]);

  if (loading) {
    return (
      <div className="py-8 text-center text-gray-500">
        Loading procedures...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by code or description (e.g., T1019, home health)..."
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      <p className="text-sm text-gray-500">
        {results.length} result{results.length !== 1 ? "s" : ""} (
        {formatNumber(allData.length)} total codes)
      </p>
      <DataTable<ProcedureIndexEntry>
        data={results}
        rowKey={(r) => r.code}
        onRowClick={(r) => router.push(`/procedures/${r.code}/`)}
        defaultSortKey="total_paid"
        pageSize={25}
        columns={[
          {
            key: "code",
            label: "Code",
            sortKey: (r) => r.code,
            render: (r) => <span className="font-mono">{r.code}</span>,
          },
          {
            key: "description",
            label: "Description",
            sortKey: (r) => r.description,
            render: (r) => (
              <ProcedureTooltip code={r.code} description={r.description} />
            ),
            className: "min-w-[150px] sm:min-w-[300px]",
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
    </div>
  );
}
