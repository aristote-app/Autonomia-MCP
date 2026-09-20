import { NextResponse } from "next/server";
import { authConfigured, createAuthServerClient } from "../../../lib/auth/server.js";

export async function POST(request) {
  if (authConfigured()) {
    const supabase = await createAuthServerClient();
    await supabase.auth.signOut();
  }

  return NextResponse.redirect(new URL("/login", request.url), 303);
}
