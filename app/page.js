import Link from "next/link";
import { SOURCES, SOURCE_GROUPS } from "../lib/sources.js";
import { hasAutonomiaDatabase } from "../lib/db/supabase.js";
import {
  searchRankedOpportunities,
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
    const [summary, opportunities, freelanceSignals, trainingSignals] = await Promise.all([
      getIntelligenceDashboardSummary(),
      searchRankedOpportunities({
        actionability: "active",
        aiRelatedOnly: true,
        minFitScore: 0,
        limit: 200
      }),
      searchJobSignals({
        sources: [
          "linkedin",
          "indeed",
          "freelancerepublik",
          "lehibou",
          "france_travail_jobs"
        ],
        freelanceOnly: true,
        limit: 80
      }),
      searchJobSignals({
        sources: [
          "france_travail_jobs",
          "linkedin",
          "indeed"
        ],
        signalKey: "training_need",
        limit: 80
      })
    ]);

    const visibleOpportunities = opportunities.items.filter((item) => {
      const source = String(item.primary_source_id || "").toLowerCase();
      const isPublicProcurement =
        item.opportunity_type === "public_ai" ||
        source === "boamp" ||
        source === "ted";

      // Public procurement is operational only while the stored deadline is open.
      // Award notices / historical results and unknown-deadline public notices stay out
      // of the commercial queue.
      return !isPublicProcurement || item.actionability_state === "open_by_deadline";
    });

    const today = buildUnifiedTodayQueue({
      opportunities: visibleOpportunities,
      jobSignals: [...freelanceSignals.items, ...trainingSignals.items],
      limit: 200
    });

    const workflow = await getTeamWorkflowContext(today);

    const directMissions = today.filter((item) => item.type_label === "Mission freelance").length;
    const trainingNeeds = today.filter((item) => item.type_label === "Besoin formation IA").length;

    return {
      summary,
      today,
      todaySummary: {
        total: (summary.activeAiOpportunities || 0) + (summary.totalJobSignals || 0),
        directMissions,
        trainingNeeds,
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
          directMissions > 0
            ? "Flux alimenté"
            : "Missions web non alimentées",
        urgent:
          (summary.urgentAiOpportunities || 0) > 0
            ? "Échéance ≤ 3 jours"
            : "Aucune échéance ≤ 3 jours"
      },
      workflow
    };
  } catch (error) {
    console.error("Autonomia dashboard data error", error);
    return null;
  }
}


const QUEUE_FILTERS = [
  ["all", "Tout"],
  ["public", "Marchés publics"],
  ["freelance", "Missions freelance"],
  ["training", "Formation IA"],
  ["urgent", "Urgents"]
];

const QUEUE_SORTS = [
  ["priority", "Priorité commerciale"],
  ["deadline", "Échéance la plus proche"],
  ["fit", "Meilleur FIT"],
  ["recent", "Plus récent"]
];

const SOURCE_FILTERS = [
  ["all", "Toutes les sources"],
  ["france_travail_jobs", "France Travail"],
  ["linkedin", "LinkedIn"],
  ["indeed", "Indeed"],
  ["freework", "Free-Work"],
  ["freelancerepublik", "FreelanceRepublik"],
  ["lehibou", "LeHibou"],
  ["boamp", "BOAMP"],
  ["ted", "TED / JOUE"]
];

function filterBySource(items, source) {
  if (!source || source === "all") return items;
  return items.filter((item) => String(item.source_id || "").toLowerCase() === source);
}

function countBySource(items, source) {
  return filterBySource(items, source).length;
}

function filterQueue(items, filter) {
  if (filter === "public") return items.filter((item) => item.type_label === "Marché public");
  if (filter === "freelance") return items.filter((item) => item.type_label === "Mission freelance");
  if (filter === "company") return items.filter((item) => item.type_label === "Signal entreprise");
  if (filter === "training") return items.filter((item) => item.type_label === "Formation IA" || item.type_label === "Besoin formation IA");
  if (filter === "urgent") return items.filter((item) => item.attention_bucket === "Urgent");
  return items;
}

function sortQueue(items, sort) {
  return [...items].sort((a, b) => {
    if (sort === "deadline") {
      const aValue = a.days_to_deadline == null ? Number.POSITIVE_INFINITY : Number(a.days_to_deadline);
      const bValue = b.days_to_deadline == null ? Number.POSITIVE_INFINITY : Number(b.days_to_deadline);
      return aValue - bValue || b.triage_score - a.triage_score;
    }

    if (sort === "fit") {
      const aValue = a.fit_score == null ? -1 : Number(a.fit_score);
      const bValue = b.fit_score == null ? -1 : Number(b.fit_score);
      return bValue - aValue || b.triage_score - a.triage_score;
    }

    if (sort === "recent") {
      const aValue = new Date(a.detected_at || a.published_at || 0).getTime() || 0;
      const bValue = new Date(b.detected_at || b.published_at || 0).getTime() || 0;
      return bValue - aValue || b.triage_score - a.triage_score;
    }

    return b.triage_score - a.triage_score;
  });
}

function countQueue(items, filter) {
  return filterQueue(items, filter).length;
}

export default async function Home({ searchParams }) {
  const live = await loadLiveData();
  const params = await searchParams;
  const activeFilter = QUEUE_FILTERS.some(([value]) => value === params?.filter) ? params.filter : "all";
  const activeSort = QUEUE_SORTS.some(([value]) => value === params?.sort) ? params.sort : "priority";
  const activeSource = SOURCE_FILTERS.some(([value]) => value === params?.source) ? params.source : "all";
  const filteredToday = live
    ? sortQueue(filterBySource(filterQueue(live.today, activeFilter), activeSource), activeSort)
    : [];

  const staticCounts = SOURCES.reduce((acc, source) => {
    acc[source.status] = (acc[source.status] || 0) + 1;
    return acc;
  }, {});

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
          {live && (
            <small className="statusMeta">
              {countQueue(live.today, "public")} marchés ouverts · {countQueue(live.today, "freelance")} missions freelance
            </small>
          )}
          <Link className="adminNav" href="/territoires">Territoires</Link>
          <Link className="adminNav" href="/admin">Admin</Link>
        </div>
      </header>

      {live && (
        <>
          <section className="todaySection" id="queue">
            <div className="sectionTitle">
              <div>
                <p className="eyebrow">FILE COMMERCIALE</p>
                <h2>Choisir, trier, ouvrir.</h2>
              </div>
              <p>
                Le score sert à ordonner le travail à partir des preuves disponibles.
                Il ne représente pas une probabilité de gagner.
              </p>
            </div>

            <div className="queueToolbar">
              <nav className="queueFilters" aria-label="Filtres des opportunités">
                {QUEUE_FILTERS.map(([value, label]) => (
                  <Link
                    key={value}
                    className={activeFilter === value ? "active" : ""}
                    href={`/?filter=${value}&source=${activeSource}&sort=${activeSort}#queue`}
                  >
                    <strong>{countQueue(live.today, value)}</strong>
                    <span>{label}</span>
                  </Link>
                ))}
              </nav>

              <nav className="sourceFilters" aria-label="Filtrer par source">
                {SOURCE_FILTERS.map(([value, label]) => (
                  <Link
                    key={value}
                    className={activeSource === value ? "active" : ""}
                    href={`/?filter=${activeFilter}&source=${value}&sort=${activeSort}#queue`}
                  >
                    <strong>{countBySource(filterQueue(live.today, activeFilter), value)}</strong>
                    <span>{label}</span>
                  </Link>
                ))}
              </nav>

              <form className="queueSort" method="get" action="/">
                <input type="hidden" name="filter" value={activeFilter} />
                <input type="hidden" name="source" value={activeSource} />
                <label htmlFor="queue-sort">Trier par</label>
                <select id="queue-sort" name="sort" defaultValue={activeSort}>
                  {QUEUE_SORTS.map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <button type="submit">Appliquer</button>
              </form>
            </div>

            <div className="queueResultMeta">
              <strong>{filteredToday.length} résultat{filteredToday.length > 1 ? "s" : ""}</strong>
              <span>
                sur {live.today.length} éléments chargés
                {activeSource !== "all" ? ` · source ${SOURCE_FILTERS.find(([value]) => value === activeSource)?.[1]}` : ""}
              </span>
            </div>

            <div className="opportunityList">
              {filteredToday.length ? filteredToday.map((item) => {
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
                      <p className="buyer">
                        {item.internal_href ? <Link href={item.internal_href}>{item.company_name}</Link> : item.company_name}
                      </p>
                      <h3>
                        {item.internal_href ? <Link href={item.internal_href}>{item.title}</Link> : item.title}
                      </h3>
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
                      <Link href={item.internal_href}>Ouvrir la fiche →</Link>
                    )}
                    {item.source_url && (
                      <a href={item.source_url} target="_blank" rel="noreferrer">
                        Ouvrir la source · {item.source_label} ↗
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
                {SOURCES.filter((source) => source.group === group.id && source.id !== "decp").map((source) => (
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
