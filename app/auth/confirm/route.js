import { NextResponse } from "next/server";
import { createAuthServerClient } from "../../../lib/auth/server.js";

const ALLOWED_TYPES = new Set([
  "email",
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change"
]);

export async function GET(request) {
  const url = new URL(request.url);
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  const next = url.searchParams.get("next");

  const successPath =
    type === "invite" || type === "recovery"
      ? "/auth/set-password"
      : (next && next.startsWith("/") && !next.startsWith("//") ? next : "/");

  if (tokenHash && type && ALLOWED_TYPES.has(type)) {
    const supabase = await createAuthServerClient();
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type
    });

    if (!error) {
      return NextResponse.redirect(new URL(successPath, request.url), 303);
    }
  }

  return NextResponse.redirect(
    new URL("/login?error=confirmation_failed", request.url),
    303
  );
}
