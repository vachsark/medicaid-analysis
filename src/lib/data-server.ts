export async function readJsonFile<T>(relativePath: string): Promise<T> {
  const fs = await import("fs/promises");
  const path = await import("path");
  const filePath = path.join(process.cwd(), "public", "data", relativePath);
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
}
