"use server";

import { revalidatePath } from "next/cache";
import { getCurrentWorkspaceMembership } from "../../lib/auth/access.js";
import { loadAccountBySlug } from "../../lib/db/accountIntelligence.js";
import {
  acknowledgeAccountWatch,
  disableAccountWatch,
  upsertAccountWatch
} from "../../lib/db/accountWatches.js";

async function requireMember() {
  const context = await getCurrentWorkspaceMembership();
  if (!context.configured || !context.claims?.sub || !context.membership) {
    throw new Error("Workspace session required");
  }
  return context;
}

function slug(value) {
  return String(value || "").trim().slice(0, 120);
}

export async function watchAccount(formData) {
  const context = await requireMember();
  const accountSlug = slug(formData.get("account_slug"));
  const account = await loadAccountBySlug(accountSlug);
  if (!account) throw new Error("Account not found");

  await upsertAccountWatch({ ownerId: context.claims.sub, account });
  revalidatePath("/accounts/" + accountSlug);
  revalidatePath("/");
}

export async function unwatchAccount(formData) {
  const context = await requireMember();
  const accountSlug = slug(formData.get("account_slug"));
  await disableAccountWatch({ ownerId: context.claims.sub, accountSlug });
  revalidatePath("/accounts/" + accountSlug);
  revalidatePath("/");
}

export async function acknowledgeWatchedAccount(formData) {
  const context = await requireMember();
  const accountSlug = slug(formData.get("account_slug"));
  await acknowledgeAccountWatch({ ownerId: context.claims.sub, accountSlug });
  revalidatePath("/accounts/" + accountSlug);
  revalidatePath("/");
}
