import Link from "next/link";
import { SOURCES, SOURCE_GROUPS } from "../lib/sources.js";
import { hasAutonomiaDatabase } from "../lib/db/supabase.js";
import {
  searchRankedOpportunities,
  getBuyerMarketIntelligence,
  getIntelligenceDashboardSummary
} from "../lib/db/intelligence.js";
import {
  buildTodayQueue,
  summarizeTodayQueue
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
  if (!value) return "Échéance inconnue";
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
        actionability: "open",
        aiRelatedOnly: true,
        minFitScore: 0,
        limit: 30
      }),
      getBuyerMarketIntelligence({
        minAiAwardRows: 1,
        limit: 6
      }),
      searchJobSignals({
        sources: ["linkedin", "indeed"],
        limit: 12
      })
    ]);

    const today = buildTodayQueue(opportunities.items, { limit: 12 });

    return {
      summary,
      today,
      todaySummary: summarizeTodayQueue(today),
      buyers: buyers.items,
      jobSignals: jobSignals.items
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
        [live.summary.openAiOpportunities, "IA encore ouvertes"],
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
            Radar IA autonome : opportunités, preuves, échéances, staffing et prochaines actions.
          </p>
        </div>
        <div className={`status ${live ? "live" : ""}`}>
          <strong>{live ? "LIVE" : "V1"}</strong>
          <span>{live ? "Supabase Autonomia connecté" : "Secrets production à connecter"}</span>
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
                <h2>Ce qui mérite une décision humaine</h2>
              </div>
              <p>
                La priorité de tri combine urgence, fit, couverture des preuves et staffing.
                Elle sert à organiser le travail, pas à prédire un gain.
              </p>
            </div>

            <div className="todaySummary">
              <article><strong>{live.todaySummary.urgent}</strong><span>urgents</span></article>
              <article><strong>{live.todaySummary.thisWeek}</strong><span>cette semaine</span></article>
              <article><strong>{live.todaySummary.prepare}</strong><span>à préparer</span></article>
              <article><strong>{live.todaySummary.analyze}</strong><span>à analyser</span></article>
            </div>

            <div className="opportunityList">
              {live.today.length ? live.today.map((item) => (
                <article className="opportunity" key={item.id}>
                  <div className="oppTop">
                    <div>
                      <div className="attentionLine">
                        <span className="attentionBucket">{item.attention_bucket}</span>
                        <span>Priorité {item.triage_score}/100</span>
                      </div>
                      <p className="buyer">{item.buyer_name || "Acheteur non identifié"}</p>
                      <h3>{item.title}</h3>
                    </div>
                    <div className="score">
                      <strong>{item.autonomia_fit_score ?? "—"}</strong>
                      <span>FIT / 100</span>
                    </div>
                  </div>

                  <div className="chips">
                    {(item.ai_tags || []).map((tag) => <span key={tag}>{tag}</span>)}
                  </div>

                  <div className="oppMeta">
                    <span>{formatDate(item.deadline_at)}</span>
                    <span>{item.days_to_deadline == null ? "Délai inconnu" : `${item.days_to_deadline} j restants`}</span>
                    <span>Couverture : {item.fit_coverage_percent ?? 0}%</span>
                    {(item.budget_max || item.budget_min) && (
                      <span>{formatMoney(item.budget_max || item.budget_min)}</span>
                    )}
                  </div>

                  <div className="nextAction">
                    <span>PROCHAINE ACTION</span>
                    <strong>{item.next_action}</strong>
                  </div>

                  {Array.isArray(item.inferred_staffing_roles) && item.inferred_staffing_roles.length > 0 && (
                    <p className="staffing">
                      <strong>Staffing inféré :</strong> {item.inferred_staffing_roles.join(" · ")}
                    </p>
                  )}

                  <div className="oppActions">
                    <Link href={`/opportunities/${item.id}`}>Voir le besoin</Link>
                    {item.primary_source_url && (
                      <a href={item.primary_source_url} target="_blank" rel="noreferrer">
                        Voir la source {item.primary_source_id ? `· ${item.primary_source_id}` : ""} ↗
                      </a>
                    )}
                  </div>
                </article>
              )) : (
                <div className="emptyState">Aucune opportunité IA ouverte dans le lot actuellement chargé.</div>
              )}
            </div>
          </section>

          <section className="jobSignalSection">
            <div className="sectionTitle">
              <div>
                <p className="eyebrow">LINKEDIN + INDEED</p>
                <h2>Besoins IA détectés dans les offres d'emploi</h2>
              </div>
              <p>
                Une mission freelance est un besoin direct. Un recrutement salarié est traité comme un signal de demande IA.
              </p>
            </div>

            <div className="jobSignalGrid">
              {live.jobSignals.length ? live.jobSignals.map((signal) => {
                const freelance = /freelance|indépendant/i.test(signal.contract_type || "");
                return (
                  <article className="jobSignalCard" key={signal.id}>
                    <div className="jobSignalTop">
                      <span className="sourceBadge">{signal.source_id}</span>
                      <span className="signalType">{freelance ? "MISSION FREELANCE" : "SIGNAL RECRUTEMENT"}</span>
                    </div>
                    <p className="buyer">{signal.company_name || "Entreprise non identifiée"}</p>
                    <h3>{signal.title}</h3>
                    <div className="oppMeta">
                      <span>{signal.location || "Lieu inconnu"}</span>
                      <span>{signal.contract_type || "Contrat non précisé"}</span>
                    </div>
                    <div className="chips">
                      {(signal.skills || []).slice(0, 6).map((skill) => <span key={skill}>{skill}</span>)}
                    </div>
                    {signal.source_url && (
                      <div className="oppActions">
                        <a href={signal.source_url} target="_blank" rel="noreferrer">Voir le besoin original ↗</a>
                      </div>
                    )}
                  </article>
                );
              }) : (
                <div className="emptyState">
                  Aucun signal LinkedIn/Indeed n'est encore persisté. Le pipeline d'ingestion est prêt ; le prochain branchement est le moteur de découverte automatique.
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
          <p>API/open data officiels prioritaires ; aucun contournement de protection technique.</p>
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
        <h2>Une donnée vérifiable avant toute analyse</h2>
        <div className="pipelineRow">
          {["Collecte", "Raw evidence", "Normalisation", "Déduplication", "Classification V2", "Fit", "Priorisation", "MCP"].map((step) => (
            <span key={step}>{step}</span>
          ))}
        </div>
      </section>
    </main>
  );
}
