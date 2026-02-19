// ── Meta ─────────────────────────────────────────────────────

export interface Meta {
  buildTimestamp: string;
  dataRange: { earliest: string; latest: string };
  totals: {
    spending: number;
    claims: number;
    providers: number;
    rows: number;
  };
}

// ── National ─────────────────────────────────────────────────

export interface MonthlyDataPoint {
  month: string;
  total_paid: number;
  total_claims: number;
  active_providers: number;
}

export interface YearlyDataPoint {
  year: string;
  total_paid: number;
  total_claims: number;
  active_providers: number;
  total_beneficiaries?: number;
}

export interface YoYGrowth {
  year: string;
  total_paid: number;
  total_claims: number;
  yoy_paid_growth_pct: number | null;
  yoy_claims_growth_pct: number | null;
}

export interface ProviderSummary {
  npi: string;
  name: string;
  state: string;
  city: string;
  classification: string;
  total_paid: number;
  total_claims: number;
  distinct_procedures: number;
}

export interface ProcedureSummary {
  code: string;
  description: string;
  total_paid: number;
  total_claims: number;
  provider_count: number;
  avg_per_claim: number;
}

export interface ParetoTier {
  provider_tier: string;
  provider_count: number;
  tier_total_paid: number;
  pct_of_total: number;
}

export interface DistributionBucket {
  spending_bucket: string;
  provider_count: number;
  bucket_total_paid: number;
  pct_of_total: number;
}

export interface NationalData {
  headline: {
    total_spending: number;
    total_claims: number;
    total_providers: number;
    total_rows: number;
    data_range: string;
  };
  monthly: MonthlyDataPoint[];
  yearly: YearlyDataPoint[];
  yoy_growth: YoYGrowth[];
  top_providers: ProviderSummary[];
  top_procedures: ProcedureSummary[];
  pareto: ParetoTier[];
  distribution: DistributionBucket[];
}

// ── States ───────────────────────────────────────────────────

export interface StateIndexEntry {
  code: string;
  name: string;
  total_paid: number;
  total_claims: number;
  provider_count: number;
  avg_per_claim: number;
  yoy_change: number | null;
}

export interface ClassificationEntry {
  classification: string;
  total_paid: number;
  total_claims: number;
  provider_count: number;
}

export interface StateDetail {
  code: string;
  name: string;
  headline: {
    total_paid: number;
    total_claims: number;
    provider_count: number;
    avg_per_claim: number;
    national_rank: number;
    national_pct: number;
  };
  yearly: YearlyDataPoint[];
  yoy_growth: YoYGrowth[];
  top_providers: ProviderSummary[];
  top_procedures: ProcedureSummary[];
  classification: ClassificationEntry[];
  concentration: ParetoTier[];
}

// ── Providers ────────────────────────────────────────────────

export interface ProviderProfile {
  npi: string;
  name: string;
  state: string;
  city: string;
  classification: string;
  total_paid: number;
  total_claims: number;
  distinct_procedures: number;
  yearly: YearlyDataPoint[];
  top_procedures: {
    code: string;
    description: string;
    total_paid: number;
    total_claims: number;
  }[];
}

export interface ProviderSearchEntry {
  npi: string;
  name: string;
  classification: string;
  total_paid: number;
  total_claims: number;
}

// ── Procedures ───────────────────────────────────────────────

export interface ProcedureIndexEntry {
  code: string;
  description: string;
  total_paid: number;
  total_claims: number;
}

export interface ProcedureProfile {
  code: string;
  description: string;
  total_paid: number;
  total_claims: number;
  provider_count: number;
  yearly: YearlyDataPoint[];
  top_states: {
    state: string;
    total_paid: number;
    total_claims: number;
    provider_count: number;
  }[];
  top_providers: {
    npi: string;
    name: string;
    state: string;
    total_paid: number;
    total_claims: number;
  }[];
}
