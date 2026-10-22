import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function getSupabaseAuthConfig() {
  const url = String(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/+$/, "");
  // Public project key, not a service secret. Explicit configuration wins.
  // The fallback is restricted to the existing AUTONOMIA project.
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY ||
    (url === "https://haazpzbwcryaksgtormn.supabase.co"
      ? "sb_publishable_Bm1iNRfElahGZMkcsRkgIw_4XMjYPYS" : "");
  return { url, publishableKey };
}

export function authConfigured() {
  const { url, publishableKey } = getSupabaseAuthConfig();
  return Boolean(url && publishableKey);
}

export function authRequired() {
  return authConfigured() && process.env.AUTONOMIA_AUTH_REQUIRED === "true";
}

export async function createAuthServerClient() {
  if (!authConfigured()) {
    throw new Error("Supabase Auth is not configured");
  }

  const cookieStore = await cookies();
  const { url, publishableKey } = getSupabaseAuthConfig();

  return createServerClient(
    url,
    publishableKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Components cannot always write cookies.
            // proxy.js refreshes authenticated sessions when auth is enabled.
          }
        }
      }
    }
  );
}

export async function getCurrentClaims() {
  if (!authConfigured()) return null;

  const client = await createAuthServerClient();
  const { data, error } = await client.auth.getClaims();

  if (error || !data?.claims) return null;
  return data.claims;
}
