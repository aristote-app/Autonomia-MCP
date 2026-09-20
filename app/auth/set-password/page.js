import { redirect } from "next/navigation";
import { createAuthServerClient, getCurrentClaims } from "../../../lib/auth/server.js";

async function updatePassword(formData) {
  "use server";

  const claims = await getCurrentClaims();
  if (!claims?.sub) {
    redirect("/login?error=session_required");
  }

  const password = String(formData.get("password") || "");
  const confirmation = String(formData.get("confirmation") || "");

  if (password.length < 10 || password !== confirmation) {
    redirect("/auth/set-password?error=password");
  }

  const supabase = await createAuthServerClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect("/auth/set-password?error=update_failed");
  }

  redirect("/");
}

export default async function SetPasswordPage({ searchParams }) {
  const params = await searchParams;
  const claims = await getCurrentClaims();

  if (!claims?.sub) {
    redirect("/login?error=session_required");
  }

  return (
    <main className="loginShell">
      <section className="loginCard">
        <p className="eyebrow">AUTONOMIA</p>
        <h1>Créer ton mot de passe</h1>
        <p className="lede">Minimum 10 caractères.</p>

        {params?.error && (
          <div className="loginError">
            {params.error === "password"
              ? "Les mots de passe doivent correspondre et contenir au moins 10 caractères."
              : "Le mot de passe n'a pas pu être enregistré."}
          </div>
        )}

        <form action={updatePassword} className="loginForm">
          <label>
            <span>Mot de passe</span>
            <input name="password" type="password" minLength="10" required />
          </label>
          <label>
            <span>Confirmation</span>
            <input name="confirmation" type="password" minLength="10" required />
          </label>
          <button type="submit">Activer mon compte</button>
        </form>
      </section>
    </main>
  );
}
