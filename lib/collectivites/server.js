import { createAuthServerClient } from '../auth/server.js';
import { parseFilters } from './contract.js';
export async function collectivitesClient() {
  try {
    const client = await createAuthServerClient();
    const { data, error } = await client.auth.getClaims();
    return !error && data?.claims?.sub ? client : null;
  } catch { return null; }
}
export function search(client, filters, from, to) {
  return client.rpc('search_collectivites_v1', filters.rpc, { count: 'exact' })
    .order(filters.sort, { ascending: filters.ascending, nullsFirst: false })
    .order('siren', { ascending: true }).range(from, to);
}
export { parseFilters };
