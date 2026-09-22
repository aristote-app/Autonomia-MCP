const { createServer } = require("node:http");
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
