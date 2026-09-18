function arrayFirst(value) {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

export function normalizeBoamp(record) {
  return {
    source: "boamp",
    sourceId: record.idweb || record.id || null,
    sourceUrl: record.url_avis || null,
    opportunityType: "public_ai",
    title: record.objet || null,
    buyerName: record.nomacheteur || null,
    publishedAt: record.dateparution || null,
    deadlineAt: record.datelimitereponse || null,
    procedure: record.procedure_libelle || record.type_procedure || null,
    contractType: record.type_marche || null,
    awardee: record.titulaire || null,
    raw: record
  };
}

export function normalizeTed(record) {
  const publicationNumber = arrayFirst(record["publication-number"]);
  const title = arrayFirst(record["notice-title"]);
  const buyer = arrayFirst(record["buyer-name"]);

  return {
    source: "ted",
    sourceId: publicationNumber,
    sourceUrl: publicationNumber
      ? `https://ted.europa.eu/fr/notice/-/detail/${publicationNumber}`
      : null,
    opportunityType: "public_ai",
    title,
    buyerName: buyer,
    publishedAt: arrayFirst(record["publication-date"]),
    deadlineAt: arrayFirst(record["deadline-receipt-tender-date-lot"]),
    procedure: arrayFirst(record["procedure-type"]),
    contractType: arrayFirst(record["contract-nature"]),
    awardee: null,
    raw: record
  };
}
