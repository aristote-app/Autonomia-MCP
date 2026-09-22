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

export default async function TerritoriesPage({ searchParams }) {
  const params = await searchParams;
  const type = ["CC", "CA"].includes(params?.type) ? params.type : null;
  const signal = ["with", "without"].includes(params?.signal) ? params.signal : null;
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
    searchTerritories({ type, signal, query, limit, offset })
  ]);

  const totalPages = Math.max(Math.ceil(results.count / limit), 1);
  const baseParams = { type, signal, q: query };

  return (
    <main>
      <section className="territoryHero">
        <div>
          <p className="eyebrow">AUTONOMIA / TERRITOIRES</p>
          <h1>Communautés de communes & communautés d’agglomération</h1>
          <p>
            Univers complet de prospection BANATIC. Un territoire reste visible même sans signal ;
            les signaux servent à prioriser, pas à décider qui existe dans le cockpit.
          </p>
        </div>
        <Link className="territoryBack" href="/">← Market Intelligence</Link>
      </section>

      <section className="territoryMetrics">
        <article><strong>{number(summary.total)}</strong><span>territoires actifs</span></article>
        <article><strong>{number(summary.communitiesOfCommunes)}</strong><span>communautés de communes</span></article>
        <article><strong>{number(summary.communitiesOfAgglomeration)}</strong><span>communautés d’agglomération</span></article>
        <article><strong>{number(summary.withSignal)}</strong><span>avec signal</span></article>
        <article><strong>{number(summary.withoutSignal)}</strong><span>sans signal</span></article>
      </section>

      <section className="territoryControls">
        <form className="territorySearch">
          <input name="q" defaultValue={query || ""} placeholder="Rechercher un territoire…" />
          {type && <input type="hidden" name="type" value={type} />}
          {signal && <input type="hidden" name="signal" value={signal} />}
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
          <p>Source principale : BANATIC / Direction générale des collectivités locales.</p>
        </div>

        <div className="territoryTable">
          <div className="territoryRow territoryHead">
            <span>Territoire</span>
            <span>Type</span>
            <span>Population</span>
            <span>Contact</span>
            <span>Signal</span>
            <span>Source</span>
          </div>

          {results.items.map((territory) => {
            const email = firstEmail(territory.email);
            const website = safeWebsite(territory.website);
            const seat = seatName(territory.seat_commune);

            return (
            <article className="territoryRow" key={territory.id}>
              <div>
                <strong>{territory.name}</strong>
                <small>
                  {territory.department_code ? `Dép. ${territory.department_code}` : "Département —"}
                  {seat ? ` · siège : ${seat}` : ""}
                </small>
              </div>
              <div><span className="territoryType">{territory.territory_type}</span></div>
              <div>
                <strong>{territory.population_total ? number(territory.population_total) : "—"}</strong>
                <small>{territory.member_count ? `${territory.member_count} communes/membres` : "membres —"}</small>
              </div>
              <div className="territoryContact">
                {email ? <a href={`mailto:${email}`}>{email}</a> : <span>email —</span>}
                {territory.phone && <small>{territory.phone}</small>}
              </div>
              <div>
                <span className={territory.has_signal ? "territorySignal hot" : "territorySignal"}>
                  {territory.has_signal ? `${territory.signal_count} signal${territory.signal_count > 1 ? "s" : ""}` : "Sans signal"}
                </span>
                {territory.last_signal_at && (
                  <small>Dernier : {new Intl.DateTimeFormat("fr-FR").format(new Date(territory.last_signal_at))}</small>
                )}
              </div>
              <div>
                <a href={territory.banatic_url} target="_blank" rel="noreferrer">BANATIC ↗</a>
                {website && <a href={website} target="_blank" rel="noreferrer">Site ↗</a>}
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
