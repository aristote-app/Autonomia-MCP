import { collectivitesClient } from '../../../../lib/collectivites/server.js';
import { validatePatch } from '../../../../lib/collectivites/contract.js';
export const dynamic = 'force-dynamic';
export async function GET(request, { params }) {
  const client = await collectivitesClient();
  if (!client) return Response.json({ error: 'Authentification requise' }, { status: 401 });
  const { siren } = await params;
  if (!/^\d{9}$/.test(siren)) return Response.json({ error: 'SIREN invalide' }, { status: 400 });
  const { data, error } = await client.from('collectivites').select('*,collectivites_competences(domaine,competence)').eq('siren', siren).maybeSingle();
  if (error) return Response.json({ error: 'Fiche indisponible' }, { status: 503 });
  return data ? Response.json(data, { headers: { 'Cache-Control': 'no-store' } }) : Response.json({ error: 'Structure introuvable' }, { status: 404 });
}
export async function PATCH(request, { params }) {
  const allowedOrigins = new Set(['https://cockpit.build-autonomia.com']);
  const url = new URL(request.url);
  if (['localhost', '127.0.0.1'].includes(url.hostname)) allowedOrigins.add(url.origin);
  if (!allowedOrigins.has(request.headers.get('origin'))) return Response.json({ error: 'Origine refusée' }, { status: 403 });
  const client = await collectivitesClient();
  if (!client) return Response.json({ error: 'Authentification requise' }, { status: 401 });
  const { siren } = await params;
  if (!/^\d{9}$/.test(siren)) return Response.json({ error: 'SIREN invalide' }, { status: 400 });
  let patch;
  try { patch = validatePatch(await request.json()); } catch (e) { return Response.json({ error: e.message }, { status: 400 }); }
  const { data, error } = await client.from('collectivites').update(patch).eq('siren', siren).select('*').maybeSingle();
  if (error) return Response.json({ error: 'Enregistrement impossible' }, { status: 503 });
  return data ? Response.json(data, { headers: { 'Cache-Control': 'no-store' } }) : Response.json({ error: 'Structure introuvable' }, { status: 404 });
}
