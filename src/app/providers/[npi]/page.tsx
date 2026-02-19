import { readJsonFile } from "@/lib/data";
import type { ProviderProfile } from "@/lib/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { formatCurrency, formatNumber } from "@/lib/format";
import { getStateName } from "@/lib/states";
import { ProviderDetailCharts } from "./ProviderDetailCharts";

export async function generateStaticParams() {
  const profiles = await readJsonFile<ProviderProfile[]>(
    "/providers/top1000.json",
  );
  return profiles.map((p) => ({ npi: p.npi }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ npi: string }>;
}) {
  const { npi } = await params;
  const profiles = await readJsonFile<ProviderProfile[]>(
    "/providers/top1000.json",
  );
  const provider = profiles.find((p) => p.npi === npi);
  return { title: provider?.name ?? `Provider ${npi}` };
}

export default async function ProviderDetailPage({
  params,
}: {
  params: Promise<{ npi: string }>;
}) {
  const { npi } = await params;
  const profiles = await readJsonFile<ProviderProfile[]>(
    "/providers/top1000.json",
  );
  const provider = profiles.find((p) => p.npi === npi);

  if (!provider) {
    return (
      <div>
        <PageHeader
          title={`Provider ${npi}`}
          subtitle="Detailed profile not available for this provider"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Providers", href: "/providers/" },
            { label: npi },
          ]}
        />
        <p className="text-gray-500">
          Only the top 1,000 providers have detailed profiles. Use the{" "}
          <a href="/providers/" className="text-blue-600 underline">
            search page
          </a>{" "}
          to find summary data for all providers.
        </p>
      </div>
    );
  }

  const location = [
    provider.city,
    provider.state && getStateName(provider.state),
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div>
      <PageHeader
        title={provider.name}
        subtitle={`${provider.classification} — ${location}`}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Providers", href: "/providers/" },
          { label: provider.name },
        ]}
      />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Spending"
          value={formatCurrency(provider.total_paid, true)}
        />
        <StatCard
          label="Total Claims"
          value={formatNumber(provider.total_claims, true)}
        />
        <StatCard
          label="Procedures Billed"
          value={formatNumber(provider.distinct_procedures)}
        />
        <StatCard label="NPI" value={provider.npi} />
      </div>

      <ProviderDetailCharts provider={provider} />
    </div>
  );
}
