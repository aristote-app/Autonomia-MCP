import { searchJobSignals } from "../db/jobSignals.js";
import { getAutonomiaWorkspace } from "../db/inboundLeads.js";
import {
  saveSalesContactCandidate,
  setSalesContactVerification,
  markSalesContactEnrichmentRequested,
  applySalesContactKasprResult,
  listSalesContacts
} from "../db/salesContacts.js";
import { resolveFrenchCompanyRegistry } from "../collectors/companyRegistry.js";
import { discoverDecisionMakers } from "../collectors/decisionMakers.js";
import {
  enrichKasprLinkedInProfile,
  extractKasprContactData
} from "../integrations/kaspr.js";

const INTERMEDIARY_NAF = [
  /^78(?:\.|$)/,
  /^62\.02/,
  /^70\.22/
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
  if (!best || best.active === false || Number(best.score || 0) < 80) return false;
  const naf = String(best.naf || "");
  return !INTERMEDIARY_NAF.some((pattern) => pattern.test(naf));
}

function directEmployerSignal(signal) {
  return Boolean(
    signal?.company_name &&
    signal?.source_url &&
    ["linkedin", "indeed"].includes(signal.source_id) &&
    signal?.raw_payload?.discovery_version === "linkedin_indeed_ai_terms_v6" &&
    (
      (signal.source_id === "linkedin" && /^https:\/\/fr\.linkedin\.com\/jobs\/view/i.test(signal.source_url)) ||
      (signal.source_id === "indeed" && /^https:\/\/fr\.indeed\.com\/viewjob/i.test(signal.source_url))
    ) &&
    signal?.raw_payload?.france_evidence === true &&
    signal?.raw_payload?.direct_employer_evidence === true &&
    signal?.raw_payload?.intermediary_risk !== true &&
    !(signal.signal_keys || []).includes("intermediary_risk")
  );
}

function decisionRolesFor(signal) {
  const title = String(signal?.title || "");
  const roles = [];

  if (/data scientist|machine learning|mlops|data engineer/i.test(title)) {
    roles.push("Head of Data", "CTO");
  } else if (/product/i.test(title)) {
    roles.push("Head of AI", "CTO");
  } else {
    roles.push("Head of AI", "CTO");
  }

  return roles;
}

function newestByCompany(items = []) {
  const byCompany = new Map();

  for (const signal of items) {
    const key = String(signal.company_name || "").trim().toLowerCase();
    if (!key) continue;
    const current = byCompany.get(key);
    const currentDate = new Date(current?.last_seen_at || current?.first_seen_at || 0).getTime();
    const nextDate = new Date(signal.last_seen_at || signal.first_seen_at || 0).getTime();
    if (!current || nextDate >= currentDate) byCompany.set(key, signal);
  }

  return [...byCompany.values()].sort(
    (a, b) =>
      new Date(b.last_seen_at || b.first_seen_at || 0).getTime() -
      new Date(a.last_seen_at || a.first_seen_at || 0).getTime()
  );
}

export async function runOpportunityHunter({
  maxAccounts = Number(process.env.AUTONOMIA_OPPORTUNITY_HUNTER_MAX_ACCOUNTS || 25),
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

  const eligibleSignals = newestByCompany(
    (result.items || []).filter(directEmployerSignal)
  ).slice(0, Math.max(1, Number(maxAccounts) || 3));

  const accounts = [];
  let phoneFallbacksUsed = 0;

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
        (contact.email_b2b || contact.phone)
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
      .slice(0, 1);

    account.decision_candidates = candidates.length;

    for (const candidate of candidates) {
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
          offer_track: "AUTONOMIA EXPERTS",
          trigger_source: signal.source_id,
          account_type: "end_client",
          verification_mode: "automated_public_evidence",
          end_client_verified: true,
          end_client_proof: signal.source_url,
          registry_siren: best?.siren || null,
          registry_naf: best?.naf || null
        }
      });

      let verified = contact;
      if (contact.verification_status !== "verified") {
        verified = await setSalesContactVerification({
          workspaceId: workspace.id,
          actorUserId: null,
          contactId: contact.id,
          status: "verified"
        });
      }
      account.auto_verified_contacts += 1;

      if (
        !process.env.KASPR_API_KEY ||
        verified.enrichment_status === "enriched" ||
        verified.email_b2b ||
        verified.phone
      ) {
        continue;
      }

      try {
        const emailProvider = await enrichKasprLinkedInProfile({
          linkedinUrl: verified.linkedin_url,
          name: verified.full_name,
          dataToGet: ["workEmail"],
          requiredData: ["workEmail"]
        });
        let extracted = extractKasprContactData(emailProvider);
        let requestedFields = ["workEmail"];

        if (
          !extracted.found &&
          phoneFallbacksUsed < Math.max(0, Number(maxPhoneFallbacks) || 0)
        ) {
          const phoneProvider = await enrichKasprLinkedInProfile({
            linkedinUrl: verified.linkedin_url,
            name: verified.full_name,
            dataToGet: ["phone"],
            requiredData: ["phone"]
          });
          extracted = extractKasprContactData(phoneProvider);
          requestedFields = ["workEmail", "phone"];
          phoneFallbacksUsed += 1;
        }

        if (extracted.found) {
          await markSalesContactEnrichmentRequested({
            workspaceId: workspace.id,
            actorUserId: null,
            contactId: verified.id
          });
          const enriched = await applySalesContactKasprResult({
            workspaceId: workspace.id,
            actorUserId: null,
            contactId: verified.id,
            extracted,
            requestedFields,
            providerStatus: "success"
          });
          if (enriched.email_b2b) account.kaspr_email_found += 1;
          if (enriched.phone) account.kaspr_phone_found += 1;
        }
      } catch (error) {
        account.kaspr_error =
          error instanceof Error ? error.message.slice(0, 220) : String(error).slice(0, 220);
      }
    }

    accounts.push(account);
  }

  return {
    available: true,
    scannedSignals: result.items?.length || 0,
    directEmployerCandidates: newestByCompany(
      (result.items || []).filter(directEmployerSignal)
    ).length,
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
    accounts
  };
}
