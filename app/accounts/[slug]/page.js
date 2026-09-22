import Link from "next/link";
import { notFound } from "next/navigation";
import { loadAccountBySlug } from "../../../lib/db/accountIntelligence.js";
import { hasAutonomiaDatabase } from "../../../lib/db/supabase.js";
import { discoverDecisionMakers } from "../../../lib/collectors/decisionMakers.js";
import { buildAccountOutreachPlan } from "../../../lib/intelligence/outreach.js";

export const dynamic = "force-dynamic";

function formatDate(value) {
  if (!value) return "Date non disponible";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

const KIND_LABELS = {
  freelance: "Mission / staffing",
  training: "Formation",
  public: "Marché public",
  private: "Signal entreprise"
};

export default async function AccountDetailPage({ params, searchParams }) {
  if (!hasAutonomiaDatabase()) notFound();

  const { slug } = await params;
  const query = await searchParams;
  const account = await loadAccountBySlug(slug).catch(() => null);
  if (!account) notFound();

  const outreach = buildAccountOutreachPlan(account);
  const shouldDiscover = query?.discover === "1";
  const decisionMakers = shouldDiscover
    ? await discoverDecisionMakers({
        company: account.name,
        roles: account.decision_roles,
        maxRoles: 3,
        countPerRole: 5
      }).catch((error) => ({
        available: false,
        reason: error instanceof Error ? error.message : String(error),
        candidates: [],
        searches: []
      }))
    : null;

  const kasprConfigured = Boolean(process.env.KASPR_API_KEY);
  const waalaxyConfigured = Boolean(process.env.WAALAXY_API_KEY);

  return (
    <main>
      <div className="detailBack">
        <Link href="/accounts">← Tous les comptes</Link>
      </div>

      <header className="accountDetailHero">
        <div>
          <p className="eyebrow">ACCOUNT 360°</p>
          <h1>{account.name}</h1>
          <p className="lede">
            {account.signal_count} signaux · {account.source_count} sources ·{" "}
            {account.offers.length} pistes commerciales
          </p>
        </div>
        <div className="accountHeat accountHeatLarge">
          <strong>{account.heat_score}</strong>
          <span>{account.heat_label}</span>
        </div>
      </header>

      <section className="accountDetailGrid">
        <div className="detailPanel">
          <p className="eyebrow">POURQUOI MAINTENANT ?</p>
          <h2>Convergence des signaux</h2>
          <div className="whyNow large">
            <ul>
              {account.why_now.map((reason) => <li key={reason}>{reason}</li>)}
            </ul>
          </div>

          <div className="nextAction">
            <span>PROCHAINE ACTION RECOMMANDÉE</span>
            <strong>{account.next_action}</strong>
          </div>
        </div>

        <aside className="detailPanel">
          <p className="eyebrow">OFFRES AUTONOMIA</p>
          <h2>Angles possibles</h2>
          <div className="offerStack">
            {account.offers.map((offer) => (
              <div key={offer}>
                <strong>{offer}</strong>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="accountDetailGrid">
        <div className="detailPanel">
          <p className="eyebrow">DECISION MAKER ENGINE</p>
          <h2>Qui chercher ?</h2>
          <div className="decisionRoleList">
            {account.decision_roles.map((role, index) => (
              <article key={role.label}>
                <span>#{index + 1}</span>
                <div>
                  <strong>{role.label}</strong>
                  <p>{role.reason}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="accountHint">
            Étape suivante : identifier 1 à 3 personnes réelles correspondant à ces fonctions,
            puis enrichir seulement les meilleurs contacts avec Kaspr.
          </p>

          <div className="decisionFinderActions">
            <Link href={`/accounts/${account.slug}?discover=1#decision-makers`}>
              Trouver les décideurs maintenant →
            </Link>
            <span>Recherche publique à la demande · pas de boucle automatique</span>
          </div>

          <div id="decision-makers" className="decisionCandidates">
            {decisionMakers?.available && decisionMakers.candidates.length > 0 && (
              <>
                <div className="integrationState">
                  <span>Kaspr : <strong>{kasprConfigured ? "clé détectée" : "à brancher"}</strong></span>
                  <span>Waalaxy : <strong>{waalaxyConfigured ? "clé détectée" : "à brancher"}</strong></span>
                </div>
                {decisionMakers.candidates.map((candidate, index) => (
                  <article key={candidate.linkedin_url}>
                    <div>
                      <span className="candidateRank">#{index + 1}</span>
                    </div>
                    <div>
                      <strong>{candidate.name_guess || candidate.headline || "Profil LinkedIn"}</strong>
                      <p>{candidate.matched_role} · pertinence {candidate.relevance_score}/100</p>
                      {candidate.snippet && <small>{candidate.snippet}</small>}
                      <div className="candidateActions">
                        <a href={candidate.linkedin_url} target="_blank" rel="noreferrer">
                          Vérifier le profil LinkedIn ↗
                        </a>
                        <span className={kasprConfigured ? "ready" : ""}>
                          {kasprConfigured ? "Kaspr prêt" : "Kaspr à connecter"}
                        </span>
                        <span className={waalaxyConfigured ? "ready" : ""}>
                          {waalaxyConfigured ? "Waalaxy prêt" : "Waalaxy à connecter"}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
                <p className="accountHint">
                  Ces profils sont des candidats issus de résultats publics : vérifie la fonction
                  avant tout enrichissement ou prospection.
                </p>
              </>
            )}

            {decisionMakers?.available && decisionMakers.candidates.length === 0 && (
              <div className="emptyState">
                Aucun profil suffisamment crédible trouvé sur les trois premiers rôles. Aucun crédit Kaspr dépensé.
              </div>
            )}

            {decisionMakers && !decisionMakers.available && (
              <div className="emptyState">
                Recherche décideurs indisponible : {decisionMakers.reason || "configuration manquante"}.
              </div>
            )}
          </div>
        </div>

        <aside className="detailPanel">
          <p className="eyebrow">COUVERTURE</p>
          <h2>Ce que l'on sait</h2>
          <dl className="detailFacts">
            <div><dt>Signaux</dt><dd>{account.signal_count}</dd></div>
            <div><dt>Sources distinctes</dt><dd>{account.source_count}</dd></div>
            <div><dt>Signaux ≤ 7 j</dt><dd>{account.recent_7d}</dd></div>
            <div><dt>Signaux ≤ 30 j</dt><dd>{account.recent_30d}</dd></div>
            <div><dt>Localisations</dt><dd>{account.locations.join(" · ") || "—"}</dd></div>
            <div><dt>Sources</dt><dd>{account.sources.join(" · ") || "—"}</dd></div>
          </dl>
        </aside>
      </section>

      <section className="accountAttackSection">
        <div className="sectionTitle">
          <div>
            <p className="eyebrow">PLAN D'ATTAQUE</p>
            <h2>Que dire et quand ?</h2>
          </div>
          <p>
            Séquence générée par règles à partir des preuves du compte. Elle doit être validée avant envoi.
          </p>
        </div>

        <div className="outreachSequence">
          {outreach.sequence.map((step) => (
            <article key={step.day + ":" + step.channel + ":" + step.action}>
              <div className="outreachDay">J+{step.day}</div>
              <div>
                <div className="attentionLine">
                  <span className="attentionBucket">{step.channel}</span>
                  <span>{step.action}</span>
                </div>
                {step.subject && <strong>{step.subject}</strong>}
                <p>{step.content}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="outreachGuardrails">
          {outreach.guardrails.map((rule) => <span key={rule}>{rule}</span>)}
        </div>
      </section>

      <section className="accountTimelineSection">
        <div className="sectionTitle">
          <div>
            <p className="eyebrow">SIGNAL STACKING</p>
            <h2>Timeline du compte</h2>
          </div>
          <p>Chaque élément reste relié à sa source pour distinguer les faits des interprétations.</p>
        </div>

        <div className="accountTimeline">
          {account.timeline.map((event) => (
            <article key={`${event.kind}:${event.id}`}>
              <div className="timelineDate">{formatDate(event.date)}</div>
              <div className="timelineBody">
                <div className="attentionLine">
                  <span className="attentionBucket">{KIND_LABELS[event.kind] || event.kind}</span>
                  <span>{event.source_id || "source"}</span>
                </div>
                <h3>{event.title}</h3>
                {event.location && <p>{event.location}</p>}
                {event.source_url && (
                  <a href={event.source_url} target="_blank" rel="noreferrer">
                    Ouvrir la preuve source ↗
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
