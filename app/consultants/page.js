import Link from "next/link";
import { getCurrentWorkspaceMembership } from "../../lib/auth/access.js";
import {
  listConsultantsWithSkills,
  getConsultantPoolSummary
} from "../../lib/db/consultants.js";
import { loadAccountIntelligence } from "../../lib/db/accountIntelligence.js";
import { rankAccountsForConsultant } from "../../lib/intelligence/consultantAccounts.js";

export const dynamic = "force-dynamic";

function money(value, currency = "EUR") {
  if (value == null) return "TJM non renseigné";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency || "EUR",
    maximumFractionDigits: 0
  }).format(Number(value)) + " / j";
}

function date(value) {
  if (!value) return "Disponibilité inconnue";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

export default async function ConsultantsPage() {
  const context = await getCurrentWorkspaceMembership().catch(() => ({
    configured: false,
    claims: null,
    membership: null
  }));
  const hasSession = Boolean(context?.claims?.sub && context?.membership?.workspace_id);

  if (!hasSession) {
    return (
      <main>
        <div className="detailBack"><Link href="/">← Retour au cockpit</Link></div>
        <header className="integrationHero">
          <p className="eyebrow">AUTONOMIA · CONSULTANT INTELLIGENCE</p>
          <h1>Consultants.</h1>
          <p className="lede">
            Pool privé pour le matching mission ↔ consultant et l'approche proactive des comptes.
          </p>
        </header>
        <div className="lockedContactState">
          <strong>Pool privé prêt</strong>
          <span>Visible uniquement après authentification du workspace.</span>
        </div>
      </main>
    );
  }

  const [consultants, summary, accountResult] = await Promise.all([
    listConsultantsWithSkills({ limit: 500 }).catch(() => []),
    getConsultantPoolSummary().catch(() => ({
      total: 0, active: 0, available_now: 0, remote: 0, tjm_known: 0
    })),
    loadAccountIntelligence({ limit: 250 }).catch(() => ({ accounts: [] }))
  ]);

  const accounts = accountResult.accounts || [];
  const proactiveMatches = new Map(
    consultants.map((consultant) => [
      consultant.id,
      rankAccountsForConsultant({
        consultant,
        accounts,
        limit: 3
      }).matches
    ])
  );

  return (
    <main>
      <div className="detailBack"><Link href="/">← Retour au cockpit</Link></div>

      <header className="integrationHero">
        <p className="eyebrow">AUTONOMIA · CONSULTANT INTELLIGENCE</p>
        <h1>Consultants.</h1>
        <p className="lede">
          La même donnée sert dans les deux sens : trouver le meilleur profil pour une mission
          et trouver les meilleurs comptes à attaquer pour un profil disponible.
        </p>
      </header>

      <section className="consultantMetrics">
        <article><strong>{summary.active}</strong><span>Actifs</span></article>
        <article><strong>{summary.available_now}</strong><span>Disponibles maintenant</span></article>
        <article><strong>{summary.remote}</strong><span>Remote</span></article>
        <article><strong>{summary.tjm_known}</strong><span>TJM connus</span></article>
      </section>

      {consultants.length ? (
        <section className="consultantList">
          {consultants.map((consultant) => (
            <article key={consultant.id}>
              <div>
                <p className="buyer">{consultant.status}</p>
                <h3>{consultant.display_name}</h3>
                <div className="consultantFacts">
                  <span>{date(consultant.available_from)}</span>
                  <span>{money(consultant.tjm, consultant.currency)}</span>
                  <span>{consultant.remote ? "Remote possible" : "Remote non renseigné"}</span>
                  {consultant.years_experience != null && (
                    <span>{consultant.years_experience} ans d'expérience</span>
                  )}
                </div>
              </div>
              <div className="chips">
                {(consultant.skills || []).slice(0, 12).map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>

              {(proactiveMatches.get(consultant.id) || []).length > 0 && (
                <div className="nextAction">
                  <span>COMPTES À ATTAQUER POUR CE PROFIL</span>
                  <div className="offerStack">
                    {(proactiveMatches.get(consultant.id) || []).map((match) => (
                      <div key={match.account_slug}>
                        <strong>
                          <Link href={"/accounts/" + match.account_slug}>
                            {match.account_name} · {match.score}/100
                          </Link>
                        </strong>
                        <small>
                          {match.matched_skills.length
                            ? "Convergence : " + match.matched_skills.slice(0, 4).join(" · ")
                            : match.reason}
                        </small>
                        {match.trigger && <small>Signal : {match.trigger}</small>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>
          ))}
        </section>
      ) : (
        <div className="emptyState">
          Le moteur est prêt mais le pool contient actuellement 0 consultant.
          Aucun profil n'est inventé : l'import réel alimentera ensuite le matching bidirectionnel.
        </div>
      )}
    </main>
  );
}
