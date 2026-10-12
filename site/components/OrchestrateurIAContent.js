import Link from "next/link";
import styles from "./OrchestrateurIAContent.module.css";

const deliverySteps = [
  { number: "01", title: "Recevoir", detail: "Le client demande où se trouve son colis.", type: "Entrée", tool: "E-mail / formulaire" },
  { number: "02", title: "Comprendre", detail: "La demande est classée et la référence de commande est identifiée.", type: "IA encadrée", tool: "Classification / extraction" },
  { number: "03", title: "Vérifier", detail: "Le système interroge la commande et le suivi transporteur.", type: "Données réelles", tool: "CRM / boutique / API" },
  { number: "04", title: "Décider", detail: "La règle choisit : réponse préparée ou intervention du support.", type: "Règles métier", tool: "Routage & garde-fous" },
  { number: "05", title: "Transmettre", detail: "Le conseiller valide si nécessaire, puis le dossier est tracé.", type: "Supervision", tool: "Validation & historique" }
];

const useCases = [
  {
    number: "01",
    label: "VENTE B2B",
    title: "Une demande entrante devient un dossier commercial qualifié.",
    before: "Un prospect écrit. Ses informations restent dans la boîte mail et doivent être ressaisies dans le CRM.",
    chain: ["Identifier la société et le besoin", "Détecter les doublons et enrichir depuis les sources autorisées", "Créer une fiche et proposer une priorité à valider"],
    after: "Le commercial reçoit un dossier structuré, avec les éléments trouvés et ceux restant à vérifier.",
    role: "Orchestrateur IA + intégration CRM",
    guard: "Le score est une aide à la priorisation, pas un jugement automatique sur la personne."
  },
  {
    number: "02",
    label: "RH & ADMINISTRATIF",
    title: "Les pièces d'un dossier circulent entre les bonnes personnes.",
    before: "Documents, e-mails et relances s'accumulent. On ne sait plus quelle pièce est attendue.",
    chain: ["Reconnaître le type de document reçu", "Contrôler les champs et la complétude selon des règles", "Notifier le bon interlocuteur et préparer une relance"],
    after: "Le statut du dossier est lisible et les pièces manquantes sont identifiées pour validation humaine.",
    role: "Orchestrateur IA + gestion documentaire",
    guard: "Les décisions administratives restent prises par les personnes habilitées."
  },
  {
    number: "03",
    label: "FINANCE & PILOTAGE",
    title: "Un reporting se prépare sans copier-coller entre cinq outils.",
    before: "Chaque mois, l'équipe récupère des exports, consolide des fichiers et recherche les écarts.",
    chain: ["Collecter les données via les connecteurs disponibles", "Vérifier formats, périodes et incohérences", "Préparer tableaux et commentaires soumis à validation"],
    after: "Une base de reporting traçable est prête à être relue, plutôt qu'un fichier reconstruit à la main.",
    role: "Orchestrateur IA + intégration de données",
    guard: "Les valeurs calculées restent séparées des commentaires générés par l'IA."
  }
];

const architectures = [
  {
    tag: "01 / QUAND LES RÈGLES SUFFISENT",
    name: "Workflow classique",
    summary: "Une suite d'étapes fixes et prévisibles. Par exemple : réception d'un formulaire, création d'une tâche, notification.",
    choose: "À privilégier si les conditions et exceptions sont connues.",
    stack: "Make · n8n · Power Automate · API"
  },
  {
    tag: "02 / QUAND IL FAUT INTERPRÉTER",
    name: "Workflow + IA",
    summary: "Une étape lit, classe ou résume une information non structurée, puis les règles métier reprennent le contrôle.",
    choose: "Utile lorsque l'IA apporte une capacité précise, sans décider de toute la suite.",
    stack: "LLM · extraction structurée · RAG · validation"
  },
  {
    tag: "03 / QUAND IL FAUT COORDONNER",
    name: "Orchestration agentique",
    summary: "Plusieurs outils ou agents coopèrent selon un état partagé ; permissions, mémoire, routage et reprises sont explicités.",
    choose: "À réserver aux processus réellement multi-étapes et variables.",
    stack: "LangGraph · CrewAI · MCP · Python · tracing",
    featured: true
  }
];

const deliverables = [
  { number: "01", title: "Cartographie du processus", description: "Qui fait quoi aujourd'hui, avec quels outils, quelles données et quelles exceptions.", proof: "Un schéma lisible par les équipes métier et techniques." },
  { number: "02", title: "Architecture et droits", description: "Étapes, agents, connecteurs, permissions, données échangées et points de décision.", proof: "Des responsabilités explicites et des accès limités au besoin." },
  { number: "03", title: "Workflow testable", description: "Intégrations réelles, transitions, sorties structurées et actions soumises à validation.", proof: "Des scénarios reproductibles, pas seulement une démonstration." },
  { number: "04", title: "Traitement des incidents", description: "Timeouts, doublons, erreurs d'API, reprises, alertes et solution manuelle de secours.", proof: "Un parcours prévu aussi lorsque quelque chose échoue." },
  { number: "05", title: "Suivi opérationnel", description: "Traces d'exécution, volumes, étapes en erreur, coûts des appels et contrôles qualité.", proof: "Des indicateurs consultables par la personne chargée du suivi." },
  { number: "06", title: "Passation & autonomie", description: "Documentation, propriétaires, versions, procédures de maintenance et prise en main.", proof: "Le système peut être compris et repris après la mission." }
];

export default function OrchestrateurIAContent() {
  return (
    <>
      <section className={styles.showcase} id="orchestration-exemple" aria-labelledby="orchestrateur-exemple-title">
        <div className={styles.sectionIntro}>
          <p className={styles.sectionKicker}>03 — DU PROBLÈME AU WORKFLOW</p>
          <div>
            <h2 id="orchestrateur-exemple-title">Voyez ce que fait vraiment un orchestrateur IA.</h2>
            <p>Le rôle ne consiste pas à empiler des agents. Il consiste à faire passer une tâche d'un outil à l'autre, avec les bonnes décisions, les bonnes données et un contrôle humain là où il compte.</p>
          </div>
        </div>

        <div className={styles.demo}>
          <div className={styles.demoHeader}>
            <div>
              <span className={styles.demoLabel}>EXEMPLE ILLUSTRATIF · SAV E-COMMERCE</span>
              <h3>« Où est mon colis ? »</h3>
              <p>Un simple e-mail peut nécessiter cinq systèmes et plusieurs décisions. L'orchestrateur relie les étapes plutôt que de demander à quelqu'un de tout recopier.</p>
            </div>
            <span className={styles.demoMark} aria-hidden="true">A → B</span>
          </div>
          <ol className={styles.flow}>
            {deliverySteps.map((step) => (
              <li key={step.number} className={styles.flowStep}>
                <div className={styles.flowTop}><span>{step.number}</span><small>{step.type}</small></div>
                <h4>{step.title}</h4>
                <p>{step.detail}</p>
                <span className={styles.flowTool}>{step.tool}</span>
              </li>
            ))}
          </ol>
          <div className={styles.controlRow}>
            <div><span className={styles.controlSymbol} aria-hidden="true">!</span><p><strong>Si une donnée manque :</strong> le dossier est mis en attente, avec une raison identifiable. L'IA n'invente pas un statut de livraison.</p></div>
            <div><span className={styles.controlSymbol} aria-hidden="true">✓</span><p><strong>Avant toute action sensible :</strong> l'équipe garde la main sur les exceptions et les validations prévues.</p></div>
          </div>
        </div>

        <div className={styles.caseIntro}>
          <div>
            <span className={styles.overline}>D'AUTRES PROCESSUS CONCRETS</span>
            <h3>Trois besoins. Trois chaînes d'exécution différentes.</h3>
          </div>
          <p>Les situations ci-dessous illustrent ce qu'un expert pourrait concevoir après analyse des outils, des accès et des règles métier. Elles ne sont pas présentées comme des réalisations clients.</p>
        </div>

        <div className={styles.caseGrid}>
          {useCases.map((scenario) => (
            <article key={scenario.number} className={styles.caseCard}>
              <div className={styles.caseTop}><span>{scenario.number}</span><small>{scenario.label}</small></div>
              <h4>{scenario.title}</h4>
              <div className={styles.fromBlock}><b>POINT A · AUJOURD'HUI</b><p>{scenario.before}</p></div>
              <div className={styles.chainBlock}>
                <b>CE QUE L'ORCHESTRATEUR COORDONNE</b>
                <ol>{scenario.chain.map((action) => <li key={action}>{action}</li>)}</ol>
              </div>
              <div className={styles.toBlock}><b>POINT B · PROCESSUS CIBLE</b><p>{scenario.after}</p></div>
              <div className={styles.caseBottom}>
                <strong>{scenario.role}</strong>
                <p>{scenario.guard}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.architecture} id="choisir-orchestration" aria-labelledby="orchestrateur-choisir-title">
        <div className={styles.sectionIntro}>
          <p className={styles.sectionKicker}>04 — CHOISIR LA BONNE ARCHITECTURE</p>
          <div>
            <h2 id="orchestrateur-choisir-title">Un agent de plus n'est pas toujours une meilleure solution.</h2>
            <p>Un bon orchestrateur sait surtout <strong>où l'IA est utile et où une règle suffit.</strong> Le choix dépend de la variabilité des tâches, du niveau de risque, des outils disponibles et de la capacité à maintenir le système.</p>
          </div>
        </div>

        <div className={styles.architectureGrid}>
          {architectures.map((item) => (
            <article key={item.name} className={item.featured ? styles.architectureFeatured : styles.architectureCard}>
              <span className={styles.archTag}>{item.tag}</span>
              <h3>{item.name}</h3>
              <p>{item.summary}</p>
              <div className={styles.archWhen}><strong>Quand le choisir ?</strong><span>{item.choose}</span></div>
              <small>{item.stack}</small>
            </article>
          ))}
        </div>

        <div className={styles.decisionStrip}>
          <span>LE PRINCIPE AUTONOMIA</span>
          <p>Commencer par la solution la plus simple capable d'exécuter le processus, puis ajouter de l'autonomie seulement si le besoin le justifie.</p>
        </div>
      </section>

      <section className={styles.delivery} id="livrables-orchestrateur" aria-labelledby="orchestrateur-livrables-title">
        <div className={styles.sectionIntro}>
          <p className={styles.sectionKicker}>05 — CE QUE DOIT LIVRER L'EXPERT</p>
          <div>
            <h2 id="orchestrateur-livrables-title">Une mission terminée, ce n'est pas seulement un workflow qui tourne.</h2>
            <p>Le consultant doit laisser une solution compréhensible par les métiers, vérifiable par l'IT et maintenable après son intervention. Voici les éléments à demander et à contrôler lors du staffing.</p>
          </div>
        </div>
        <div className={styles.deliverablesGrid}>
          {deliverables.map((item) => (
            <article key={item.number} className={styles.deliverable}>
              <span className={styles.deliverableNumber}>{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div><b>À VÉRIFIER</b><span>{item.proof}</span></div>
            </article>
          ))}
        </div>
        <div className={styles.staffingBox}>
          <div>
            <span className={styles.overline}>SOURCING AUTONOMIA</span>
            <h3>Le bon profil sait expliquer ses choix et montrer ses limites.</h3>
            <p>Pour sélectionner un orchestrateur IA, nous privilégions la capacité à décrire un workflow livré, à expliquer les arbitrages IA / règles, à gérer les exceptions et à documenter la reprise. Les outils cités dans un CV ne suffisent pas à établir ces compétences.</p>
          </div>
          <Link href="#exprimer-besoin" className={styles.cta}>Décrire mon projet d'orchestration <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
    </>
  );
}
