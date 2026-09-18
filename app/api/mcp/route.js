import { autonomiaMcpHandler } from "../../../lib/mcp/handler.js";
import { requireInternalToken } from "../../../lib/security.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  const auth = requireInternalToken(request);
  if (!auth.ok) return auth.response;
  return autonomiaMcpHandler.fetch(request);
}

export async function GET() {
  return Response.json(
    {
      service: "autonomia-market-intelligence-mcp",
      protocol: "MCP Streamable HTTP",
      message: "Use POST for MCP requests."
    },
    { status: 405, headers: { Allow: "POST" } }
  );
}
