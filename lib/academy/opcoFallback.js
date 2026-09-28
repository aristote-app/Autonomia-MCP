import { VERIFIED_ACADEMY_COMPANY_OVERRIDES } from "./companyOverrides.js";

const IDCC_RESOURCE_ID = "a22e54f7-b937-4483-9a72-aad2ea1316f1";

function cleanDigits(value, max) {
  return String(value || "").replace(/\D/g, "").slice(0, max);
}

function mapOpcoCode(name) {
  const value = String(name || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();

  if (value.includes("AFDAS")) return "AFDAS";
  if (value.includes("AKTO")) return "AKTO";
  if (value.includes("ATLAS")) return "ATLAS";
  if (value.includes("CONSTRUCTYS")) return "CONSTRUCTYS";
  if (value.includes("COMMERCE")) return "OPCOMMERCE";
  if (value.includes("OCAPIAT")) return "OCAPIAT";
  if (value.includes("2I")) return "OPCO2I";
  if (value.includes("PROXIMITE")) return "OPCOEP";
  if (value.includes("MOBILITES")) return "OPCOMOBILITES";
  if (value.includes("SANTE")) return "OPCOSANTE";
  if (value.includes("UNIFORMATION")) return "UNIFORMATION";
  return null;
}

async function fetchJson(url, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      headers: { accept: "application/json" },
      cache: "no-store",
      signal: controller.signal
    });
    const text = await response.text();
    if (!response.ok) {
      return { ok: false, status: response.status, payload: text };
    }
    try {
      return { ok: true, status: response.status, payload: JSON.parse(text) };
    } catch {
      return { ok: false, status: response.status, payload: text, reason: "invalid_json" };
    }
  } catch (error) {
    return {
      ok: false,
      status: 0,
      reason: error?.name === "AbortError" ? "timeout" : (error?.message || String(error))
    };
  } finally {
    clearTimeout(timer);
  }
}

function parseCfaDock(payload, sourceUrl) {
  const status = String(
    payload?.ResultStatus ??
    payload?.resultStatus ??
    payload?.status ??
    ""
  ).toUpperCase();

  const opcoName =
    payload?.OpcoName ??
    payload?.opcoName ??
    payload?.OPCOName ??
    null;

  const idcc =
    payload?.Idcc ??
    payload?.IDCC ??
    payload?.idcc ??
    null;

  return {
    available: true,
    found: status === "OK" || Boolean(opcoName),
    provider: "CFA Dock",
    status: status || null,
    opco_name: opcoName,
    opco_code: mapOpcoCode(opcoName),
    opco_siren:
      payload?.OpcoSiren ??
      payload?.opcoSiren ??
      null,
    idcc: idcc != null ? String(idcc) : null,
    source_url: sourceUrl
  };
}

export async function lookupCfaDockOpco(identifier) {
  const normalized = cleanDigits(identifier, 14);
  if (![9, 14].includes(normalized.length)) {
    return { available: false, found: false, reason: "invalid_siret_or_siren" };
  }

  const url = new URL("https://www.cfadock.fr/api/opcos");
  url.searchParams.set("siret", normalized);

  const result = await fetchJson(url.toString());
  if (!result.ok) {
    return {
      available: false,
      found: false,
      reason: result.reason || `http_${result.status}`,
      source_url: url.toString()
    };
  }

  return parseCfaDock(result.payload, url.toString());
}

export async function lookupCfaDockByIdcc(idcc) {
  const normalized = cleanDigits(idcc, 4);
  if (!normalized) {
    return { available: false, found: false, reason: "invalid_idcc" };
  }

  const url = new URL("https://www.cfadock.fr/api/opcos");
  url.searchParams.set("idcc", normalized);

  const result = await fetchJson(url.toString());
  if (!result.ok) {
    return {
      available: false,
      found: false,
      reason: result.reason || `http_${result.status}`,
      source_url: url.toString()
    };
  }

  return parseCfaDock(result.payload, url.toString());
}

export async function lookupIdccFromDataGouv(siret) {
  const normalized = cleanDigits(siret, 14);
  if (normalized.length !== 14) {
    return { available: false, found: false, reason: "invalid_siret" };
  }

  const candidates = ["SIRET", "siret"];
  for (const column of candidates) {
    const url = new URL(
      `https://tabular-api.data.gouv.fr/api/resources/${IDCC_RESOURCE_ID}/data/`
    );
    url.searchParams.set(`${column}__exact`, normalized);
    url.searchParams.set("page_size", "20");

    const result = await fetchJson(url.toString());
    if (!result.ok) continue;

    const rows = Array.isArray(result.payload?.data) ? result.payload.data : [];
    if (!rows.length) {
      return {
        available: true,
        found: false,
        provider: "data.gouv.fr · siret2idcc",
        source_url: url.toString()
      };
    }

    const idccs = [...new Set(
      rows
        .map((row) => row.IDCC ?? row.idcc ?? row.Idcc ?? null)
        .filter((value) => value != null && String(value).trim() !== "")
        .map((value) => String(value).replace(/\D/g, "").padStart(4, "0"))
    )];

    if (idccs.length) {
      return {
        available: true,
        found: true,
        provider: "data.gouv.fr · siret2idcc",
        idcc: idccs[0],
        idccs,
        rows,
        source_url: url.toString()
      };
    }

    return {
      available: true,
      found: false,
      provider: "data.gouv.fr · siret2idcc",
      source_url: url.toString()
    };
  }

  return {
    available: false,
    found: false,
    reason: "tabular_api_unavailable"
  };
}


async function lookupOfficialCompany(siret) {
  const normalized = cleanDigits(siret, 14);
  if (normalized.length !== 14) return { found: false, reason: "invalid_siret" };

  const url = new URL("https://recherche-entreprises.api.gouv.fr/search");
  url.searchParams.set("q", normalized);
  url.searchParams.set("page", "1");
  url.searchParams.set("per_page", "5");

  const result = await fetchJson(url.toString());
  if (!result.ok) {
    return {
      found: false,
      available: false,
      reason: result.reason || `http_${result.status}`,
      source_url: url.toString()
    };
  }

  const rows = Array.isArray(result.payload?.results) ? result.payload.results : [];
  const exact = rows.find((row) =>
    String(row?.siege?.siret || row?.siret || "").replace(/\D/g, "") === normalized
  ) || rows[0] || null;

  if (!exact) {
    return { found: false, available: true, source_url: url.toString() };
  }

  return {
    found: true,
    available: true,
    provider: "API Recherche d'entreprises · DINUM",
    name: exact.nom_complet || exact.nom_raison_sociale || null,
    siren: exact.siren || normalized.slice(0, 9),
    siret: exact.siege?.siret || exact.siret || normalized,
    naf: exact.activite_principale || exact.siege?.activite_principale || null,
    legal_nature: exact.nature_juridique || null,
    employee_bracket_code: exact.tranche_effectif_salarie || exact.siege?.tranche_effectif_salarie || null,
    employer:
      exact.caractere_employeur ??
      exact.siege?.caractere_employeur ??
      null,
    source_url: url.toString()
  };
}

function inferOpcoCandidate(company) {
  const naf = String(company?.naf || "").replace(/[^0-9A-Z]/gi, "").toUpperCase();

  if (naf === "8559A") {
    return {
      candidate: true,
      confidence: "medium",
      opco_code: "AKTO",
      opco_name: "AKTO",
      idcc: "1516",
      branch_label: "Organismes de formation",
      reason:
        "L'activité principale 85.59A correspond à la formation continue d'adultes. La branche Organismes de formation est identifiée par AKTO sous l'IDCC 1516. Ce rattachement reste à confirmer car l'IDCC officiel de l'établissement n'est pas renseigné dans les sources DSN/SIRO et certaines exclusions conventionnelles existent.",
      evidence_urls: [
        "https://www.akto.fr/regles-de-prise-en-charge-organisme-de-formation/",
        "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635435"
      ]
    };
  }

  if (naf === "4719B") {
    return {
      candidate: true,
      confidence: "medium",
      opco_code: "OPCOMMERCE",
      opco_name: "L'Opcommerce",
      idcc: "1517",
      branch_label: "Commerces de détail non alimentaires",
      reason:
        "L'activité principale 47.19B correspond au commerce de détail en magasin non spécialisé. Plusieurs sources publiques rattachent cette activité à la convention Commerces de détail non alimentaires (IDCC 1517), relevant de L'Opcommerce. Ce rattachement reste à confirmer tant qu'aucun IDCC officiel exploitable n'est publié dans SIRO/DSN pour l'établissement.",
      evidence_urls: [
        "https://www.lopcommerce.com/entreprise/criteres-de-prise-en-charge-par-branche-professionnelle/",
        "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635887"
      ]
    };
  }

  return null;
}

export async function resolveExternalOpco(siret) {
  const normalized = cleanDigits(siret, 14);
  if (normalized.length !== 14) {
    return { found: false, reason: "invalid_siret" };
  }

  const direct = await lookupCfaDockOpco(normalized);
  if (direct.found) {
    return { ...direct, resolution_path: "cfadock_siret" };
  }

  const siren = normalized.slice(0, 9);
  const bySiren = await lookupCfaDockOpco(siren);
  if (bySiren.found) {
    return { ...bySiren, resolution_path: "cfadock_siren" };
  }

  const idccLookup = await lookupIdccFromDataGouv(normalized);
  if (idccLookup.found && idccLookup.idcc) {
    const byIdcc = await lookupCfaDockByIdcc(idccLookup.idcc);
    if (byIdcc.found) {
      return {
        ...byIdcc,
        idcc: idccLookup.idcc,
        resolution_path: "datagouv_idcc_to_cfadock",
        idcc_provider: idccLookup.provider,
        idcc_source_url: idccLookup.source_url
      };
    }

    return {
      found: false,
      available: true,
      provider: idccLookup.provider,
      idcc: idccLookup.idcc,
      resolution_path: "datagouv_idcc_only",
      source_url: idccLookup.source_url,
      reason: "idcc_found_but_opco_unresolved"
    };
  }

  const override = VERIFIED_ACADEMY_COMPANY_OVERRIDES[normalized] || null;
  const company = override
    ? { found: true, available: true, ...override }
    : await lookupOfficialCompany(normalized);
  const candidate = company.found ? inferOpcoCandidate(company) : null;

  if (candidate) {
    return {
      found: false,
      available: true,
      resolution_path: "candidate_from_official_company_activity",
      reason: "official_mapping_missing",
      company,
      candidate
    };
  }

  return {
    found: false,
    available: direct.available || bySiren.available || idccLookup.available || company.available,
    resolution_path: "no_external_match",
    reason: direct.reason || bySiren.reason || idccLookup.reason || company.reason || "not_found",
    company: company.found ? company : null
  };
}
