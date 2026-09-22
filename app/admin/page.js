import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminDashboard } from "../../lib/admin/dashboard.js";
import { WORKSPACE_ROLES } from "../../lib/auth/access.js";
import {
  bootstrapWorkspace,
  inviteMember,
  updateMemberRole,
  setMemberActive,
  refreshMarketNow
} from "./actions.js";

export const dynamic = "force-dynamic";

const ROLE_LABELS = {
  admin: "Admin",
  direction: "Direction",
  public_markets: "Marchés publics",
  sales: "Commercial",
  staffing: "Staffing / recrutement",
  contributor: "Contributeur",
  viewer: "Lecture seule"
};

const STAGE_LABELS = {
  new: "Nouveau",
  review: "À analyser",
  go: "GO",
  no_go: "NO-GO",
  in_progress: "En cours",
  proposal: "Proposition",
  submitted: "Déposé / envoyé",
  won: "Gagné",
  lost: "Perdu",
  archived: "Archivé"
};

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function messageFor(code) {
  const messages = {
    workspace_created: "Workspace Autonomia créé.",
    member_invited: "Invitation envoyée.",
    role_updated: "Rôle mis à jour.",
    member_activated: "Utilisateur réactivé.",
    member_deactivated: "Utilisateur désactivé.",
    auth_not_configured: "L'authentification Supabase n'est pas encore configurée.",
    workspace_already_exists: "Un workspace existe déjà.",
    invalid_email: "Adresse email invalide.",
    invalid_role: "Rôle invalide.",
    invite_failed: "L'invitation Supabase a échoué.",
    invite_missing_user: "Supabase n'a pas retourné l'utilisateur invité.",
    invalid_member_update: "Mise à jour utilisateur invalide.",
    last_admin: "Impossible de retirer ou désactiver le dernier administrateur.",
    cannot_disable_self: "Tu ne peux pas désactiver ton propre compte.",
    market_refreshed: "Rafraîchissement terminé.",
    market_refresh_failed: "Le rafraîchissement Free-Work a échoué. Consulte le journal des collectes."
  };
  return messages[code] || code;
}

export default async function AdminPage({ searchParams }) {
  const params = await searchParams;
  const dashboard = await getAdminDashboard();

  if (dashboard.state === "not_authenticated") {
    redirect("/login?next=/admin");
  }

  if (dashboard.state === "not_authorized") {
    return (
      <main>
        <div className="detailBack"><Link href="/">← Retour au cockpit</Link></div>
        <section className="adminState">
          <p className="eyebrow">ADMIN</p>
          <h1>Accès refusé</h1>
          <p>Ce compte n'a pas de rôle Direction ou Admin.</p>
        </section>
      </main>
    );
  }

  if (dashboard.state === "auth_not_configured") {
    return (
      <main>
        <div className="detailBack"><Link href="/">← Retour au cockpit</Link></div>
        <section className="adminState">
          <p className="eyebrow">ESPACE ÉQUIPE</p>
          <h1>Le cockpit fonctionne. L’accès multi-utilisateur n’est pas encore activé.</h1>
          <p>
            Ce n’est pas un problème de base de données : Supabase alimente déjà le cockpit.
            Seule la connexion par comptes utilisateurs reste à finaliser avant d’ouvrir les rôles,
            affectations et invitations.
          </p>

          <div className="adminReadiness">
            <article>
              <strong>OK</strong>
              <span>Base Supabase</span>
              <small>Données du cockpit connectées</small>
            </article>
            <article>
              <strong>À ACTIVER</strong>
              <span>Connexion équipe</span>
              <small>Création du premier administrateur puis activation de l’authentification</small>
            </article>
          </div>

          <p className="adminStateHint">
            Tant que cette étape n’est pas activée, le bouton Admin sert uniquement à signaler cet état.
            Les opportunités, signaux, territoires et sources restent accessibles depuis le cockpit.
          </p>
        </section>
      </main>
    );
  }

  if (dashboard.state === "bootstrap") {
    return (
      <main>
        <div className="detailBack"><Link href="/">← Retour au cockpit</Link></div>
        <section className="adminState">
          <p className="eyebrow">PREMIÈRE CONFIGURATION</p>
          <h1>Créer le workspace Autonomia</h1>
          <p>Le compte actuellement connecté deviendra le premier administrateur.</p>

          <form action={bootstrapWorkspace} className="adminForm">
            <label>
              <span>Nom du workspace</span>
              <input name="name" defaultValue="Autonomia" required />
            </label>
            <label>
              <span>Ton nom affiché</span>
              <input name="display_name" placeholder="Déborah" />
            </label>
            <button type="submit">Créer le workspace</button>
          </form>
        </section>
      </main>
    );
  }

  const { metrics, members, recentActivities, collectorRuns, stageCounts, workspace } = dashboard;

  return (
    <main>
      <header className="adminHeader">
        <div>
          <p className="eyebrow">AUTONOMIA ADMIN</p>
          <h1>{workspace?.name || "Workspace"}</h1>
          <p className="lede">Comptes, activité, pipeline et santé du système.</p>
        </div>
        <div className="adminHeaderActions">
          <Link href="/">Cockpit</Link>
          <form action="/auth/logout" method="post">
            <button type="submit">Déconnexion</button>
          </form>
        </div>
      </header>

      {(params?.success || params?.error) && (
        <div className={`adminFlash ${params?.error ? "error" : "success"}`}>
          <strong>{messageFor(params?.error || params?.success)}</strong>
          {params?.success === "market_refreshed" && (
            <span>
              Free-Work persisté : {params?.freelance || "0"} · Signaux emploi persistés : {params?.signals || "0"}
              {params?.signals_status === "unavailable" ? " · LinkedIn/Indeed : connecteur de découverte indisponible" : ""}
            </span>
          )}
        </div>
      )}

      <section className="adminMetrics">
        <article><strong>{metrics.activeMembers}</strong><span>utilisateurs actifs</span></article>
        <article><strong>{metrics.opportunities}</strong><span>opportunités</span></article>
        <article><strong>{metrics.jobSignals}</strong><span>signaux emploi/freelance</span></article>
        <article><strong>{metrics.workItems}</strong><span>dossiers suivis</span></article>
      </section>

      <section className="adminSection">
        <div className="sectionTitle">
          <div>
            <p className="eyebrow">COMPTES</p>
            <h2>Utilisateurs et rôles</h2>
          </div>
          <p>Les invitations passent par Supabase Auth. La désactivation conserve l'historique.</p>
        </div>

        <div className="adminSplit">
          <div className="memberList">
            {members.map((member) => (
              <article className="memberCard" key={member.user_id}>
                <div className="memberIdentity">
                  <strong>{member.display_name || member.email || "Utilisateur"}</strong>
                  <span>{member.email || member.user_id}</span>
                  <small>{member.active ? "ACTIF" : "INACTIF"}</small>
                </div>

                <form action={updateMemberRole} className="memberRoleForm">
                  <input type="hidden" name="user_id" value={member.user_id} />
                  <select name="role" defaultValue={member.role}>
                    {WORKSPACE_ROLES.map((role) => (
                      <option key={role} value={role}>{ROLE_LABELS[role] || role}</option>
                    ))}
                  </select>
                  <button type="submit">Mettre à jour</button>
                </form>

                <form action={setMemberActive}>
                  <input type="hidden" name="user_id" value={member.user_id} />
                  <input type="hidden" name="active" value={member.active ? "false" : "true"} />
                  <button type="submit" className="secondaryButton">
                    {member.active ? "Désactiver" : "Réactiver"}
                  </button>
                </form>
              </article>
            ))}
          </div>

          <aside className="invitePanel">
            <p className="eyebrow">INVITER</p>
            <h3>Ajouter un utilisateur</h3>
            <form action={inviteMember} className="adminForm">
              <label>
                <span>Email</span>
                <input name="email" type="email" required />
              </label>
              <label>
                <span>Nom affiché</span>
                <input name="display_name" />
              </label>
              <label>
                <span>Rôle</span>
                <select name="role" defaultValue="contributor">
                  {WORKSPACE_ROLES.map((role) => (
                    <option key={role} value={role}>{ROLE_LABELS[role] || role}</option>
                  ))}
                </select>
              </label>
              <button type="submit">Envoyer l'invitation</button>
            </form>
          </aside>
        </div>
      </section>

      <section className="adminSection">
        <div className="sectionTitle">
          <div>
            <p className="eyebrow">PIPELINE ÉQUIPE</p>
            <h2>Dossiers suivis</h2>
          </div>
        </div>
        <div className="stageGrid">
          {Object.entries(STAGE_LABELS).map(([stage, label]) => (
            <article key={stage}>
              <strong>{stageCounts[stage] || 0}</strong>
              <span>{label}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="adminSection">
        <div className="sectionTitle">
          <div>
            <p className="eyebrow">SANTÉ DU RADAR</p>
            <h2>Dernières collectes</h2>
          </div>
          <form action={refreshMarketNow} className="radarRefreshForm">
            <button type="submit">Rafraîchir maintenant</button>
            <small>Free-Work + découverte LinkedIn/Indeed</small>
          </form>
        </div>
        <div className="adminTable">
          <div className="adminTableRow header radar">
            <span>Source</span><span>Statut</span><span>Démarré</span><span>Terminé</span><span>Détail</span>
          </div>
          {collectorRuns.map((run) => (
            <div className="adminTableRow radar" key={run.id}>
              <span>{run.source_id || "job-signals / multi-source"}</span>
              <span>{run.status}</span>
              <span>{formatDate(run.started_at)}</span>
              <span>{formatDate(run.completed_at)}</span>
              <span className="collectorDetail">
                {run.error_message
                  ? run.error_message
                  : run.stats
                    ? [
                        run.stats.fetched != null ? `${run.stats.fetched} récupérés` : null,
                        run.stats.persisted != null ? `${run.stats.persisted} persistés` : null,
                        run.stats.discovered != null ? `${run.stats.discovered} détectés` : null
                      ].filter(Boolean).join(" · ") || "OK"
                    : "OK"}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="adminSection">
        <div className="sectionTitle">
          <div>
            <p className="eyebrow">JOURNAL</p>
            <h2>Activité récente</h2>
          </div>
        </div>
        <div className="activityList">
          {recentActivities.length ? recentActivities.map((event) => (
            <article key={event.id}>
              <strong>{event.action}</strong>
              <span>{event.entity_type}{event.entity_id ? ` · ${event.entity_id}` : ""}</span>
              <time>{formatDate(event.created_at)}</time>
            </article>
          )) : (
            <div className="emptyState">Aucune activité enregistrée pour le moment.</div>
          )}
        </div>
      </section>
    </main>
  );
}
