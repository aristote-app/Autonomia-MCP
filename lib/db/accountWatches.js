import { getAutonomiaServerClient } from "./supabase.js";
import { loadAccountIntelligence } from "./accountIntelligence.js";
import {
  acknowledgeAccountWatchState,
  createAccountWatchState,
  refreshAccountWatchState
} from "../intelligence/accountWatch.js";

const TYPE = "account_watch_v1";

async function ownerWatches(ownerId, { enabledOnly = false } = {}) {
  if (!ownerId) return [];
  const client = getAutonomiaServerClient();
  let query = client
    .from("watchlists")
    .select("id,owner_id,name,query,enabled,last_run_at,created_at")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false })
    .limit(250);

  if (enabledOnly) query = query.eq("enabled", true);

  const { data, error } = await query;
  if (error) throw error;
  return (data || []).filter((row) => row.query?.type === TYPE);
}

export async function getAccountWatch({ ownerId, accountSlug } = {}) {
  const watches = await ownerWatches(ownerId);
  return watches.find((row) => row.query?.account_slug === accountSlug) || null;
}

export async function upsertAccountWatch({ ownerId, account } = {}) {
  if (!ownerId || !account?.slug) throw new Error("Owner and account are required");
  const client = getAutonomiaServerClient();
  const existing = await getAccountWatch({ ownerId, accountSlug: account.slug });
  const state = existing
    ? refreshAccountWatchState(existing.query || {}, account)
    : createAccountWatchState(account);

  if (existing) {
    const { data, error } = await client
      .from("watchlists")
      .update({
        name: "Compte · " + account.name,
        query: state,
        enabled: true
      })
      .eq("id", existing.id)
      .eq("owner_id", ownerId)
      .select("*")
      .single();
    if (error) throw error;
    return data;
  }

  const { data, error } = await client
    .from("watchlists")
    .insert({
      owner_id: ownerId,
      name: "Compte · " + account.name,
      query: state,
      enabled: true
    })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function disableAccountWatch({ ownerId, accountSlug } = {}) {
  const existing = await getAccountWatch({ ownerId, accountSlug });
  if (!existing) return null;

  const client = getAutonomiaServerClient();
  const { data, error } = await client
    .from("watchlists")
    .update({ enabled: false })
    .eq("id", existing.id)
    .eq("owner_id", ownerId)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function acknowledgeAccountWatch({ ownerId, accountSlug } = {}) {
  const existing = await getAccountWatch({ ownerId, accountSlug });
  if (!existing) return null;

  const client = getAutonomiaServerClient();
  const now = new Date().toISOString();
  const { data, error } = await client
    .from("watchlists")
    .update({
      query: acknowledgeAccountWatchState(existing.query || {}, now),
      last_run_at: now
    })
    .eq("id", existing.id)
    .eq("owner_id", ownerId)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function listAccountWatchAlerts({ ownerId } = {}) {
  const watches = await ownerWatches(ownerId, { enabledOnly: true });
  return watches
    .filter((row) => Number(row.query?.unseen_signal_delta || 0) > 0)
    .sort((a, b) =>
      Number(b.query?.unseen_signal_delta || 0) - Number(a.query?.unseen_signal_delta || 0) ||
      Number(b.query?.current_heat || 0) - Number(a.query?.current_heat || 0)
    );
}

export async function refreshAllAccountWatches() {
  const client = getAutonomiaServerClient();
  const { data: rows, error } = await client
    .from("watchlists")
    .select("id,owner_id,name,query,enabled,last_run_at,created_at")
    .eq("enabled", true)
    .limit(1000);

  if (error) throw error;

  const watches = (rows || []).filter((row) => row.query?.type === TYPE);
  if (!watches.length) return { watched: 0, updated: 0, alerts: 0 };

  const intelligence = await loadAccountIntelligence({ limit: 500 });
  const bySlug = new Map((intelligence.accounts || []).map((account) => [account.slug, account]));
  const now = new Date().toISOString();
  let updated = 0;
  let alerts = 0;

  for (const watch of watches) {
    const account = bySlug.get(watch.query?.account_slug);
    if (!account) continue;

    const next = refreshAccountWatchState(watch.query || {}, account, now);
    if (Number(next.unseen_signal_delta || 0) > 0) alerts += 1;

    const write = await client
      .from("watchlists")
      .update({
        query: next,
        last_run_at: now,
        name: "Compte · " + account.name
      })
      .eq("id", watch.id);

    if (write.error) throw write.error;
    updated += 1;
  }

  return { watched: watches.length, updated, alerts };
}
