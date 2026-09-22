import { getAutonomiaServerClient } from "./supabase.js";

function normalizeLinkedInUrl(value) {
  const url = String(value || "").trim();
  const match = url.match(/^https:\/\/(?:www\.)?linkedin\.com\/in\/[^?#/]+/i);
  if (!match) throw new Error("A standard LinkedIn profile URL is required");
  return match[0].replace(/\/$/, "");
}

export async function listSalesContacts({
  workspaceId,
  accountKey,
  limit = 50
} = {}) {
  if (!workspaceId || !accountKey) return [];

  const client = getAutonomiaServerClient();
  const { data, error } = await client
    .from("sales_contacts")
    .select(
      "id,workspace_id,account_key,account_name,first_name,last_name,full_name,role_title,matched_role,linkedin_url,source,evidence_url,trigger_title,trigger_url,relevance_score,verification_status,email_b2b,email_direct,phone,enrichment_provider,enrichment_status,enriched_at,waalaxy_prospect_id,waalaxy_list_id,waalaxy_campaign_id,outreach_status,last_contacted_at,next_action_at,do_not_contact,notes,created_at,updated_at"
    )
    .eq("workspace_id", workspaceId)
    .eq("account_key", accountKey)
    .order("relevance_score", { ascending: false, nullsFirst: false })
    .order("updated_at", { ascending: false })
    .limit(Math.min(Math.max(Number(limit) || 50, 1), 200));

  if (error) throw error;
  return data || [];
}

export async function getSalesContact({
  workspaceId,
  contactId
} = {}) {
  if (!workspaceId || !contactId) return null;

  const client = getAutonomiaServerClient();
  const { data, error } = await client
    .from("sales_contacts")
    .select("*")
    .eq("workspace_id", workspaceId)
    .eq("id", contactId)
    .maybeSingle();

  if (error) throw error;
  return data || null;
}

export async function saveSalesContactCandidate({
  workspaceId,
  actorUserId,
  accountKey,
  accountName,
  candidate,
  trigger
} = {}) {
  if (!workspaceId || !actorUserId) throw new Error("Workspace identity is required");
  if (!accountKey || !accountName) throw new Error("Account identity is required");

  const linkedinUrl = normalizeLinkedInUrl(candidate?.linkedin_url);
  const client = getAutonomiaServerClient();

  const { data: existing, error: existingError } = await client
    .from("sales_contacts")
    .select("id,workspace_id,verification_status")
    .eq("linkedin_url", linkedinUrl)
    .maybeSingle();

  if (existingError) throw existingError;

  if (existing?.workspace_id && existing.workspace_id !== workspaceId) {
    throw new Error("This contact already belongs to another workspace");
  }

  const payload = {
    workspace_id: workspaceId,
    account_key: accountKey,
    account_name: accountName,
    full_name: candidate?.name_guess || null,
    role_title: candidate?.headline || null,
    matched_role: candidate?.matched_role || null,
    linkedin_url: linkedinUrl,
    source: candidate?.evidence_kind || "public_search_candidate",
    evidence_url: linkedinUrl,
    trigger_title: trigger?.title || null,
    trigger_url: trigger?.url || null,
    relevance_score:
      candidate?.relevance_score == null
        ? null
        : Math.min(100, Math.max(0, Number(candidate.relevance_score) || 0)),
    updated_by: actorUserId,
    updated_at: new Date().toISOString(),
    ...(existing
      ? {}
      : {
          created_by: actorUserId,
          verification_status: "candidate"
        })
  };

  const write = existing
    ? client.from("sales_contacts").update(payload).eq("id", existing.id).select("*").single()
    : client.from("sales_contacts").insert(payload).select("*").single();

  const { data: contact, error } = await write;
  if (error) throw error;

  if (!existing) {
    const { error: eventError } = await client.from("sales_contact_events").insert({
      contact_id: contact.id,
      workspace_id: workspaceId,
      event_type: "candidate_saved",
      channel: "linkedin",
      payload: {
        account_key: accountKey,
        matched_role: candidate?.matched_role || null,
        relevance_score: candidate?.relevance_score ?? null,
        evidence_url: linkedinUrl
      },
      created_by: actorUserId
    });

    if (eventError) throw eventError;
  }

  return contact;
}

export async function setSalesContactVerification({
  workspaceId,
  actorUserId,
  contactId,
  status
} = {}) {
  if (!["verified", "rejected"].includes(status)) {
    throw new Error("Invalid verification status");
  }

  const client = getAutonomiaServerClient();
  const { data, error } = await client
    .from("sales_contacts")
    .update({
      verification_status: status,
      updated_by: actorUserId,
      updated_at: new Date().toISOString(),
      ...(status === "rejected"
        ? {
            outreach_status: "stopped",
            do_not_contact: true
          }
        : {})
    })
    .eq("workspace_id", workspaceId)
    .eq("id", contactId)
    .select("*")
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("Contact not found");

  const { error: eventError } = await client.from("sales_contact_events").insert({
    contact_id: contactId,
    workspace_id: workspaceId,
    event_type: status,
    channel: "linkedin",
    payload: {},
    created_by: actorUserId
  });

  if (eventError) throw eventError;
  return data;
}

export async function appendSalesContactEvent({
  workspaceId,
  actorUserId = null,
  contactId,
  eventType,
  channel = null,
  payload = {}
} = {}) {
  const client = getAutonomiaServerClient();
  const { data: contact, error: contactError } = await client
    .from("sales_contacts")
    .select("id")
    .eq("workspace_id", workspaceId)
    .eq("id", contactId)
    .maybeSingle();

  if (contactError) throw contactError;
  if (!contact) throw new Error("Contact not found");

  const { data, error } = await client
    .from("sales_contact_events")
    .insert({
      contact_id: contactId,
      workspace_id: workspaceId,
      event_type: eventType,
      channel,
      payload,
      created_by: actorUserId
    })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}


export async function markSalesContactWaalaxyImported({
  workspaceId,
  actorUserId,
  contactId,
  listId,
  campaignId = null,
  providerResult = null
} = {}) {
  const client = getAutonomiaServerClient();

  const { data: existing, error: existingError } = await client
    .from("sales_contacts")
    .select("id,verification_status,do_not_contact")
    .eq("workspace_id", workspaceId)
    .eq("id", contactId)
    .maybeSingle();

  if (existingError) throw existingError;
  if (!existing) throw new Error("Contact not found");
  if (existing.verification_status !== "verified") {
    throw new Error("Only a verified contact can be sent to Waalaxy");
  }
  if (existing.do_not_contact) {
    throw new Error("This contact is marked do-not-contact");
  }

  const resultItem =
    providerResult?.result?.[0] ||
    providerResult?.data?.[0] ||
    providerResult?.prospects?.[0] ||
    null;

  const prospectId =
    resultItem?.prospect?._id ||
    resultItem?.prospectId ||
    resultItem?.id ||
    resultItem?._id ||
    null;

  const { data, error } = await client
    .from("sales_contacts")
    .update({
      waalaxy_prospect_id: prospectId ? String(prospectId) : null,
      waalaxy_list_id: listId,
      waalaxy_campaign_id: campaignId || null,
      outreach_status: campaignId ? "queued" : "not_started",
      updated_by: actorUserId,
      updated_at: new Date().toISOString()
    })
    .eq("workspace_id", workspaceId)
    .eq("id", contactId)
    .select("*")
    .single();

  if (error) throw error;

  const { error: eventError } = await client.from("sales_contact_events").insert({
    contact_id: contactId,
    workspace_id: workspaceId,
    event_type: "waalaxy_imported",
    channel: "linkedin",
    payload: {
      list_id: listId,
      campaign_id: campaignId || null,
      provider_result_code:
        resultItem?.importCode ||
        resultItem?.code ||
        null
    },
    created_by: actorUserId
  });

  if (eventError) throw eventError;
  return data;
}
