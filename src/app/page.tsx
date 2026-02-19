import { readJsonFile } from "@/lib/data-server";
import type { NationalData } from "@/lib/types";
import { formatCurrency, formatNumber } from "@/lib/format";
import { StatCard } from "@/components/ui/StatCard";
import { NationalCharts } from "./NationalCharts";
import { DATA_URL } from "@/lib/constants";

export default async function HomePage() {
  const data = await readJsonFile<NationalData>("/national.json");

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Medicaid Spending Explorer
        </h1>
        <p className="mt-1 text-sm text-gray-600 sm:mt-2 sm:text-lg">
          Explore {formatCurrency(data.headline.total_spending, true)} in
          Medicaid provider spending across{" "}
          {formatNumber(data.headline.total_providers)} providers (
          {data.headline.data_range})
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Source:{" "}
          <a
            href={DATA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
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
          label="Data Rows"
          value={formatNumber(data.headline.total_rows, true)}
        />
      </div>

      <NationalCharts data={data} />
    </div>
  );
}
