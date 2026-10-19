import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { personalLinkedInProfileUrl } from "./commercialLeadPolicy.js";

export function decisionCompanyKey(company) {
  return String(company || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/&/g, " et ").replace(/[^a-z0-9]+/g, " ").trim();
}

const snapshotPath = () => join(process.cwd(), ".runtime", "decision-makers-latest.json");

export async function readDecisionMakerSnapshot() {
  try {
    const data = JSON.parse(await readFile(snapshotPath(), "utf8"));
    return data?.version === 1 && data.accounts ? data : { version: 1, accounts: {} };
  } catch {
    return { version: 1, accounts: {} };
  }
}

export async function writeDecisionMakerSnapshot(snapshot) {
  const path = snapshotPath();
  await mkdir(join(process.cwd(), ".runtime"), { recursive: true });
  const temporary = `${path}.${process.pid}.tmp`;
  await writeFile(temporary, JSON.stringify(snapshot), "utf8");
  await rename(temporary, path);
}

export function getSnapshotCandidate(snapshot, company, { now = Date.now(), minScore = 0 } = {}) {
  const entry = snapshot?.accounts?.[decisionCompanyKey(company)];
  const checkedAt = Date.parse(entry?.checkedAt || "");
  if (!Number.isFinite(checkedAt) || checkedAt > now || now - checkedAt > 14 * 86400000) return null;
  return (entry.candidates || [])
    .filter(candidate =>
      candidate.name_guess &&
      personalLinkedInProfileUrl(candidate.linkedin_url) &&
      Number(candidate.relevance_score || 0) >= minScore
    )
    .sort((a, b) => Number(b.relevance_score || 0) - Number(a.relevance_score || 0))[0] || null;
}
