import Link from "next/link";
import { SOURCES, SOURCE_GROUPS } from "../lib/sources.js";
import { hasAutonomiaDatabase } from "../lib/db/supabase.js";
import {
  searchRankedOpportunities,
  getBuyerMarketIntelligence,
  getIntelligenceDashboardSummary
} from "../lib/db/intelligence.js";
import {
  buildUnifiedTodayQueue
} from "../lib/intelligence/today.js";
import { searchJobSignals } from "../lib/db/jobSignals.js";
import { getTeamWorkflowContext, queueKey } from "../lib/db/workItems.js";
import {
  claimWorkItem,
  assignWorkItem,
  updateWorkItem
} from "./actions/work-items.js";

export const dynamic = "force-dynamic";

const WORKFLOW_STAGES = [
  ["new", "Nouveau"],
  ["review", "À analyser"],
  ["go", "GO"],
  ["no_go", "NO-GO"],
  ["in_progress", "En cours"],
  ["proposal", "Proposition"],
  ["submitted", "Déposé / envoyé"],
  ["won", "Gagné"],
  ["lost", "Perdu"],
  ["archived", "Archivé"]
];

const WORKFLOW_PRIORITIES = [
  ["low", "Basse"],
  ["normal", "Normale"],
  ["high", "Haute"],
  ["urgent", "Urgente"]
];

function dueInputValue(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 16);
}

function formatNumber(value) {
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(Number(value) || 0);
}

function formatMoney(value) {
  if (value == null) return "—";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  }).format(Number(value));
}

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

async function loadLiveData() {
  if (!hasAutonomiaDatabase()) return null;

  try {
    const [summary, opportunities, buyers, jobSignals] = await Promise.all([
      getIntelligenceDashboardSummary(),
      searchRankedOpportunities({
        actionability: "active",
        aiRelatedOnly: true,
        minFitScore: 0,
        limit: 60
      }),
      getBuyerMarketIntelligence({
        minAiAwardRows: 1,
        limit: 6
      }),
      searchJobSignals({
        sources: ["linkedin", "indeed"],
        limit: 40
      })
    ]);

    const today = buildUnifiedTodayQueue({
      opportunities: opportunities.items,
      jobSignals: jobSignals.items,
      limit: 24
    });

    const workflow = await getTeamWorkflowContext(today);

    const directMissions =
      (summary.activeFreelanceOpportunities || 0) +
      (summary.freelanceJobSignals || 0);

    return {
      summary,
      today,
      todaySummary: {
        total: (summary.activeAiOpportunities || 0) + (summary.totalJobSignals || 0),
        directMissions,
        companySignals: summary.companyJobSignals || 0,
        urgent: summary.urgentAiOpportunities || 0
      },
      sourceHealth: {
        freelance:
          directMissions > 0
            ? "Flux alimenté"
            : summary.freeworkRows > 0
              ? "Aucune mission IA active"
              : "Free-Work non persisté",
        companySignals:
          (summary.totalJobSignals || 0) > 0
            ? "Flux alimenté"
            : "LinkedIn / Indeed non alimentés",
        urgent:
          (summary.urgentAiOpportunities || 0) > 0
            ? "Échéance ≤ 3 jours"
            : "Aucune échéance ≤ 3 jours"
      },
      buyers: buyers.items,
      workflow
    };
  } catch (error) {
    console.error("Autonomia dashboard data error", error);
    return null;
  }
}

export default async function Home() {
  const live = await loadLiveData();
  const staticCounts = SOURCES.reduce((acc, source) => {
    acc[source.status] = (acc[source.status] || 0) + 1;
    return acc;
  }, {});

  const metrics = live
    ? [
        [live.summary.totalOpportunities, "opportunités persistées"],
        [live.summary.aiRelatedOpportunities, "classées IA V2"],
        [live.summary.openAiOpportunities, "IA avec échéance ouverte"],
        [live.summary.publicAwards, "attributions historiques"]
      ]
    : [
        [SOURCES.length, "sources référencées"],
        [staticCounts.active || 0, "connecteurs actifs"],
        [staticCounts.ready_for_credentials || 0, "prêts pour credentials"],
        [3, "marchés principaux"]
      ];

  return (
    <main>
      <header className="hero">
        <div>
          <p className="eyebrow">AUTONOMIA</p>
          <h1>Market Intelligence</h1>
          <p className="lede">
            Un seul radar pour les marchés, missions freelance, signaux entreprises et besoins IA.
          </p>
        </div>
        <div className={`status ${live ? "live" : ""}`}>
          <strong>{live ? "LIVE" : "V1"}</strong>
          <span>{live ? "Supabase Autonomia connecté" : "Secrets production à connecter"}</span>
          <Link className="adminNav" href="/admin">Admin</Link>
        </div>
      </header>

      <section className="metrics">
        {metrics.map(([value, label]) => (
          <article key={label}>
            <strong>{formatNumber(value)}</strong>
            <span>{label}</span>
          </article>
        ))}
      </section>

      {live && (
        <>
          <section className="todaySection">
            <div className="sectionTitle">
              <div>
                <p className="eyebrow">À TRAITER AUJOURD'HUI</p>
                <h2>Une seule file. Toutes les opportunités.</h2>
              </div>
              <p>
                La priorité de tri organise le travail à partir des preuves disponibles.
                Elle ne représente pas une probabilité de gagner.
              </p>
            </div>

            <div className="todaySummary">
              <article>
                <strong>{live.todaySummary.total}</strong>
                <span>à traiter</span>
                <small>Base active, pas seulement les cartes visibles</small>
              </article>
              <article>
                <strong>{live.todaySummary.directMissions}</strong>
                <span>missions freelance</span>
                <small>{live.sourceHealth.freelance}</small>
              </article>
              <article>
                <strong>{live.todaySummary.companySignals}</strong>
                <span>signaux entreprises</span>
                <small>{live.sourceHealth.companySignals}</small>
              </article>
              <article>
                <strong>{live.todaySummary.urgent}</strong>
                <span>urgents</span>
                <small>{live.sourceHealth.urgent}</small>
              </article>
            </div>

            <div className="opportunityList">
              {live.today.length ? live.today.map((item) => {
                const workKey = queueKey(item.queue_kind, item.entity_id);
                const workItem = live.workflow?.workItems?.[workKey] || null;
                const owner = workItem?.owner_user_id
                  ? live.workflow?.members?.find((member) => member.user_id === workItem.owner_user_id)
                  : null;
                const canEditWorkItem =
                  live.workflow?.canWrite &&
                  (!workItem?.owner_user_id ||
                    workItem.owner_user_id === live.workflow.currentUserId ||
                    live.workflow.canAssign);

                return (
                <article className="opportunity" key={item.queue_id}>
                  <div className="oppTop">
                    <div>
                      <div className="attentionLine">
                        <span className="attentionBucket">{item.type_label}</span>
                        <span>{item.source_label}</span>
                        <span>Priorité {item.triage_score}/100</span>
                        <span>{item.attention_bucket}</span>
                      </div>
                      <p className="buyer">{item.company_name}</p>
                      <h3>{item.title}</h3>
                    </div>

                    {item.fit_score != null && (
                      <div className="score">
                        <strong>{item.fit_score}</strong>
                        <span>FIT / 100</span>
                      </div>
                    )}
                  </div>

                  {item.tags?.length > 0 && (
                    <div className="chips">
                      {item.tags.slice(0, 8).map((tag) => <span key={tag}>{tag}</span>)}
                    </div>
                  )}

                  <div className="oppMeta">
                    {item.location && <span>{item.location}</span>}
                    {item.deadline_at && <span>Échéance : {formatDate(item.deadline_at)}</span>}
                    {item.days_to_deadline != null && <span>{item.days_to_deadline} j restants</span>}
                    {item.coverage_percent != null && <span>Couverture : {item.coverage_percent}%</span>}
                    {(item.budget_max || item.budget_min) && (
                      <span>{formatMoney(item.budget_max || item.budget_min)}</span>
                    )}
                  </div>

                  <div className="nextAction">
                    <span>PROCHAINE ACTION</span>
                    <strong>{item.next_action}</strong>
                  </div>

                  {Array.isArray(item.staffing_roles) && item.staffing_roles.length > 0 && (
                    <p className="staffing">
                      <strong>Profils / rôles :</strong> {item.staffing_roles.join(" · ")}
                    </p>
                  )}

                  {live.workflow?.enabled && (
                    <div className="teamWorkflow">
                      <div className="teamWorkflowSummary">
                        <span>
                          <strong>Responsable</strong>
                          {owner?.display_name || (workItem?.owner_user_id ? "Utilisateur affecté" : "Non affecté")}
                        </span>
                        <span>
                          <strong>Étape</strong>
                          {WORKFLOW_STAGES.find(([value]) => value === (workItem?.stage || "new"))?.[1] || "Nouveau"}
                        </span>
                        <span>
                          <strong>Priorité équipe</strong>
                          {WORKFLOW_PRIORITIES.find(([value]) => value === (workItem?.priority || "normal"))?.[1] || "Normale"}
                        </span>

                        {!workItem?.owner_user_id && live.workflow.canWrite && (
                          <form action={claimWorkItem}>
                            <input type="hidden" name="item_type" value={item.queue_kind} />
                            <input type="hidden" name="item_id" value={item.entity_id} />
                            <button type="submit">Prendre en charge</button>
                          </form>
                        )}
                      </div>

                      {(live.workflow.canAssign || canEditWorkItem) && (
                        <details className="workflowDetails">
                          <summary>Suivi équipe</summary>

                          {live.workflow.canAssign && (
                            <form action={assignWorkItem} className="workflowForm compact">
                              <input type="hidden" name="item_type" value={item.queue_kind} />
                              <input type="hidden" name="item_id" value={item.entity_id} />
                              <label>
                                <span>Affecter à</span>
                                <select name="owner_user_id" defaultValue={workItem?.owner_user_id || ""}>
                                  <option value="">Non affecté</option>
                                  {live.workflow.members.map((member) => (
                                    <option key={member.user_id} value={member.user_id}>
                                      {member.display_name || member.user_id.slice(0, 8)}
                                    </option>
                                  ))}
                                </select>
                              </label>
                              <button type="submit">Affecter</button>
                            </form>
                          )}

                          {canEditWorkItem && (
                            <form action={updateWorkItem} className="workflowForm">
                              <input type="hidden" name="item_type" value={item.queue_kind} />
                              <input type="hidden" name="item_id" value={item.entity_id} />

                              <label>
                                <span>Étape</span>
                                <select name="stage" defaultValue={workItem?.stage || "review"}>
                                  {WORKFLOW_STAGES.map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                  ))}
                                </select>
                              </label>

                              <label>
                                <span>Priorité</span>
                                <select name="priority" defaultValue={workItem?.priority || "normal"}>
                                  {WORKFLOW_PRIORITIES.map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                  ))}
                                </select>
                              </label>

                              <label className="workflowWide">
                                <span>Prochaine action</span>
                                <input
                                  name="next_action"
                                  defaultValue={workItem?.next_action || item.next_action || ""}
                                />
                              </label>

                              <label>
                                <span>Échéance interne</span>
                                <input
                                  name="due_at"
                                  type="datetime-local"
                                  defaultValue={dueInputValue(workItem?.due_at)}
                                />
                              </label>

                              <button type="submit">Enregistrer le suivi</button>
                            </form>
                          )}
                        </details>
                      )}
                    </div>
                  )}

                  <div className="oppActions">
                    {item.internal_href && (
                      <Link href={item.internal_href}>Voir le besoin</Link>
                    )}
                    {item.source_url && (
                      <a href={item.source_url} target="_blank" rel="noreferrer">
                        Voir la source · {item.source_label} ↗
                      </a>
                    )}
                  </div>
                </article>
                );
              }) : (
                <div className="emptyState">
                  Aucun besoin n'est encore remonté dans la file unifiée.
                </div>
              )}
            </div>
          </section>

          <section className="buyerSection">
            <div className="sectionTitle">
              <div>
                <p className="eyebrow">HISTORIQUE DECP</p>
                <h2>Acheteurs observés</h2>
              </div>
              <p>Données factuelles agrégées depuis les attributions persistées.</p>
            </div>
            <div className="buyerGrid">
              {live.buyers.map((buyer) => (
                <article className="buyerCard" key={buyer.buyer_org_id}>
                  <h3>{buyer.buyer_name}</h3>
                  <dl>
                    <div><dt>Lignes IA</dt><dd>{buyer.ai_related_award_rows}</dd></div>
                    <div><dt>Titulaires observés</dt><dd>{buyer.observed_suppliers}</dd></div>
                    <div><dt>Montants connus</dt><dd>{formatMoney(buyer.known_amount_total)}</dd></div>
                    <div><dt>Dernière attribution</dt><dd>{formatDate(buyer.last_award_date)}</dd></div>
                  </dl>
                </article>
              ))}
            </div>
          </section>
        </>
      )}

      <section>
        <div className="sectionTitle">
          <div>
            <p className="eyebrow">COUVERTURE</p>
            <h2>Sources prioritaires</h2>
          </div>
          <p>API/open data et accès conformes prioritaires ; aucun contournement de protection technique.</p>
        </div>

        <div className="grid">
          {SOURCE_GROUPS.map((group) => (
            <article className="card" key={group.id}>
              <h3>{group.label}</h3>
              <p>{group.description}</p>
              <ul>
                {SOURCES.filter((source) => source.group === group.id).map((source) => (
                  <li key={source.id}>
                    <span>{source.name}</span>
                    <small className={source.status}>{source.priority} · {source.status}</small>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="pipeline">
        <p className="eyebrow">PIPELINE</p>
        <h2>Du signal brut à l'action commerciale</h2>
        <div className="pipelineRow">
          {["Collecte", "Preuve", "Normalisation", "Déduplication", "Classification", "Priorisation", "Besoin", "Action"].map((step) => (
            <span key={step}>{step}</span>
          ))}
        </div>
      </section>
    </main>
  );
}
