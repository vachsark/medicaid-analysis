import { readJsonFile } from "@/lib/data-server";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProviderSearchClient } from "./ProviderSearchClient";

export const metadata = { title: "Providers" };

export default async function ProvidersPage() {
  const profileNpis = await readJsonFile<string[]>(
    "/providers/profiles/_index.json",
  );

  return (
    <div>
      <PageHeader
        title="Provider Search"
        subtitle="Search 617K+ Medicaid providers by name or NPI"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Providers" }]}
      />
      <ProviderSearchClient profileNpis={profileNpis} />
    </div>
  );
}
