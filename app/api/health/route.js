export async function GET() {
  return Response.json({
    ok: true,
    service: "autonomia-market-intelligence",
    version: "0.1.0",
    databaseConfigured: Boolean(
      (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      process.env.SUPABASE_SECRET_KEY
    ),
    authConfigured: Boolean(
      (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      process.env.SUPABASE_PUBLISHABLE_KEY
    ),
    timestamp: new Date().toISOString()
  });
}
