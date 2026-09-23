const { createServer } = require("node:http");
const next = require("next");

const fallbackPort = Number(process.env.PORT || 3000);
const hostname = "0.0.0.0";
const app = next({ dev: false, hostname, port: fallbackPort });
const handle = app.getRequestHandler();

if (typeof PhusionPassenger !== "undefined") {
  PhusionPassenger.configure({ autoInstall: false });
}

app.prepare()
  .then(() => {
    const server = createServer((req, res) => handle(req, res));
    const target = typeof PhusionPassenger !== "undefined" ? "passenger" : fallbackPort;

    server.listen(target, hostname, () => {
      console.log(
        typeof PhusionPassenger !== "undefined"
          ? "Autonomia public site listening through Passenger"
          : `Autonomia public site listening on ${hostname}:${fallbackPort}`
      );
    });
  })
  .catch((error) => {
    console.error("Failed to start Autonomia public site", error);
    process.exit(1);
  });
