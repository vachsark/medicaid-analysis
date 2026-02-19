"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import type { ProcedureIndexEntry, ProcedureCategory } from "@/lib/types";
import { formatCurrency, formatNumber } from "@/lib/format";
import { DataTable } from "@/components/ui/DataTable";
import { ProcedureTooltip } from "@/components/ui/ProcedureTooltip";
import { CategoryBreakdownChart } from "@/components/charts/CategoryBreakdownChart";

const FUSE_OPTIONS = {
  keys: ["code", "description"],
  threshold: 0.3,
  distance: 100,
  minMatchCharLength: 2,
};

export function ProcedureSearchClient() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [allData, setAllData] = useState<ProcedureIndexEntry[]>([]);
  const [categories, setCategories] = useState<ProcedureCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/data/procedures/_index.json").then((r) => r.json()),
      fetch("/data/procedures/categories.json").then((r) => r.json()),
    ])
      .then(([procs, cats]) => {
        setAllData(procs);
        setCategories(cats);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const fuse = useMemo(
    () => (allData.length > 0 ? new Fuse(allData, FUSE_OPTIONS) : null),
    [allData],
  );

  const results = useMemo(() => {
    let base: ProcedureIndexEntry[];
    if (query.trim() && fuse) {
      base = fuse.search(query, { limit: 200 }).map((r) => r.item);
    } else {
      base = allData;
    }
    if (categoryFilter) {
      base = base.filter((p) => p.category === categoryFilter);
    }
    return base.slice(0, 100);
  }, [query, categoryFilter, allData, fuse]);

  if (loading) {
    return (
      <div className="py-8 text-center text-gray-500">
        Loading procedures...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category Breakdown Chart */}
      {categories.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
            Spending by Category
          </h2>
          <div className="rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-gray-900 sm:p-4">
            <CategoryBreakdownChart
              data={categories}
              onCategoryClick={(cat) =>
                setCategoryFilter((prev) => (prev === cat ? "" : cat))
              }
            />
          </div>
        </section>
      )}

      {/* Search + filter controls */}
      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by code or description (e.g., T1019, home health)..."
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.category} value={c.category}>
                {c.category} ({c.procedure_count})
              </option>
            ))}
          </select>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {results.length} result{results.length !== 1 ? "s" : ""}
          {categoryFilter && ` in ${categoryFilter}`} (
          {formatNumber(allData.length)} total codes)
        </p>
      </div>
      <DataTable<ProcedureIndexEntry>
        data={results}
        rowKey={(r) => r.code}
        onRowClick={(r) => router.push(`/procedures/${r.code}/`)}
        defaultSortKey="total_paid"
        pageSize={25}
        exportFilename="procedures"
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
            key: "category",
            label: "Category",
            sortKey: (r) => r.category,
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
