import Link from "next/link";
import { revalidatePath } from "next/cache";
import { hasAutonomiaDatabase } from "../../lib/db/supabase.js";
import { searchRankedOpportunities } from "../../lib/db/intelligence.js";
import { searchJobSignals } from "../../lib/db/jobSignals.js";
import { buildSeoGeoSignals, summarizeSeoGeoSignals } from "../../lib/seo-geo/demandSignals.js";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

const DEFAULT_PUBLIC_SITE = "https://build-autonomia.com";

function siteConfig() {
  return {
    base: String(process.env.AUTONOMIA_PUBLIC_SITE_URL || DEFAULT_PUBLIC_SITE).replace(/\/$/, ""),
    token: process.env.AUTONOMIA_ORGANIC_TOKEN || ""
  };
}

async function organicFetch(path, options = {}) {
  const { base, token } = siteConfig();
  if (!token) return { ok: false, error: "organic_token_missing" };

  try {
    const response = await fetch(`${base}${path}`, {
      ...options,
      cache: "no-store",
      headers: {
        ...(options.headers || {}),
        authorization: `Bearer ${token}`,
        "content-type": "application/json"
      }
    });

    const body = await response.json().catch(() => null);
    return response.ok
      ? { ok: true, data: body }
      : { ok: false, status: response.status, error: body?.error || "request_failed", data: body };
  } catch (error) {
    return { ok: false, error: error?.message || "network_error" };
  }
}

async function loadMarketSignals() {
  if (!hasAutonomiaDatabase()) return { opportunities: [], jobs: [] };

  try {
    const [opportunities, jobs] = await Promise.all([
      searchRankedOpportunities({
        actionability: "active",
        aiRelatedOnly: true,
        minFitScore: 0,
        limit: 250
      }),
      searchJobSignals({
        sources: ["france_travail_jobs", "linkedin", "indeed", "freework", "freelancerepublik", "lehibou"],
        limit: 350
      })
    ]);

    return {
      opportunities: opportunities?.items || [],
      jobs: jobs?.items || []
    };
  } catch (error) {
    console.error("SEO/GEO market signals error", error);
    return { opportunities: [], jobs: [] };
  }
}

async function loadSeoGeo() {
  const market = await loadMarketSignals();
  const signals = buildSeoGeoSignals(market);
  const signalSummary = summarizeSeoGeoSignals(signals);

  const [manifest, backlog, google, searchDemand] = await Promise.all([
    organicFetch("/api/organic/manifest"),
    organicFetch("/api/organic/backlog"),
    organicFetch("/api/organic/google/sitemap"),
    organicFetch("/api/organic/google/search-demand?days=28&limit=500")
  ]);

  const searchSignals = searchDemand.ok
    ? (searchDemand.data?.rows || []).map((row) => ({
        query: row.query,
        search_impressions: Number(row.impressions) || 0,
        search_clicks: Number(row.clicks) || 0,
        search_position: Number(row.position) || 0,
        source: "google_search_console"
      }))
    : [];

  const allSignals = [...signals, ...searchSignals];
  const recommendations = await organicFetch("/api/organic/editorial-opportunities", {
    method: "POST",
    body: JSON.stringify({ signals: allSignals, max_results: 25 })
  });

  return {
    market,
    signals: allSignals,
    signalSummary: {
      ...signalSummary,
      searchQueries: searchSignals.length,
      total: signalSummary.total + searchSignals.length
    },
    manifest,
    backlog,
    recommendations,
    google,
    searchDemand
  };
}

async function submitSitemapAction() {
  "use server";
  await organicFetch("/api/organic/google/sitemap", {
    method: "POST",
    body: JSON.stringify({})
  });
  revalidatePath("/seo-geo");
}

function number(value) {
  return new Intl.NumberFormat("fr-FR").format(Number(value) || 0);
}

export default async function SeoGeoPage() {
  const data = await loadSeoGeo();
  const manifest = data.manifest.ok ? data.manifest.data : null;
  const backlog = data.backlog.ok ? data.backlog.data : null;
  const recommendations = data.recommendations.ok
    ? data.recommendations.data?.recommendations || []
    : [];
  const google = data.google.ok ? data.google.data : null;
  const site = siteConfig().base;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>AUTONOMIA · CONTENT INTELLIGENCE</p>
          <h1>SEO / GEO Intelligence</h1>
          <p className={styles.lede}>
            Piloter les contenus à partir de la demande observée : recherche, emploi, marchés publics,
            Territoires et signaux commerciaux. Le moteur recommande ; la publication reste contrôlée.
          </p>
        </div>
        <Link className={styles.back} href="/">← Cockpit</Link>
      </header>

      {!data.manifest.ok && (
        <div className={styles.notice}>
          Le cockpit SEO/GEO est installé, mais le site public n'est pas encore relié à ce déploiement.
          Vérifier AUTONOMIA_PUBLIC_SITE_URL et AUTONOMIA_ORGANIC_TOKEN.
        </div>
      )}

      <section className={styles.grid}>
        <article className={styles.card}>
          <span>URLs indexables</span>
          <strong>{number(manifest?.indexable?.total)}</strong>
          <small>Sitemap dynamique du site public.</small>
        </article>
        <article className={styles.card}>
          <span>Articles publiés</span>
          <strong>{number(manifest?.editorial?.published_articles_total)}</strong>
          <small>Guides de fond déjà publiés par le moteur éditorial.</small>
        </article>
        <article className={styles.card}>
          <span>Backlog éditorial</span>
          <strong>{number(backlog?.backlog ?? manifest?.editorial?.backlog_total)}</strong>
          <small>Sujets disponibles avant scoring par la demande réelle.</small>
        </article>
        <article className={styles.card}>
          <span>Signaux marché analysés</span>
          <strong>{number(data.signalSummary.total)}</strong>
          <small>{number(data.signalSummary.territory)} signaux Territoires détectés.</small>
        </article>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <p className={styles.eyebrow}>INDEXATION</p>
            <h2>Sitemap & Google Search Console</h2>
            <p>Le sitemap reste automatique ; ce contrôle permet aussi de le soumettre à Search Console.</p>
          </div>
          <div className={styles.actions}>
            <a className={styles.secondaryButton} href={`${site}/sitemap.xml`} target="_blank" rel="noreferrer">
              Voir sitemap ↗
            </a>
            <form action={submitSitemapAction}>
              <button className={styles.button} type="submit" disabled={!google?.configured}>
                Envoyer le sitemap à Google
              </button>
            </form>
          </div>
        </div>

        <div className={styles.statusList}>
          <div className={styles.statusItem}>
            <strong>Site public</strong>
            <span className={data.manifest.ok ? styles.ok : styles.warn}>
              {data.manifest.ok ? "Connecté" : "À connecter"}
            </span>
          </div>
          <div className={styles.statusItem}>
            <strong>Search Console API</strong>
            <span className={google?.configured ? styles.ok : styles.warn}>
              {google?.configured ? "Configurée" : "Identifiants à ajouter"}
            </span>
          </div>
          <div className={styles.statusItem}>
            <strong>Dernier sitemap connu</strong>
            <span>{google?.last_submitted ? new Date(google.last_submitted).toLocaleString("fr-FR") : "—"}</span>
          </div>
        </div>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <p className={styles.eyebrow}>DEMANDE RÉELLE</p>
            <h2>Ce qui doit nourrir le contenu maintenant</h2>
            <p>Les signaux sont issus du Market Intelligence d'Autonomia et servent à reclasser le backlog.</p>
          </div>
        </div>
        <div className={styles.statusList}>
          <div className={styles.statusItem}>
            <strong>Marchés / besoins publics</strong>
            <span>{number(data.signalSummary.procurement)}</span>
          </div>
          <div className={styles.statusItem}>
            <strong>Emploi & missions</strong>
            <span>{number(data.signalSummary.jobs)}</span>
          </div>
          <div className={styles.statusItem}>
            <strong>Territoires</strong>
            <span>{number(data.signalSummary.territory)}</span>
          </div>
          <div className={styles.statusItem}>
            <strong>Requêtes Google · 28 j</strong>
            <span>{number(data.signalSummary.searchQueries)}</span>
          </div>
        </div>
        <div className={styles.clusters} style={{ marginTop: 14 }}>
          {data.signalSummary.topClusters.map((item) => (
            <span className={styles.pill} key={item.cluster}>{item.cluster} · {item.count}</span>
          ))}
        </div>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <p className={styles.eyebrow}>OPPORTUNITY ENGINE</p>
            <h2>Priorités éditoriales recommandées</h2>
            <p>Score de priorisation interne fondé sur les signaux disponibles, pas une estimation de trafic Google.</p>
          </div>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Score</th>
                <th>Sujet</th>
                <th>Cluster</th>
                <th>Action</th>
                <th>Preuves</th>
              </tr>
            </thead>
            <tbody>
              {recommendations.slice(0, 15).map((item) => (
                <tr key={item.slug}>
                  <td className={styles.score}>{item.score}</td>
                  <td><strong>{item.title}</strong><br/><small>{item.pillar}</small></td>
                  <td><span className={styles.pill}>{item.cluster}</span></td>
                  <td>{item.action}</td>
                  <td>
                    {number(item.evidence?.matched_signals)} signaux ·
                    {" "}{number(item.evidence?.search_impressions)} impr. search ·
                    {" "}{number(item.evidence?.job_mentions)} emploi ·
                    {" "}{number(item.evidence?.public_procurement_mentions)} marchés
                  </td>
                </tr>
              ))}
              {!recommendations.length && (
                <tr>
                  <td colSpan="5">Aucune recommandation disponible tant que le moteur du site public n'est pas relié.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <p className={styles.eyebrow}>CIBLES MÉTIERS</p>
            <h2>Couverture éditoriale à maintenir</h2>
          </div>
        </div>
        <div className={styles.targetGrid}>
          <div className={styles.target}>
            <strong>Entreprises & ETI</strong>
            <p>Automatisation métier, copilotes, agents, knowledge management, productivité et gouvernance.</p>
          </div>
          <div className={styles.target}>
            <strong>Communautés de communes / agglomérations</strong>
            <p>Agents, services aux usagers, développement économique, accompagnement TPE/PME et feuille de route IA territoriale.</p>
          </div>
          <div className={styles.target}>
            <strong>Formation IA</strong>
            <p>Acculturation, montée en compétences, cas d'usage par métier et déploiement responsable.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
