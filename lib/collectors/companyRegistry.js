import { fetchJson } from "./http.js";

const SEARCH_URL = "https://recherche-entreprises.api.gouv.fr/search";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const cache = new Map();

const EFFECTIF_LABELS = Object.freeze({
  NN: "Non employeuse / effectif inconnu",
  "00": "0 salarié",
  "01": "1 à 2 salariés",
  "02": "3 à 5 salariés",
  "03": "6 à 9 salariés",
  "11": "10 à 19 salariés",
  "12": "20 à 49 salariés",
  "21": "50 à 99 salariés",
  "22": "100 à 199 salariés",
  "31": "200 à 249 salariés",
  "32": "250 à 499 salariés",
  "41": "500 à 999 salariés",
  "42": "1 000 à 1 999 salariés",
  "51": "2 000 à 4 999 salariés",
  "52": "5 000 à 9 999 salariés",
  "53": "10 000 salariés et plus"
});

function clean(value) {
  return String(value || "").trim();
}

function identity(value) {
  return clean(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\b(sas|sasu|sa|sarl|eurl|groupe|group|holding|france)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function words(value) {
  return new Set(identity(value).split(" ").filter((word) => word.length >= 2));
}

function overlap(a, b) {
  const left = words(a);
  const right = words(b);
  if (!left.size || !right.size) return 0;
  const matched = [...left].filter((word) => right.has(word)).length;
  return matched / Math.max(left.size, right.size);
}

function candidateNames(item = {}) {
  return [
    item.nom_complet,
    item.nom_raison_sociale,
    item.sigle,
    ...(item.noms_commerciaux || []),
    ...(item.siege?.liste_enseignes || [])
  ].filter(Boolean);
}

export function rankCompanyRegistryCandidates(companyName, results = []) {
  const target = identity(companyName);

  return (results || [])
    .map((item) => {
      const names = candidateNames(item);
      const exact = names.some((name) => identity(name) === target);
      const similarity = Math.max(0, ...names.map((name) => overlap(companyName, name)));
      const active =
        String(item.etat_administratif || item.siege?.etat_administratif || "").toUpperCase() === "A";
      const score = Math.min(
        100,
        Math.round((exact ? 78 : similarity * 78) + (active ? 12 : 0) + (item.siren ? 10 : 0))
      );

      return {
        siren: item.siren || null,
        siret_siege: item.siege?.siret || item.siret || null,
        name: item.nom_complet || item.nom_raison_sociale || names[0] || null,
        legal_name: item.nom_raison_sociale || null,
        score,
        match_status: exact && score >= 95
          ? "exact"
          : score >= 80
            ? "strong"
            : "candidate",
        active,
        naf: item.activite_principale || item.siege?.activite_principale || null,
        section_naf: item.section_activite_principale || null,
        company_category: item.categorie_entreprise || null,
        legal_nature: item.nature_juridique || null,
        employee_bracket_code:
          item.tranche_effectif_salarie ||
          item.siege?.tranche_effectif_salarie ||
          null,
        employee_bracket:
          EFFECTIF_LABELS[
            item.tranche_effectif_salarie ||
            item.siege?.tranche_effectif_salarie
          ] || null,
        creation_date: item.date_creation || item.siege?.date_creation || null,
        establishments:
          item.nombre_etablissements_ouverts ??
          item.nombre_etablissements ??
          null,
        address: item.siege?.adresse || null,
        postal_code: item.siege?.code_postal || null,
        city: item.siege?.libelle_commune || null
      };
    })
    .filter((item) => item.name)
    .sort((a, b) => b.score - a.score);
}

export async function resolveFrenchCompanyRegistry(companyName, {
  perPage = 5
} = {}) {
  const name = clean(companyName);
  if (!name) return { available: false, reason: "Company name is required", candidates: [] };

  const key = identity(name);
  const cached = cache.get(key);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return { ...cached.value, cached: true };
  }

  const url = new URL(SEARCH_URL);
  url.searchParams.set("q", name);
  url.searchParams.set("page", "1");
  url.searchParams.set("per_page", String(Math.min(Math.max(Number(perPage) || 5, 1), 10)));

  try {
    const payload = await fetchJson(url.toString(), {
      headers: { accept: "application/json" }
    });

    const ranked = rankCompanyRegistryCandidates(name, payload?.results || []);
    const value = {
      available: true,
      provider: "API Recherche d'entreprises · DINUM",
      query: name,
      best: ranked[0] || null,
      candidates: ranked.slice(0, 5),
      total_results: Number(payload?.total_results || payload?.total || ranked.length) || ranked.length,
      note:
        "La fiche juridique reste une correspondance de registre. Autonomia ne fusionne pas automatiquement un compte commercial avec une unité légale sur un score faible."
    };

    cache.set(key, { at: Date.now(), value });
    return value;
  } catch (error) {
    return {
      available: false,
      provider: "API Recherche d'entreprises · DINUM",
      query: name,
      reason: error instanceof Error ? error.message : String(error),
      candidates: []
    };
  }
}
