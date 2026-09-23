"use server";

import { revalidatePath } from "next/cache";
import { getCurrentWorkspaceMembership } from "../../lib/auth/access.js";
import {
  setSalesContactOutreachStatus,
  setSalesContactOptOut
} from "../../lib/db/salesContacts.js";

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

function localDateTimeToIso(value, timeZone = process.env.AUTONOMIA_TIMEZONE || "Europe/Paris") {
  const match = String(value || "").match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/
  );
  if (!match) throw new Error("Invalid next action date");

  const [, y, mo, d, h, mi] = match;
  const localAsUtc = Date.UTC(
    Number(y),
    Number(mo) - 1,
    Number(d),
    Number(h),
    Number(mi)
  );

  const offsetPart = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "longOffset",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  })
    .formatToParts(new Date(localAsUtc))
    .find((part) => part.type === "timeZoneName")?.value;

  const offsetMatch = String(offsetPart || "GMT+00:00").match(
    /GMT([+-])(\d{2}):(\d{2})/
  );
  const sign = offsetMatch?.[1] === "-" ? -1 : 1;
  const offsetMinutes = offsetMatch
    ? sign * (Number(offsetMatch[2]) * 60 + Number(offsetMatch[3]))
    : 0;

  return new Date(localAsUtc - offsetMinutes * 60000).toISOString();
}

export async function updateContactPipelineStage(formData) {
  const context = await requireWriter();
  const contactId = clean(formData.get("contact_id"), 80);
  const status = clean(formData.get("status"), 30);
  const note = clean(formData.get("note"), 1000) || null;
  const nextActionAtRaw = clean(formData.get("next_action_at"), 40) || null;
  const nextActionAt = nextActionAtRaw
    ? localDateTimeToIso(nextActionAtRaw)
    : null;

  if (!contactId || !status) {
    throw new Error("Contact and status are required");
  }

  await setSalesContactOutreachStatus({
    workspaceId: context.membership.workspace_id,
    actorUserId: context.claims.sub,
    contactId,
    status,
    note,
    nextActionAt
  });

  revalidatePath("/contacts");
}

export async function optOutContact(formData) {
  const context = await requireWriter();
  const contactId = clean(formData.get("contact_id"), 80);
  const note = clean(formData.get("note"), 1000) || null;

  if (!contactId) throw new Error("Contact is required");

  await setSalesContactOptOut({
    workspaceId: context.membership.workspace_id,
    actorUserId: context.claims.sub,
    contactId,
    note
  });

  revalidatePath("/contacts");
}
