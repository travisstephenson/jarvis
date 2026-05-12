import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

export async function ensureRunDir(runId: string): Promise<string> {
  const dir = join(process.cwd(), "output", runId);
  await mkdir(dir, { recursive: true });
  return dir;
}

export async function writeJson(path: string, data: unknown): Promise<void> {
  await writeFile(path, JSON.stringify(data, null, 2), "utf-8");
}

export async function writeText(path: string, data: string): Promise<void> {
  await writeFile(path, data, "utf-8");
}

export async function writeBinary(path: string, data: Buffer): Promise<void> {
  await writeFile(path, data);
}
