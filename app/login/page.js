import { redirect } from "next/navigation";
import { authConfigured, createAuthServerClient } from "../../lib/auth/server.js";

async function login(formData) {
  "use server";

  if (!authConfigured()) {
    redirect("/login?error=auth_not_configured");
  }

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const nextPath = String(formData.get("next") || "/");

  const supabase = await createAuthServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    redirect(`/login?error=invalid_credentials&next=${encodeURIComponent(nextPath)}`);
  }

  redirect(nextPath.startsWith("/") ? nextPath : "/");
}

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const error = params?.error || null;
  const nextPath = params?.next || "/";

  return (
    <main className="loginShell">
      <section className="loginCard">
        <p className="eyebrow">AUTONOMIA</p>
        <h1>Connexion</h1>
        <p className="lede">
          Accès réservé à l'équipe Autonomia.
        </p>

        {!authConfigured() && (
          <div className="loginNotice">
            L'authentification n'est pas encore activée dans l'environnement de production.
          </div>
        )}

        {error === "invalid_credentials" && (
          <div className="loginError">Email ou mot de passe incorrect.</div>
        )}

        <form action={login} className="loginForm">
          <input type="hidden" name="next" value={nextPath} />
          <label>
            <span>Email</span>
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            <span>Mot de passe</span>
            <input name="password" type="password" autoComplete="current-password" required />
          </label>
          <button type="submit">Se connecter</button>
        </form>
      </section>
    </main>
  );
}
