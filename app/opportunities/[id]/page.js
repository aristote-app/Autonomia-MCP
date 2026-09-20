import Link from "next/link";
import { notFound } from "next/navigation";
import { getOpportunityDetail } from "../../../lib/db/opportunitySources.js";

export const dynamic = "force-dynamic";

function formatMoney(value, currency = "EUR") {
  if (value == null) return "—";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
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

export default async function OpportunityPage({ params }) {
  const { id } = await params;
  const opportunity = await getOpportunityDetail(id);

  if (!opportunity) notFound();

  const classification = opportunity.classification?.payload || {};
  const fit = opportunity.fit?.payload || {};
  const staffing = opportunity.staffing?.payload || {};
  const organization = opportunity.company?.canonical_name || opportunity.buyer?.canonical_name || "Organisation non identifiée";

  return (
    <main>
      <div className="detailBack">
        <Link href="/">← Retour au cockpit</Link>
      </div>

      <header className="detailHero">
        <div>
          <p className="eyebrow">{opportunity.opportunity_type}</p>
          <h1 className="detailTitle">{opportunity.title}</h1>
          <p className="lede">{organization}</p>
        </div>
        <div className="detailFit">
          <strong>{fit.score ?? "—"}</strong>
          <span>FIT / 100</span>
        </div>
      </header>

      <section className="detailGrid">
        <article className="detailPanel">
          <p className="eyebrow">BESOIN</p>
          <h2>Ce qui est demandé</h2>
          <p className="detailDescription">
            {opportunity.description || "Description détaillée non disponible dans les faits normalisés. Ouvre la source originale pour vérifier le besoin complet."}
          </p>

          <dl className="detailFacts">
            <div><dt>Organisation</dt><dd>{organization}</dd></div>
            <div><dt>Localisation</dt><dd>{opportunity.location || "—"}</dd></div>
            <div><dt>Contrat</dt><dd>{opportunity.contract_type || "—"}</dd></div>
            <div><dt>Télétravail</dt><dd>{opportunity.remote_mode || "—"}</dd></div>
            <div><dt>Publication</dt><dd>{formatDate(opportunity.published_at)}</dd></div>
            <div><dt>Échéance</dt><dd>{formatDate(opportunity.deadline_at)}</dd></div>
            <div><dt>Budget</dt><dd>{formatMoney(opportunity.budget_max || opportunity.budget_min, opportunity.currency || "EUR")}</dd></div>
            <div><dt>TJM</dt><dd>{opportunity.tjm_max || opportunity.tjm_min ? `${formatMoney(opportunity.tjm_min, opportunity.currency || "EUR")} – ${formatMoney(opportunity.tjm_max, opportunity.currency || "EUR")}` : "—"}</dd></div>
          </dl>
        </article>

        <article className="detailPanel">
          <p className="eyebrow">INTELLIGENCE AUTONOMIA</p>
          <h2>Lecture du besoin</h2>

          <div className="chips detailChips">
            {(classification.tags || []).map((tag) => <span key={tag}>{tag}</span>)}
          </div>

          <div className="detailBlock">
            <span>Couverture des critères</span>
            <strong>{fit.coverage_percent ?? 0}%</strong>
          </div>

          <div className="detailBlock">
            <span>Staffing inféré</span>
            <strong>{Array.isArray(staffing.roles) && staffing.roles.length ? staffing.roles.join(" · ") : "Non déterminé"}</strong>
          </div>

          {Array.isArray(fit.missing_criteria) && fit.missing_criteria.length > 0 && (
            <div className="detailBlock">
              <span>Informations encore manquantes</span>
              <strong>{fit.missing_criteria.join(" · ")}</strong>
            </div>
          )}
        </article>
      </section>

      <section className="sourceSection">
        <div className="sectionTitle">
          <div>
            <p className="eyebrow">PREUVES</p>
            <h2>Sources du besoin</h2>
          </div>
          <p>Chaque lien ouvre la source originale utilisée par Autonomia.</p>
        </div>

        <div className="sourceList">
          {opportunity.sources.length ? opportunity.sources.map((source) => (
            <article className="sourceCard" key={source.id}>
              <div>
                <strong>{source.source_id}</strong>
                <span>{source.source_record_id || "référence source non renseignée"}</span>
              </div>
              <div className="sourceActions">
                {source.source_url ? (
                  <a href={source.source_url} target="_blank" rel="noreferrer">Ouvrir la source ↗</a>
                ) : (
                  <span>Lien source indisponible</span>
                )}
              </div>
            </article>
          )) : (
            <div className="emptyState">Aucune source liée à cette opportunité.</div>
          )}
        </div>
      </section>
    </main>
  );
}
