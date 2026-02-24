import type { Metadata } from "next";
import { readJsonFile } from "@/lib/data-server";
import type { StateDetail, StateIndexEntry } from "@/lib/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import { StateDetailCharts } from "./StateDetailCharts";

export async function generateStaticParams() {
  const states = await readJsonFile<StateIndexEntry[]>("/states/_index.json");
  return states.map((s) => ({ state: s.code }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state: code } = await params;
  const data = await readJsonFile<StateDetail>(`/states/${code}.json`);
  const h = data.headline;
  const desc = `${data.name} Medicaid spending: ${formatCurrency(h.total_paid, true)} across ${formatNumber(h.provider_count)} providers. Ranked #${h.national_rank} nationally (${h.national_pct}% of total).`;
  return {
    title: data.name,
    description: desc,
    openGraph: { title: `${data.name} — Medicaid Spending`, description: desc },
  } satisfies Metadata;
}

export default async function StateDetailPage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state: code } = await params;
  const data = await readJsonFile<StateDetail>(`/states/${code}.json`);
  const h = data.headline;

  return (
    <div>
      <PageHeader
        title={data.name}
        subtitle={`#${h.national_rank} in Medicaid spending (${h.national_pct}% of national total)`}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "States", href: "/states/" },
          { label: data.name },
        ]}
      />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Spending"
          value={formatCurrency(h.total_paid, true)}
        />
        <StatCard
          label="Total Claims"
          value={formatNumber(h.total_claims, true)}
        />
        <StatCard label="Providers" value={formatNumber(h.provider_count)} />
        <StatCard
          label="Avg Cost/Claim"
          value={formatCurrency(h.avg_per_claim)}
        />
      </div>

      <StateDetailCharts data={data} />
    </div>
  );
}
