"use client";

import { useRouter } from "next/navigation";
import { useProviderSearch } from "@/hooks/useProviderSearch";
import { VALID_STATE_CODES, getStateName } from "@/lib/states";
import { formatCurrency, formatNumber } from "@/lib/format";
import type { ProviderSearchEntry } from "@/lib/types";
import { DataTable } from "@/components/ui/DataTable";

export function ProviderSearchClient() {
  const router = useRouter();
  const {
    query,
    setQuery,
    stateFilter,
    setStateFilter,
    results,
    loading,
    totalProviders,
  } = useProviderSearch();

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
        >
          <option value="">All States (Top 5,000)</option>
          {VALID_STATE_CODES.sort().map((code) => (
            <option key={code} value={code}>
              {getStateName(code)}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by provider name or NPI..."
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {loading && (
        <div className="py-8 text-center text-gray-500">
          Loading providers...
        </div>
      )}

      {!loading && (
        <>
          <p className="text-sm text-gray-500">
            {results.length} result{results.length !== 1 ? "s" : ""}
            {stateFilter && ` in ${getStateName(stateFilter)}`}
            {totalProviders > 0 && ` (${formatNumber(totalProviders)} total)`}
          </p>
          <DataTable<ProviderSearchEntry>
            data={results}
            rowKey={(r) => r.npi}
            onRowClick={(r) => router.push(`/providers/${r.npi}/`)}
            defaultSortKey="total_paid"
            pageSize={25}
            exportFilename="providers"
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
                key: "npi",
                label: "NPI",
                sortKey: (r) => r.npi,
                hideOnMobile: true,
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
            ]}
          />
        </>
      )}
    </div>
  );
}
