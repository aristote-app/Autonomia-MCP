import Link from "next/link";
import styles from "./PublicOverview.module.css";

const SOURCE_NAMES = Object.freeze({
  linkedin: "LinkedIn Jobs",
  indeed: "Indeed",
  france_travail_jobs: "France Travail",
  welcome_to_the_jungle: "Welcome to the Jungle",
  apec: "Apec",
  hellowork: "HelloWork"
});

const OFFER_STEPS = [
  { label: "EXPERTS", color: "purple", title: "Recrutements IA", description: "Repérer les entreprises qui embauchent directement des profils IA." },
  { label: "ACADEMY", color: "green", title: "Besoins de formation", description: "Identifier les signaux d'adoption et les responsables formation." },
  { label: "BUILD", color: "blue", title: "Projets opérationnels", description: "Surveiller les annonces révélant un besoin d'automatisation." }
];

function initials(name) {
  return String(name || "?").trim().split(/\s+/).slice(0,2).map(s=>s[0]||"").join("").toUpperCase();
}
function DecisionMakerInJob({ recommendation }) {
  if (!recommendation) return null;
  const identified = recommendation.kind === "named_public_contact";
  const candidate = recommendation.kind === "search_candidate";
  const visible = identified || candidate;
  return <div className={identified ? styles.decisionCard : styles.decisionCardPending}>
    <div className={styles.decisionTop}>
      <span className={styles.decisionEyebrow}>✦ QUI CONTACTER ?</span>
      <span className={identified ? styles.decisionReviewed : styles.decisionNotFound}>
        {identified ? "Profil professionnel documenté" : candidate ? "Profil à confirmer" : "Recherche automatique à poursuivre"}
      </span>
    </div>
    <div className={styles.decisionIdentity}>
      <span className={identified ? styles.decisionAvatar : styles.decisionAvatarPending} aria-hidden="true">
        {visible ? initials(recommendation.name) : "◎"}
      </span>
      <div>
        <strong>{visible ? recommendation.name : "Décideur non identifié"}</strong>
        <p>{visible ? recommendation.role : "Fonction cible : " + recommendation.targetRole + ". Aucun profil personnel confirmé."}</p>
      </div>
    </div>
    {identified && <p className={styles.decisionNotice}>Fonction publiée dans une source professionnelle. Son rôle dans ce recrutement reste à confirmer.</p>}
    {candidate && <p className={styles.decisionNotice}>Résultat de recherche public. Identité, emploi actuel et pouvoir de décision à vérifier avant toute prospection.</p>}
    {visible && <div className={styles.decisionLinks}>
      <a className={styles.decisionPrimary} target="_blank" rel="noopener noreferrer" href={recommendation.linkedinUrl}>Voir le profil LinkedIn ↗</a>
      <a className={styles.decisionSecondary} href={recommendation.sourceUrl} target="_blank" rel="noopener noreferrer">Source ↗</a>
    </div>}
    {!visible && <p className={styles.decisionNotice}>Aucun lien générique : cet encart affichera un accès LinkedIn seulement après identification d'une personne.</p>}
  </div>;
}

function dateFR(value) {
  if (!value) return "Date non confirmée";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date non confirmée";
  return new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", day:"numeric", month:"short", year:"numeric" }).format(date);
}

export default function PublicOverview({ signals=[], sources=[], updatedAt, historical=null }) {
  const withData=sources.filter(s=>s.count>0);
  return <main className={styles.page}>
    {historical && <section aria-label="Contacts historiques" style={{padding:20,background:"#f1f5f9",borderRadius:12,margin:"12px 0 20px",color:"#17253a"}}>
      <strong>Base historique conservée : {historical.records} fiches sources, {historical.uniqueProfiles} profils LinkedIn uniques et {historical.opportunityLinks} références d'annonces</strong>
      <p>Ces contacts ne sont pas nécessairement les décideurs des besoins actuels.</p>
      <Link href="/growth/historique">Voir les contacts historiques et leurs sources ↗</Link>
    </section>}
    <section style={{padding:"18px 22px",margin:"12px 0",border:"1px solid #a8b7d8",borderRadius:12}}><strong>🌍 Formateurs francophones · Suisse, Belgique, Canada</strong><p>Recherche automatique de demandes de formation : distanciel ou formateurs locaux sur place.</p><Link href="/missions-formateurs">Voir les missions internationales ↗</Link></section>
    <header className={styles.hero}>
      <div className={styles.eyebrow}><span className={styles.liveDot}/> AUTONOMIA · GROWTH INTELLIGENCE</div>
      <div className={styles.heroGrid}>
        <div>
          <h1>Ton radar commercial.<br/><em>Accès direct.</em></h1>
          <p>Consulte les signaux de recrutement accessibles publiquement et la couverture des sources, sans écran de connexion.</p>
          <a className={styles.cta} href="#signaux">Explorer les signaux <span aria-hidden="true">↗</span></a>
        </div>
        <div className={styles.heroBubble}>
          <span>RADAR RECRUTEMENT</span>
          <strong>{signals.length}</strong>
          <p>annonce(s) affichable(s) après les premiers filtres</p>
          <small>Données publiques, employeurs à confirmer</small>
        </div>
      </div>
    </header>

    <section className={styles.ribbon} aria-label="Niveaux d'accès">
      <div><span className={styles.roundGreen} aria-hidden="true">✓</span><div><strong>Sans connexion</strong><small>Radar public accessible immédiatement</small></div></div>
      <div><span className={styles.roundBlue} aria-hidden="true">↻</span><div><strong>Recherche automatique</strong><small>Collecteurs et analyses configurés dans AUTONOMIA</small></div></div>
      <div><span className={styles.roundAmber} aria-hidden="true">⌁</span><div><strong>Données privées préservées</strong><small>Contacts, campagnes et clés restent protégés</small></div></div>
    </section>

    <section className={styles.metrics} aria-label="Vue publique des sources">
      <article><span>Sources référencées</span><strong>{sources.length}</strong><small>Existantes et prévues</small></article>
      <article><span>Sources avec données</span><strong>{withData.length}</strong><small>Dans l'échantillon consulté</small></article>
      <article><span>Annonces affichées</span><strong>{signals.length}</strong><small>Après exclusion des intermédiaires repérés</small></article>
    </section>

    <section className={styles.bodyGrid} id="signaux">
      <div className={styles.mainColumn}>
        <div className={styles.sectionHead}>
          <div><p>01 · OPPORTUNITÉS VISIBLES</p><h2>Les signaux repérés<span>.</span></h2><small>Chaque annonce indique maintenant la fonction à contacter, avec un profil LinkedIn direct lorsqu’il a déjà été identifié dans des sources professionnelles. Les ESN identifiées restent exclues.</small></div>
          <span className={styles.infoTag}>{signals.filter(s=>s.decisionMaker?.kind==="named_public_contact").length} profil(s) recensé(s)</span>
        </div>
        <div className={styles.jobList}>
          {signals.length ? signals.map((s,i)=><article key={s.id+":"+i} className={styles.job}>
            <div className={styles.jobTop}><span className={styles.source}>{SOURCE_NAMES[s.sourceId]||"Source publique"}</span><span className={styles.date}>{dateFR(s.publishedAt)}</span></div>
            <h3>{s.company}</h3>
            <p className={styles.jobTitle}>{s.title}</p>
            <DecisionMakerInJob recommendation={s.decisionMaker}/>
            <div className={styles.jobFooter}><span className={styles.review}>◷ Employeur à confirmer</span><a href={s.sourceUrl} target="_blank" rel="noopener noreferrer">Voir l'offre originale ↗</a></div>
          </article>):<div className={styles.empty}><span className={styles.emptyIcon} aria-hidden="true">◎</span><h3>Aucune annonce vérifiable à afficher</h3><p>Les sources restent visibles ci-dessous. Le radar conserve les critères d'exclusion des ESN et n'invente aucun signal.</p></div>}
        </div>
      </div>
      <aside className={styles.aside}>
        <section className={styles.sidePanel}>
          <p className={styles.eyebrowDark}>02 · LA MACHINE AUTONOMIA</p>
          <h2>Du signal au bon contact.</h2>
          <div className={styles.steps}>
            <div><span className={styles.stepGreen}>✓</span><p><strong>Détection</strong><small>Offres et signaux publics indexés</small></p></div>
            <div><span className={styles.stepBlue}>2</span><p><strong>Qualification</strong><small>Écarter les ESN, contrôler l'employeur</small></p></div>
            <div><span className={styles.stepBlue}>3</span><p><strong>Décideur</strong><small>Rapprochement avec les contacts déjà connus</small></p></div>
            <div><span className={styles.stepAmber}>4</span><p><strong>Validation humaine</strong><small>Vérifier le contact et le message</small></p></div>
            <div><span className={styles.stepNeutral}>5</span><p><strong>Waalaxy</strong><small>Import après connexion API et validation</small></p></div>
          </div>
          <div className={styles.disclosure}>Les étapes ci-dessus décrivent le parcours cible ; chaque connexion et chaque import doivent être testés avant activation.</div>
        </section>
        <section className={styles.sidePanel}>
          <p className={styles.eyebrowDark}>03 · NOS 3 CIRCUITS</p>
          {OFFER_STEPS.map(s=><div className={styles.offerLine} key={s.label}><span className={styles["accent_"+s.color]}>{s.label}</span><div><strong>{s.title}</strong><small>{s.description}</small></div></div>)}
        </section>
      </aside>
    </section>

    <section className={styles.sources} id="sources">
      <div className={styles.sectionHead}><div><p>04 · COUVERTURE</p><h2>Les sources de recrutement<span>.</span></h2><small>La présence du connecteur ne garantit pas une collecte récente réussie.</small></div><span className={styles.infoTag}>{sources.length} sources référencées</span></div>
      <div className={styles.sourceGrid}>
        {sources.map(s=><article key={s.id} className={styles.sourceCard}>
          <div className={styles.sourceLine}><span className={styles.sourceInitial}>{s.initial}</span><span className={s.count>0?styles.tagData:s.stage==="planned"?styles.tagPlanned:styles.tagCheck}>{s.count>0?"Données disponibles":s.stage==="planned"?"À intégrer":"À vérifier"}</span></div>
          <strong>{s.label}</strong><p>{s.method}</p>
          <small>{s.count ? s.count+" enregistrement(s) dans l'échantillon":s.stage==="planned"?"Source prévue":"Pas de données dans l'échantillon"}</small>
        </article>)}
      </div>
    </section>

    <footer className={styles.footer}>
      <div><p className={styles.eyebrowDark}>À PROPOS DE CET ACCÈS</p><h2>Le radar est accessible directement.</h2><p>Les fiches de prospection, données personnelles, campagnes Waalaxy et opérations commerciales restent réservées à ton espace privé.</p></div>
      <div className={styles.footerLinks}><Link href="/login?next=/growth">Ouvrir les fonctions privées ↗</Link><a href="https://build-autonomia.com" target="_blank" rel="noopener noreferrer">Site AUTONOMIA ↗</a></div>
    </footer>
    <div className={styles.bottom}>AUTONOMIA · RADAR PUBLIC <span>Dernière consultation {dateFR(updatedAt)}</span></div>
  </main>;
}
