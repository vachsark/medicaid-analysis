import type {
  Meta,
  NationalData,
  StateIndexEntry,
  StateDetail,
  ProviderProfile,
  ProviderSearchEntry,
  ProviderAnomaly,
  ProcedureIndexEntry,
  ProcedureProfile,
  ProcedureCategory,
} from "./types";

const BASE = "/data";

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);
  return res.json();
}

export const fetchMeta = () => fetchJson<Meta>("/meta.json");
export const fetchNational = () => fetchJson<NationalData>("/national.json");
export const fetchStatesIndex = () =>
  fetchJson<StateIndexEntry[]>("/states/_index.json");
export const fetchStateDetail = (code: string) =>
  fetchJson<StateDetail>(`/states/${code}.json`);
export const fetchProviderProfiles = () =>
  fetchJson<ProviderProfile[]>("/providers/top5000.json");
export const fetchProviderSearch = (state?: string) =>
  fetchJson<ProviderSearchEntry[]>(
    state
      ? `/providers/search/${state}.json`
      : "/providers/search/top5000.json",
  );
export const fetchProviderAnomalies = () =>
  fetchJson<ProviderAnomaly[]>("/providers/anomalies.json");
export const fetchProceduresIndex = () =>
  fetchJson<ProcedureIndexEntry[]>("/procedures/_index.json");
export const fetchProcedureCategories = () =>
  fetchJson<ProcedureCategory[]>("/procedures/categories.json");
export const fetchProcedureProfile = (code: string) =>
  fetchJson<ProcedureProfile>(`/procedures/${code}.json`);
