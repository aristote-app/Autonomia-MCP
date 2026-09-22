import Link from "next/link";
import { notFound } from "next/navigation";
import { getTerritoryBySiren, getTerritorySignalFeed } from "../../../lib/db/territories.js";

export const dynamic = "force-dynamic";

function number(value) {
  return new Intl.NumberFormat("fr-FR").format(Number(value) || 0);
}

function safeWebsite(value) {
  const raw = String(value || "").trim();
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return raw;
  return `https://${raw.replace(/^\/+/, "")}`;
}

function firstEmail(value) {
  const match = String(value || "").match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return match ? match[0] : null;
}

function personName(territory) {
  return [territory.president_title, territory.president_first_name, territory.president_last_name]
    .filter(Boolean)
    .join(" ");
}

export default async function TerritoryDetailPage({ params }) {
  const { siren } = await params;
  const [territory, signals] = await Promise.all([
    getTerritoryBySiren(siren),
    getTerritorySignalFeed(siren)
  ]);

  if (!territory) notFound();

  const email = firstEmail(territory.email);
  const website = safeWebsite(territory.website);
  const president = personName(territory);

  return (
    <main>
      <div className="detailBack"><Link href="/territoires">← Tous les territoires</Link></div>

      <section className="territoryDetailHero">
        <div>
          <p className="eyebrow">AUTONOMIA / TERRITOIRE</p>
          <h1 className="detailTitle">{territory.name}</h1>
          <p className="lede">
            {territory.territory_type} · SIREN {territory.siren}
            {territory.department_code ? ` · département ${territory.department_code}` : ""}
          </p>
        </div>
        <div className="territoryDetailScore">
          <strong>{territory.commercial_score}/100</strong>
          <span>{territory.priority_band} · priorité commerciale</span>
        </div>
      </section>

      <section className="territoryDetailGrid">
        <article className="detailPanel">
          <p className="eyebrow">POURQUOI CONTACTER ?</p>
          <div className="territoryScoreCards">
            <div><strong>{territory.signal_score}/60</strong><span>signaux</span></div>
            <div><strong>{territory.reach_score}/25</strong><span>portée</span></div>
            <div><strong>{territory.contact_score}/15</strong><span>joignabilité</span></div>
          </div>
          <p className="territoryScoreDisclaimer">
            Le score sert à prioriser la prospection. Il ne mesure pas la maturité IA de la collectivité.
          </p>

          <div className="detailBlock">
            <span>Offre suggérée</span>
            <strong>{territory.suggested_offer}</strong>
          </div>
          <div className="detailBlock">
            <span>Décideurs à rechercher</span>
            <strong>{Array.isArray(territory.recommended_roles) ? territory.recommended_roles.join(" · ") : "DGS · numérique · développement économique"}</strong>
          </div>
          <div className="detailBlock">
            <span>Prochaine action</span>
            <strong>{territory.next_action}</strong>
          </div>
        </article>

        <aside className="detailPanel">
          <p className="eyebrow">CONTACTS CONNUS</p>
          <dl className="detailFacts">
            <div><dt>Présidence</dt><dd>{president || "—"}</dd></div>
            <div><dt>Population</dt><dd>{territory.population_total ? number(territory.population_total) : "—"}</dd></div>
            <div><dt>Communes / membres</dt><dd>{territory.member_count || "—"}</dd></div>
            <div><dt>Email</dt><dd>{email ? <a href={`mailto:${email}`}>{email}</a> : "—"}</dd></div>
            <div><dt>Téléphone</dt><dd>{territory.phone || "—"}</dd></div>
            <div><dt>Ville siège</dt><dd>{territory.city || territory.seat_commune || "—"}</dd></div>
          </dl>
          <div className="oppActions">
            <a href={territory.banatic_url} target="_blank" rel="noreferrer">BANATIC ↗</a>
            {website && <a href={website} target="_blank" rel="noreferrer">Site officiel ↗</a>}
          </div>
        </aside>
      </section>

      <section className="sourceSection">
        <div className="sectionTitle">
          <div>
            <p className="eyebrow">SIGNAUX RATTACHÉS</p>
            <h2>{signals.length} signal{signals.length > 1 ? "s" : ""}</h2>
          </div>
          <p>Chaque signal conserve sa source quand une URL publique est disponible.</p>
        </div>

        {signals.length ? (
          <div className="sourceList">
            {signals.map((signal, index) => (
              <article className="sourceCard" key={`${signal.signal_source}-${signal.detected_at}-${index}`}>
                <div>
                  <strong>{signal.signal_source || "source publique"}</strong>
                  <span>{signal.title}</span>
                  <small>
                    {signal.signal_type || "signal"} · importance {signal.importance || 1}/5
                    {signal.detected_at ? ` · ${new Intl.DateTimeFormat("fr-FR").format(new Date(signal.detected_at))}` : ""}
                  </small>
                </div>
                <div className="sourceActions">
                  {signal.evidence_url ? (
                    <a href={signal.evidence_url} target="_blank" rel="noreferrer">Ouvrir la preuve ↗</a>
                  ) : <span>URL source non disponible</span>}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="emptyState">
            Aucun signal public n’est encore rattaché à ce territoire. La fiche reste exploitable pour l’enrichissement et la recherche ciblée.
          </div>
        )}
      </section>
    </main>
  );
}
