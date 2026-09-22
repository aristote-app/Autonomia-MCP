"use server";

import { revalidatePath } from "next/cache";
import { getCurrentWorkspaceMembership } from "../../lib/auth/access.js";
import { getSalesContact, markSalesContactWaalaxyImported } from "../../lib/db/salesContacts.js";
import { importWaalaxyProspects } from "../../lib/integrations/waalaxy.js";

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
  if (contact.do_not_contact) {
    throw new Error("This contact is marked do-not-contact");
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
