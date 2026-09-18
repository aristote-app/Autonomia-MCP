function scalar(value) {
  if (value == null) return null;
  if (Array.isArray(value)) return scalar(value[0]);
  if (typeof value === "object") {
    for (const key of ["value", "nom", "name", "denominationSociale", "id"]) {
      if (value[key] != null) return scalar(value[key]);
    }
    return null;
  }
  return String(value).trim() || null;
}

function numberValue(value) {
  if (value == null || value === "") return null;
  const normalized = String(value).replace(",", ".").replace(/\s/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function intValue(value) {
  const n = numberValue(value);
  return n == null ? null : Math.trunc(n);
}

function normalizeIdentifier(value) {
  const text = scalar(value);
  return text ? text.replace(/\s/g, "") : null;
}

function asList(value) {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

function supplierFrom(value) {
  if (!value) return null;
  if (typeof value === "string") {
    return { name: value, siret: null, siren: null, identifier: null };
  }

  const identifier = normalizeIdentifier(
    value.id ??
    value.identifiant ??
    value.siret ??
    value.siren ??
    value.identifier
  );

  return {
    name: scalar(
      value.denominationSociale ??
      value.nom ??
      value.name ??
      value.raisonSociale
    ),
    siret:
      normalizeIdentifier(value.siret) ||
      (identifier?.length === 14 ? identifier : null),
    siren:
      normalizeIdentifier(value.siren) ||
      (identifier?.length === 9 ? identifier : null),
    identifier,
    identifierType: scalar(value.typeIdentifiant ?? value.identifierType)
  };
}

export function normalizeDecpAwardRecord(record) {
  if (!record || typeof record !== "object") {
    throw new Error("DECP record must be an object");
  }

  const buyerRaw = record.acheteur ?? record.buyer ?? {};
  const buyerIdentifier = normalizeIdentifier(
    buyerRaw.id ??
    buyerRaw.siret ??
    record.acheteur_id ??
    record.siretAcheteur ??
    record.buyer_id
  );

  const buyer = {
    name: scalar(
      buyerRaw.nom ??
      buyerRaw.name ??
      record.acheteur_nom ??
      record.nomAcheteur ??
      record.buyer_name
    ),
    siret:
      normalizeIdentifier(buyerRaw.siret ?? record.siretAcheteur) ||
      (buyerIdentifier?.length === 14 ? buyerIdentifier : null),
    siren:
      normalizeIdentifier(buyerRaw.siren) ||
      (buyerIdentifier?.length === 9 ? buyerIdentifier : null),
    identifier: buyerIdentifier
  };

  const suppliersRaw =
    record.titulaires ??
    record.titulaire ??
    record.suppliers ??
    record.supplier ??
    [];

  const flattenedSuppliers = [1, 2, 3]
    .map((index) => {
      const identifier = normalizeIdentifier(record[`titulaire_id_${index}`]);
      const identifierType = scalar(record[`titulaire_typeidentifiant_${index}`]);
      if (!identifier || identifier === "CDL") return null;
      return {
        name: null,
        siret: identifier.length === 14 ? identifier : null,
        siren: identifier.length === 9 ? identifier : null,
        identifier,
        identifierType
      };
    })
    .filter(Boolean);

  const suppliers = [
    ...asList(suppliersRaw).map(supplierFrom),
    ...flattenedSuppliers
  ]
    .filter((supplier) => supplier?.name || supplier?.identifier)
    .filter((supplier, index, list) => {
      const key = supplier.identifier || supplier.siret || supplier.siren || supplier.name;
      return list.findIndex((item) =>
        (item.identifier || item.siret || item.siren || item.name) === key
      ) === index;
    });

  const contractReference = scalar(
    record.id ??
    record.idMarche ??
    record.identifiantMarche ??
    record.contract_reference
  );

  const cpvCode = scalar(
    record.codeCPV ??
    record.codecpv ??
    record.code_cpv ??
    record.cpv ??
    record.cpv_code
  );

  const sourceRecordId =
    scalar(record.uid) ||
    [buyer.identifier, contractReference, cpvCode].filter(Boolean).join("|") ||
    null;

  const execution = record.lieuExecution ?? record.execution_location ?? {};

  return {
    source: "decp",
    sourceRecordId,
    contractReference,
    lotReference: scalar(
      record.numeroLot ??
      record.lot ??
      record.lot_reference
    ),
    object: scalar(
      record.objet ??
      record.object ??
      record.title
    ),
    cpvCode,
    amount: numberValue(record.montant ?? record.amount),
    currency: scalar(record.devise ?? record.currency) || "EUR",
    awardDate: scalar(
      record.dateNotification ??
      record.datenotification ??
      record.date_notification ??
      record.award_date
    ),
    publicationDate: scalar(
      record.datePublicationDonnees ??
      record.datepublicationdonnees ??
      record.date_publication_donnees ??
      record.publication_date
    ),
    durationMonths: intValue(
      record.dureeMois ??
      record.dureemois ??
      record.duree_mois ??
      record.duration_months
    ),
    procedure: scalar(record.procedure),
    nature: scalar(record.nature),
    location: scalar(
      execution.nom ??
      execution.name ??
      record.lieuExecutionNom ??
      record.lieuexecution_code ??
      record.location
    ),
    buyer,
    suppliers,
    sourceUrl: scalar(record.url),
    raw: record
  };
}

export function normalizeDecpPayload(payload) {
  if (Array.isArray(payload)) return payload.map(normalizeDecpAwardRecord);

  const candidates = [
    payload?.marches,
    payload?.data,
    payload?.results,
    payload?.records
  ];

  const list = candidates.find(Array.isArray);
  if (list) return list.map(normalizeDecpAwardRecord);

  if (payload && typeof payload === "object") {
    return [normalizeDecpAwardRecord(payload)];
  }

  return [];
}
