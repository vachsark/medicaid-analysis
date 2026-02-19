import { PageHeader } from "@/components/ui/PageHeader";
import { ProviderSearchClient } from "./ProviderSearchClient";

export const metadata = { title: "Providers" };

export default function ProvidersPage() {
  return (
    <div>
      <PageHeader
        title="Provider Search"
        subtitle="Search 617K+ Medicaid providers by name or NPI"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Providers" }]}
      />
      <ProviderSearchClient />
    </div>
  );
}
