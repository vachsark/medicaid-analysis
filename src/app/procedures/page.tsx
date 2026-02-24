import { readJsonFile } from "@/lib/data-server";
import type { ProcedureIndexEntry, ProcedureCategory } from "@/lib/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProcedureSearchClient } from "./ProcedureSearchClient";

export const metadata = { title: "Procedures" };

export default async function ProceduresPage() {
  const [procedures, categories] = await Promise.all([
    readJsonFile<ProcedureIndexEntry[]>("/procedures/_index.json"),
    readJsonFile<ProcedureCategory[]>("/procedures/categories.json").catch(
      () => [] as ProcedureCategory[],
    ),
  ]);

  return (
    <div>
      <PageHeader
        title="Procedure Explorer"
        subtitle="Browse all HCPCS procedure codes in the Medicaid spending dataset"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Procedures" }]}
      />
      <ProcedureSearchClient
        initialProcedures={procedures}
        initialCategories={categories}
      />
    </div>
  );
}
