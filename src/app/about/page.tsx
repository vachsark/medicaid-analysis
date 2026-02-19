import { PageHeader } from "@/components/ui/PageHeader";
import { DATA_URL } from "@/lib/constants";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="max-w-3xl">
      <PageHeader title="About This Project" />

      <div className="space-y-8 text-gray-700 leading-relaxed">
        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-900">
            Data Source
          </h2>
          <p>
            This dashboard visualizes the{" "}
            <a
              href={DATA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
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
          <h2 className="mb-3 text-xl font-semibold text-gray-900">
            Methodology
          </h2>
          <p>
            Raw claims data was enriched with provider names and locations from
            the NPPES (National Plan and Provider Enumeration System), procedure
            descriptions from HCPCS (Healthcare Common Procedure Coding System),
            and provider classifications from NUCC (National Uniform Claim
            Committee) taxonomy codes.
          </p>
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
          <h2 className="mb-3 text-xl font-semibold text-gray-900">Privacy</h2>
          <p>
            The source dataset already applies privacy protections: rows with
            fewer than 12 claims are excluded by HHS before publication. All
            data shown here is derived from publicly available government
            records.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-900">
            Limitations
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>
              This dataset covers Medicaid fee-for-service claims only. Managed
              care (which accounts for a significant portion of Medicaid
              spending) is not included.
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
          <h2 className="mb-3 text-xl font-semibold text-gray-900">
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
