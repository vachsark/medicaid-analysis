"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Fuse, { type IFuseOptions } from "fuse.js";

interface SearchItem {
  type: "state" | "provider" | "procedure";
  label: string;
  sublabel: string;
  href: string;
}

const FUSE_OPTIONS: IFuseOptions<SearchItem> = {
  keys: ["label", "sublabel"],
  threshold: 0.35,
  distance: 100,
};

function formatUSD(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

async function loadSearchData(): Promise<SearchItem[]> {
  const [states, procedures, providers] = await Promise.all([
    fetch("/data/states/_index.json").then((r) => r.json()),
    fetch("/data/procedures/_index.json").then((r) => r.json()),
    fetch("/data/providers/search/top5000.json").then((r) => r.json()),
  ]);

  const items: SearchItem[] = [];

  for (const s of states) {
    items.push({
      type: "state",
      label: s.name,
      sublabel: `${s.code} — ${formatUSD(s.total_paid)}`,
      href: `/states/${s.code}/`,
    });
  }

  // Only include top 500 procedures (those with detail pages)
  for (const p of procedures.slice(0, 500)) {
    items.push({
      type: "procedure",
      label: `${p.code} — ${p.description}`,
      sublabel: formatUSD(p.total_paid),
      href: `/procedures/${p.code}/`,
    });
  }

  for (const p of providers) {
    items.push({
      type: "provider",
      label: p.name,
      sublabel: `${p.classification} — ${formatUSD(p.total_paid)}`,
      href: `/providers/${p.npi}/`,
    });
  }

  return items;
}

const GROUP_LABELS: Record<SearchItem["type"], string> = {
  state: "States",
  provider: "Providers",
  procedure: "Procedures",
};

const MAX_PER_GROUP = 3;

export function GlobalSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const fuseRef = useRef<Fuse<SearchItem> | null>(null);
  const loadingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  const ensureLoaded = useCallback(async () => {
    if (fuseRef.current || loadingRef.current) return;
    loadingRef.current = true;
    const items = await loadSearchData();
    fuseRef.current = new Fuse(items, FUSE_OPTIONS);
    loadingRef.current = false;
  }, []);

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setMobileExpanded(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Debounced query
  const [debouncedQuery, setDebouncedQuery] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 200);
    return () => clearTimeout(t);
  }, [query]);

  // The actual search runs off debouncedQuery
  const debouncedResults = useMemo(() => {
    if (!debouncedQuery.trim() || !fuseRef.current) return [];
    return fuseRef.current
      .search(debouncedQuery, { limit: 30 })
      .map((r) => r.item);
  }, [debouncedQuery]);

  const debouncedGrouped = useMemo(() => {
    const groups: Partial<Record<SearchItem["type"], SearchItem[]>> = {};
    for (const item of debouncedResults) {
      const arr = groups[item.type] ?? (groups[item.type] = []);
      if (arr.length < MAX_PER_GROUP) arr.push(item);
    }
    return groups;
  }, [debouncedResults]);

  const debouncedFlat = useMemo(() => {
    const flat: SearchItem[] = [];
    for (const type of ["state", "provider", "procedure"] as const) {
      if (debouncedGrouped[type]) flat.push(...debouncedGrouped[type]!);
    }
    return flat;
  }, [debouncedGrouped]);

  const showDebouncedDropdown = open && debouncedQuery.trim().length > 0;

  const navigate = useCallback(
    (item: SearchItem) => {
      router.push(item.href);
      setQuery("");
      setOpen(false);
      setMobileExpanded(false);
      setActiveIndex(-1);
    },
    [router],
  );

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setOpen(false);
      setMobileExpanded(false);
      inputRef.current?.blur();
      mobileInputRef.current?.blur();
      return;
    }
    if (!showDebouncedDropdown || debouncedFlat.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % debouncedFlat.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? debouncedFlat.length - 1 : i - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      navigate(debouncedFlat[activeIndex]);
    }
  }

  // Magnifying glass SVG
  const SearchIcon = (
    <svg
      className="h-4 w-4 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      />
    </svg>
  );

  const renderDropdown = () => {
    if (!showDebouncedDropdown) return null;

    return (
      <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-80 overflow-y-auto rounded-lg bg-white shadow-lg ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-700">
        {debouncedFlat.length === 0 ? (
          <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
            No results found
          </div>
        ) : (
          (() => {
            let idx = 0;
            return (["state", "provider", "procedure"] as const).map((type) => {
              const items = debouncedGrouped[type];
              if (!items || items.length === 0) return null;
              const startIdx = idx;
              idx += items.length;
              return (
                <div key={type}>
                  <div className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    {GROUP_LABELS[type]}
                  </div>
                  {items.map((item, i) => {
                    const globalIdx = startIdx + i;
                    return (
                      <button
                        key={item.href}
                        type="button"
                        className={`flex w-full items-start gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800 ${
                          globalIdx === activeIndex
                            ? "bg-blue-50 dark:bg-blue-950"
                            : ""
                        }`}
                        onMouseEnter={() => setActiveIndex(globalIdx)}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          navigate(item);
                        }}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-medium text-gray-900 dark:text-gray-100">
                            {item.label}
                          </div>
                          <div className="truncate text-xs text-gray-500 dark:text-gray-400">
                            {item.sublabel}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              );
            });
          })()
        )}
      </div>
    );
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Desktop: compact search bar */}
      <div className="hidden sm:block">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
            {SearchIcon}
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            placeholder="Search..."
            className="h-8 w-48 rounded-md border border-gray-200 bg-gray-50 pl-8 pr-3 text-sm text-gray-900 placeholder-gray-400 transition-all focus:w-64 focus:border-blue-300 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-300 lg:w-56 lg:focus:w-72 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:bg-gray-900"
            onFocus={() => {
              ensureLoaded();
              setOpen(true);
            }}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(-1);
              setOpen(true);
            }}
            onKeyDown={handleKeyDown}
          />
        </div>
        {renderDropdown()}
      </div>

      {/* Mobile: icon or expanded input */}
      <div className="sm:hidden">
        {mobileExpanded ? (
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
              {SearchIcon}
            </div>
            <input
              ref={mobileInputRef}
              type="text"
              value={query}
              placeholder="Search..."
              autoFocus
              className="h-9 w-full rounded-md border border-gray-200 bg-white pl-8 pr-8 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
              onFocus={() => {
                ensureLoaded();
                setOpen(true);
              }}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(-1);
                setOpen(true);
              }}
              onKeyDown={handleKeyDown}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={() => {
                setMobileExpanded(false);
                setQuery("");
                setOpen(false);
              }}
              aria-label="Close search"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            {renderDropdown()}
          </div>
        ) : (
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            onClick={() => {
              setMobileExpanded(true);
              ensureLoaded();
            }}
            aria-label="Search"
          >
            {SearchIcon}
          </button>
        )}
      </div>
    </div>
  );
}
