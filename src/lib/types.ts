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
  enrollment: number | null;
  per_enrollee_spending: number | null;
  managed_care_pct: number | null;
  ffs_pct: number | null;
  expanded: boolean | null;
  expansion_year: number | null;
}

export interface ClassificationEntry {
  classification: string;
  total_paid: number;
  total_claims: number;
  provider_count: number;
}

export interface EnrollmentTrendPoint {
  year: string;
  enrollment: number | null;
  ffs_spending: number | null;
  per_enrollee: number | null;
  managed_care_pct: number | null;
  ffs_pct: number | null;
}

export interface StateSupplementary {
  expanded: boolean | null;
  expansion_year: number | null;
  managed_care_pct: number | null;
  ffs_pct: number | null;
  ffs_caveat: boolean;
  enrollment_trend: EnrollmentTrendPoint[];
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
  supplementary: StateSupplementary;
  yearly: YearlyDataPoint[];
  yoy_growth: YoYGrowth[];
  top_providers: ProviderSummary[];
  top_procedures: ProcedureSummary[];
  classification: ClassificationEntry[];
  concentration: ParetoTier[];
}

// ── Providers ────────────────────────────────────────────────

export interface MedicareCrosswalk {
  payment: number;
  services: number;
  beneficiaries: number;
  dual_eligible: number | null;
  provider_type: string;
}

export interface ProviderProfile {
  npi: string;
  name: string;
  state: string;
  city: string;
  classification: string;
  total_paid: number;
  total_claims: number;
  distinct_procedures: number;
  avg_per_claim: number;
  avg_per_claim_zscore: number | null;
  classification_avg_per_claim: number | null;
  yearly: YearlyDataPoint[];
  monthly: MonthlyDataPoint[] | null;
  top_procedures: {
    code: string;
    description: string;
    total_paid: number;
    total_claims: number;
  }[];
  medicare: MedicareCrosswalk | null;
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
  category: string;
  total_paid: number;
  total_claims: number;
}

export interface ProcedureCategory {
  category: string;
  total_paid: number;
  total_claims: number;
  procedure_count: number;
}

export interface ProviderAnomaly {
  npi: string;
  name: string;
  state: string;
  city: string;
  classification: string;
  total_paid: number;
  total_claims: number;
  avg_per_claim: number;
  classification_avg_per_claim: number;
  zscore: number;
}

export interface ProcedureProfile {
  code: string;
  description: string;
  category: string;
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

// ── Supplementary ──────────────────────────────────────────

export interface SupplementaryData {
  data_sources: Record<
    string,
    {
      name: string;
      url: string;
      coverage?: string;
      note?: string;
      kff_url?: string;
    }
  >;
  national_enrollment: { year: string; total_enrollment: number }[];
  managed_care_summary: {
    year: string;
    states_reporting: number;
    avg_managed_care_pct: number;
    min_managed_care_pct: number;
    max_managed_care_pct: number;
  }[];
  expansion_summary: {
    expanded_count: number;
    total_states: number;
    not_expanded: string[];
  };
  medicare_overlap: {
    total_medicare_providers: number;
    providers_in_both_programs: number;
    total_medicare_payment: number;
  } | null;
  methodology_notes: string[];
}
