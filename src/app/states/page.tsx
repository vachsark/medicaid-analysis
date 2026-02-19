import { readJsonFile } from "@/lib/data-server";
import type { StateIndexEntry } from "@/lib/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatesOverview } from "./StatesOverview";

export const metadata = { title: "States" };

export default async function StatesPage() {
  const states = await readJsonFile<StateIndexEntry[]>("/states/_index.json");

  return (
    <div>
      <PageHeader
        title="States"
        subtitle="Compare Medicaid spending across all U.S. states and territories"
      />
      <StatesOverview states={states} />
    </div>
  );
}
