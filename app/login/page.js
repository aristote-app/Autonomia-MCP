import {parseEmailProof} from "../../lib/auth/emailProof.js";
import {safeInternalPath} from "../../lib/auth/redirect.js";
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

  const safeNext = safeInternalPath(nextPath,"/");
  redirect(safeNext);
}

async function sendMagicLink(formData){
 "use server";
 const next=safeInternalPath(formData.get('next'));
 const email=String(formData.get('email')||'').trim();
 if(!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)||email.length>254)redirect('/login?error=invalid_email&next='+encodeURIComponent(next));
 const supabase=await createAuthServerClient();
 const {error}=await supabase.auth.signInWithOtp({email,options:{shouldCreateUser:false,emailRedirectTo:'https://cockpit.build-autonomia.com/auth/callback?next='+encodeURIComponent(next)}});
 if(error)redirect('/login?error=email_unavailable&next='+encodeURIComponent(next));
 redirect('/login?sent=1&next='+encodeURIComponent(next));
}

async function verifyEmailToken(formData){
 "use server";
 const next=safeInternalPath(formData.get('next'));
 const email=String(formData.get('email')||'').trim();
 const received=String(formData.get('email_token')||'').trim();
 const supabase=await createAuthServerClient();
 let verification;
 try{verification=parseEmailProof(received,email);}catch{redirect('/login?error=confirmation_failed&next='+encodeURIComponent(next));}
 const {error}=await supabase.auth.verifyOtp(verification);
 if(error)redirect('/login?error=confirmation_failed&next='+encodeURIComponent(next));
 redirect(next);
}

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const error = params?.error || null;
  const nextPath = safeInternalPath(params?.next,"/");
  // Old cockpit links should open the requested page directly as well.
  if (nextPath === "/" || nextPath === "/collectivites" || nextPath === "/territoires") {
    redirect(nextPath);
  }

  // Integrations can be configured through the temporary secure access flow
  // while full cockpit authentication is not enabled.
  if (!authConfigured() && String(nextPath).startsWith("/integrations")) {
    redirect("/integrations#connection-settings");
  }

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

        {params?.sent==='1'&&<p role="status">Lien demandé. Consulte ta boîte mail et ouvre le lien dans ce même navigateur. Seuls les comptes déjà autorisés peuvent se connecter.</p>}
        {error==='email_unavailable'&&<p role="alert">Le lien n’a pas pu être envoyé. Réessaie dans quelques minutes ou utilise ton mot de passe.</p>}
        {error==='confirmation_failed'&&<p role="alert">Ce lien a expiré ou n’a pas pu être confirmé. Demande un nouveau lien depuis ce navigateur.</p>}
        <h2>Connexion par lien email</h2>
        <form action={sendMagicLink} className="loginForm">
         <input type="hidden" name="next" value={nextPath}/>
         <label>Email du compte<input name="email" type="email" autoComplete="email" required/></label>
         <button type="submit">Recevoir mon lien de connexion</button>
        </form>
        <details>
         <summary>J’ai reçu un lien ou un code de connexion</summary>
         <p>Si tu utilises un autre navigateur, colle ici le lien original reçu par email, ou le code si le message en contient un.</p>
         <form action={verifyEmailToken} className="loginForm">
          <input type="hidden" name="next" value={nextPath}/>
          <label>Email du compte<input name="email" type="email" autoComplete="email" required/></label>
          <label>Lien ou code reçu par email<input name="email_token" type="password" autoComplete="one-time-code" required/></label>
          <button type="submit">Valider mon accès par email</button>
         </form>
        </details>
        <h2>Connexion par mot de passe</h2>
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
