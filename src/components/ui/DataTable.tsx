"use client";

import { useState, useMemo } from "react";

interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  sortKey?: (row: T) => number | string;
  align?: "left" | "right";
  className?: string;
  /** Hide this column on mobile (below sm breakpoint) */
  hideOnMobile?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  defaultSortKey?: string;
  defaultSortDir?: "asc" | "desc";
  onRowClick?: (row: T) => void;
  rowKey: (row: T) => string;
}

export function DataTable<T>({
  data,
  columns,
  pageSize = 20,
  defaultSortKey,
  defaultSortDir = "desc",
  onRowClick,
  rowKey,
}: DataTableProps<T>) {
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState(defaultSortKey ?? columns[0]?.key);
  const [sortDir, setSortDir] = useState<"asc" | "desc">(defaultSortDir);

  const sorted = useMemo(() => {
    const col = columns.find((c) => c.key === sortKey);
    if (!col?.sortKey) return data;
    return [...data].sort((a, b) => {
      const av = col.sortKey!(a);
      const bv = col.sortKey!(b);
      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc" ? av - bv : bv - av;
      }
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
  }, [data, sortKey, sortDir, columns]);

  const totalPages = Math.ceil(sorted.length / pageSize);
  const pageData = sorted.slice(page * pageSize, (page + 1) * pageSize);

  function handleSort(key: string) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
    setPage(0);
  }

  return (
    <div>
      <div className="-mx-4 overflow-x-auto sm:mx-0 sm:rounded-lg sm:border sm:border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-3 py-2.5 text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-4 sm:py-3 ${
                    col.align === "right" ? "text-right" : "text-left"
                  } ${col.sortKey ? "cursor-pointer select-none hover:text-gray-900" : ""} ${col.className ?? ""} ${col.hideOnMobile ? "hidden sm:table-cell" : ""}`}
                  onClick={() => col.sortKey && handleSort(col.key)}
                >
                  {col.label}
                  {sortKey === col.key && (
                    <span className="ml-1">
                      {sortDir === "asc" ? "\u25B2" : "\u25BC"}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {pageData.map((row) => (
              <tr
                key={rowKey(row)}
                className={onRowClick ? "cursor-pointer hover:bg-gray-50" : ""}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-3 py-2.5 text-sm sm:px-4 sm:py-3 ${
                      col.align === "right"
                        ? "text-right tabular-nums whitespace-nowrap"
                        : "text-left"
                    } ${col.className ?? ""} ${col.hideOnMobile ? "hidden sm:table-cell" : ""}`}
                  >
                    {col.render
                      ? col.render(row)
                      : ((row as Record<string, unknown>)[
                          col.key
                        ] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="mt-3 flex items-center justify-between px-1 text-sm text-gray-600">
          <span>
            {page * pageSize + 1}-
            {Math.min((page + 1) * pageSize, sorted.length)} of {sorted.length}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="rounded border px-3 py-1 disabled:opacity-50"
            >
              Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="rounded border px-3 py-1 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
