function scalarText(value) {
  if (value == null) return null;
  if (Array.isArray(value)) return scalarText(value[0]);
  if (typeof value === "object") {
    const preferred = ["fra", "eng", "fre"];
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

export function normalizeBoamp(record) {
  return {
    source: "boamp",
    sourceId: record.idweb || record.id || null,
    sourceUrl: record.url_avis || null,
    opportunityType: "public_ai",
    title: scalarText(record.objet),
    buyerName: scalarText(record.nomacheteur),
    publishedAt: scalarText(record.dateparution),
    deadlineAt: scalarText(record.datelimitereponse),
    procedure: scalarText(record.procedure_libelle || record.type_procedure),
    contractType: scalarText(record.type_marche),
    awardee: scalarText(record.titulaire),
    raw: record
  };
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
    publishedAt: scalarText(record["publication-date"]),
    deadlineAt: scalarText(record["deadline-receipt-tender-date-lot"]),
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
