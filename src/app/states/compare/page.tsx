import { readJsonFile } from "@/lib/data-server";
import type { StateIndexEntry } from "@/lib/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { CompareClient } from "./CompareClient";

export const metadata = { title: "Compare States" };

export default async function CompareStatesPage() {
  const states = await readJsonFile<StateIndexEntry[]>("/states/_index.json");

  return (
    <div>
      <PageHeader
        title="Compare States"
        subtitle="Side-by-side comparison of Medicaid spending across states"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "States", href: "/states/" },
          { label: "Compare" },
        ]}
      />
      <CompareClient states={states} />
    </div>
  );
}
