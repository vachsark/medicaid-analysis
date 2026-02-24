"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { StateIndexEntry, StateDetail } from "@/lib/types";
import { fetchStateDetail } from "@/lib/data";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import { StatCard } from "@/components/ui/StatCard";
import { CHART_PALETTE, CHART_COLORS } from "@/lib/constants";

interface Props {
  states: StateIndexEntry[];
}

const DEFAULT_CODES = ["NY", "CA", "TX"];
const MAX_STATES = 4;

export function CompareClient({ states }: Props) {
  const sortedStates = useMemo(
    () => [...states].sort((a, b) => a.name.localeCompare(b.name)),
    [states],
  );

  const [selectedCodes, setSelectedCodes] = useState<string[]>(DEFAULT_CODES);
  const [stateDetails, setStateDetails] = useState<Record<string, StateDetail>>(
    {},
  );
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const missing = selectedCodes.filter((c) => !stateDetails[c]);
    if (missing.length === 0) return;

    setLoading(true);
    Promise.all(missing.map((code) => fetchStateDetail(code)))
      .then((results) => {
        setStateDetails((prev) => {
          const next = { ...prev };
          for (const detail of results) {
            next[detail.code] = detail;
          }
          return next;
        });
      })
      .finally(() => setLoading(false));
  }, [selectedCodes, stateDetails]);

  function toggleState(code: string) {
    setSelectedCodes((prev) => {
      if (prev.includes(code)) {
        return prev.filter((c) => c !== code);
      }
      if (prev.length >= MAX_STATES) return prev;
      return [...prev, code];
    });
  }

  const selected = selectedCodes
    .map((code) => stateDetails[code])
    .filter(Boolean);

  const allLoaded = selected.length === selectedCodes.length && !loading;

  // Build overlaid trend data: { year, NY: value, CA: value, ... }
  const trendData = useMemo(() => {
    if (!allLoaded) return [];
    const yearMap: Record<string, Record<string, number>> = {};
    for (const detail of selected) {
      for (const y of detail.yearly) {
        if (!yearMap[y.year]) yearMap[y.year] = {};
        yearMap[y.year][detail.code] = y.total_paid;
      }
    }
    return Object.keys(yearMap)
      .sort()
      .map((year) => ({ year, ...yearMap[year] }));
  }, [selected, allLoaded]);

  // Bar chart data for total spending comparison
  const barData = useMemo(
    () =>
      selected.map((d) => ({
        name: d.name,
        code: d.code,
        total_paid: d.headline.total_paid,
      })),
    [selected],
  );

  const colorMap = useMemo(() => {
    const map: Record<string, string> = {};
    selectedCodes.forEach((code, i) => {
      map[code] = CHART_PALETTE[i % CHART_PALETTE.length];
    });
    return map;
  }, [selectedCodes]);

  return (
    <div className="space-y-8">
      {/* State selector */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Select states to compare (2-4)
        </label>
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex w-full flex-wrap items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm shadow-sm hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-gray-500"
          >
            {selectedCodes.length === 0 ? (
              <span className="text-gray-400">Select states...</span>
            ) : (
              selectedCodes.map((code) => {
                const s = states.find((st) => st.code === code);
                return (
                  <span
                    key={code}
                    className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium text-white"
                    style={{ backgroundColor: colorMap[code] }}
                  >
                    {s?.name ?? code}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleState(code);
                      }}
                      className="ml-0.5 hover:opacity-75"
                    >
                      x
                    </button>
                  </span>
                );
              })
            )}
            <svg
              className="ml-auto h-4 w-4 shrink-0 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
              {sortedStates.map((s) => {
                const isSelected = selectedCodes.includes(s.code);
                const disabled =
                  !isSelected && selectedCodes.length >= MAX_STATES;
                return (
                  <button
                    key={s.code}
                    onClick={() => !disabled && toggleState(s.code)}
                    disabled={disabled}
                    className={`flex w-full items-center justify-between px-3 py-1.5 text-left text-sm ${
                      disabled
                        ? "cursor-not-allowed text-gray-300 dark:text-gray-600"
                        : isSelected
                          ? "bg-blue-50 font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    <span>
                      {s.name} ({s.code})
                    </span>
                    {isSelected && (
                      <svg
                        className="h-4 w-4 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="py-12 text-center text-gray-500">
          Loading state data...
        </div>
      )}

      {allLoaded && selected.length >= 2 && (
        <>
          {/* Side-by-side stat cards */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100 sm:mb-4 sm:text-xl">
              Key Metrics
            </h2>
            <div className="overflow-x-auto">
              <div
                className="grid gap-4"
                style={{
                  gridTemplateColumns: `repeat(${selected.length}, minmax(200px, 1fr))`,
                }}
              >
                {selected.map((d, i) => (
                  <div key={d.code} className="space-y-3">
                    <div
                      className="rounded-t-lg px-3 py-1.5 text-center text-sm font-semibold text-white"
                      style={{ backgroundColor: colorMap[d.code] }}
                    >
                      {d.name}
                    </div>
                    <StatCard
                      label="Total Spending"
                      value={formatCurrency(d.headline.total_paid, true)}
                    />
                    <StatCard
                      label="Total Claims"
                      value={formatNumber(d.headline.total_claims, true)}
                    />
                    <StatCard
                      label="Providers"
                      value={formatNumber(d.headline.provider_count)}
                    />
                    <StatCard
                      label="Avg Cost/Claim"
                      value={formatCurrency(d.headline.avg_per_claim)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Overlaid spending trend */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100 sm:mb-4 sm:text-xl">
              Yearly Spending Trend
            </h2>
            <div className="rounded-lg border border-gray-200 bg-white p-2 sm:p-4 dark:border-gray-800 dark:bg-gray-900">
              <ResponsiveContainer width="100%" height={350}>
                <LineChart
                  data={trendData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={CHART_COLORS.grid}
                  />
                  <XAxis
                    dataKey="year"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    tickFormatter={(v: number) => formatCurrency(v, true)}
                  />
                  <Tooltip
                    formatter={(value: number | undefined) =>
                      formatCurrency(value ?? 0)
                    }
                    labelStyle={{ fontWeight: 600 }}
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                    }}
                  />
                  <Legend verticalAlign="top" height={30} />
                  {selectedCodes.map((code) => (
                    <Line
                      key={code}
                      type="monotone"
                      dataKey={code}
                      name={states.find((s) => s.code === code)?.name ?? code}
                      stroke={colorMap[code]}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Total spending bar chart */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100 sm:mb-4 sm:text-xl">
              Total Spending Comparison
            </h2>
            <div className="rounded-lg border border-gray-200 bg-white p-2 sm:p-4 dark:border-gray-800 dark:bg-gray-900">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={barData}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={CHART_COLORS.grid}
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    tickFormatter={(v: number) => formatCurrency(v, true)}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    width={100}
                  />
                  <Tooltip
                    formatter={(value: number | undefined) => [
                      formatCurrency(value ?? 0),
                      "Total Spending",
                    ]}
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                    }}
                  />
                  <Bar dataKey="total_paid" radius={[0, 4, 4, 0]}>
                    {barData.map((entry) => (
                      <Cell key={entry.code} fill={colorMap[entry.code]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Comparison table */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100 sm:mb-4 sm:text-xl">
              Detailed Comparison
            </h2>
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
              <table className="min-w-full divide-y divide-gray-200 bg-white text-sm dark:divide-gray-800 dark:bg-gray-950">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">
                      Metric
                    </th>
                    {selected.map((d) => (
                      <th
                        key={d.code}
                        className="px-4 py-3 text-right font-semibold"
                        style={{ color: colorMap[d.code] }}
                      >
                        {d.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-gray-700 dark:text-gray-300">
                      Total Spending
                    </td>
                    {selected.map((d) => (
                      <td
                        key={d.code}
                        className="px-4 py-2.5 text-right text-gray-900 dark:text-gray-100"
                      >
                        {formatCurrency(d.headline.total_paid, true)}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-gray-50/50 dark:bg-gray-900/50">
                    <td className="px-4 py-2.5 font-medium text-gray-700 dark:text-gray-300">
                      Total Claims
                    </td>
                    {selected.map((d) => (
                      <td
                        key={d.code}
                        className="px-4 py-2.5 text-right text-gray-900 dark:text-gray-100"
                      >
                        {formatNumber(d.headline.total_claims, true)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-gray-700 dark:text-gray-300">
                      Providers
                    </td>
                    {selected.map((d) => (
                      <td
                        key={d.code}
                        className="px-4 py-2.5 text-right text-gray-900 dark:text-gray-100"
                      >
                        {formatNumber(d.headline.provider_count)}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-gray-50/50 dark:bg-gray-900/50">
                    <td className="px-4 py-2.5 font-medium text-gray-700 dark:text-gray-300">
                      Avg Cost/Claim
                    </td>
                    {selected.map((d) => (
                      <td
                        key={d.code}
                        className="px-4 py-2.5 text-right text-gray-900 dark:text-gray-100"
                      >
                        {formatCurrency(d.headline.avg_per_claim)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-gray-700 dark:text-gray-300">
                      National Rank
                    </td>
                    {selected.map((d) => (
                      <td
                        key={d.code}
                        className="px-4 py-2.5 text-right text-gray-900 dark:text-gray-100"
                      >
                        #{d.headline.national_rank}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-gray-50/50 dark:bg-gray-900/50">
                    <td className="px-4 py-2.5 font-medium text-gray-700 dark:text-gray-300">
                      % of National
                    </td>
                    {selected.map((d) => (
                      <td
                        key={d.code}
                        className="px-4 py-2.5 text-right text-gray-900 dark:text-gray-100"
                      >
                        {d.headline.national_pct}%
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-gray-700 dark:text-gray-300">
                      Managed Care %
                    </td>
                    {selected.map((d) => (
                      <td
                        key={d.code}
                        className="px-4 py-2.5 text-right text-gray-900 dark:text-gray-100"
                      >
                        {d.supplementary?.managed_care_pct != null
                          ? `${d.supplementary.managed_care_pct.toFixed(0)}%`
                          : "—"}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-gray-50/50 dark:bg-gray-900/50">
                    <td className="px-4 py-2.5 font-medium text-gray-700 dark:text-gray-300">
                      ACA Expansion
                    </td>
                    {selected.map((d) => (
                      <td
                        key={d.code}
                        className={`px-4 py-2.5 text-right ${
                          d.supplementary?.expanded === true
                            ? "text-green-600"
                            : d.supplementary?.expanded === false
                              ? "text-red-600"
                              : "text-gray-400"
                        }`}
                      >
                        {d.supplementary?.expanded === true
                          ? `Yes${d.supplementary.expansion_year ? ` (${d.supplementary.expansion_year})` : ""}`
                          : d.supplementary?.expanded === false
                            ? "No"
                            : "—"}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-gray-700 dark:text-gray-300">
                      Enrollment (Latest)
                    </td>
                    {selected.map((d) => {
                      const trend = d.supplementary?.enrollment_trend;
                      const latest = trend?.length
                        ? trend[trend.length - 1]?.enrollment
                        : null;
                      return (
                        <td
                          key={d.code}
                          className="px-4 py-2.5 text-right text-gray-900 dark:text-gray-100"
                        >
                          {latest != null ? formatNumber(latest, true) : "—"}
                        </td>
                      );
                    })}
                  </tr>
                  <tr className="bg-gray-50/50 dark:bg-gray-900/50">
                    <td className="px-4 py-2.5 font-medium text-gray-700 dark:text-gray-300">
                      FFS $/Enrollee
                    </td>
                    {selected.map((d) => {
                      const trend = d.supplementary?.enrollment_trend;
                      const latest = trend?.length
                        ? trend[trend.length - 1]?.per_enrollee
                        : null;
                      return (
                        <td
                          key={d.code}
                          className="px-4 py-2.5 text-right text-gray-900 dark:text-gray-100"
                        >
                          {latest != null ? formatCurrency(latest) : "—"}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {allLoaded && selected.length < 2 && (
        <div className="py-12 text-center text-gray-500">
          Select at least 2 states to compare.
        </div>
      )}
    </div>
  );
}
