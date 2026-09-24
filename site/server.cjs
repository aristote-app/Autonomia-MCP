const { createServer } = require("node:http");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");

function loadInboundToken() {
  const candidates = [
    join(process.cwd(), ".runtime", "integration-settings.json"),
    join(process.cwd(), "..", ".runtime", "integration-settings.json"),
    "/home/dide4169/autonomia-cockpit-app/.runtime/integration-settings.json"
  ];

  for (const runtimeFile of candidates) {
    try {
      const parsed = JSON.parse(readFileSync(runtimeFile, "utf8"));
      const token = parsed?.values?.AUTONOMIA_INBOUND_TOKEN;
      if (typeof token === "string" && token) {
        if (!process.env.AUTONOMIA_INBOUND_TOKEN) {
          process.env.AUTONOMIA_INBOUND_TOKEN = token;
        }
        return;
      }
    } catch {}
  }
}

loadInboundToken();

if (!process.env.AUTONOMIA_INBOUND_URL) {
  process.env.AUTONOMIA_INBOUND_URL =
    "https://cockpit.build-autonomia.com/api/inbound/leads";
}

const fallbackPort = Number(process.env.PORT || 3000);
const hostname = "0.0.0.0";
const next = require("next");
const app = next({ dev: false, hostname, port: fallbackPort });
const handle = app.getRequestHandler();

if (typeof PhusionPassenger !== "undefined") {
  PhusionPassenger.configure({ autoInstall: false });
}

app.prepare()
  .then(() => {
    const server = createServer((req, res) => handle(req, res));

    if (typeof PhusionPassenger !== "undefined") {
      server.listen("passenger", () => {
        console.log("Autonomia public site listening through Passenger");
      });
      return;
    }

    server.listen(fallbackPort, hostname, () => {
      console.log(`Autonomia public site listening on ${hostname}:${fallbackPort}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start Autonomia public site", error);
    process.exit(1);
  });
