import { readFile } from "node:fs/promises";
import { join } from "node:path";

export async function GET() {
  const deployedSha = await readFile(
    join(process.cwd(), ".runtime", "deployed-sha"),
    "utf8"
  ).then((value) => value.trim()).catch(() => null);

  return Response.json({
    deployedSha,
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
    kasprEnrichmentConfigured: Boolean(
      process.env.KASPR_API_KEY &&
      String(process.env.KASPR_DATA_TO_GET || "").trim()
    ),
    waalaxyConfigured: Boolean(process.env.WAALAXY_API_KEY),
    waalaxyReplyWebhookConfigured: Boolean(process.env.AUTONOMIA_WAALAXY_WEBHOOK_TOKEN),
    selfDeployConfigured: true,
    selfDeployAuthMode: "github_oidc",
    legacySelfDeployConfigured:
      process.env.AUTONOMIA_SELF_DEPLOY_ENABLED === "true" &&
      Boolean(process.env.AUTONOMIA_INTERNAL_TOKEN),
    timestamp: new Date().toISOString()
  });
}
