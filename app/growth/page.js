import Link from "next/link";
import { getCurrentWorkspaceMembership } from "../../lib/auth/access.js";
import { hasAutonomiaDatabase } from "../../lib/db/supabase.js";
import { loadAccountIntelligence } from "../../lib/db/accountIntelligence.js";
import { listWorkspaceSalesContacts } from "../../lib/db/salesContacts.js";
import { listInboundLeads } from "../../lib/db/inboundLeads.js";
import { searchJobSignals } from "../../lib/db/jobSignals.js";
import { buildGrowthPlays, growthStats } from "../../lib/intelligence/growthEngine.js";
import { runtimeIntegrationStatus } from "../../lib/runtime/integrationSettings.js";
import ControlTower from "./ControlTower.js";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Growth Intelligence · AUTONOMIA",
  robots: { index: false, follow: false }
};

const SOURCE_CATALOG = [
  { id: "linkedin", label: "LinkedIn Jobs", initial: "in", method: "Annonces via résultats indexés publiquement", category: "job", stage: "connected_code" },
  { id: "indeed", label: "Indeed", initial: "Id", method: "Annonces via résultats indexés publiquement", category: "job", stage: "connected_code" },
  { id: "france_travail_jobs", label: "France Travail", initial: "FT", method: "API officielle des offres d'emploi ; identifiants requis", category: "public", stage: "connected_code" },
  { id: "welcome_to_the_jungle", label: "Welcome to the Jungle", initial: "WJ", method: "Index web et sites carrières autorisés", category: "job", stage: "connected_code" },
  { id: "apec", label: "Apec", initial: "Ap", method: "Annonces cadres via index web public", category: "job", stage: "connected_code" },
  { id: "hellowork", label: "HelloWork", initial: "HW", method: "Offres indexées publiquement", category: "job", stage: "connected_code" },
  { id: "greenhouse", label: "Greenhouse", initial: "Gh", method: "API d'annonces publiques des employeurs", category: "direct", stage: "planned" },
  { id: "lever", label: "Lever", initial: "Lv", method: "Pages carrières des employeurs", category: "direct", stage: "planned" },
  { id: "ashby", label: "Ashby", initial: "As", method: "Job boards publics des entreprises", category: "direct", stage: "planned" },
  { id: "smartrecruiters", label: "SmartRecruiters", initial: "Sr", method: "Offres des grands comptes et ETI", category: "direct", stage: "planned" },
  { id: "teamtailor", label: "Teamtailor", initial: "Tt", method: "Pages carrières et flux ouverts", category: "direct", stage: "planned" },
  { id: "recruitee", label: "Recruitee", initial: "Rc", method: "Job boards des entreprises", category: "direct", stage: "planned" }
];

function sourceActivity(rows) {
  const activity = new Map();
  for (const row of rows || []) {
    const id = String(row.source_id || "");
    if (!id) continue;
    const current = activity.get(id) || { count: 0, latest: null };
    current.count += 1;
    const next = row.last_seen_at || row.published_at || null;
    if (next && (!current.latest || new Date(next) > new Date(current.latest))) current.latest = next;
    activity.set(id, current);
  }
  return SOURCE_CATALOG.map(source => ({
    ...source,
    count: activity.get(source.id)?.count || 0,
    latest: activity.get(source.id)?.latest || null
  }));
}

export default async function GrowthPage() {
  const context = await getCurrentWorkspaceMembership().catch(() => null);
  const authorized = Boolean(context?.claims?.sub && context?.membership?.workspace_id);
  if (!authorized || !hasAutonomiaDatabase()) {
    return <main style={{ maxWidth: 760, margin: "48px auto", padding: 24, color: "#16384e" }}>
      <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".15em", color: "#167e9b" }}>AUTONOMIA / GROWTH INTELLIGENCE</p>
      <h1 style={{ fontSize: "clamp(32px,5vw,52px)", letterSpacing: "-.05em" }}>Votre centre d'acquisition sécurisé</h1>
      <p style={{ lineHeight: 1.7 }}>Connecte-toi à ton espace AUTONOMIA pour voir les opportunités et les contacts de ton organisation. Aucun dossier privé ne s'affiche sans authentification.</p>
      <Link href="/login" style={{ display: "inline-block", marginTop: 18, background: "#13455f", color: "#fff", padding: "13px 20px", borderRadius: 10, textDecoration: "none", fontWeight: 800 }}>Se connecter →</Link>
    </main>;
  }

  const workspaceId = context.membership.workspace_id;
  const [accountResult, contacts, inbound, jobData, runtimeState] = await Promise.all([
    loadAccountIntelligence({ limit: 500 }).catch(() => null),
    listWorkspaceSalesContacts({ workspaceId, limit: 500 }).catch(() => []),
    listInboundLeads({ workspaceId, limit: 500 }).catch(() => []),
    searchJobSignals({ sources: ["linkedin", "indeed", "france_travail_jobs", "welcome_to_the_jungle", "apec", "hellowork"], franceOnly: false, limit: 500 }).catch(() => ({ items: [] })),
    runtimeIntegrationStatus().catch(() => null)
  ]);

  const accounts = accountResult?.accounts || [];
  const ready = {
    waalaxy: Boolean(process.env.WAALAXY_API_KEY || runtimeState?.configured?.WAALAXY_API_KEY),
    kaspr: Boolean(process.env.KASPR_API_KEY || runtimeState?.configured?.KASPR_API_KEY),
    brave: Boolean(process.env.BRAVE_SEARCH_API_KEY),
    franceTravail: Boolean(process.env.FRANCE_TRAVAIL_CLIENT_ID && process.env.FRANCE_TRAVAIL_CLIENT_SECRET)
  };
  const plays = buildGrowthPlays({ accounts, contacts, waalaxyReady: ready.waalaxy, limit: 400 });

  return <ControlTower
    overview={growthStats({ accounts, contacts, inbound })}
    plays={plays}
    signals={jobData.items || []}
    sources={sourceActivity(jobData.items || [])}
    connections={ready}
    generatedAt={new Date().toISOString()}
  />;
}
