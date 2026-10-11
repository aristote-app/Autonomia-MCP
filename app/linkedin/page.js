import Link from "next/link";
import { revalidatePath } from "next/cache";
import { getCurrentWorkspaceMembership } from "../../lib/auth/access.js";
import {
  latestLinkedinNewsletterMetrics,
  listLinkedinNewsletterMetrics,
  saveLinkedinNewsletterMetrics
} from "../../lib/db/linkedinAnalytics.js";
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

function metric(value, fallback = null) {
  return value == null ? fallback : value;
}

async function saveNewsletterMetricsAction(formData) {
  "use server";

  const context = await getCurrentWorkspaceMembership();
  const workspaceId = context?.membership?.workspace_id;
  const actorUserId = context?.claims?.sub || null;

  if (!workspaceId || !actorUserId || context.membership.role === "viewer") {
    throw new Error("Accès en écriture requis");
  }

  await saveLinkedinNewsletterMetrics({
    workspaceId,
    actorUserId,
    subscribers: formData.get("subscribers"),
    issueId: "issue-01",
    issueTitle: "#01 — Construire une machine IA pour le SAV e-commerce",
    impressions: formData.get("impressions"),
    reactions: formData.get("reactions"),
    comments: formData.get("comments"),
    shares: formData.get("shares"),
    clicks: formData.get("clicks")
  });

  revalidatePath("/linkedin");
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

  const context = await getCurrentWorkspaceMembership().catch(() => ({
    configured: false,
    claims: null,
    membership: null
  }));
  const workspaceId = context?.membership?.workspace_id || null;
  const canWrite = Boolean(
    context?.claims?.sub &&
    workspaceId &&
    context.membership.role !== "viewer"
  );

  const savedRows = workspaceId
    ? await listLinkedinNewsletterMetrics({ workspaceId }).catch(() => [])
    : [];
  const saved = latestLinkedinNewsletterMetrics(savedRows);

  const newsletter = snapshot.newsletter;
  const baseIssue = newsletter.issues[0];
  const manualIssue = saved.issues?.[baseIssue.id] || null;
  const subscribers = metric(saved.newsletter?.subscribers, newsletter.subscribers);
  const issue = {
    ...baseIssue,
    impressions: metric(manualIssue?.impressions, baseIssue.impressions),
    reactions: metric(manualIssue?.reactions, baseIssue.reactions),
    comments: metric(manualIssue?.comments, baseIssue.comments),
    shares: metric(manualIssue?.shares, baseIssue.shares),
    clicks: metric(manualIssue?.clicks, baseIssue.clicks)
  };

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
  const newsletterUpdatedAt =
    manualIssue?.updatedAt || saved.newsletter?.updatedAt || null;

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
                ? "À renseigner depuis LinkedIn Analytics."
                : `Dernière valeur enregistrée${saved.newsletter?.updatedAt ? " · " + formatDate(saved.newsletter.updatedAt, true) : ""}.`}
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
          <article><span>Impressions / vues</span><strong>{number(issue.impressions)}</strong></article>
          <article><span>Réactions</span><strong>{number(issue.reactions)}</strong></article>
          <article><span>Commentaires</span><strong>{number(issue.comments)}</strong></article>
          <article><span>Partages</span><strong>{number(issue.shares)}</strong></article>
          <article><span>Clics</span><strong>{number(issue.clicks)}</strong></article>
        </div>

        <div className={styles.newsletterNotice}>
          <strong>Pourquoi certains chiffres sont saisis ici ?</strong>
          <p>
            La connexion Metricool actuelle suit automatiquement le profil personnel et les posts.
            Les statistiques de newsletter détaillées ne sont exposées par Metricool que pour les pages entreprise.
            Le cockpit conserve donc les chiffres de la newsletter que vous relevez dans LinkedIn, sans les mélanger aux données posts.
          </p>
        </div>

        {canWrite ? (
          <form action={saveNewsletterMetricsAction} className={styles.manualForm}>
            <div className={styles.formHead}>
              <div>
                <span>MISE À JOUR NEWSLETTER</span>
                <strong>Reporter les chiffres affichés dans LinkedIn Analytics.</strong>
              </div>
              {newsletterUpdatedAt && <small>Dernière saisie · {formatDate(newsletterUpdatedAt, true)}</small>}
            </div>
            <div className={styles.formGrid}>
              <label>
                <span>Abonnés newsletter</span>
                <input name="subscribers" type="number" min="0" defaultValue={subscribers ?? ""} />
              </label>
              <label>
                <span>Vues / impressions #01</span>
                <input name="impressions" type="number" min="0" defaultValue={issue.impressions ?? ""} />
              </label>
              <label>
                <span>Réactions #01</span>
                <input name="reactions" type="number" min="0" defaultValue={issue.reactions ?? ""} />
              </label>
              <label>
                <span>Commentaires #01</span>
                <input name="comments" type="number" min="0" defaultValue={issue.comments ?? ""} />
              </label>
              <label>
                <span>Partages #01</span>
                <input name="shares" type="number" min="0" defaultValue={issue.shares ?? ""} />
              </label>
              <label>
                <span>Clics #01</span>
                <input name="clicks" type="number" min="0" defaultValue={issue.clicks ?? ""} />
              </label>
            </div>
            <button type="submit">Enregistrer les stats newsletter</button>
          </form>
        ) : (
          <p className={styles.readOnly}>
            Connectez-vous au cockpit avec un rôle contributeur ou supérieur pour enregistrer les statistiques Newsletter.
          </p>
        )}
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
