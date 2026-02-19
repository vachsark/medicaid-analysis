import { readJsonFile } from "@/lib/data";
import type { ProcedureProfile, ProcedureIndexEntry } from "@/lib/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { formatCurrency, formatNumber } from "@/lib/format";
import { ProcedureDetailCharts } from "./ProcedureDetailCharts";

export async function generateStaticParams() {
  // We generate pages for top 500 procedures (those with individual JSON files)
  const index = await readJsonFile<ProcedureIndexEntry[]>(
    "/procedures/_index.json",
  );
  return index.slice(0, 500).map((p) => ({ code: p.code }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  try {
    const data = await readJsonFile<ProcedureProfile>(
      `/procedures/${code}.json`,
    );
    return { title: `${data.code} — ${data.description}` };
  } catch {
    return { title: `Procedure ${code}` };
  }
}

export default async function ProcedureDetailPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  let data: ProcedureProfile;
  try {
    data = await readJsonFile<ProcedureProfile>(`/procedures/${code}.json`);
  } catch {
    return (
      <div>
        <PageHeader
          title={`Procedure ${code}`}
          subtitle="Detailed profile not available for this procedure"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Procedures", href: "/procedures/" },
            { label: code },
          ]}
        />
        <p className="text-gray-500">
          Only the top 500 procedures have detailed profiles. Use the{" "}
          <a href="/procedures/" className="text-blue-600 underline">
            procedure explorer
          </a>{" "}
          to browse all codes.
        </p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={`${data.code} — ${data.description}`}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Procedures", href: "/procedures/" },
          { label: data.code },
        ]}
      />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Total Spending"
          value={formatCurrency(data.total_paid, true)}
        />
        <StatCard
          label="Total Claims"
          value={formatNumber(data.total_claims, true)}
        />
        <StatCard
          label="Avg Cost/Claim"
          value={formatCurrency(
            data.total_claims > 0 ? data.total_paid / data.total_claims : 0,
          )}
        />
      </div>

      <ProcedureDetailCharts data={data} />
    </div>
  );
}
