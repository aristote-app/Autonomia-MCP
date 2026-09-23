export function requireOrganicAuth(request) {
  const expected = String(process.env.AUTONOMIA_ORGANIC_TOKEN || "").trim();

  if (!expected) {
    return {
      ok: false,
      response: Response.json(
        { ok: false, error: "organic_token_missing" },
        { status: 503 }
      )
    };
  }

  const authorization = request.headers.get("authorization") || "";
  const supplied = authorization.startsWith("Bearer ")
    ? authorization.slice(7).trim()
    : "";

  if (!supplied || supplied !== expected) {
    return {
      ok: false,
      response: Response.json(
        { ok: false, error: "unauthorized" },
        { status: 401 }
      )
    };
  }

  return { ok: true };
}
