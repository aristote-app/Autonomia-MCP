import { randomBytes } from "node:crypto";
import { chmod, mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const file = join(process.cwd(), ".runtime", "integration-settings.json");

async function readState() {
  try {
    const parsed = JSON.parse(await readFile(file, "utf8"));
    return {
      version: 1,
      updated_at: parsed?.updated_at || null,
      values: parsed?.values && typeof parsed.values === "object" ? parsed.values : {}
    };
  } catch {
    return { version: 1, updated_at: null, values: {} };
  }
}

const state = await readState();

if (typeof state.values.AUTONOMIA_INBOUND_TOKEN === "string" && state.values.AUTONOMIA_INBOUND_TOKEN) {
  console.log("Inbound token already configured.");
  process.exit(0);
}

state.values.AUTONOMIA_INBOUND_TOKEN = randomBytes(32).toString("base64url");
state.updated_at = new Date().toISOString();

await mkdir(dirname(file), { recursive: true });
const temp = file + ".tmp";
await writeFile(temp, JSON.stringify(state, null, 2) + "\n", {
  encoding: "utf8",
  mode: 0o600
});
await chmod(temp, 0o600);
await rename(temp, file);
await chmod(file, 0o600);

console.log("Inbound token generated and stored in .runtime/integration-settings.json.");
