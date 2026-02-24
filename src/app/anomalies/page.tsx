import { readJsonFile } from "@/lib/data-server";
import type { ProviderAnomaly } from "@/lib/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { AnomaliesClient } from "./AnomaliesClient";

export const metadata = {
  title: "Outlier Providers",
  description:
    "Medicaid providers with unusually high per-claim costs relative to their specialty peers, identified by z-score analysis.",
};

export default async function AnomaliesPage() {
  const anomalies = await readJsonFile<ProviderAnomaly[]>(
    "/providers/anomalies.json",
  );

  return (
    <div>
      <PageHeader
        title="Outlier Providers"
        subtitle="Providers whose average cost per claim is significantly above their specialty peers"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Outlier Providers" },
        ]}
      />
      <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
        <strong>How to interpret:</strong> These providers have average
        per-claim costs significantly above their specialty peers (z-score &gt;
        2). This may indicate billing anomalies, high-acuity patients, specialty
        services, or data reporting differences. A high z-score alone does not
        indicate fraud or waste.
      </div>
      <AnomaliesClient anomalies={anomalies} />
    </div>
  );
}
