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

export async function lookupCfaDockOpco(siret) {
  const normalized = cleanDigits(siret, 14);
  if (normalized.length !== 14) {
    return { available: false, found: false, reason: "invalid_siret" };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const url = new URL("https://www.cfadock.fr/api/opcos");
    url.searchParams.set("siret", normalized);

    const response = await fetch(url.toString(), {
      headers: { accept: "application/json" },
      cache: "no-store",
      signal: controller.signal
    });

    if (!response.ok) {
      return {
        available: false,
        found: false,
        reason: `http_${response.status}`
      };
    }

    const payload = await response.json();
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

    const found =
      status === "OK" ||
      Boolean(opcoName);

    return {
      available: true,
      found,
      provider: "CFA Dock",
      status: status || null,
      opco_name: opcoName,
      opco_code: mapOpcoCode(opcoName),
      opco_siren:
        payload?.OpcoSiren ??
        payload?.opcoSiren ??
        null,
      idcc: idcc != null ? String(idcc) : null,
      source_url: url.toString()
    };
  } catch (error) {
    return {
      available: false,
      found: false,
      reason: error?.name === "AbortError"
        ? "timeout"
        : (error?.message || String(error))
    };
  } finally {
    clearTimeout(timer);
  }
}
