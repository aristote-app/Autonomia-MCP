"use server";

import { revalidatePath } from "next/cache";
import {
  saveSalesContactCandidate,
  setSalesContactVerification
} from "../../lib/db/salesContacts.js";
import { getCurrentWorkspaceMembership } from "../../lib/auth/access.js";

async function requireWriter() {
  const context = await getCurrentWorkspaceMembership();

  if (
    !context.configured ||
    !context.claims?.sub ||
    !context.membership ||
    context.membership.role === "viewer"
  ) {
    throw new Error("Workspace write access required");
  }

  return context;
}

function clean(value, max = 500) {
  return String(value || "").trim().slice(0, max);
}

export async function saveDecisionMakerCandidate(formData) {
  const context = await requireWriter();
  const accountKey = clean(formData.get("account_key"), 120);
  const accountName = clean(formData.get("account_name"), 240);
  const linkedinUrl = clean(formData.get("linkedin_url"), 600);
  const nameGuess = clean(formData.get("name_guess"), 240) || null;
  const headline = clean(formData.get("headline"), 500) || null;
  const matchedRole = clean(formData.get("matched_role"), 240) || null;
  const triggerTitle = clean(formData.get("trigger_title"), 500) || null;
  const triggerUrl = clean(formData.get("trigger_url"), 900) || null;
  const relevanceScore = Number(formData.get("relevance_score"));

  if (!accountKey || !accountName || !linkedinUrl) {
    throw new Error("Missing decision-maker candidate identity");
  }

  await saveSalesContactCandidate({
    workspaceId: context.membership.workspace_id,
    actorUserId: context.claims.sub,
    accountKey,
    accountName,
    candidate: {
      linkedin_url: linkedinUrl,
      name_guess: nameGuess,
      headline,
      matched_role: matchedRole,
      relevance_score: Number.isFinite(relevanceScore) ? relevanceScore : null,
      evidence_kind: "public_search_candidate"
    },
    trigger: {
      title: triggerTitle,
      url: triggerUrl
    }
  });

  revalidatePath("/accounts/" + accountKey);
}

export async function verifyDecisionMaker(formData) {
  const context = await requireWriter();
  const contactId = clean(formData.get("contact_id"), 80);
  const accountKey = clean(formData.get("account_key"), 120);
  const status = clean(formData.get("status"), 20);

  if (!contactId || !accountKey || !["verified", "rejected"].includes(status)) {
    throw new Error("Invalid contact verification request");
  }

  await setSalesContactVerification({
    workspaceId: context.membership.workspace_id,
    actorUserId: context.claims.sub,
    contactId,
    status
  });

  revalidatePath("/accounts/" + accountKey);
}
