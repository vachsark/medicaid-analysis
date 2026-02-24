"use client";

import { useState, useMemo, useCallback } from "react";

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
  /** When provided, shows an "Export CSV" button and uses this as the download filename (without .csv) */
  exportFilename?: string;
}

function escapeCsvField(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function DataTable<T>({
  data,
  columns,
  pageSize = 20,
  defaultSortKey,
  defaultSortDir = "desc",
  onRowClick,
  rowKey,
  exportFilename,
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

  const handleExport = useCallback(() => {
    if (!exportFilename) return;
    const headers = columns.map((c) => c.label);
    const rows = sorted.map((row) =>
      columns.map((col) => {
        const raw = (row as Record<string, unknown>)[col.key];
        if (col.sortKey) {
          const v = col.sortKey(row);
          return escapeCsvField(String(v));
        }
        return escapeCsvField(String(raw ?? ""));
      }),
    );
    const csv = [
      headers.map(escapeCsvField).join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${exportFilename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [exportFilename, sorted, columns]);

  return (
    <div>
      <div className="-mx-4 overflow-x-auto sm:mx-0 sm:rounded-lg sm:border sm:border-gray-200 dark:sm:border-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-3 py-2.5 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 sm:px-4 sm:py-3 ${
                    col.align === "right" ? "text-right" : "text-left"
                  } ${col.sortKey ? "cursor-pointer select-none hover:text-gray-900 dark:hover:text-gray-100" : ""} ${col.className ?? ""} ${col.hideOnMobile ? "hidden sm:table-cell" : ""}`}
                  onClick={() => col.sortKey && handleSort(col.key)}
                  onKeyDown={(e) => {
                    if (col.sortKey && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      handleSort(col.key);
                    }
                  }}
                  tabIndex={col.sortKey ? 0 : undefined}
                  role={col.sortKey ? "button" : undefined}
                  aria-sort={
                    sortKey === col.key
                      ? sortDir === "asc"
                        ? "ascending"
                        : "descending"
                      : col.sortKey
                        ? "none"
                        : undefined
                  }
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
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-950">
            {pageData.map((row) => (
              <tr
                key={rowKey(row)}
                className={
                  onRowClick
                    ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 focus-within:bg-gray-50 dark:focus-within:bg-gray-900"
                    : ""
                }
                onClick={() => onRowClick?.(row)}
                onKeyDown={
                  onRowClick
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onRowClick(row);
                        }
                      }
                    : undefined
                }
                tabIndex={onRowClick ? 0 : undefined}
                role={onRowClick ? "button" : undefined}
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
      {(totalPages > 1 || exportFilename) && (
        <div className="mt-3 flex items-center justify-between px-1 text-sm text-gray-600 dark:text-gray-400">
          <span>
            {totalPages > 1 ? (
              <>
                {page * pageSize + 1}-
                {Math.min((page + 1) * pageSize, sorted.length)} of{" "}
                {sorted.length}
              </>
            ) : (
              <>{sorted.length} rows</>
            )}
          </span>
          <div className="flex gap-2">
            {exportFilename && (
              <button
                onClick={handleExport}
                className="rounded border px-3 py-1 text-blue-600 hover:bg-blue-50 dark:border-gray-700 dark:text-blue-400 dark:hover:bg-gray-800"
              >
                Export CSV
              </button>
            )}
            {totalPages > 1 && (
              <>
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="rounded border px-3 py-1 disabled:opacity-50 dark:border-gray-700"
                >
                  Prev
                </button>
                <button
                  onClick={() =>
                    setPage((p) => Math.min(totalPages - 1, p + 1))
                  }
                  disabled={page >= totalPages - 1}
                  className="rounded border px-3 py-1 disabled:opacity-50 dark:border-gray-700"
                >
                  Next
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
