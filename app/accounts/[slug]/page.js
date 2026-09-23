import Link from "next/link";
import { notFound } from "next/navigation";
import { loadAccountBySlug } from "../../../lib/db/accountIntelligence.js";
import { hasAutonomiaDatabase } from "../../../lib/db/supabase.js";
import { discoverDecisionMakers } from "../../../lib/collectors/decisionMakers.js";
import { researchAccountPublicContext } from "../../../lib/collectors/accountResearch.js";
import { resolveHiddenEndClient } from "../../../lib/collectors/endClientResolver.js";
import { resolveFrenchCompanyRegistry } from "../../../lib/collectors/companyRegistry.js";
import { buildAccountOutreachPlan } from "../../../lib/intelligence/outreach.js";
import { buildAccountBattlecard } from "../../../lib/intelligence/battlecard.js";
import { buildAccountOpportunityGraph } from "../../../lib/intelligence/accountGraph.js";
import { listConsultantsWithSkills } from "../../../lib/db/consultants.js";
import { rankConsultantsForAccount } from "../../../lib/intelligence/consultantAccounts.js";
import { getCurrentWorkspaceMembership } from "../../../lib/auth/access.js";
import { listSalesContacts } from "../../../lib/db/salesContacts.js";
import {
  saveDecisionMakerCandidate,
  verifyDecisionMaker
} from "../../actions/sales-contacts.js";
import {
  sendVerifiedContactToWaalaxy,
  enrichVerifiedContactWithKaspr
} from "../../actions/sales-outreach.js";
import {
  getWaalaxyProspectLists,
  getWaalaxyCampaigns
} from "../../../lib/integrations/waalaxy.js";
import { getAccountWatch } from "../../../lib/db/accountWatches.js";
import {
  acknowledgeWatchedAccount,
  unwatchAccount,
  watchAccount
} from "../../actions/account-watches.js";
import {
  rankWaalaxyCampaigns,
  rankWaalaxyLists
} from "../../../lib/intelligence/campaignRouter.js";

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
  const battlecard = buildAccountBattlecard(account);
  const companyRegistry = !account.intermediary_risk
    ? await resolveFrenchCompanyRegistry(account.name, { perPage: 5 }).catch(() => null)
    : null;
  const workspaceContext = await getCurrentWorkspaceMembership().catch(() => ({
    configured: false,
    claims: null,
    membership: null
  }));
  const hasWorkspaceSession = Boolean(
    workspaceContext?.claims?.sub && workspaceContext?.membership?.workspace_id
  );
  const canWriteContacts =
    hasWorkspaceSession && workspaceContext.membership.role !== "viewer";

  const shouldPrepare = query?.prepare === "1";
  const shouldDiscover =
    query?.discover === "1" || (shouldPrepare && !account.intermediary_risk);
  const shouldResearch =
    query?.research === "1" || (shouldPrepare && !account.intermediary_risk);
  const shouldResolveClient =
    query?.resolveClient === "1" || (shouldPrepare && account.intermediary_risk);
  const decisionDiscoveryEnabled =
    hasWorkspaceSession &&
    process.env.AUTONOMIA_DECISION_DISCOVERY_ENABLED === "true" &&
    Boolean(process.env.BRAVE_SEARCH_API_KEY);
  const accountResearchEnabled =
    hasWorkspaceSession &&
    process.env.AUTONOMIA_ACCOUNT_RESEARCH_ENABLED === "true" &&
    Boolean(process.env.BRAVE_SEARCH_API_KEY);
  const hiddenClientResolverEnabled =
    hasWorkspaceSession &&
    process.env.AUTONOMIA_ACCOUNT_RESEARCH_ENABLED === "true" &&
    Boolean(process.env.BRAVE_SEARCH_API_KEY);
  const kasprConfigured = Boolean(process.env.KASPR_API_KEY);
  const kasprEnrichmentConfigured = Boolean(
    process.env.KASPR_API_KEY &&
    String(process.env.KASPR_DATA_TO_GET || "").trim()
  );
  const waalaxyConfigured = Boolean(process.env.WAALAXY_API_KEY);
  const accountWatch = hasWorkspaceSession
    ? await getAccountWatch({
        ownerId: workspaceContext.claims.sub,
        accountSlug: account.slug
      }).catch(() => null)
    : null;

  const shouldLoadWaalaxy =
    query?.waalaxy === "1" &&
    hasWorkspaceSession &&
    waalaxyConfigured;

  const [decisionMakers, accountResearch, hiddenClientResolution, savedContacts, consultantPool, waalaxyOptions] = await Promise.all([
    shouldDiscover && decisionDiscoveryEnabled
      ? discoverDecisionMakers({
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
      : Promise.resolve(null),
    shouldResearch && accountResearchEnabled && !account.intermediary_risk
      ? researchAccountPublicContext({
          company: account.name,
          countPerQuery: 8
        }).catch((error) => ({
          available: false,
          reason: error instanceof Error ? error.message : String(error),
          evidence: [],
          searches: []
        }))
      : Promise.resolve(null),
    shouldResolveClient && hiddenClientResolverEnabled && account.intermediary_risk
      ? resolveHiddenEndClient({
          account,
          maxSignals: 2,
          countPerQuery: 8
        }).catch((error) => ({
          available: false,
          reason: error instanceof Error ? error.message : String(error),
          candidates: [],
          searches: []
        }))
      : Promise.resolve(null),
    hasWorkspaceSession
      ? listSalesContacts({
          workspaceId: workspaceContext.membership.workspace_id,
          accountKey: account.slug,
          limit: 50
        }).catch(() => [])
      : Promise.resolve([]),
    hasWorkspaceSession
      ? listConsultantsWithSkills({ limit: 500 }).catch(() => [])
      : Promise.resolve([]),
    shouldLoadWaalaxy
      ? Promise.all([
          getWaalaxyProspectLists(),
          getWaalaxyCampaigns()
        ])
          .then(([lists, campaigns]) => ({
            available: true,
            lists: Array.isArray(lists) ? lists : [],
            campaigns: Array.isArray(campaigns?.campaigns) ? campaigns.campaigns : []
          }))
          .catch((error) => ({
            available: false,
            error: error instanceof Error ? error.message : String(error),
            lists: [],
            campaigns: []
          }))
      : Promise.resolve(null)
  ]);

  const consultantRanking = rankConsultantsForAccount({
    account,
    consultants: consultantPool,
    limit: 5
  });
  const consultantMatches = consultantRanking.matches;
  const opportunityGraph = buildAccountOpportunityGraph(account, {
    consultantMatches
  });

  const waalaxyRouting =
    waalaxyOptions?.available
      ? {
          campaigns: rankWaalaxyCampaigns({
            account,
            campaigns: waalaxyOptions.campaigns
          }),
          lists: rankWaalaxyLists({
            account,
            lists: waalaxyOptions.lists
          })
        }
      : null;

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

      {hasWorkspaceSession && (
        <section className="accountPrepareBar">
          <div>
            <span>ACCOUNT AGENT</span>
            <strong>Préparer le plan d'attaque en une passe</strong>
            <small>
              {account.intermediary_risk
                ? "Recherche uniquement des traces possibles du client final ; aucune prospection de l'intermédiaire."
                : "Contexte public + décideurs candidats + battlecard + messages sourcés. Cache activé pour éviter les appels répétés."}
            </small>
          </div>
          {(account.intermediary_risk ? hiddenClientResolverEnabled : accountResearchEnabled && decisionDiscoveryEnabled) ? (
            <Link href={`/accounts/${account.slug}?prepare=1#${account.intermediary_risk ? "hidden-client-resolver" : "account-research"}`}>
              {shouldPrepare ? "Brief préparé · actualiser" : "Préparer ce compte →"}
            </Link>
          ) : (
            <span className="disabledAction">
              Prêt après activation sécurisée des chercheurs
            </span>
          )}
        </section>
      )}

      {hasWorkspaceSession && (
        <section className="accountWatchBar">
          <div>
            <span>VEILLE COMPTE</span>
            <strong>
              {accountWatch?.enabled ? "Sous surveillance" : "Non surveillé"}
            </strong>
            {Number(accountWatch?.query?.unseen_signal_delta || 0) > 0 && (
              <small>
                {accountWatch.query.unseen_signal_delta} nouveau{accountWatch.query.unseen_signal_delta > 1 ? "x" : ""} signal{accountWatch.query.unseen_signal_delta > 1 ? "s" : ""} depuis ta dernière validation.
              </small>
            )}
          </div>
          <div className="accountWatchActions">
            {accountWatch?.enabled ? (
              <>
                {Number(accountWatch?.query?.unseen_signal_delta || 0) > 0 && (
                  <form action={acknowledgeWatchedAccount}>
                    <input type="hidden" name="account_slug" value={account.slug} />
                    <button type="submit">Marquer les signaux vus</button>
                  </form>
                )}
                <form action={unwatchAccount}>
                  <input type="hidden" name="account_slug" value={account.slug} />
                  <button type="submit" className="secondary">Arrêter la veille</button>
                </form>
              </>
            ) : (
              <form action={watchAccount}>
                <input type="hidden" name="account_slug" value={account.slug} />
                <button type="submit">Surveiller ce compte</button>
              </form>
            )}
          </div>
        </section>
      )}

      <section className="accountBrief">
        <div>
          <span>TYPE DE COMPTE</span>
          <strong>
            {account.account_type === "intermediary"
              ? "Intermédiaire / marketplace"
              : account.account_type === "public_buyer"
                ? "Acheteur public"
                : "Client final à qualifier"}
          </strong>
        </div>
        <div>
          <span>OFFRE À OUVRIR</span>
          <strong>{account.recommended_offer || "Qualification IA"}</strong>
        </div>
        <div>
          <span>CIBLE PRIORITAIRE</span>
          <strong>{account.primary_decision_role?.label || "DSI / Direction digitale"}</strong>
        </div>
        <div>
          <span>SIGNAL D'ACCROCHE</span>
          <strong>{account.playbook?.trigger || "Signal à qualifier"}</strong>
          {account.playbook?.proof_url && (
            <a href={account.playbook.proof_url} target="_blank" rel="noreferrer">
              Preuve source ↗
            </a>
          )}
        </div>
      </section>

      {!account.intermediary_risk && companyRegistry?.available && companyRegistry.best && (
        <section className="detailPanel companyRegistryPanel">
          <div className="sectionTitle">
            <div>
              <p className="eyebrow">IDENTITÉ ENTREPRISE · SOURCE PUBLIQUE</p>
              <h2>{companyRegistry.best.name}</h2>
            </div>
            <p>
              Correspondance registre : {companyRegistry.best.match_status} · score {companyRegistry.best.score}/100.
              Les données juridiques restent distinctes du signal commercial.
            </p>
          </div>
          <div className="accountBrief">
            <div>
              <span>SIREN</span>
              <strong>{companyRegistry.best.siren || "—"}</strong>
            </div>
            <div>
              <span>ACTIVITÉ / NAF</span>
              <strong>{companyRegistry.best.naf || "—"}</strong>
            </div>
            <div>
              <span>EFFECTIF</span>
              <strong>{companyRegistry.best.employee_bracket || "Non disponible"}</strong>
            </div>
            <div>
              <span>SIÈGE</span>
              <strong>
                {[companyRegistry.best.postal_code, companyRegistry.best.city].filter(Boolean).join(" ") || "Non disponible"}
              </strong>
            </div>
          </div>
          {companyRegistry.best.score < 80 && (
            <p className="accountHint">
              Correspondance insuffisante pour considérer cette unité légale comme identifiée : vérification humaine requise.
            </p>
          )}
        </section>
      )}

      {account.intermediary_risk && (
        <section className="accountResearchPanel" id="hidden-client-resolver">
          <div className="sectionTitle">
            <div>
              <p className="eyebrow">HIDDEN CLIENT RESOLVER</p>
              <h2>Chercher le client final sans l'inventer.</h2>
            </div>
            <p>
              Autonomia cherche des traces publiques indépendantes du même besoin. Un résultat reste
              un candidat à vérifier, jamais une identité client affirmée automatiquement.
            </p>
          </div>

          {!hiddenClientResolution && (
            <div className="accountResearchAction">
              {hiddenClientResolverEnabled ? (
                <Link href={`/accounts/${account.slug}?resolveClient=1#hidden-client-resolver`}>
                  Chercher des traces du client final →
                </Link>
              ) : (
                <span>
                  Resolver prêt · activation après sécurisation du cockpit
                </span>
              )}
              <small>2 recherches Brave maximum · aucun crédit Kaspr.</small>
            </div>
          )}

          {hiddenClientResolution?.available && hiddenClientResolution.candidates.length > 0 && (
            <div className="accountResearchGrid">
              {hiddenClientResolution.candidates.map((candidate) => (
                <article key={candidate.candidate_url}>
                  <div className="attentionLine">
                    <span className="attentionBucket">TRACE POSSIBLE</span>
                    <span>{candidate.candidate_domain}</span>
                    <span>Similarité {candidate.similarity_score}/100</span>
                  </div>
                  <strong>{candidate.title || candidate.candidate_domain}</strong>
                  {candidate.snippet && <p>{candidate.snippet}</p>}
                  <small>Besoin d'origine : {candidate.source_signal_title}</small>
                  <a href={candidate.candidate_url} target="_blank" rel="noreferrer">
                    Vérifier cette trace ↗
                  </a>
                </article>
              ))}
            </div>
          )}

          {hiddenClientResolution?.available && hiddenClientResolution.candidates.length === 0 && (
            <div className="emptyState">
              Aucune trace indépendante suffisamment similaire. Autonomia ne devine pas le client final.
            </div>
          )}

          {shouldResolveClient && !hiddenClientResolverEnabled && (
            <div className="emptyState">
              Resolver désactivé tant que le cockpit n'est pas sécurisé.
            </div>
          )}

          {hiddenClientResolution && !hiddenClientResolution.available && (
            <div className="emptyState">
              Resolver indisponible : {hiddenClientResolution.reason || "configuration manquante"}.
            </div>
          )}
        </section>
      )}

      {!account.intermediary_risk && (
        <section className="accountResearchPanel" id="account-research">
          <div className="sectionTitle">
            <div>
              <p className="eyebrow">ACCOUNT RESEARCHER</p>
              <h2>Contexte public complémentaire.</h2>
            </div>
            <p>
              Recherche volontaire et à la demande. Ces résultats n'augmentent jamais le score
              tant qu'ils ne sont pas validés comme preuves utiles.
            </p>
          </div>

          {!accountResearch && (
            <div className="accountResearchAction">
              {accountResearchEnabled ? (
                <Link href={`/accounts/${account.slug}?research=1#account-research`}>
                  Rechercher le contexte public →
                </Link>
              ) : (
                <span>
                  Account Researcher prêt · activation après sécurisation du cockpit
                </span>
              )}
              <small>2 recherches Brave maximum par déclenchement.</small>
            </div>
          )}

          {accountResearch?.available && accountResearch.evidence.length > 0 && (
            <div className="accountResearchGrid">
              {accountResearch.evidence.map((item) => (
                <article key={item.url}>
                  <div className="attentionLine">
                    <span className="attentionBucket">{item.kind}</span>
                    <span>{item.domain || "web"}</span>
                  </div>
                  <strong>{item.title}</strong>
                  {item.snippet && <p>{item.snippet}</p>}
                  <a href={item.url} target="_blank" rel="noreferrer">Ouvrir la source ↗</a>
                </article>
              ))}
            </div>
          )}

          {accountResearch?.available && accountResearch.evidence.length === 0 && (
            <div className="emptyState">Aucun contexte public supplémentaire suffisamment exploitable.</div>
          )}

          {shouldResearch && !accountResearchEnabled && (
            <div className="emptyState">
              Recherche compte désactivée tant que le cockpit n'est pas sécurisé.
            </div>
          )}

          {accountResearch && !accountResearch.available && (
            <div className="emptyState">
              Account Researcher indisponible : {accountResearch.reason || "configuration manquante"}.
            </div>
          )}
        </section>
      )}

      <section className="accountGraphSection">
        <div className="sectionTitle">
          <div>
            <p className="eyebrow">OPPORTUNITY GRAPH</p>
            <h2>Du signal à l'action commerciale.</h2>
          </div>
          <p>
            Lecture déterministe : chaque bloc est dérivé des signaux du compte, sans inventer
            de besoin ou de décideur réel.
          </p>
        </div>

        <div className="accountGraph">
          <div className="accountGraphColumn">
            <span>SIGNAUX</span>
            {opportunityGraph.nodes.filter((item) => item.type === "signal").slice(0, 5).map((item) => (
              <article key={item.id}>
                <strong>{item.label}</strong>
                <small>{item.source_id || "source"}</small>
                {item.source_url && <a href={item.source_url} target="_blank" rel="noreferrer">Preuve ↗</a>}
              </article>
            ))}
          </div>

          <div className="accountGraphArrow">→</div>

          <div className="accountGraphColumn">
            <span>BESOINS</span>
            {opportunityGraph.nodes.filter((item) => item.type === "need").map((item) => (
              <article key={item.id}><strong>{item.label}</strong></article>
            ))}
          </div>

          <div className="accountGraphArrow">→</div>

          <div className="accountGraphColumn">
            <span>DÉCIDEURS À CHERCHER</span>
            {opportunityGraph.nodes.filter((item) => item.type === "decision_role").slice(0, 3).map((item) => (
              <article key={item.id}>
                <strong>{item.label}</strong>
                {item.reason && <small>{item.reason}</small>}
              </article>
            ))}
          </div>

          <div className="accountGraphArrow">→</div>

          <div className="accountGraphColumn">
            <span>OFFRES</span>
            {opportunityGraph.nodes.filter((item) => item.type === "offer").map((item) => (
              <article key={item.id} className={item.recommended ? "recommended" : ""}>
                <strong>{item.label}</strong>
                {item.recommended && <small>Angle recommandé</small>}
              </article>
            ))}
          </div>

          <div className="accountGraphArrow">→</div>

          <div className="accountGraphColumn">
            <span>RESSOURCES</span>
            {opportunityGraph.nodes.filter((item) => item.type === "resource").length > 0 ? (
              opportunityGraph.nodes.filter((item) => item.type === "resource").map((item) => (
                <article key={item.id} className={item.suitable_for_proactive_outreach ? "recommended" : ""}>
                  <strong>{item.label}</strong>
                  <small>Matching {item.score}/100</small>
                  {item.matched_skills?.length > 0 && (
                    <small>{item.matched_skills.slice(0, 3).join(" · ")}</small>
                  )}
                </article>
              ))
            ) : (
              <article>
                <strong>Aucune ressource chargée</strong>
                <small>Le matching apparaîtra ici dès que le pool consultant sera alimenté.</small>
              </article>
            )}
          </div>
        </div>
      </section>

      {hasWorkspaceSession && (
        <section className="accountConsultantSection">
          <div className="sectionTitle">
            <div>
              <p className="eyebrow">OPPORTUNITY → CONSULTANT MATCHING</p>
              <h2>Consultants compatibles avec ce compte.</h2>
            </div>
            <p>
              Matching déterministe entre compétences déclarées et signaux sourcés. Le score n'est ni une probabilité de mission ni une probabilité de signature.
            </p>
          </div>

          {consultantMatches.length > 0 ? (
            <div className="accountConsultantList">
              {consultantMatches.map((match) => (
                <article key={match.consultant_id || match.consultant_name}>
                  <div className="accountConsultantTop">
                    <div>
                      <strong>{match.consultant_name || "Consultant"}</strong>
                      <p>{match.reason}</p>
                    </div>
                    <span>{match.score}/100</span>
                  </div>

                  <div className="accountConsultantFacts">
                    <span>
                      Compétences · {match.matched_skills.length ? match.matched_skills.join(", ") : "Aucune correspondance explicite"}
                    </span>
                    <span>
                      Disponibilité · {match.available_from ? formatDate(match.available_from) : "Non renseignée"}
                    </span>
                    <span>
                      Localisation · {match.locations?.length ? match.locations.join(", ") : match.remote ? "Remote" : "Non renseignée"}
                    </span>
                    <span>
                      TJM · {match.tjm != null ? match.tjm + " " + match.currency : "Non renseigné"}
                    </span>
                    <span>
                      Expérience · {match.years_experience != null ? match.years_experience + " ans" : "Non renseignée"}
                    </span>
                  </div>

                  <div className="accountConsultantGaps">
                    <strong>Gaps détectés</strong>
                    <span>{match.gaps?.length ? match.gaps.join(" · ") : "Aucun gap de domaine détecté dans les compétences déclarées."}</span>
                  </div>

                  {match.proof_url && (
                    <a href={match.proof_url} target="_blank" rel="noreferrer">
                      Voir le signal qui justifie le matching ↗
                    </a>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="emptyState">
              {consultantPool.length
                ? "Aucun consultant actif ne présente encore de convergence explicite avec les signaux de ce compte."
                : "Le pool consultant est vide : importe les consultants pour activer le matching compte → ressource."}
            </div>
          )}
        </section>
      )}

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
            {decisionDiscoveryEnabled ? (
              <Link href={`/accounts/${account.slug}?discover=1#decision-makers`}>
                Trouver les décideurs maintenant →
              </Link>
            ) : (
              <span className="disabledAction">
                Recherche décideurs prête · activation après sécurisation du cockpit
              </span>
            )}
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
                        {canWriteContacts && (
                          <form action={saveDecisionMakerCandidate}>
                            <input type="hidden" name="account_key" value={account.slug} />
                            <input type="hidden" name="account_name" value={account.name} />
                            <input type="hidden" name="linkedin_url" value={candidate.linkedin_url} />
                            <input type="hidden" name="name_guess" value={candidate.name_guess || ""} />
                            <input type="hidden" name="headline" value={candidate.headline || ""} />
                            <input type="hidden" name="matched_role" value={candidate.matched_role || ""} />
                            <input type="hidden" name="relevance_score" value={candidate.relevance_score} />
                            <input type="hidden" name="trigger_title" value={account.timeline[0]?.title || ""} />
                            <input type="hidden" name="trigger_url" value={account.timeline[0]?.source_url || ""} />
                            <input type="hidden" name="offer_track" value={account.recommended_offer || ""} />
                            <input type="hidden" name="trigger_source" value={account.timeline[0]?.source_id || ""} />
                            <input type="hidden" name="account_type" value={account.account_type || ""} />
                            <button type="submit">Sauvegarder candidat</button>
                          </form>
                        )}
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

            {shouldDiscover && !decisionDiscoveryEnabled && (
              <div className="emptyState">
                Recherche décideurs désactivée pour protéger le quota Brave tant que le cockpit n'est pas sécurisé.
              </div>
            )}

            {decisionMakers && !decisionMakers.available && (
              <div className="emptyState">
                Recherche décideurs indisponible : {decisionMakers.reason || "configuration manquante"}.
              </div>
            )}
          </div>
        </div>

        {hasWorkspaceSession && (
          <div className="detailPanel savedContactsPanel">
            <p className="eyebrow">MÉMOIRE COMMERCIALE</p>
            <h2>Contacts sauvegardés</h2>
            {savedContacts.length ? (
              <div className="savedContactList">
                {savedContacts.map((contact) => (
                  <article key={contact.id}>
                    <div className="savedContactTop">
                      <div>
                        <strong>{contact.full_name || contact.role_title || "Contact LinkedIn"}</strong>
                        <p>
                          {contact.matched_role || contact.role_title || "Fonction à vérifier"}
                        </p>
                      </div>
                      <span className={"contactStatus " + contact.verification_status}>
                        {contact.verification_status === "verified"
                          ? "Vérifié"
                          : contact.verification_status === "rejected"
                            ? "Rejeté"
                            : "Candidat"}
                      </span>
                    </div>

                    <div className="savedContactFacts">
                      <a href={contact.linkedin_url} target="_blank" rel="noreferrer">
                        LinkedIn ↗
                      </a>
                      {contact.email_b2b && (
                        <a href={"mailto:" + contact.email_b2b}>Email pro ↗</a>
                      )}
                      {contact.email_direct && !contact.email_b2b && (
                        <a href={"mailto:" + contact.email_direct}>Email ↗</a>
                      )}
                      {contact.phone && (
                        <a href={"tel:" + contact.phone}>Téléphone ↗</a>
                      )}
                      <span>Kaspr : {contact.enrichment_status}</span>
                      <span>Waalaxy : {contact.outreach_status}</span>
                    </div>

                    {canWriteContacts && contact.verification_status === "candidate" && (
                      <div className="savedContactActions">
                        <form action={verifyDecisionMaker}>
                          <input type="hidden" name="contact_id" value={contact.id} />
                          <input type="hidden" name="account_key" value={account.slug} />
                          <input type="hidden" name="status" value="verified" />
                          <button type="submit">Confirmer le contact</button>
                        </form>
                        <form action={verifyDecisionMaker}>
                          <input type="hidden" name="contact_id" value={contact.id} />
                          <input type="hidden" name="account_key" value={account.slug} />
                          <input type="hidden" name="status" value="rejected" />
                          <button type="submit" className="secondary">Rejeter</button>
                        </form>
                      </div>
                    )}

                    {canWriteContacts &&
                      contact.verification_status === "verified" &&
                      !contact.do_not_contact &&
                      contact.enrichment_status !== "enriched" && (
                        <div className="kasprContactAction">
                          {kasprEnrichmentConfigured ? (
                            <form action={enrichVerifiedContactWithKaspr}>
                              <input type="hidden" name="contact_id" value={contact.id} />
                              <input type="hidden" name="account_key" value={account.slug} />
                              <button type="submit">Enrichir avec Kaspr</button>
                              <small>
                                Action manuelle · uniquement les champs autorisés · consommation de crédits possible.
                              </small>
                            </form>
                          ) : (
                            <small>
                              Kaspr détecté mais enrichissement verrouillé tant que les champs payants autorisés ne sont pas configurés.
                            </small>
                          )}
                        </div>
                      )}

                    {canWriteContacts &&
                      contact.verification_status === "verified" &&
                      !contact.do_not_contact &&
                      waalaxyConfigured &&
                      !contact.waalaxy_list_id && (
                        <div className="waalaxyContactAction" id={"waalaxy-" + contact.id}>
                          {!waalaxyOptions ? (
                            <Link href={`/accounts/${account.slug}?waalaxy=1#waalaxy-${contact.id}`}>
                              Préparer Waalaxy →
                            </Link>
                          ) : waalaxyOptions.available && waalaxyOptions.lists.length > 0 ? (
                            <form action={sendVerifiedContactToWaalaxy}>
                              <input type="hidden" name="contact_id" value={contact.id} />
                              <input type="hidden" name="account_key" value={account.slug} />
                              <label>
                                <span>Liste Waalaxy</span>
                                <select
                                  name="prospect_list_id"
                                  required
                                  defaultValue={waalaxyRouting?.lists?.recommended?._id || ""}
                                >
                                  <option value="" disabled>Choisir une liste</option>
                                  {(waalaxyRouting?.lists?.ranked || waalaxyOptions.lists).map((list) => (
                                    <option key={list._id} value={list._id}>
                                      {list.name || list._id}
                                      {list._id === waalaxyRouting?.lists?.recommended?._id ? " · recommandée" : ""}
                                    </option>
                                  ))}
                                </select>
                              </label>
                              <label>
                                <span>Campagne (optionnel)</span>
                                <select
                                  name="campaign_id"
                                  defaultValue={waalaxyRouting?.campaigns?.recommended?._id || ""}
                                >
                                  <option value="">Liste uniquement</option>
                                  {(waalaxyRouting?.campaigns?.ranked || waalaxyOptions.campaigns).map((campaign) => (
                                    <option key={campaign._id} value={campaign._id}>
                                      {campaign.name || campaign._id}
                                      {campaign._id === waalaxyRouting?.campaigns?.recommended?._id ? " · recommandée" : ""}
                                    </option>
                                  ))}
                                </select>
                              </label>
                              {waalaxyRouting?.campaigns?.recommended && (
                                <small className="waalaxyRecommendation">
                                  Campagne recommandée : {waalaxyRouting.campaigns.recommended.name} · {waalaxyRouting.campaigns.track.label}.
                                  Validation obligatoire avant envoi.
                                </small>
                              )}
                              <button type="submit">Envoyer vers Waalaxy</button>
                            </form>
                          ) : (
                            <small>
                              {waalaxyOptions.error
                                ? "Waalaxy indisponible : " + waalaxyOptions.error
                                : "Aucune liste Waalaxy disponible."}
                            </small>
                          )}
                        </div>
                      )}

                    {contact.waalaxy_list_id && (
                      <div className="waalaxySynced">
                        <strong>Waalaxy synchronisé</strong>
                        <span>Liste : {contact.waalaxy_list_id}</span>
                        {contact.waalaxy_campaign_id && (
                          <span>Campagne : {contact.waalaxy_campaign_id}</span>
                        )}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <p className="accountHint">
                Aucun contact sauvegardé. Les candidats ne sont enregistrés qu'après action explicite.
              </p>
            )}
          </div>
        )}

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

      <section className="accountBattlecardSection">
        <div className="sectionTitle">
          <div>
            <p className="eyebrow">RDV / CALL PREP</p>
            <h2>Battlecard commerciale.</h2>
          </div>
          <p>
            Préparation déterministe à partir du compte, du signal et de l'offre. Les inconnues restent des questions.
          </p>
        </div>

        <div className="battlecardGrid">
          <article className="battlecardLead">
            <span>OBJECTIF</span>
            <strong>{battlecard.objective}</strong>
            <p>{battlecard.opener}</p>
            <dl>
              <div><dt>Cible</dt><dd>{battlecard.target_role}</dd></div>
              <div><dt>Offre</dt><dd>{battlecard.offer}</dd></div>
            </dl>
          </article>

          <article>
            <span>5 QUESTIONS À POSER</span>
            <ol>
              {battlecard.questions.map((question) => <li key={question}>{question}</li>)}
            </ol>
          </article>

          <article>
            <span>OBJECTIONS À PRÉPARER</span>
            <div className="battlecardObjections">
              {battlecard.objections.map((item) => (
                <div key={item.objection}>
                  <strong>{item.objection}</strong>
                  <p>{item.response}</p>
                </div>
              ))}
            </div>
          </article>

          <article>
            <span>PREUVES À GARDER SOUS LA MAIN</span>
            <div className="battlecardEvidence">
              {battlecard.evidence.length ? battlecard.evidence.map((item) => (
                <div key={(item.source_url || "") + ":" + item.title}>
                  <strong>{item.title}</strong>
                  <small>{item.source_id || "source"}</small>
                  {item.source_url && (
                    <a href={item.source_url} target="_blank" rel="noreferrer">Source ↗</a>
                  )}
                </div>
              )) : (
                <p>Aucune preuve source disponible.</p>
              )}
            </div>
          </article>
        </div>

        <div className="outreachGuardrails">
          {battlecard.guardrails.map((rule) => <span key={rule}>{rule}</span>)}
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
