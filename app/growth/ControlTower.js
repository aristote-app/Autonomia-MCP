 "use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "./ControlTower.module.css";

const OFFERS = [
  { id: "all", label: "Toutes les offres" },
  { id: "EXPERTS", label: "Experts IA" },
  { id: "BUILD", label: "Build" },
  { id: "ACADEMY", label: "Academy" }
];

function cls(...names) { return names.filter(Boolean).join(" "); }
function formatDate(value) {
  if (!value) return "Date non disponible";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date non disponible";
  return new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", day: "2-digit", month: "short" }).format(date);
}
function classifyAction(id) {
  if (["respond", "prepare_meeting", "follow_proposal"].includes(id)) return "urgent";
  if (["verify", "verify_client", "find_decider", "find_linkedin"].includes(id)) return "human";
  if (id === "monitor") return "automatic";
  return "ready";
}
function stageText(id) {
  const map = {
    respond: "Réponse à traiter",
    prepare_meeting: "RDV à préparer",
    follow_proposal: "Proposition à suivre",
    verify: "Profil à vérifier",
    verify_client: "Entreprise à vérifier",
    find_decider: "Décideur à trouver",
    find_linkedin: "LinkedIn à identifier",
    prepare: "À valider",
    monitor: "En cours"
  };
  return map[id] || "À examiner";
}
function Kpi({ icon, label, value, context, emphasis }) {
  return <article className={cls(styles.kpi, emphasis && styles.kpiEmphasis)}>
    <div className={styles.kpiHeader}><span className={styles.kpiIcon} aria-hidden="true">{icon}</span><span>{label}</span></div>
    <strong>{value}</strong>
    <small>{context}</small>
  </article>;
}
function Pill({ children, tone = "neutral" }) {
  return <span className={cls(styles.pill, styles["pill_" + tone])}>{children}</span>;
}
function SignalDate({ value }) {
  return <time dateTime={value || undefined}>{formatDate(value)}</time>;
}
function PlayCard({ play, onCopy, copied }) {
  const category = classifyAction(play.action?.id);
  return <article className={cls(styles.playCard, styles["play_" + category])}>
    <div className={styles.playTop}>
      <span className={cls(styles.offerMark, styles["offer_" + play.offer])}>{play.offer}</span>
      <Pill tone={category === "urgent" ? "coral" : category === "automatic" ? "green" : category === "ready" ? "blue" : "amber"}>
        {stageText(play.action?.id)}
      </Pill>
      <span className={styles.playScore} title="Score heuristique de priorité, pas une probabilité d'achat">{play.score}/100</span>
    </div>
    <div className={styles.playBody}>
      <div><h3>{play.company}</h3><p className={styles.person}>{play.contactName || "Interlocuteur à identifier"}{play.contactRole ? " · " + play.contactRole : ""}</p></div>
      <p className={styles.actionReason}><strong>{play.action?.label}.</strong> {play.action?.reason}</p>
      {play.evidence?.url
        ? <div className={styles.evidence}>
            <span className={styles.evidenceDot} aria-hidden="true"/>
            <div><span>Signal documenté · <SignalDate value={play.evidence.date}/></span>
            <a href={play.evidence.url} target="_blank" rel="noopener noreferrer">{play.evidence.title} <span aria-hidden="true">↗</span></a></div>
          </div>
        : <div className={styles.noEvidence}>Besoin non confirmé · Prospection de découverte uniquement</div>}
    </div>
    <div className={styles.playFoot}>
      <Link className={styles.cardPrimary} href={play.route}>Ouvrir le dossier <span aria-hidden="true">↗</span></Link>
      {play.linkedIn && <a className={styles.textAction} href={play.linkedIn} target="_blank" rel="noopener noreferrer">Profil LinkedIn</a>}
      <button className={styles.textAction} type="button" onClick={() => onCopy(play)} title="Copier le brouillon proposé, sans l'envoyer">{copied === play.id ? "Message copié ✓" : "Copier le message"}</button>
    </div>
  </article>;
}

export default function ControlTower({ overview, plays, signalCount, sources, connections, generatedAt }) {
  const [offer, setOffer] = useState("all");
  const [view, setView] = useState("needs");
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(null);
  const [sourcesExpanded, setSourcesExpanded] = useState(false);
  const [toast, setToast] = useState("");
  const actionSet = ["respond", "prepare_meeting", "follow_proposal", "prepare", "verify", "find_decider", "find_linkedin", "verify_client"];
  const decisions = useMemo(() => plays.filter(p => actionSet.includes(p.action?.id)), [plays]);
  const followups = useMemo(() => plays.filter(p => ["respond","prepare_meeting","follow_proposal"].includes(p.action?.id)), [plays]);
  const active = useMemo(() => plays.filter(p => p.action?.id === "monitor"), [plays]);
  const filtered = useMemo(() => {
    const q = search.toLocaleLowerCase("fr").trim();
    const base = view === "needs" ? decisions : view === "followups" ? followups : view === "active" ? active : plays;
    return base.filter(p => (offer === "all" || p.offer === offer) && (!q ||
      [p.company, p.contactName, p.contactRole, p.evidence?.title].filter(Boolean).join(" ").toLocaleLowerCase("fr").includes(q)
    )).slice(0, 24);
  }, [plays, decisions, followups, active, offer, view, search]);
  const readySources = sources.filter(s => s.count > 0).length;
  const needsLabel = decisions.length === 1 ? "1 décision" : decisions.length + " décisions";

  async function copyMessage(play) {
    try {
      await navigator.clipboard.writeText(play.message || "");
      setCopied(play.id);
      setToast("Le brouillon est copié. Relis-le avant utilisation.");
    } catch {
      setToast("La copie automatique est indisponible sur cet appareil.");
    }
  }

  return <main className={styles.layout}>
    <header className={styles.hero}>
      <div className={styles.topline}><span className={styles.toplineDot}/><span>GROWTH INTELLIGENCE</span><span className={styles.toplineSeparator}>/</span><span>COCKPIT AUTONOMIA</span></div>
      <div className={styles.heroGrid}>
        <div className={styles.heroText}>
          <h1>Vous décidez.<br/><em>La machine avance.</em></h1>
          <p>Les signaux commerciaux arrivent ici, l'IA prépare les prochaines actions et tu gardes la main sur les contacts et les messages.</p>
          <div className={styles.heroButtons}>
            <a className={styles.heroPrimary} href="#priorities">Voir mes priorités <span aria-hidden="true">↗</span></a>
            <Link className={styles.heroSecondary} href="/integrations">Gérer les connexions</Link>
          </div>
        </div>
        <div className={styles.heroStatus}>
          <div className={styles.heroStatusTop}><span>VUE D'ENSEMBLE</span><span className={styles.liveDot}/> <span>Données du cockpit</span></div>
          <div className={styles.heroBig}><strong>{decisions.length}</strong><span>actions à examiner</span></div>
          <div className={styles.heroStatusBottom}><span>La prospection n'est pas envoyée depuis cet écran.</span><span>Actualisé {formatDate(generatedAt)}</span></div>
          <span className={styles.orbitOne}/><span className={styles.orbitTwo}/>
        </div>
      </div>
    </header>

    <section className={styles.systemRibbon} aria-label="Qui fait quoi">
      <div className={styles.ribbonItem}><span className={cls(styles.stateIcon, styles.stateAuto)} aria-hidden="true">↻</span><div><strong>Le moteur travaille</strong><span>Sourcing et priorisation prévus côté serveur</span></div><Pill tone="green">Automatisé*</Pill></div>
      <div className={styles.ribbonItem}><span className={cls(styles.stateIcon, styles.stateUser)} aria-hidden="true">!</span><div><strong>Votre intervention</strong><span>{needsLabel} identifiées dans le pipeline</span></div><Pill tone="amber">À examiner</Pill></div>
      <div className={styles.ribbonItem}><span className={cls(styles.stateIcon, styles.stateConnection)} aria-hidden="true">⇄</span><div><strong>Waalaxy Advanced</strong><span>{connections.waalaxy ? "Clé côté serveur présente" : "Clé API à connecter pour les imports"}</span></div><Pill tone={connections.waalaxy ? "blue" : "neutral"}>{connections.waalaxy ? "À tester" : "Non connecté"}</Pill></div>
    </section>

    <section className={styles.kpiGrid} aria-label="Indicateurs réels">
      <Kpi icon="◎" value={Math.max(0, overview.accounts - overview.excluded)} label="Comptes candidats" context="Hors intermédiaires repérés"/>
      <Kpi icon="⌁" value={signalCount} label="Signaux consultés" context="Échantillon de la base (max 500)"/>
      <Kpi icon="◉" value={overview.verified} label="Contacts vérifiés" context="Dans l'espace commercial"/>
      <Kpi icon="↗" value={overview.pipelineMeetings} label="Au stade RDV" context="Toutes périodes, pas forcément tenus" emphasis/>
    </section>

    <section className={styles.mainGrid} id="priorities">
      <div className={styles.leftColumn}>
        <div className={styles.sectionHeading}>
          <div><p className={styles.eyebrow}>01 · CENTRE DE DÉCISION</p><h2>Ce qui mérite ton attention<span className={styles.headingAccent}>.</span></h2>
          <p>Des propositions classées, avec la preuve du signal et une seule prochaine action.</p></div>
          <span className={styles.countBubble}>{needsLabel}</span>
        </div>
        <div className={styles.actionToolbar}>
          <div className={styles.tabs} role="group" aria-label="Type de suivi">
            {[["needs", "À décider", decisions.length], ["followups", "À relancer", followups.length], ["active", "En cours", active.length], ["all", "Tout", plays.length]].map(([id, title, count]) =>
              <button type="button" key={id} onClick={() => setView(id)} className={cls(styles.tab, view === id && styles.tabActive)} aria-pressed={view === id}>{title}<span>{count}</span></button>
            )}
          </div>
          <label className={styles.searchBox}><span className={styles.srOnly}>Rechercher une entreprise, un contact ou un signal</span><span aria-hidden="true">⌕</span><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Chercher une entreprise…" /></label>
        </div>
        <div className={styles.offerFilters} role="group" aria-label="Filtrer par offre">
          {OFFERS.map(o => <button type="button" key={o.id} onClick={() => setOffer(o.id)} aria-pressed={offer === o.id} className={cls(styles.offerFilter, offer === o.id && styles.offerFilterActive)}>{o.label}</button>)}
        </div>
        <div className={styles.cards}>
          {filtered.length ? filtered.map(play => <PlayCard key={play.id} play={play} copied={copied} onCopy={copyMessage}/>)
            : <div className={styles.empty}><span aria-hidden="true">◌</span><h3>Aucune action dans cette vue</h3><p>Change les filtres ou consulte les comptes existants. Aucun prospect n'est inventé pour remplir l'écran.</p><Link href="/accounts">Explorer les comptes →</Link></div>}
        </div>
        {filtered.length === 24 && <p className={styles.listFoot}>24 dossiers affichés. Affine la recherche ou <Link href="/accounts">consulte tous les comptes</Link>.</p>}
      </div>

      <aside className={styles.rightColumn}>
        <section className={styles.automationPanel}>
          <div className={styles.sideHeading}><span className={styles.miniIcon}>✳</span><div><p className={styles.eyebrow}>02 · SANS MANIPULATION</p><h2>Ce que fait le moteur</h2></div></div>
          <div className={styles.workflow}>
            {[
              { n: "01", label: "Détecter les signaux", sub: "Annonces IA et signaux publics indexés", ready: connections.brave || connections.franceTravail },
              { n: "02", label: "Croiser les entreprises", sub: "Regroupement et exclusion des ESN repérées", ready: true },
              { n: "03", label: "Prioriser les dossiers", sub: "Score explicable et message à relire", ready: true },
              { n: "04", label: "Compléter avec Kaspr", sub: "Enrichissement conditionnel sur contacts vérifiés", ready: connections.kaspr },
              { n: "05", label: "Transférer vers Waalaxy", sub: "Après vérification et validation", ready: connections.waalaxy }
            ].map((step, i) => <div className={styles.workflowItem} key={step.n}><span className={cls(styles.workflowNumber, step.ready ? styles.workflowReady : styles.workflowPending)}>{step.ready ? "✓" : step.n}</span><div><strong>{step.label}</strong><span>{step.sub}</span></div><span className={cls(styles.workflowBadge, step.ready ? styles.workflowBadgeOn : styles.workflowBadgeOff)}>{step.ready ? (i === 0 ? "Configuré*" : "Prévu") : "À connecter"}</span></div>)}
          </div>
          <p className={styles.safetyNote}>*La présence du code ou d'une clé ne prouve pas qu'une collecte vient de réussir. Les envois LinkedIn nécessitent toujours une validation et sont soumis aux règles de LinkedIn.</p>
        </section>

        <section className={styles.connectionsPanel}>
          <div className={styles.sideHeading}><span className={styles.miniIcon}>⌘</span><div><p className={styles.eyebrow}>03 · CONNECTIVITÉ</p><h2>Mes outils</h2></div></div>
          {[
            { name: "Waalaxy", detail: "Import et campagnes", status: connections.waalaxy, initial: "W", color: "waalaxy" },
            { name: "Kaspr", detail: "Coordonnées B2B", status: connections.kaspr, initial: "K", color: "kaspr" },
            { name: "Brave Search", detail: "Index web d'annonces", status: connections.brave, initial: "B", color: "brave" },
            { name: "France Travail", detail: "API offres d'emploi", status: connections.franceTravail, initial: "F", color: "ft" }
          ].map(c => <div className={styles.connectionRow} key={c.name}><div className={cls(styles.toolIcon, styles["tool_" + c.color])}>{c.initial}</div><div><strong>{c.name}</strong><span>{c.detail}</span></div><span className={cls(styles.connectionDot, c.status ? styles.dotOn : styles.dotOff)} title={c.status ? "Configuration présente, connexion non testée ici" : "Accès à connecter"}/></div>)}
          <Link className={styles.integrationsLink} href="/integrations">Voir le détail des connexions <span aria-hidden="true">↗</span></Link>
        </section>
      </aside>
    </section>

    <section className={styles.sourcesSection} id="sources">
      <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>04 · RADAR MULTI-SOURCES</p><h2>Les sources que nous suivons<span className={styles.headingAccent}>.</span></h2><p>Le code, les clés et les annonces réellement enregistrées sont distingués.</p></div><div className={styles.sourcesSummary}><strong>{readySources}</strong><span>source(s) avec<br/>données présentes</span></div></div>
      <div className={styles.sourcesGrid}>
        {(sourcesExpanded ? sources : sources.slice(0, 6)).map(s => <article className={styles.sourceCard} key={s.id}>
          <div className={styles.sourceHead}><span className={cls(styles.sourceIcon, styles["source_" + s.category])}>{s.initial}</span><Pill tone={s.count > 0 ? "green" : s.stage === "planned" ? "neutral" : "amber"}>{s.count > 0 ? "Données présentes" : s.stage === "planned" ? "À intégrer" : "Aucune donnée"}</Pill></div>
          <strong>{s.label}</strong>
          <p>{s.method}</p>
          <div className={styles.sourceBottom}><span>{s.count > 0 ? s.count + " annonce(s) dans l'échantillon" : s.stage === "planned" ? "Connecteur prévu" : "Collecte à vérifier"}</span>{s.latest && <small>Vu le <SignalDate value={s.latest}/></small>}</div>
        </article>)}
      </div>
      <div className={styles.sourcesFooter}><span>Une annonce publiée sur plusieurs sites doit devenir un seul dossier commercial.</span><button type="button" onClick={() => setSourcesExpanded(s => !s)}>{sourcesExpanded ? "Afficher moins −" : "Voir toutes les sources +"}</button></div>
    </section>

    <section className={styles.footerCta}>
      <div><p className={styles.eyebrow}>LA SUITE DU PARCOURS</p><h2>Une opportunité, une personne, une action.</h2><p>Les fiches entreprises, les contacts et les campagnes restent reliés. Pas de double prospection, pas d'annonce inventée, pas d'envoi silencieux.</p></div>
      <div><Link href="/accounts" className={styles.bottomPrimary}>Comptes 360° ↗</Link><Link href="/contacts" className={styles.bottomSecondary}>Suivi des contacts ↗</Link></div>
    </section>
    <div className={styles.footerMeta}><span>AUTONOMIA · GROWTH INTELLIGENCE</span><span>Données réelles du workspace · Priorités indicatives · Validation humaine</span></div>
    {toast && <div className={styles.toast} role="status"><span>{toast}</span><button aria-label="Fermer la notification" onClick={() => setToast("")} type="button">×</button></div>}
  </main>;
}
