export function splitContact(value) {
  return String(value || '').split(';').map(x => x.trim()).filter(Boolean);
}
export function presidentName(row) {
  return [row.president_civilite, row.president_prenom, row.president_nom].filter(Boolean).join(' ');
}
export function filtersToParams(filters = {}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    for (const item of Array.isArray(value) ? value : [value]) if (item) params.append(key, item);
  }
  return params;
}
export function initialFilters(params = {}) {
  const filters = {};
  for (const key of ['q','categorie','code_type','code_departement','email','telephone','statut_prospection','tri','ordre']) {
    const value = Array.isArray(params[key]) ? params[key][0] : params[key];
    if (value) filters[key] = String(value).slice(0,200);
  }
  if (params.domaine) filters.domaine = [...new Set((Array.isArray(params.domaine) ? params.domaine : [params.domaine]).map(String))].slice(0,19);
  return filters;
}
export function prepareMessage(row, offer = 'formation') {
  const opening = `Bonjour,\n\nJe vous contacte au sujet de ${row.nom}.`;
  const proposal = offer === 'automatisation'
    ? "Nous accompagnons les collectivités dans l'automatisation de tâches administratives avec l'IA : tri de demandes, préparation de documents et suivi de dossiers, avec validation par les équipes."
    : "Nous proposons des formations pratiques à l'IA pour les agents et les équipes : prise en main des outils, rédaction de documents et organisation du travail à partir de leurs cas d'usage.";
  return `${opening}\n\n${proposal}\n\nQui serait la bonne personne pour échanger sur ce sujet dans votre structure ?\n\nBien cordialement,\nDéborah Dian\nAUTONOMIA`;
}
export function nextAction(status) {
  return {
    'à contacter': "Appelez ou préparez un e-mail pour identifier la personne qui pilote la formation ou les projets numériques.",
    'contacté': "Précisez le besoin, le bon interlocuteur et la prochaine étape dans les notes.",
    'à relancer': "Reprenez le dernier échange dans les notes avant de préparer votre relance.",
    'rendez-vous': "Notez la date du rendez-vous, les participants et les sujets à préparer.",
    'proposition envoyée': "Notez la proposition envoyée et la date de votre prochaine relance.",
    'gagné': "Consignez les modalités retenues et organisez la préparation de la mission.",
    'perdu': "Notez le motif et, si utile, les conditions d'une prochaine prise de contact."
  }[status] || "Précisez la prochaine étape dans les notes.";
}
