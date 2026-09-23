import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { compactSeoGeoSnapshot } from "./refresh.js";

const RUNTIME_DIR = join(process.cwd(), ".runtime");
const SNAPSHOT_FILE = join(RUNTIME_DIR, "seo-geo-latest.json");

export async function readSeoGeoSnapshot() {
  try {
    const raw = await readFile(SNAPSHOT_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function writeSeoGeoSnapshot(data) {
  await mkdir(RUNTIME_DIR, { recursive: true });
  const payload = compactSeoGeoSnapshot(data);
  const temp = `${SNAPSHOT_FILE}.tmp`;
  await writeFile(temp, JSON.stringify(payload, null, 2), "utf8");
  await rename(temp, SNAPSHOT_FILE);
  return payload;
}

export function seoGeoSnapshotPath() {
  return SNAPSHOT_FILE;
}
