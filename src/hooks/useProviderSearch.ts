"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Fuse from "fuse.js";
import type { ProviderSearchEntry } from "@/lib/types";

const FUSE_OPTIONS = {
  keys: ["name", "npi"],
  threshold: 0.3,
  distance: 100,
  minMatchCharLength: 2,
};

export function useProviderSearch() {
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState<string>("");
  const [allData, setAllData] = useState<ProviderSearchEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadedState, setLoadedState] = useState<string>("");

  const loadData = useCallback(
    async (state: string) => {
      if (state === loadedState && allData.length > 0) return;
      setLoading(true);
      try {
        const path = state
          ? `/data/providers/search/${state}.json`
          : "/data/providers/search/top5000.json";
        const res = await fetch(path);
        if (!res.ok) throw new Error(`Failed to load ${path}`);
        const data = await res.json();
        setAllData(data);
        setLoadedState(state);
      } catch (e) {
        console.error("Failed to load provider search data:", e);
        setAllData([]);
      } finally {
        setLoading(false);
      }
    },
    [loadedState, allData.length],
  );

  useEffect(() => {
    loadData(stateFilter);
  }, [stateFilter, loadData]);

  const fuse = useMemo(
    () => (allData.length > 0 ? new Fuse(allData, FUSE_OPTIONS) : null),
    [allData],
  );

  const results = useMemo(() => {
    if (!query.trim()) return allData.slice(0, 100);

    // Direct NPI lookup
    if (/^\d{10}$/.test(query.trim())) {
      const match = allData.find((p) => p.npi === query.trim());
      return match ? [match] : [];
    }

    if (!fuse) return [];
    return fuse.search(query, { limit: 100 }).map((r) => r.item);
  }, [query, allData, fuse]);

  return {
    query,
    setQuery,
    stateFilter,
    setStateFilter,
    results,
    loading,
    totalProviders: allData.length,
  };
}
