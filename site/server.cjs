const { createServer } = require("node:http");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");

try {
  const runtimeFile = join(process.cwd(), "..", ".runtime", "integration-settings.json");
  const parsed = JSON.parse(readFileSync(runtimeFile, "utf8"));
  const token = parsed?.values?.AUTONOMIA_INBOUND_TOKEN;

  if (!process.env.AUTONOMIA_INBOUND_TOKEN && typeof token === "string" && token) {
    process.env.AUTONOMIA_INBOUND_TOKEN = token;
  }
} catch {
  // Public site startup must not fail if inbound integration is not configured yet.
}

if (!process.env.AUTONOMIA_INBOUND_URL) {
  process.env.AUTONOMIA_INBOUND_URL =
    "https://cockpit.build-autonomia.com/api/inbound/leads";
}

const next = require("next");

const port = Number(process.env.PORT || 3000);
const hostname = "0.0.0.0";
const app = next({ dev: false, hostname, port });
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    createServer((req, res) => handle(req, res)).listen(port, hostname, () => {
      console.log(`Autonomia public site listening on ${hostname}:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start Autonomia public site", error);
    process.exit(1);
  });
