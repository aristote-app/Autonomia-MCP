"use server";

import { revalidatePath } from "next/cache";
import { getCurrentWorkspaceMembership } from "../../lib/auth/access.js";
import {
  getSalesContact,
  listSalesContacts,
  markSalesContactWaalaxyImported,
  markSalesContactEnrichmentRequested,
  applySalesContactKasprResult,
  markSalesContactEnrichmentError
} from "../../lib/db/salesContacts.js";
import {
  importWaalaxyProspects,
  assertSuccessfulWaalaxyImport
} from "../../lib/integrations/waalaxy.js";
import {
  enrichKasprLinkedInProfile,
  extractKasprContactData,
  kasprRequestedFields
} from "../../lib/integrations/kaspr.js";
import {
  evaluateKasprGuard,
  evaluateWaalaxyGuard
} from "../../lib/intelligence/outreachGuard.js";

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

export async function sendVerifiedContactToWaalaxy(formData) {
  const context = await requireWriter();

  if (!process.env.WAALAXY_API_KEY) {
    throw new Error("Waalaxy is not configured");
  }

  const contactId = clean(formData.get("contact_id"), 80);
  const accountKey = clean(formData.get("account_key"), 120);
  const prospectListId = clean(formData.get("prospect_list_id"), 160);
  const campaignId = clean(formData.get("campaign_id"), 160) || null;

  if (!contactId || !accountKey || !prospectListId) {
    throw new Error("Contact, account and Waalaxy list are required");
  }

  const contact = await getSalesContact({
    workspaceId: context.membership.workspace_id,
    contactId
  });

  if (!contact) throw new Error("Contact not found");
  if (contact.verification_status !== "verified") {
    throw new Error("Verify the contact before sending it to Waalaxy");
  }
  const accountContacts = await listSalesContacts({
    workspaceId: context.membership.workspace_id,
    accountKey,
    limit: 50
  });

  const guard = evaluateWaalaxyGuard({
    contact,
    accountContacts,
    campaignId
  });
  if (!guard.allowed) {
    throw new Error("Waalaxy bloqué : " + guard.reason);
  }

  const result = await importWaalaxyProspects({
    prospects: [{
      linkedin_url: contact.linkedin_url,
      firstName: contact.first_name || undefined,
      lastName: contact.last_name || undefined,
      email: contact.email_b2b || contact.email_direct || undefined,
      company: contact.account_name,
      matchedRole: contact.matched_role || contact.role_title || undefined,
      trigger: contact.trigger_title || undefined
    }],
    prospectListId,
    campaignId,
    addExistingProspectInCampaign: Boolean(campaignId)
  });

  assertSuccessfulWaalaxyImport(result, { campaignId });

  await markSalesContactWaalaxyImported({
    workspaceId: context.membership.workspace_id,
    actorUserId: context.claims.sub,
    contactId,
    listId: prospectListId,
    campaignId,
    providerResult: result
  });

  revalidatePath("/accounts/" + accountKey);
}


export async function enrichVerifiedContactWithKaspr(formData) {
  const context = await requireWriter();

  if (!process.env.KASPR_API_KEY) {
    throw new Error("Kaspr is not configured");
  }

  const requestedFields = kasprRequestedFields();
  if (!requestedFields.length) {
    throw new Error(
      "Kaspr fields are not configured. Set KASPR_DATA_TO_GET before spending enrichment credits."
    );
  }

  const contactId = clean(formData.get("contact_id"), 80);
  const accountKey = clean(formData.get("account_key"), 120);

  if (!contactId || !accountKey) {
    throw new Error("Contact and account are required");
  }

  const contact = await getSalesContact({
    workspaceId: context.membership.workspace_id,
    contactId
  });

  if (!contact) throw new Error("Contact not found");
  if (contact.verification_status !== "verified") {
    throw new Error("Verify the contact before Kaspr enrichment");
  }
  const guard = evaluateKasprGuard({ contact });
  if (!guard.allowed) {
    throw new Error("Kaspr bloqué : " + guard.reason);
  }

  const contactName =
    contact.full_name ||
    [contact.first_name, contact.last_name].filter(Boolean).join(" ").trim();

  if (!contactName) {
    throw new Error("A verified contact name is required before Kaspr enrichment");
  }

  await markSalesContactEnrichmentRequested({
    workspaceId: context.membership.workspace_id,
    actorUserId: context.claims.sub,
    contactId
  });

  try {
    const providerResult = await enrichKasprLinkedInProfile({
      linkedinUrl: contact.linkedin_url,
      name: contactName,
      dataToGet: requestedFields
    });

    const extracted = extractKasprContactData(providerResult);

    await applySalesContactKasprResult({
      workspaceId: context.membership.workspace_id,
      actorUserId: context.claims.sub,
      contactId,
      extracted,
      requestedFields,
      providerStatus: "success"
    });
  } catch (error) {
    await markSalesContactEnrichmentError({
      workspaceId: context.membership.workspace_id,
      actorUserId: context.claims.sub,
      contactId,
      errorMessage: error instanceof Error ? error.message : String(error)
    }).catch(() => null);

    throw error;
  }

  revalidatePath("/accounts/" + accountKey);
  revalidatePath("/contacts");
}
