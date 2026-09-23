"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentWorkspaceMembership } from "../../lib/auth/access.js";
import {
  bulkUpsertConsultants,
  upsertDiscoveredConsultantCandidates,
  setConsultantCandidateStatus
} from "../../lib/db/consultants.js";
import { parseConsultantImportText } from "../../lib/consultants/import.js";
import { discoverTalentCandidates } from "../../lib/collectors/talentHunter.js";

const IMPORT_ROLES = new Set(["admin", "direction", "staffing"]);

async function requireImporter() {
  const context = await getCurrentWorkspaceMembership();

  if (
    !context.configured ||
    !context.claims?.sub ||
    !context.membership ||
    !IMPORT_ROLES.has(context.membership.role)
  ) {
    throw new Error("Consultant import access required");
  }

  return context;
}

export async function importConsultantsFromText(formData) {
  const context = await requireImporter();
  const rows = parseConsultantImportText(formData.get("rows"), { maxRows: 200 });

  if (!rows.length) {
    throw new Error("Aucun consultant valide à importer");
  }

  const result = await bulkUpsertConsultants(rows, {
    actorUserId: context.claims.sub
  });

  revalidatePath("/consultants");
  revalidatePath("/");

  redirect(
    "/consultants?imported=" +
      encodeURIComponent(String(result.imported)) +
      "&skills=" +
      encodeURIComponent(String(result.skill_links))
  );
}


export async function discoverConsultantsFromWeb(formData) {
  const context = await requireImporter();
  const query = String(formData.get("query") || "").trim().slice(0, 180);

  if (query.length < 3) {
    throw new Error("Recherche consultant trop courte");
  }

  const result = await discoverTalentCandidates({
    query,
    sources: ["malt", "freelance_com", "linkedin"],
    countPerSource: 10
  });

  if (!result.available) {
    throw new Error(result.reason || "Talent Hunter indisponible");
  }

  const persisted = await upsertDiscoveredConsultantCandidates(result.candidates, {
    actorUserId: context.claims.sub
  });

  revalidatePath("/consultants");

  redirect(
    "/consultants?discovered=" +
      encodeURIComponent(String(persisted.created)) +
      "&updated=" +
      encodeURIComponent(String(persisted.updated)) +
      "&found=" +
      encodeURIComponent(String(result.candidates.length)) +
      "&query=" +
      encodeURIComponent(query)
  );
}

export async function reviewConsultantCandidate(formData) {
  const context = await requireImporter();
  const consultantId = String(formData.get("consultant_id") || "").trim();
  const decision = String(formData.get("decision") || "").trim();
  const status = decision === "approve" ? "active" : decision === "reject" ? "rejected" : null;

  if (!consultantId || !status) {
    throw new Error("Décision candidat invalide");
  }

  await setConsultantCandidateStatus({
    consultantId,
    status,
    actorUserId: context.claims.sub
  });

  revalidatePath("/consultants");
  revalidatePath("/accounts");
  revalidatePath("/");

  redirect(
    "/consultants?reviewed=" +
      encodeURIComponent(status)
  );
}
