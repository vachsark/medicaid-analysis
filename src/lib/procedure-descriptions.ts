/**
 * Human-readable descriptions for common HCPCS/procedure codes.
 * These explain in plain English what the cryptic code abbreviations mean.
 */
export const PROCEDURE_DESCRIPTIONS: Record<string, string> = {
  // Office/outpatient visits (E&M codes)
  "99201":
    "New patient office visit, straightforward decision-making (~15 min)",
  "99202":
    "New patient office visit, straightforward decision-making (~15-29 min)",
  "99203": "New patient office visit, low complexity (~30-44 min)",
  "99204": "New patient office visit, moderate complexity (~45-59 min)",
  "99205": "New patient office visit, high complexity (~60-74 min)",
  "99211":
    "Established patient office visit, minimal complexity (may not require physician)",
  "99212": "Established patient office visit, straightforward (~10-19 min)",
  "99213":
    "Established patient office visit, low complexity (~20-29 min). One of the most common doctor visit codes in Medicaid.",
  "99214":
    "Established patient office visit, moderate complexity (~30-39 min). The most common mid-level doctor visit.",
  "99215": "Established patient office visit, high complexity (~40-54 min)",

  // Emergency department
  "99281":
    "Emergency department visit — straightforward medical decision-making",
  "99282":
    "Emergency department visit — low complexity medical decision-making",
  "99283":
    "Emergency department visit — moderate complexity medical decision-making",
  "99284":
    "Emergency department visit — moderately complex medical decision-making with urgent evaluation",
  "99285":
    "Emergency department visit — high complexity medical decision-making, often involving threat to life or function",

  // Behavioral health / psychotherapy
  "90791":
    "Psychiatric diagnostic evaluation — initial assessment without medical services",
  "90792":
    "Psychiatric diagnostic evaluation — initial assessment with medical services",
  "90832": "Individual psychotherapy session, ~30 minutes",
  "90834": "Individual psychotherapy session, ~45 minutes",
  "90837":
    "Individual psychotherapy session, ~60 minutes. The standard therapy hour.",
  "90839":
    "Psychotherapy for crisis — first 60 minutes of emergency mental health intervention",
  "90840": "Psychotherapy for crisis — each additional 30 minutes",
  "90846": "Family psychotherapy without the patient present",
  "90847": "Family psychotherapy with the patient present",
  "90853": "Group psychotherapy session",
  "90999":
    "Dialysis procedure not covered by a specific code. Often used for kidney dialysis treatments.",

  // Community/behavioral health HCPCS
  H0001: "Alcohol and/or drug assessment",
  H0004: "Behavioral health counseling and therapy, per 15 minutes",
  H0005: "Alcohol and/or drug group counseling",
  H0015: "Alcohol and/or drug intensive outpatient program",
  H0019:
    "Substance abuse (alcohol/drug) treatment services — residential or outpatient",
  H0020: "Alcohol and/or drug methadone administration",
  H0031: "Mental health assessment by a qualified professional",
  H0032: "Mental health service plan development by a non-physician clinician",
  H0036:
    "Community psychiatric supportive treatment — face-to-face, per 15 minutes",
  H0038: "Self-help/peer support services, per 15 minutes",
  H2010:
    "Comprehensive medication services (substance abuse or mental health), per 15 minutes",
  H2011:
    "Crisis intervention service — a mental health worker responding to an acute episode",
  H2012:
    "Behavioral health day treatment, per hour — structured program for mental health/substance abuse",
  H2015:
    "Comprehensive community support services, per 15 min — mental health recovery assistance including daily living skills and community integration",
  H2017:
    "Psychosocial rehabilitation services, per 15 min — helping people with mental illness develop social and independent living skills",
  H2019:
    "Therapeutic behavioral services, per 15 min — behavior modification and management for mental health conditions",
  H2023:
    "Supported employment services, per 15 min — helping people with disabilities find and keep jobs",
  H2025: "Ongoing support to maintain employment, per 15 min",

  // Case management / care coordination
  T1015:
    "Outpatient clinic visit for Medicaid-covered services. Very broad code used for behavioral health, primary care, and other outpatient settings.",
  T1016: "Case management services, each 15 minutes",
  T1017:
    "Targeted case management — care coordination for specific eligible populations (e.g., serious mental illness, children in foster care)",
  T1019:
    "Personal care services — assistance with activities of daily living (bathing, dressing, eating, mobility)",
  T1020: "Personal care services — per diem (daily rate) instead of hourly",
  T1023:
    "Screening to determine appropriateness of Medicaid home and community-based services",

  // Home and community-based services
  T2003:
    "Non-emergency medical transportation — round trip to medical appointments",
  T2025:
    "Waiver services — not otherwise specified (catch-all for state-specific Medicaid waiver programs)",
  T2031:
    "Assisted living facility services — daily rate under a Medicaid waiver program",

  // Adult day care / residential
  S5102:
    "Adult day care — daily rate for supervised care programs for adults who need assistance during the day",
  S5150:
    "Unskilled respite care — temporary relief for family caregivers, not requiring medical professionals",
  S9484:
    "Crisis intervention services, per hour — emergency mental health support during an acute episode",

  // Lab / diagnostic
  "80053":
    "Comprehensive metabolic panel — blood test checking organ function, electrolytes, glucose, and kidney/liver markers",
  "85025":
    "Complete blood count (CBC) with differential — standard blood test counting all cell types",
  "36415": "Routine venipuncture — drawing blood from a vein for lab tests",

  // Pharmacy / drugs
  J1745:
    "Infliximab injection (Remicade) — biologic drug for autoimmune conditions",
  J0129: "Abatacept injection (Orencia) — drug for rheumatoid arthritis",
  J2505:
    "Pegfilgrastim injection (Neulasta) — drug to prevent infection during chemotherapy",

  // Dental
  D0120:
    "Periodic oral evaluation — routine dental checkup for established patients",
  D0150:
    "Comprehensive oral evaluation — thorough dental exam for new patients or significant changes",
  D0210: "Full mouth X-rays — complete set of dental radiographs",
  D0220: "Periapical X-ray — single dental X-ray of a specific tooth and root",
  D0230: "Additional periapical X-ray — each additional view beyond the first",
  D0274: "Bitewing X-rays — four images checking for cavities between teeth",
  D1110: "Prophylaxis (dental cleaning) — adult routine teeth cleaning",
  D1120: "Prophylaxis (dental cleaning) — child routine teeth cleaning",
  D1206: "Topical fluoride varnish — preventive dental treatment",
  D1351:
    "Dental sealant — protective coating applied to tooth to prevent cavities",
  D2140: "Silver (amalgam) filling — one surface",
  D2150: "Silver (amalgam) filling — two surfaces",
  D2330: "Resin-based (tooth-colored) filling — one surface, front tooth",
  D2331: "Resin-based (tooth-colored) filling — two surfaces, front tooth",
  D2391: "Resin-based (tooth-colored) filling — one surface, back tooth",
  D2392: "Resin-based (tooth-colored) filling — two surfaces, back tooth",
  D7140: "Tooth extraction — simple removal of erupted tooth",
  D7210: "Tooth extraction — surgical removal requiring incision",
  D7240: "Tooth extraction — surgical removal of impacted tooth",

  // Transport
  A0425:
    "Ground ambulance — non-emergency transport at basic life support (BLS) level",
  A0426: "Ambulance service — advanced life support (ALS) non-emergency",
  A0427: "Ambulance service — advanced life support (ALS) emergency",
  A0428: "Ambulance service — basic life support (BLS) non-emergency",
  A0429: "Ambulance service — basic life support (BLS) emergency",

  // DME / supplies
  A4253: "Blood glucose test strip — for diabetes monitoring",
  E0260: "Hospital bed — semi-electric for home use",

  // Revenue codes (often appear without descriptions)
  "0450":
    "Emergency room facility charge — covers the facility cost of an ER visit",
  "0100": "Inpatient room and board — general hospital admission charge",
  "00003": "State-specific billing code — varies by state Medicaid program",
};

/**
 * Get a human-readable description for a procedure code.
 * Returns the human description if available, otherwise returns the HCPCS short description.
 */
export function getHumanDescription(
  code: string,
  hcpcsDescription?: string,
): string | null {
  return PROCEDURE_DESCRIPTIONS[code] ?? hcpcsDescription ?? null;
}
