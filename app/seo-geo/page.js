import Link from "next/link";
import { revalidatePath } from "next/cache";
import { loadSeoGeoData, organicFetch, siteConfig } from "../../lib/seo-geo/refresh.js";
import { readSeoGeoSnapshot, writeSeoGeoSnapshot } from "../../lib/seo-geo/snapshot.js";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

async function submitSitemapAction() {
  "use server";
  await organicFetch("/api/organic/google/sitemap", {
    method: "POST",
    body: JSON.stringify({})
  });
  revalidatePath("/seo-geo");
}

async function refreshRadarAction() {
  "use server";
  const data = await loadSeoGeoData({ prepareBriefs: true, maxBriefs: 5 });
  await writeSeoGeoSnapshot(data);
  revalidatePath("/seo-geo");
}

function number(value) {
  return new Intl.NumberFormat("fr-FR").format(Number(value) || 0);
}

export default async function SeoGeoPage() {
  const [data, snapshot] = await Promise.all([
    loadSeoGeoData(),
    readSeoGeoSnapshot()
  ]);

  const manifest = data.manifest.ok
    ? data.manifest.data
    : snapshot?.manifest?.ok
      ? snapshot.manifest.data
      : null;
  const backlog = data.backlog.ok
    ? data.backlog.data
    : snapshot?.backlog?.ok
      ? snapshot.backlog.data
      : null;
  const recommendations = data.recommendations.ok
    ? data.recommendations.data?.recommendations || []
    : snapshot?.recommendations?.ok
      ? snapshot.recommendations.data?.recommendations || []
      : [];
  const google = data.google.ok
    ? data.google.data
    : snapshot?.google?.ok
      ? snapshot.google.data
      : null;
  const searchDemand = data.searchDemand?.ok
    ? data.searchDemand.data
    : snapshot?.searchDemand?.ok
      ? snapshot.searchDemand.data
      : null;
  const searchRows = searchDemand?.rows || [];
  const searchTotals = searchRows.reduce((acc, row) => {
    acc.clicks += Number(row.clicks) || 0;
    acc.impressions += Number(row.impressions) || 0;
    return acc;
  }, { clicks: 0, impressions: 0 });
  const weightedPosition = searchRows.reduce(
    (sum, row) => sum + (Number(row.position) || 0) * (Number(row.impressions) || 0),
    0
  );
  const avgPosition = searchTotals.impressions
    ? weightedPosition / searchTotals.impressions
    : 0;
  const ctr = searchTotals.impressions
    ? searchTotals.clicks / searchTotals.impressions
    : 0;
  const topQueries = [...searchRows]
    .sort((a, b) => Number(b.impressions || 0) - Number(a.impressions || 0))
    .slice(0, 15);
  const draftQueue = snapshot?.draftQueue || [];
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
            <form action={refreshRadarAction}>
              <button className={styles.secondaryButton} type="submit">
                Actualiser + préparer 5 briefs
              </button>
            </form>
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
          <div className={styles.statusItem}>
            <strong>Dernière veille automatique</strong>
            <span>{snapshot?.generatedAt ? new Date(snapshot.generatedAt).toLocaleString("fr-FR") : "Pas encore exécutée"}</span>
          </div>
        </div>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <p className={styles.eyebrow}>GOOGLE SEARCH CONSOLE</p>
            <h2>Visibilité organique réelle</h2>
            <p>Mesures issues des requêtes observées sur les 28 derniers jours. Elles commencent à se remplir après les premiers crawls et impressions Google.</p>
          </div>
        </div>

        <div className={styles.grid}>
          <article className={styles.card}>
            <span>Impressions · 28 j</span>
            <strong>{number(searchTotals.impressions)}</strong>
            <small>Nombre d’affichages observés dans Google Search.</small>
          </article>
          <article className={styles.card}>
            <span>Clics · 28 j</span>
            <strong>{number(searchTotals.clicks)}</strong>
            <small>Trafic organique reçu depuis Google Search.</small>
          </article>
          <article className={styles.card}>
            <span>CTR moyen</span>
            <strong>{searchTotals.impressions ? `${(ctr * 100).toFixed(1)} %` : "—"}</strong>
            <small>Clics / impressions sur les requêtes remontées.</small>
          </article>
          <article className={styles.card}>
            <span>Position moyenne pondérée</span>
            <strong>{searchTotals.impressions ? avgPosition.toFixed(1) : "—"}</strong>
            <small>Pondérée par le nombre d’impressions.</small>
          </article>
        </div>

        <div className={styles.tableWrap} style={{ marginTop: 18 }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Requête Google</th>
                <th>Impressions</th>
                <th>Clics</th>
                <th>CTR</th>
                <th>Position</th>
              </tr>
            </thead>
            <tbody>
              {topQueries.map((row) => (
                <tr key={row.query}>
                  <td><strong>{row.query}</strong></td>
                  <td>{number(row.impressions)}</td>
                  <td>{number(row.clicks)}</td>
                  <td>{`${((Number(row.ctr) || 0) * 100).toFixed(1)} %`}</td>
                  <td>{Number(row.position || 0).toFixed(1)}</td>
                </tr>
              ))}
              {!topQueries.length && (
                <tr>
                  <td colSpan="5">
                    {searchDemand?.configured === false
                      ? "Search Console API n’est pas encore connectée."
                      : "Aucune requête remontée pour le moment — normal juste après la mise en ligne."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
            <strong>Leads entrants / besoins exprimés</strong>
            <span>{number(data.signalSummary.inbound)}</span>
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
            <p className={styles.eyebrow}>FILE DE PRODUCTION</p>
            <h2>Briefs préparés automatiquement</h2>
            <p>
              La veille automatique prépare les 5 sujets les mieux étayés. Ils restent à valider avant
              génération finale et publication.
            </p>
          </div>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Score</th>
                <th>Sujet</th>
                <th>Famille</th>
                <th>Brief</th>
              </tr>
            </thead>
            <tbody>
              {draftQueue.map((item) => (
                <tr key={`${item.family}:${item.slug}`}>
                  <td className={styles.score}>{item.score}</td>
                  <td><strong>{item.title}</strong><br/><small>{item.cluster}</small></td>
                  <td><span className={styles.pill}>{item.family}</span></td>
                  <td>{item.brief ? "Prêt pour rédaction" : `Erreur : ${item.brief_error || "inconnue"}`}</td>
                </tr>
              ))}
              {!draftQueue.length && (
                <tr>
                  <td colSpan="4">La première veille automatique remplira cette file dès que le moteur du site public sera relié.</td>
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
