export const STATUSES = ['à contacter', 'contacté', 'à relancer', 'rendez-vous', 'proposition envoyée', 'gagné', 'perdu'];
export const SORTS = new Set(['nom', 'code_type', 'code_departement', 'categorie', 'population', 'statut_prospection']);
export function parseFilters(params) {
  const text = (name) => params.get(name)?.trim().slice(0, 200) || null;
  const pageValue = Number(params.get('page') || 1);
  if (!Number.isSafeInteger(pageValue) || pageValue < 1 || pageValue > 100000) throw new Error('Page invalide');
  const sort = text('tri') || 'nom';
  if (!SORTS.has(sort)) throw new Error('Tri invalide');
  const domains = [...new Set(params.getAll('domaine').filter(Boolean))];
  if (domains.length > 19 || domains.some(d => d.length > 200)) throw new Error('Domaines invalides');
  return { page: pageValue, sort, ascending: params.get('ordre') !== 'desc', rpc: {
    p_categorie: text('categorie'), p_type: text('code_type'), p_departement: text('code_departement'),
    p_domaines: domains, p_q: text('q'), p_telephone: params.get('telephone') === 'true',
    p_email: params.get('email') === 'true', p_statut: text('statut_prospection')
  }};
}
export function validatePatch(body) {
  if (!body || Array.isArray(body) || typeof body !== 'object') throw new Error('Objet JSON attendu');
  const keys = Object.keys(body);
  if (!keys.length || keys.some(k => !['notes', 'statut_prospection'].includes(k))) throw new Error('Seuls le statut et les notes sont modifiables');
  if ('statut_prospection' in body && !STATUSES.includes(body.statut_prospection)) throw new Error('Statut invalide');
  if ('notes' in body && body.notes !== null && (typeof body.notes !== 'string' || body.notes.length > 20000)) throw new Error('Notes invalides (20 000 caractères maximum)');
  return body;
}
export function csvCell(value) {
  let text = String(value ?? '');
  if (/^[\s]*[=+@\-\t\r\n]/.test(text)) text = "'" + text;
  return '"' + text.replaceAll('"', '""') + '"';
}
export function safeUrl(value) {
  if (!value) return null;
  try { const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`); return ['http:', 'https:'].includes(url.protocol) ? url.href : null; } catch { return null; }
}
