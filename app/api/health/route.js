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
    jobDiscoveryConfigured: Boolean(process.env.BRAVE_SEARCH_API_KEY),
    franceTravailConfigured: Boolean(
      process.env.FRANCE_TRAVAIL_CLIENT_ID &&
      process.env.FRANCE_TRAVAIL_CLIENT_SECRET
    ),
    accountResearchConfigured:
      process.env.AUTONOMIA_ACCOUNT_RESEARCH_ENABLED === "true" &&
      Boolean(process.env.BRAVE_SEARCH_API_KEY),
    kasprConfigured: Boolean(process.env.KASPR_API_KEY),
    waalaxyConfigured: Boolean(process.env.WAALAXY_API_KEY),
    timestamp: new Date().toISOString()
  });
}
