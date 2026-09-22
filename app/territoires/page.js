import Link from "next/link";
import { getTerritorySummary, searchTerritories } from "../../lib/db/territories.js";
import { hasAutonomiaDatabase } from "../../lib/db/supabase.js";

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

function seatName(value) {
  const raw = String(value || "").trim();
  if (!raw) return null;
  const parts = raw.split(/\s+-\s+/);
  return parts.length > 1 ? parts.slice(1).join(" - ") : raw;
}

function buildHref(params, patch) {
  const next = new URLSearchParams();
  for (const [key, value] of Object.entries(params || {})) {
    if (value != null && value !== "") next.set(key, String(value));
  }
  for (const [key, value] of Object.entries(patch || {})) {
    if (value == null || value === "") next.delete(key);
    else next.set(key, String(value));
  }
  const query = next.toString();
  return query ? `/territoires?${query}` : "/territoires";
}

function priorityLabel(value) {
  return {
    P1: "P1 · à traiter",
    P2: "P2 · prioritaire",
    P3: "P3 · potentiel",
    P4: "P4 · enrichir"
  }[value] || value;
}

export default async function TerritoriesPage({ searchParams }) {
  const params = await searchParams;
  const type = ["CC", "CA"].includes(params?.type) ? params.type : null;
  const signal = ["with", "without"].includes(params?.signal) ? params.signal : null;
  const priority = ["P1", "P2", "P3", "P4"].includes(params?.priority) ? params.priority : null;
  const query = params?.q ? String(params.q).trim() : null;
  const page = Math.max(Number(params?.page) || 1, 1);
  const limit = 100;
  const offset = (page - 1) * limit;

  if (!hasAutonomiaDatabase()) {
    return (
      <main>
        <section className="territoryHero">
          <p className="eyebrow">AUTONOMIA / TERRITOIRES</p>
          <h1>Communautés de communes & communautés d’agglomération</h1>
          <p>La base Autonomia n’est pas connectée.</p>
        </section>
      </main>
    );
  }

  const [summary, results] = await Promise.all([
    getTerritorySummary(),
    searchTerritories({ type, signal, priority, query, limit, offset })
  ]);

  const totalPages = Math.max(Math.ceil(results.count / limit), 1);
  const baseParams = { type, signal, priority, q: query };

  return (
    <main>
      <section className="territoryHero">
        <div>
          <p className="eyebrow">AUTONOMIA / TERRITOIRES</p>
          <h1>1217 territoires. Une priorité explicable.</h1>
          <p>
            Tous les territoires restent visibles. Le score sert uniquement à ordonner l’effort commercial :
            signaux publics 60 points, portée territoriale 25 points, joignabilité 15 points.
          </p>
          <p className="territoryScoreDisclaimer">
            Ce score n’évalue pas la maturité IA d’une collectivité.
          </p>
        </div>
        <Link className="territoryBack" href="/">← Market Intelligence</Link>
      </section>

      <section className="territoryMetrics">
        <article><strong>{number(summary.total)}</strong><span>territoires actifs</span></article>
        <article><strong>{number(summary.communitiesOfCommunes)}</strong><span>communautés de communes</span></article>
        <article><strong>{number(summary.communitiesOfAgglomeration)}</strong><span>communautés d’agglomération</span></article>
        <article><strong>{number(summary.withSignal)}</strong><span>avec signal</span></article>
        <article><strong>{number(summary.p1 + summary.p2)}</strong><span>P1 + P2</span></article>
      </section>

      <section className="territoryPriorityStrip" aria-label="Répartition des priorités">
        {["P1","P2","P3","P4"].map((band) => (
          <Link
            key={band}
            href={buildHref(baseParams, { priority: priority === band ? null : band, page: 1 })}
            className={priority === band ? "active" : ""}
          >
            <strong>{number(summary[band.toLowerCase()])}</strong>
            <span>{priorityLabel(band)}</span>
          </Link>
        ))}
      </section>

      <section className="territoryControls">
        <form className="territorySearch">
          <input name="q" defaultValue={query || ""} placeholder="Territoire, SIREN, département, ville…" />
          {type && <input type="hidden" name="type" value={type} />}
          {signal && <input type="hidden" name="signal" value={signal} />}
          {priority && <input type="hidden" name="priority" value={priority} />}
          <button type="submit">Rechercher</button>
        </form>

        <div className="territoryFilters">
          <Link className={!type ? "active" : ""} href={buildHref(baseParams, { type: null, page: 1 })}>Tous types</Link>
          <Link className={type === "CC" ? "active" : ""} href={buildHref(baseParams, { type: "CC", page: 1 })}>CC</Link>
          <Link className={type === "CA" ? "active" : ""} href={buildHref(baseParams, { type: "CA", page: 1 })}>CA</Link>
          <span className="territoryFilterDivider" />
          <Link className={!signal ? "active" : ""} href={buildHref(baseParams, { signal: null, page: 1 })}>Tous signaux</Link>
          <Link className={signal === "with" ? "active" : ""} href={buildHref(baseParams, { signal: "with", page: 1 })}>Avec signal</Link>
          <Link className={signal === "without" ? "active" : ""} href={buildHref(baseParams, { signal: "without", page: 1 })}>Sans signal</Link>
        </div>
      </section>

      <section className="territoryListSection">
        <div className="sectionTitle">
          <div>
            <p className="eyebrow">BASE DE PROSPECTION</p>
            <h2>{number(results.count)} territoire{results.count > 1 ? "s" : ""}</h2>
          </div>
          <p>Source d’identité : BANATIC / DGCL. Les signaux sont conservés avec leur URL source lorsqu’elle existe.</p>
        </div>

        <div className="territoryTable territoryTableV2">
          <div className="territoryRow territoryHead territoryRowV2">
            <span>Territoire</span>
            <span>Priorité</span>
            <span>Pourquoi</span>
            <span>Angle</span>
            <span>Contact</span>
            <span>Action</span>
          </div>

          {results.items.map((territory) => {
            const email = firstEmail(territory.email);
            const website = safeWebsite(territory.website);
            const seat = seatName(territory.seat_commune);

            return (
              <article className="territoryRow territoryRowV2" key={territory.id}>
                <div className="territoryIdentity">
                  <Link href={`/territoires/${territory.siren}`}><strong>{territory.name}</strong></Link>
                  <small>
                    {territory.territory_type} · {territory.department_code ? `Dép. ${territory.department_code}` : "Département —"}
                    {seat ? ` · siège : ${seat}` : ""}
                  </small>
                  <small>{territory.population_total ? `${number(territory.population_total)} hab.` : "Population —"}</small>
                </div>

                <div className="territoryPriorityCell">
                  <strong className={`territoryPriorityBadge ${String(territory.priority_band || "").toLowerCase()}`}>
                    {territory.priority_band} · {territory.commercial_score}/100
                  </strong>
                  <small>{priorityLabel(territory.priority_band)}</small>
                </div>

                <div className="territoryScoreBreakdown">
                  <span>Signal <b>{territory.signal_score}/60</b></span>
                  <span>Portée <b>{territory.reach_score}/25</b></span>
                  <span>Contact <b>{territory.contact_score}/15</b></span>
                  {territory.signal_count > 0 ? (
                    <a href={territory.latest_signal_url || `/territoires/${territory.siren}`}>
                      {territory.signal_count} signal{territory.signal_count > 1 ? "s" : ""}
                    </a>
                  ) : <small>Aucun signal rattaché</small>}
                </div>

                <div className="territoryOfferCell">
                  <strong>{territory.suggested_offer}</strong>
                  <small>{Array.isArray(territory.recommended_roles) ? territory.recommended_roles.join(" · ") : ""}</small>
                </div>

                <div className="territoryContact">
                  {email ? <a href={`mailto:${email}`}>{email}</a> : <span>email —</span>}
                  {territory.phone && <small>{territory.phone}</small>}
                  <div className="territoryMiniLinks">
                    <a href={territory.banatic_url} target="_blank" rel="noreferrer">BANATIC ↗</a>
                    {website && <a href={website} target="_blank" rel="noreferrer">Site ↗</a>}
                  </div>
                </div>

                <div className="territoryActionCell">
                  <small>{territory.next_action}</small>
                  <Link href={`/territoires/${territory.siren}`}>Ouvrir la fiche →</Link>
                </div>
              </article>
            );
          })}
        </div>

        <div className="territoryPagination">
          {page > 1 ? (
            <Link href={buildHref(baseParams, { page: page - 1 })}>← Page précédente</Link>
          ) : <span />}
          <strong>Page {page} / {totalPages}</strong>
          {page < totalPages ? (
            <Link href={buildHref(baseParams, { page: page + 1 })}>Page suivante →</Link>
          ) : <span />}
        </div>
      </section>
    </main>
  );
}
