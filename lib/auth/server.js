import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function authConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_PUBLISHABLE_KEY
  );
}

export function authRequired() {
  return authConfigured() && process.env.AUTONOMIA_AUTH_REQUIRED === "true";
}

export async function createAuthServerClient() {
  if (!authConfigured()) {
    throw new Error("Supabase Auth is not configured");
  }

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_PUBLISHABLE_KEY,
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
