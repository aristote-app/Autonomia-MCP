function scalarText(value) {
  if (value == null) return null;
  if (Array.isArray(value)) return scalarText(value[0]);
  if (typeof value === "object") {
    const preferred = ["#text", "fra", "eng", "fre"];
    for (const key of preferred) {
      if (key in value) {
        const resolved = scalarText(value[key]);
        if (resolved) return resolved;
      }
    }
    for (const item of Object.values(value)) {
      const resolved = scalarText(item);
      if (resolved) return resolved;
    }
    return null;
  }
  return String(value);
}


function normalizeSiren(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (digits.length === 14) return digits.slice(0, 9);
  if (digits.length === 9) return digits;
  return null;
}

function boampBuyerSiren(record) {
  const direct = normalizeSiren(record?.buyer_siret || record?.buyer_siren);
  if (direct) return direct;

  let payload = record?.donnees;
  if (typeof payload === "string") {
    try {
      payload = JSON.parse(payload);
    } catch {
      return null;
    }
  }

  const notice = payload?.EFORMS?.ContractNotice;
  if (!notice) return null;

  const contractingParty = Array.isArray(notice["cac:ContractingParty"])
    ? notice["cac:ContractingParty"][0]
    : notice["cac:ContractingParty"];

  const buyerRef = scalarText(
    contractingParty?.["cac:Party"]?.["cac:PartyIdentification"]?.["cbc:ID"]
  );

  const rawOrganizations =
    notice?.["ext:UBLExtensions"]?.["ext:UBLExtension"]?.["ext:ExtensionContent"]?.["efext:EformsExtension"]?.["efac:Organizations"]?.["efac:Organization"];

  const organizations = Array.isArray(rawOrganizations)
    ? rawOrganizations
    : rawOrganizations ? [rawOrganizations] : [];

  const matching = organizations.find((organization) => {
    const company = organization?.["efac:Company"];
    const ref = scalarText(company?.["cac:PartyIdentification"]?.["cbc:ID"]);
    return buyerRef && ref === buyerRef;
  });

  const companyId = scalarText(
    matching?.["efac:Company"]?.["cac:PartyLegalEntity"]?.["cbc:CompanyID"]
  );

  return normalizeSiren(companyId);
}

export function normalizeBoamp(record) {
  return {
    source: "boamp",
    sourceId: record.idweb || record.id || null,
    sourceUrl: record.url_avis || null,
    opportunityType: "public_ai",
    title: scalarText(record.objet),
    buyerName: scalarText(record.nomacheteur),
    buyerSiren: boampBuyerSiren(record),
    publishedAt: scalarText(record.dateparution),
    deadlineAt: scalarText(record.datelimitereponse),
    procedure: scalarText(record.procedure_libelle || record.type_procedure),
    contractType: scalarText(record.type_marche),
    awardee: scalarText(record.titulaire),
    raw: record
  };
}

function normalizeTedDate(value) {
  const text = scalarText(value);
  if (!text) return null;

  // TED sometimes returns a calendar date plus offset but no time,
  // e.g. 2026-04-01+02:00. Preserve the published calendar day.
  const dateWithOffset = text.match(/^(\d{4}-\d{2}-\d{2})[+-]\d{2}:\d{2}$/);
  if (dateWithOffset) return `${dateWithOffset[1]}T00:00:00Z`;

  return text;
}

export function normalizeTed(record) {
  const publicationNumber = scalarText(record["publication-number"]);

  return {
    source: "ted",
    sourceId: publicationNumber,
    sourceUrl: publicationNumber
      ? `https://ted.europa.eu/fr/notice/-/detail/${publicationNumber}`
      : null,
    opportunityType: "public_ai",
    title: scalarText(record["notice-title"]),
    buyerName: scalarText(record["buyer-name"]),
    publishedAt: normalizeTedDate(record["publication-date"]),
    deadlineAt: normalizeTedDate(record["deadline-receipt-tender-date-lot"]),
    procedure: scalarText(record["procedure-type"]),
    contractType: scalarText(record["contract-nature"]),
    awardee: null,
    raw: record
  };
}

export function normalizeFreelanceMention(record) {
  return {
    source: "freelancemention",
    sourceId: record.id || null,
    sourceUrl: record.linkedin_post_url || null,
    opportunityType: "freelance_ai",
    title: scalarText(record.title),
    companyName: scalarText(record.company),
    city: scalarText(record.city),
    workMode: scalarText(record.work_mode),
    tjmLabel: scalarText(record.tjm),
    tjmAmount: Number.isFinite(Number(record.tjm_amount)) ? Number(record.tjm_amount) : null,
    duration: scalarText(record.duration),
    detectedAt: scalarText(record.detected_at),
    isOffMarket: Boolean(record.is_off_market),
    isDirectClient: Boolean(record.is_direct_client),
    contact: {
      firstName: scalarText(record.poster_firstname),
      lastName: scalarText(record.poster_lastname),
      linkedin: scalarText(record.poster_linkedin),
      email: scalarText(record.contact_email)
    },
    description: scalarText(record.description),
    raw: record
  };
}
