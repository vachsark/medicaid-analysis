import { PageHeader } from "@/components/ui/PageHeader";
import { DATA_URL } from "@/lib/constants";

export const metadata = {
  title: "About",
  description:
    "Methodology, data sources, and limitations for the Medicaid Spending Explorer. Based on the HHS Medicaid Provider Spending Dataset covering $1.09 trillion in payments (2018-2024).",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl">
      <PageHeader title="About This Project" />

      <div className="space-y-8 text-gray-700 leading-relaxed dark:text-gray-300">
        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-gray-100">
            Data Source
          </h2>
          <p>
            This dashboard visualizes the{" "}
            <a
              href={DATA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline dark:text-blue-400"
            >
              HHS Medicaid Provider Spending Dataset
            </a>
            , published by the U.S. Department of Health and Human Services on
            the Medicaid Open Data Portal.
          </p>
          <p className="mt-2">
            The dataset contains 227 million rows of claim-level spending data
            from 2018 through 2024, covering $1.09 trillion in Medicaid payments
            to over 617,000 unique billing providers across all 50 states, DC,
            and U.S. territories.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-gray-100">
            Methodology
          </h2>
          <p>
            Raw claims data was enriched with provider names and locations from
            the NPPES (National Plan and Provider Enumeration System), procedure
            descriptions from HCPCS (Healthcare Common Procedure Coding System),
            and provider classifications from NUCC (National Uniform Claim
            Committee) taxonomy codes.
          </p>
          <p className="mt-2">Supplementary data enrichment includes:</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>
              <strong>Enrollment data</strong> from{" "}
              <a
                href="https://data.medicaid.gov/dataset/6c114b2c-cb83-559b-832f-4d8b06d6c1b9"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline dark:text-blue-400"
              >
                CMS Medicaid Enrollment (MBES)
              </a>{" "}
              — state-level monthly unduplicated enrollee counts (2018-2024)
            </li>
            <li>
              <strong>Managed care penetration</strong> from{" "}
              <a
                href="https://www.medicaid.gov/medicaid/managed-care/enrollment-report"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline dark:text-blue-400"
              >
                CMS Managed Care Enrollment Reports
              </a>{" "}
              — percentage of enrollees in managed care by state and year
            </li>
            <li>
              <strong>ACA expansion status</strong> from{" "}
              <a
                href="https://www.kff.org/medicaid/issue-brief/status-of-state-medicaid-expansion-decisions-interactive-map/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline dark:text-blue-400"
              >
                KFF Medicaid Expansion Tracker
              </a>{" "}
              — 41 states + DC expanded as of 2025
            </li>
            <li>
              <strong>Medicare crosswalk</strong> from{" "}
              <a
                href="https://data.cms.gov/provider-summary-by-type-of-service/medicare-physician-other-practitioners/medicare-physician-other-practitioners-by-provider"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline dark:text-blue-400"
              >
                CMS Medicare Physician &amp; Other Practitioners PUF (2023)
              </a>{" "}
              — NPI-level Medicare payment data for cross-program comparison
            </li>
          </ul>
          <p className="mt-2">
            All aggregations were computed using DuckDB against the raw Parquet
            files. The web application serves pre-computed JSON files — no
            real-time queries are executed in the browser.
          </p>
          <ul className="mt-3 list-inside list-disc space-y-1">
            <li>
              Spending figures are as reported by HHS and have not been adjusted
              for inflation.
            </li>
            <li>
              Provider locations come from NPPES registration data, not claim
              service locations.
            </li>
            <li>
              State-level aggregations use the billing provider&apos;s
              registered state, which may differ from where services were
              rendered.
            </li>
            <li>
              Year-over-year growth is calculated using calendar year totals.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-gray-100">
            Privacy
          </h2>
          <p>
            The source dataset already applies privacy protections: rows with
            fewer than 12 claims are excluded by HHS before publication. All
            data shown here is derived from publicly available government
            records.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-gray-100">
            Limitations
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>
              <strong>Fee-for-service only:</strong> This dataset covers
              Medicaid FFS claims only. Approximately 85% of Medicaid enrollees
              nationally are in managed care arrangements, meaning the vast
              majority of Medicaid spending flows through MCOs and is{" "}
              <strong>not captured in this data</strong>. States with high
              managed care penetration (e.g., TN 94%, TX 96%) appear to have
              very low spending — this reflects data coverage, not actual
              spending levels. See managed care percentages on each state page.
            </li>
            <li>
              Provider names may contain typos or variations (e.g., LLC vs
              L.L.C.) since they come from NPPES self-reported data.
            </li>
            <li>
              Some NPI numbers may map to different entities over time due to
              practice changes, mergers, or data entry issues.
            </li>
            <li>
              The dataset is updated annually. The most recent data may be
              incomplete due to claims processing lag.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-gray-100">
            Technology
          </h2>
          <p>
            Built with Next.js (static export), Tailwind CSS, Recharts, and
            react-simple-maps. Data processing uses Python with DuckDB. Hosted
            on Vercel with zero server costs.
          </p>
        </section>
      </div>
    </div>
  );
}
