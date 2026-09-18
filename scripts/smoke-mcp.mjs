import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";
import { autonomiaMcpHandler } from "../lib/mcp/handler.js";

async function main() {
  const transport = new StreamableHTTPClientTransport(
    new URL("http://autonomia.local/mcp"),
    {
      fetch: (url, init) => autonomiaMcpHandler.fetch(new Request(url, init))
    }
  );

  const client = new Client({
    name: "autonomia-ci-client",
    version: "0.1.0"
  });

  await client.connect(transport);

  const tools = await client.listTools();
  const names = tools.tools.map((tool) => tool.name);
  console.log("MCP TOOLS", names);

  for (const required of ["list_sources", "search_public_tenders", "refresh_market", "market_stats", "explain_data"]) {
    if (!names.includes(required)) throw new Error(`Missing MCP tool: ${required}`);
  }

  const result = await client.callTool({
    name: "market_stats",
    arguments: { query: "intelligence artificielle" }
  });

  console.log("MCP MARKET_STATS", JSON.stringify(result.content).slice(0, 1200));

  if (!Array.isArray(result.content) || result.content.length === 0) {
    throw new Error("market_stats returned no content");
  }

  await client.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
