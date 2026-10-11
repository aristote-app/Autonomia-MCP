import Link from "next/link";
import { LINKEDIN_SNAPSHOT } from "../../lib/linkedin/snapshot.js";
import { loadMetricoolLinkedinAccount } from "../../lib/linkedin/metricool.js";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

function number(value) {
  if (value == null || value === "") return "—";
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(Number(value) || 0);
}

function percent(value) {
  if (value == null || !Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("fr-FR", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value);
}

function formatDate(value, includeTime = false) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(includeTime ? { hour: "2-digit", minute: "2-digit" } : {}),
    timeZone: process.env.AUTONOMIA_TIMEZONE || "Europe/Paris"
  }).format(new Date(value));
}

export default async function LinkedinAnalyticsPage() {
  const snapshot = LINKEDIN_SNAPSHOT;
  const liveAccount = await loadMetricoolLinkedinAccount({
    from: snapshot.period.from,
    to: new Date().toISOString().slice(0, 10)
  });

  const account = {
    ...snapshot.account,
    ...(liveAccount
      ? Object.fromEntries(
          Object.entries(liveAccount).filter(([, value]) => value != null)
        )
      : {})
  };

  const newsletter = snapshot.newsletter;
  const baseIssue = newsletter.issues[0];
  const subscribers = newsletter.subscribers;
  const issue = baseIssue;

  const posts = [...snapshot.posts].sort(
    (a, b) => Number(b.impressions || 0) - Number(a.impressions || 0)
  );
  const topPost = posts[0] || null;
  const postInteractions =
    Number(account.reactions || 0) +
    Number(account.comments || 0) +
    Number(account.shares || 0);
  const interactionRate = account.impressions
    ? postInteractions / Number(account.impressions)
    : null;

  const sourceLabel = liveAccount ? "Metricool API · live" : "Metricool · dernier snapshot";
  const newsletterUpdatedAt = newsletter.sync?.lastCheckedAt || snapshot.generatedAt;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>AUTONOMIA · SOCIAL INTELLIGENCE</p>
          <h1>LinkedIn Analytics</h1>
          <p className={styles.lede}>
            Les performances du profil, de chaque post et de la newsletter
            <strong> AUTONOMIA — Les Machines IA</strong>, réunies dans le cockpit.
          </p>
        </div>
        <Link className={styles.back} href="/">← Cockpit</Link>
      </header>

      <div className={styles.sourceBar}>
        <div>
          <span className={styles.liveDot} aria-hidden="true" />
          <strong>{sourceLabel}</strong>
          <span>
            {liveAccount
              ? "Données LinkedIn récupérées via Metricool."
              : `Données posts actualisées le ${formatDate(snapshot.generatedAt, true)}.`}
          </span>
        </div>
        <a href="https://www.linkedin.com/in/deborahdiangoldcher/" target="_blank" rel="noreferrer">
          Ouvrir LinkedIn ↗
        </a>
      </div>

      <section className={styles.grid}>
        <article className={styles.card}>
          <span>Abonnés LinkedIn</span>
          <strong>{number(account.followers)}</strong>
          <small>Profil personnel suivi par Metricool.</small>
        </article>
        <article className={styles.card}>
          <span>Nouveaux abonnés</span>
          <strong>{account.followerDelta == null ? "—" : `+${number(account.followerDelta)}`}</strong>
          <small>Période suivie · {snapshot.period.from} → {snapshot.period.to}.</small>
        </article>
        <article className={styles.card}>
          <span>Impressions des posts</span>
          <strong>{number(account.impressions)}</strong>
          <small>{number(account.posts)} publications sur la période.</small>
        </article>
        <article className={styles.card}>
          <span>Interactions visibles</span>
          <strong>{number(postInteractions)}</strong>
          <small>{percent(interactionRate)} des impressions · réactions + commentaires + partages.</small>
        </article>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <p className={styles.eyebrow}>PERFORMANCE PAR POST</p>
            <h2>Chaque publication, ligne par ligne.</h2>
            <p>Impressions, portée unique, réactions, commentaires et partages issus de Metricool.</p>
          </div>
        </div>

        {topPost && (
          <div className={styles.topPost}>
            <span>MEILLEURE PUBLICATION DE LA PÉRIODE</span>
            <div>
              <strong>{topPost.title}</strong>
              <p>
                {number(topPost.impressions)} impressions · {number(topPost.uniqueImpressions)} personnes uniques ·
                {" "}{number(topPost.reactions)} réactions · {number(topPost.comments)} commentaire(s)
              </p>
            </div>
            <a href={topPost.url} target="_blank" rel="noreferrer">Voir le post ↗</a>
          </div>
        )}

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Publication</th>
                <th>Date</th>
                <th>Impressions</th>
                <th>Uniques</th>
                <th>Réactions</th>
                <th>Commentaires</th>
                <th>Partages</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.url}>
                  <td><strong>{post.title}</strong></td>
                  <td>{formatDate(post.date)}</td>
                  <td className={styles.metric}>{number(post.impressions)}</td>
                  <td>{number(post.uniqueImpressions)}</td>
                  <td>{number(post.reactions)}</td>
                  <td>{number(post.comments)}</td>
                  <td>{number(post.shares)}</td>
                  <td>
                    <a className={styles.tableLink} href={post.url} target="_blank" rel="noreferrer">Ouvrir ↗</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.newsletterPanel}>
        <div className={styles.newsletterHero}>
          <div>
            <p className={styles.newsletterEyebrow}>LINKEDIN NEWSLETTER</p>
            <h2>{newsletter.name}</h2>
            <p>{newsletter.baseline}</p>
          </div>
          <div className={styles.subscriberCard}>
            <span>ABONNÉS NEWSLETTER</span>
            <strong>{number(subscribers)}</strong>
            <small>
              {subscribers == null
                ? "Synchronisation automatique active · compteur exact non exposé par la source actuelle."
                : `Synchronisé automatiquement · ${formatDate(newsletterUpdatedAt, true)}.`}
            </small>
          </div>
        </div>

        <div className={styles.issueHeader}>
          <div>
            <span>ÉDITION #{baseIssue.number}</span>
            <h3>{baseIssue.title}</h3>
            <small>Publiée le {formatDate(baseIssue.date)}</small>
          </div>
          <a href={baseIssue.url} target="_blank" rel="noreferrer">Lire sur LinkedIn ↗</a>
        </div>

        <div className={styles.issueGrid}>
          <article><span>Vues article</span><strong>{number(issue.impressions)}</strong></article>
          <article><span>Réactions article</span><strong>{number(issue.reactions)}</strong></article>
          <article><span>Commentaires article</span><strong>{number(issue.comments)}</strong></article>
          <article><span>Impressions diffusion</span><strong>{number(issue.distributionImpressions)}</strong></article>
          <article><span>Portée diffusion</span><strong>{number(issue.distributionUniqueImpressions)}</strong></article>
        </div>

        <div className={styles.newsletterNotice}>
          <strong>Synchronisation automatique activée</strong>
          <p>
            Le cockpit met à jour seul les performances de la diffusion via Metricool et recherche les
            statistiques exactes de la newsletter dans les sources LinkedIn disponibles. Une valeur n’est
            affichée comme « abonnés newsletter » ou « vues article » que lorsqu’elle est vérifiée : aucun
            chiffre n’est déduit du nombre de followers du profil.
          </p>
          <p>
            Dernière vérification : {formatDate(newsletterUpdatedAt, true)} · Sources suivies :
            {" "}{(newsletter.sync?.sources || []).join(" · ") || "Metricool · LinkedIn"}.
          </p>
        </div>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <p className={styles.eyebrow}>LECTURE RAPIDE</p>
            <h2>Ce qu’il faut surveiller chaque semaine.</h2>
          </div>
        </div>
        <div className={styles.signalGrid}>
          <article>
            <span>PORTÉE</span>
            <strong>{number(account.uniqueImpressions)}</strong>
            <p>Impressions uniques cumulées disponibles sur les posts du snapshot.</p>
          </article>
          <article>
            <span>RÉACTIONS</span>
            <strong>{number(account.reactions)}</strong>
            <p>À comparer au sujet, au format et à la promesse de chaque publication.</p>
          </article>
          <article>
            <span>CONVERSATION</span>
            <strong>{number(account.comments)}</strong>
            <p>Les commentaires signalent les sujets à prolonger en post, newsletter ou Machine Builder.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
