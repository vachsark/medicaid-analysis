import Link from "next/link";
import { readJsonFile } from "@/lib/data-server";
import type { NationalData } from "@/lib/types";
import { formatCurrency, formatNumber } from "@/lib/format";
import { StatCard } from "@/components/ui/StatCard";
import { NationalCharts } from "./NationalCharts";
import { DATA_URL } from "@/lib/constants";

export default async function HomePage() {
  const data = await readJsonFile<NationalData>("/national.json");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Medicaid Provider Spending Explorer",
    description: `Interactive explorer for ${formatCurrency(data.headline.total_spending, true)} in Medicaid provider spending across ${formatNumber(data.headline.total_providers)} providers (${data.headline.data_range}).`,
    url: DATA_URL,
    license: "https://www.usa.gov/government-copyright",
    creator: {
      "@type": "Organization",
      name: "U.S. Department of Health & Human Services",
    },
    temporalCoverage: "2018/2024",
    variableMeasured: [
      "Total Medicaid Spending",
      "Number of Claims",
      "Unique Providers",
      "Unique Beneficiaries",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
            Medicaid Spending Explorer
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 sm:mt-2 sm:text-lg">
            Explore {formatCurrency(data.headline.total_spending, true)} in
            Medicaid provider spending across{" "}
            {formatNumber(data.headline.total_providers)} providers (
            {data.headline.data_range})
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Source:{" "}
            <a
              href={DATA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              HHS Medicaid Provider Spending Dataset
            </a>
          </p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-4 lg:grid-cols-4">
          <StatCard
            label="Total Spending"
            value={formatCurrency(data.headline.total_spending, true)}
            subtitle={data.headline.data_range}
          />
          <StatCard
            label="Total Claims"
            value={formatNumber(data.headline.total_claims, true)}
          />
          <StatCard
            label="Unique Providers"
            value={formatNumber(data.headline.total_providers, true)}
          />
          <StatCard
            label="States & Territories"
            value="54"
            subtitle="50 states + DC + territories"
          />
        </div>

        <div className="mb-6 flex flex-wrap gap-3 sm:mb-8">
          <Link
            href="/states/"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Explore by State
          </Link>
          <Link
            href="/providers/"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Search Providers
          </Link>
          <Link
            href="/procedures/"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Browse Procedures
          </Link>
        </div>

        <NationalCharts data={data} />
      </div>
    </>
  );
}
