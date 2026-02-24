"use client";

import { useState, useEffect, useMemo, useRef } from "react";
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
  const loadedStateRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Skip if already loaded for this state
    if (stateFilter === loadedStateRef.current) return;

    // Abort any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const path = stateFilter
      ? `/data/providers/search/${stateFilter}.json`
      : "/data/providers/search/top5000.json";

    setLoading(true);
    fetch(path, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load ${path}`);
        return res.json();
      })
      .then((data) => {
        setAllData(data);
        loadedStateRef.current = stateFilter;
      })
      .catch((e) => {
        if (e instanceof DOMException && e.name === "AbortError") return;
        console.error("Failed to load provider search data:", e);
        setAllData([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [stateFilter]);

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
