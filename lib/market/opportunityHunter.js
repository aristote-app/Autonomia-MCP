import { isExcludedCommercialCompany, personalLinkedInProfileUrl } from "../intelligence/commercialLeadPolicy.js";
import { searchJobSignals } from "../db/jobSignals.js";
import { getAutonomiaWorkspace } from "../db/inboundLeads.js";
import {
  saveSalesContactCandidate,
  listSalesContacts
} from "../db/salesContacts.js";
import { resolveFrenchCompanyRegistry } from "../collectors/companyRegistry.js";
import { discoverDecisionMakers } from "../collectors/decisionMakers.js";
import { evidenceMatchesStoredEmployer, plausibleEmployerName } from "../collectors/employerEvidence.js";

const INTERMEDIARY_NAF = [
  // Temporary staffing / recruitment activities. IT consulting (62.02) and
  // management consulting (70.22) are NOT proof of intermediary status.
  /^78(?:\.|$)/
];

function slugify(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

function isRegistryEndClient(registry) {
  const best = registry?.best;
  if (!best || best.active !== true || Number(best.score || 0) < 90) return false;
  if (!["exact", "strong"].includes(best.match_status)) return false;
  const naf = String(best.naf || "");
  return !INTERMEDIARY_NAF.some((pattern) => pattern.test(naf));
}

const VERIFIED_SOURCES = Object.freeze({
  linkedin: /^https:\/\/(?:fr\.)?linkedin\.com\/jobs\/view/i,
  indeed: /^https:\/\/fr\.indeed\.com\/viewjob/i,
  welcome_to_the_jungle: /^https:\/\/www\.welcometothejungle\.com\/fr\/companies\/[^/]+\/jobs\//i,
  apec: /^https:\/\/www\.apec\.fr\/candidat\/recherche-emploi\.html\/emploi\/detail-offre\//i,
  hellowork: /^https:\/\/www\.hellowork\.com\/fr-fr\/emplois\/\d+\.html/i
});
const SAFE_VERSIONS = new Set(["verified_employer_v10", "multi_job_sources_v9", "linkedin_indeed_ai_terms_v8"]);

export function isEligibleRecruitmentSignal(signal) {
  const company = plausibleEmployerName(signal?.company_name);
  const source = String(signal?.source_id || "");
  const raw = signal?.raw_payload || {};
  return Boolean(
    company &&
    !isExcludedCommercialCompany(company) &&
    VERIFIED_SOURCES[source]?.test(String(signal?.source_url || "")) &&
    SAFE_VERSIONS.has(raw.discovery_version) &&
    raw.france_evidence === true &&
    raw.intermediary_risk !== true &&
    !(signal?.signal_keys || []).includes("intermediary_risk") &&
    evidenceMatchesStoredEmployer(signal)
  );
}

export function decisionRolesFor(signal) {
  const title = String(signal?.title || "");
  if (/formation|learning|L&D|acculturation|adoption|d[eé]veloppement des comp[eé]tences|talent development/i.test(title)) {
    return ["Responsable formation", "Learning and Development"];
  }
  if (/data scientist|machine learning|mlops|data engineer/i.test(title)) {
    return ["Head of Data", "CTO"];
  }
  if (/product|transformation|gouvernance/i.test(title)) {
    return ["Head of AI", "DSI"];
  }
  return ["Head of AI", "CTO"];
}

function offerTrackFor(signal) {
  return /formation|learning|L&D|acculturation|adoption|d[eé]veloppement des comp[eé]tences|talent development/i.test(String(signal?.title || ""))
    ? "AUTONOMIA ACADEMY" : "AUTONOMIA EXPERTS";
}

function normalizeCompanyKey(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
}
export function rankRecruitmentSignals(items = [], {limit = 6} = {}) {
  const seen = new Map();
  for (const signal of items) {
    if (!isEligibleRecruitmentSignal(signal)) continue;
    const raw = signal.raw_payload || {};
    const sourceProof = raw.company_evidence_source;
    const proofWeight = sourceProof === "title_employer" ? 45
      : sourceProof === "explicit_employer_label" ? 35
      : sourceProof === "employer_career_slug" ? 25 : 20;
    const title = String(signal.title || "");
    const academy = /formation|learning|L&D|acculturation|adoption/i.test(title);
    const important = /engineer|scientist|mlops|data|RAG|LLM|agentic|responsable|formation|copilot/i.test(title);
    const internship = /stage|internship|alternance|apprenticeship/i.test(title);
    const published = Date.parse(signal.published_at || "");
    const age = Number.isFinite(published) ? Math.max(0, (Date.now()-published)/86400000) : 999;
    const priority = proofWeight + (important ? 15 : 0) + (academy ? 10 : 0)
      - (internship ? 25 : 0) + (age <= 14 ? 10 : age <= 45 ? 4 : 0);
    const key = normalizeCompanyKey(signal.company_name);
    const previous = seen.get(key);
    if (!previous || previous.priority < priority || (previous.priority === priority && 
        String(previous.signal.last_seen_at || "") < String(signal.last_seen_at || ""))) {
      seen.set(key, {signal, priority});
    }
  }
  return [...seen.values()].sort((a,b)=>b.priority-a.priority ||
    String(b.signal.last_seen_at || "").localeCompare(String(a.signal.last_seen_at || "")))
    .slice(0, Math.min(500, Math.max(1,Number(limit)||6))).map(x=>x.signal);
}

export async function runOpportunityHunter({
  maxAccounts = Number(process.env.AUTONOMIA_OPPORTUNITY_HUNTER_MAX_ACCOUNTS || 3),
  maxPhoneFallbacks = Number(process.env.AUTONOMIA_OPPORTUNITY_HUNTER_PHONE_FALLBACKS || 1)
} = {}) {
  const workspace = await getAutonomiaWorkspace();
  if (!workspace?.id) {
    return { available: false, reason: "Autonomia workspace unavailable" };
  }

  const result = await searchJobSignals({
    sources: ["linkedin", "indeed"],
    franceOnly: false,
    limit: 500
  });

  const eligibleSignals = rankRecruitmentSignals(result.items || [], { limit: maxAccounts });

  const accounts = [];
  let phoneFallbacksUsed = 0;
  let candidatesSaved = 0;
  let candidateSaveErrors = 0;

  for (const signal of eligibleSignals) {
    const registry = await resolveFrenchCompanyRegistry(signal.company_name, {
      perPage: 5
    }).catch(() => null);

    const registryVerified = isRegistryEndClient(registry);
    const best = registry?.best || null;

    const account = {
      company: signal.company_name,
      source: signal.source_id,
      job_title: signal.title,
      job_url: signal.source_url,
      registry_verified: registryVerified,
      registry_score: best?.score || null,
      registry_naf: best?.naf || null,
      decision_candidates: 0,
      contact_candidates_saved: 0,
      auto_verified_contacts: 0,
      kaspr_email_found: 0,
      kaspr_phone_found: 0,
      skipped_reason: null
    };

    if (!registryVerified) {
      account.skipped_reason = "end_client_registry_gate";
      accounts.push(account);
      continue;
    }

    const accountKey = slugify(signal.company_name);
    const existingContacts = await listSalesContacts({
      workspaceId: workspace.id,
      accountKey,
      limit: 20
    }).catch(() => []);

    const readyContact = existingContacts.find(
      (contact) =>
        contact.verification_status === "verified" &&
        !contact.do_not_contact &&
        Boolean(personalLinkedInProfileUrl(contact.linkedin_url))
    );

    if (readyContact) {
      account.skipped_reason = "ready_contact_already_available";
      account.auto_verified_contacts = 1;
      account.kaspr_email_found = readyContact.email_b2b ? 1 : 0;
      account.kaspr_phone_found = readyContact.phone ? 1 : 0;
      accounts.push(account);
      continue;
    }

    const discovery = await discoverDecisionMakers({
      company: signal.company_name,
      roles: decisionRolesFor(signal),
      maxRoles: 2,
      countPerRole: 5
    }).catch(() => ({ candidates: [] }));

    const candidates = (discovery.candidates || [])
      .filter((candidate) =>
        candidate?.linkedin_url &&
        candidate?.name_guess &&
        Number(candidate.relevance_score || 0) >= 85
      )
      .slice(0, 2);

    account.decision_candidates = candidates.length;

    for (const candidate of candidates) {
      try {
      const contact = await saveSalesContactCandidate({
        workspaceId: workspace.id,
        actorUserId: null,
        accountKey,
        accountName: signal.company_name,
        candidate,
        trigger: {
          title: signal.title,
          url: signal.source_url
        },
        commercialContext: {
          offer_track: offerTrackFor(signal),
          trigger_source: signal.source_id,
          account_type: "end_client",
          verification_mode: "candidate_awaiting_human_review",
          end_client_verified: true,
          end_client_proof: signal.source_url,
          registry_siren: best?.siren || null,
          registry_naf: best?.naf || null
        }
      });

      // A web-indexed LinkedIn candidate is not proof of current employment.
      // Save a ready-to-review file; never auto-verify or spend Kaspr credits
      // or initiate outreach solely from a search snippet.
      if (contact.verification_status === "verified") {
        account.auto_verified_contacts += 1; // Previously reviewed, not newly auto-approved.
      } else {
        account.contact_candidates_saved = (account.contact_candidates_saved || 0) + 1;
        candidatesSaved += 1;
      }
      } catch (error) {
        // An invalid/duplicate profile or a PostgREST error must not prevent
        // the remaining genuine employers from being qualified. Do not expose
        // names, profile URLs, request headers or contact data in diagnostics.
        candidateSaveErrors += 1;
        account.contact_save_errors = (account.contact_save_errors || 0) + 1;
        account.contact_save_error_code =
          typeof error?.code === "string" && /^[A-Z0-9_]{1,20}$/i.test(error.code)
            ? error.code : "CONTACT_WRITE_FAILED";
      }
    }

    accounts.push(account);
  }

  return {
    available: true,
    scannedSignals: result.items?.length || 0,
    directEmployerCandidates: rankRecruitmentSignals(result.items || [], {limit: 500}).length,
    processedAccounts: accounts.length,
    endClientsVerified: accounts.filter((item) => item.registry_verified).length,
    autoVerifiedContacts: accounts.reduce(
      (sum, item) => sum + item.auto_verified_contacts,
      0
    ),
    kasprEmailsFound: accounts.reduce(
      (sum, item) => sum + item.kaspr_email_found,
      0
    ),
    kasprPhonesFound: accounts.reduce(
      (sum, item) => sum + item.kaspr_phone_found,
      0
    ),
    phoneFallbacksUsed,
    contactCandidatesSaved: candidatesSaved,
    pendingHumanVerification: candidatesSaved,
    candidateSaveErrors,
    accounts
  };
}
