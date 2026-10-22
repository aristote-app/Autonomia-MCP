import { collectivitesClient, parseFilters, search } from '../../../lib/collectivites/server.js';
import { csvCell } from '../../../lib/collectivites/contract.js';
export const dynamic = 'force-dynamic';
export async function GET(request) {
  const client = await collectivitesClient();
  if (!client) return Response.json({ error: 'Authentification requise' }, { status: 401 });
  const params = new URL(request.url).searchParams;
  let filters;
  try { filters = parseFilters(params); } catch (e) { return Response.json({ error: e.message }, { status: 400 }); }
  try {
    if (params.get('format') === 'csv') {
      // Each batch repeats exactly the same filters and stable ordering. No 1000-row truncation.
      const rows = [];
      for (let from = 0; ; from += 500) {
        const { data, error } = await search(client, filters, from, from + 499);
        if (error) throw error;
        rows.push(...data);
        if (data.length < 500) break;
      }
      const columns = ['siren','nom','code_type','type','categorie','code_departement','departement','domaines','president_civilite','president_prenom','president_nom','telephone','email','site_web','fiche_banatic','statut_prospection','notes'];
      const lines = [columns.map(csvCell).join(','), ...rows.map(row => columns.map(c => csvCell(row[c])).join(','))];
      return new Response('\uFEFF' + lines.join('\r\n'), { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="autonomia-collectivites.csv"', 'Cache-Control': 'no-store' }});
    }
    const from = (filters.page - 1) * 50;
    const [result, summary] = await Promise.all([
      search(client, filters, from, from + 49),
      params.get('summary') === 'true' ? client.rpc('collectivites_summary_v1') : Promise.resolve({ data: null })
    ]);
    if (result.error || summary.error) throw result.error || summary.error;
    return Response.json({ items: result.data, total: result.count, page: filters.page, pageSize: 50, summary: summary.data }, { headers: { 'Cache-Control': 'no-store' }});
  } catch (error) {
    console.error('collectivites query:', error.code || 'query_failed');
    return Response.json({ error: 'Base Collectivités indisponible. Vérifiez que le schéma et les données sont installés.' }, { status: 503 });
  }
}
