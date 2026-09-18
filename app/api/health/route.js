export async function GET() {
  return Response.json({
    ok: true,
    service: "autonomia-market-intelligence",
    version: "0.1.0",
    timestamp: new Date().toISOString()
  });
}
