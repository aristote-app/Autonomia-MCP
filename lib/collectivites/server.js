import { getAutonomiaServerClient } from '../db/supabase.js';
import { parseFilters } from './contract.js';
// The owner requested direct cockpit access. Keep the database key server-side;
// PATCH still validates the origin, SIREN and the two allowed commercial fields.
export async function collectivitesClient() {
  try { return getAutonomiaServerClient(); } catch { return null; }
}
export function search(client, filters, from, to) {
  return client.rpc('search_collectivites_v1', filters.rpc, { count: 'exact' })
    .order(filters.sort, { ascending: filters.ascending, nullsFirst: false })
    .order('siren', { ascending: true }).range(from, to);
}
export { parseFilters };
