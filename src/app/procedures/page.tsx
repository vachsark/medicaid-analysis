import { PageHeader } from "@/components/ui/PageHeader";
import { ProcedureSearchClient } from "./ProcedureSearchClient";

export const metadata = { title: "Procedures" };

export default function ProceduresPage() {
  return (
    <div>
      <PageHeader
        title="Procedure Explorer"
        subtitle="Browse all HCPCS procedure codes in the Medicaid spending dataset"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Procedures" }]}
      />
      <ProcedureSearchClient />
    </div>
  );
}
