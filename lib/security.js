export function requireInternalToken(request) {
  const configured = process.env.AUTONOMIA_INTERNAL_TOKEN;

  if (!configured) {
    if (process.env.NODE_ENV === "production") {
      return {
        ok: false,
        response: Response.json(
          { error: "AUTONOMIA_INTERNAL_TOKEN is not configured" },
          { status: 503 }
        )
      };
    }
    return { ok: true };
  }

  const supplied = request.headers.get("x-autonomia-token");
  if (supplied !== configured) {
    return {
      ok: false,
      response: Response.json({ error: "Unauthorized" }, { status: 401 })
    };
  }

  return { ok: true };
}
