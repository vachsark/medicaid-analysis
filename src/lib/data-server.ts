export async function readJsonFile<T>(relativePath: string): Promise<T> {
  const fs = await import("fs/promises");
  const path = await import("path");
  const filePath = path.join(process.cwd(), "public", "data", relativePath);
  let raw: string;
  try {
    raw = await fs.readFile(filePath, "utf-8");
  } catch (e) {
    throw new Error(
      `Failed to read data file ${relativePath}: ${e instanceof Error ? e.message : e}`,
    );
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    throw new Error(
      `Failed to parse JSON in ${relativePath}: ${e instanceof Error ? e.message : e}`,
    );
  }
}
