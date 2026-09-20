import Link from "next/link";
import { SOURCES, SOURCE_GROUPS } from "../lib/sources.js";
import { hasAutonomiaDatabase } from "../lib/db/supabase.js";
import {
  searchRankedOpportunities,
  getBuyerMarketIntelligence,
  getIntelligenceDashboardSummary
} from "../lib/db/intelligence.js";
import {
  buildUnifiedTodayQueue,
  summarizeUnifiedTodayQueue
} from "../lib/intelligence/today.js";
import { searchJobSignals } from "../lib/db/jobSignals.js";

export const dynamic = "force-dynamic";

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

    return {
      summary,
      today,
      todaySummary: summarizeUnifiedTodayQueue(today),
      buyers: buyers.items
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
              <article><strong>{live.todaySummary.total}</strong><span>à traiter</span></article>
              <article><strong>{live.todaySummary.directMissions}</strong><span>missions freelance</span></article>
              <article><strong>{live.todaySummary.companySignals}</strong><span>signaux entreprises</span></article>
              <article><strong>{live.todaySummary.urgent}</strong><span>urgents</span></article>
            </div>

            <div className="opportunityList">
              {live.today.length ? live.today.map((item) => (
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
              )) : (
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
