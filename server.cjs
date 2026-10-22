const { createServer } = require("node:http");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");

const RUNTIME_INTEGRATION_KEYS = new Set([
  "KASPR_API_KEY",
  "KASPR_DATA_TO_GET",
  "WAALAXY_API_KEY",
  "AUTONOMIA_WAALAXY_WEBHOOK_TOKEN",
  "AUTONOMIA_INBOUND_TOKEN",
  "AUTONOMIA_ACCOUNT_RESEARCH_ENABLED",
  "AUTONOMIA_DECISION_DISCOVERY_ENABLED"
]);

try {
  const runtimeFile = join(process.cwd(), ".runtime", "integration-settings.json");
  const parsed = JSON.parse(readFileSync(runtimeFile, "utf8"));
  for (const [key, value] of Object.entries(parsed?.values || {})) {
    if (RUNTIME_INTEGRATION_KEYS.has(key) && typeof value === "string" && value) {
      process.env[key] = value;
    }
  }
} catch {
  // Runtime integration settings are optional.
}


// o2switch/Passenger runtime bridge: keep server-only config dynamic after build.
if (!process.env.SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL) {
  process.env.SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
}
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, dir: process.cwd() });
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    if (typeof PhusionPassenger !== "undefined") {
      PhusionPassenger.configure({ autoInstall: false });
    }

    const server = createServer((req, res) => handle(req, res));

    if (typeof PhusionPassenger !== "undefined") {
      server.listen("passenger");
    } else {
      const port = Number(process.env.PORT || 3000);
      server.listen(port, "0.0.0.0", () => {
        console.log(`Autonomia cockpit listening on http://0.0.0.0:${port}`);
      });
    }
  })
  .catch((error) => {
    console.error("Autonomia cockpit startup failed", error);
    process.exit(1);
  });
