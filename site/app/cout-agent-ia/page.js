import Link from "next/link";
import styles from "./guide.module.css";

export const metadata = {
  title: "Combien coûte un agent IA sur mesure ? Méthode de calcul et exemple",
  description: "Quel budget prévoir pour développer un agent IA métier ? Découvrez les postes de coût, un exemple de calcul transparent et les questions à poser avant un devis.",
  alternates: { canonical: "/cout-agent-ia" }
};

const factors = [
  ["Périmètre métier", "Une seule tâche à assister ou plusieurs processus avec exceptions et intervenants."],
  ["Données et documents", "Formats, qualité du corpus, droits d'accès, mises à jour et recherche documentaire."],
  ["Connexions aux logiciels", "API disponibles, authentification, mapping des données et gestion des erreurs."],
  ["Niveau d'autonomie", "Simple préparation, proposition d'action ou exécution contrôlée dans des outils."],
  ["Interface et permissions", "Nombre de profils utilisateurs, tableaux de bord, contrôle des accès et historisation."],
  ["Tests et déploiement", "Cas limites, recette métier, journalisation, surveillance et formation des utilisateurs."],
  ["Coûts récurrents", "Consommation de modèles, hébergement, licences, support, maintenance et évolutions."]
];
const questions = [
  ["Est-ce qu'un chatbot et un agent IA coûtent la même chose ?", "Le coût dépend surtout de l'architecture. Un assistant qui répond à partir d'un corpus documentaire peut demander moins d'intégrations qu'un agent autorisé à agir dans plusieurs logiciels. Le nombre de contrôles et de cas particuliers compte aussi."],
  ["Peut-on commencer avec un petit périmètre ?", "Oui. Identifier une tâche récurrente, une source de données et une action finale à valider permet de chiffrer un premier lot et d'évaluer son usage avant élargissement."],
  ["Le budget inclut-il les frais d'API et d'hébergement ?", "Cela dépend du contrat. Demandez de séparer conception et développement, frais mensuels des outils, hébergement, garantie, maintenance et évolutions."],
  ["Faut-il prévoir une validation humaine ?", "Le niveau de supervision dépend du risque de chaque action. La préparation d'un brouillon peut être automatisée ; une modification sensible, un paiement ou une décision engageante peuvent nécessiter une validation par la personne habilitée."]
];
export default function CoutAgentIaPage() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://build-autonomia.com";
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Combien coûte un agent IA sur mesure ?",
    description: "Méthode de chiffrage d'un agent IA métier avec exemple indicatif.",
    datePublished: "2026-10-15",
    dateModified: "2026-10-15",
    mainEntityOfPage: base + "/cout-agent-ia",
    author: { "@type": "Organization", name: "AUTONOMIA", url: base },
    publisher: { "@id": base + "#organization" },
    inLanguage: "fr-FR",
    citation: [
      "https://www.cnil.fr/fr/les-fiches-pratiques-ia",
      "https://messervices.cyber.gouv.fr/guides/recommandations-de-securite-pour-un-systeme-dia-generative"
    ]
  };
  return (
    <main className={styles.guide}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <nav className={styles.crumb} aria-label="Fil d'Ariane">
            <Link href="/">Accueil</Link><span>→</span><Link href="/solutions-ia">AUTONOMIA BUILD</Link><span>→</span><span>Budget agent IA</span>
          </nav>
          <span className={styles.kicker}>GUIDE BUDGET · AGENT IA MÉTIER</span>
          <h1>Combien coûte un agent IA sur mesure ?</h1>
          <p>Le budget dépend moins du modèle d'IA choisi que du travail à réaliser : données, logiciels à connecter, droits, actions autorisées, tests et accompagnement. Voici comment préparer un chiffrage utile avant de consulter un prestataire.</p>
          <Link className={styles.heroLink} href="/start">Décrire mon projet et demander une estimation →</Link>
        </div>
      </header>

      <article className={styles.article}>
        <aside className={styles.introCard}>
          <strong>À retenir</strong>
          <p>Pour comparer deux devis, demandez le même périmètre : fonctions incluses, intégrations, validation humaine, recette, formation et frais récurrents. Une démonstration seule n'est pas équivalente à une solution exploitée par une équipe.</p>
        </aside>

        <section>
          <h2>1. Commencer par définir ce que doit faire l'agent</h2>
          <p>Le terme « agent IA » recouvre plusieurs systèmes. Certains résument des informations ou proposent des réponses. D'autres appellent des outils, préparent des décisions ou déclenchent des actions. Un workflow classique peut parfois suffire et être plus simple à superviser.</p>
          <p>Décrivez une séquence précise : événement déclencheur, données lues, résultat attendu, personne responsable de la validation et cas à traiter manuellement. Cette description constitue la première base du devis.</p>
        </section>

        <section>
          <h2>2. Les sept postes qui déterminent le prix</h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead><tr><th>Poste</th><th>Ce qui fait varier le budget</th></tr></thead>
              <tbody>{factors.map(([name,detail]) => <tr key={name}><td><strong>{name}</strong></td><td>{detail}</td></tr>)}</tbody>
            </table>
          </div>
          <p>Ces postes sont à examiner dans tout projet, même si certains ne génèrent aucun développement supplémentaire selon l'environnement existant.</p>
        </section>

        <section>
          <h2>3. Exemple de budget : une simulation, pas un tarif AUTONOMIA</h2>
          <p>Imaginons une entreprise qui souhaite recevoir des demandes par e-mail, reconnaître leur objet, préparer une réponse à partir de documents internes et soumettre le brouillon au responsable avant envoi.</p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead><tr><th>Travail hypothétique</th><th>Charge indicative</th></tr></thead>
              <tbody>
                <tr><td>Cadrage et définition des règles</td><td>2 jours</td></tr>
                <tr><td>Intégration e-mail, documentation et workflow</td><td>4 jours</td></tr>
                <tr><td>Tests, corrections et gestion des exceptions</td><td>2 jours</td></tr>
                <tr><td>Formation et mise en service</td><td>2 jours</td></tr>
              </tbody>
            </table>
          </div>
          <div className={styles.calc}>
            <p>Si l'on prend pour <strong>simple hypothèse de calcul</strong> un taux journalier de 800 € HT et une charge de 10 jours :</p>
            <strong>10 jours × 800 € HT = 8 000 € HT</strong>
            <p>Ce montant illustratif exclut hébergement, licences, consommation des modèles, assistance récurrente et éventuelles exigences spécifiques. Il ne constitue ni un prix catalogue, ni un devis AUTONOMIA, ni une moyenne de marché.</p>
          </div>
          <p>Pour votre projet, nous déterminons d'abord la charge réelle, les prérequis techniques et les responsabilités de chacun avant de proposer un montant.</p>
        </section>

        <section>
          <h2>4. Les frais à prévoir après le développement</h2>
          <ul>
            <li><strong>Consommation :</strong> appels aux modèles, stockage, traitements et éventuels services tiers.</li>
            <li><strong>Exploitation :</strong> hébergement, journalisation, suivi des erreurs et supervision.</li>
            <li><strong>Maintenance :</strong> mises à jour de connecteurs, correction de défauts et adaptation aux changements d'API.</li>
            <li><strong>Évolution :</strong> nouvelles règles, nouveaux utilisateurs, nouveaux logiciels ou nouvelles fonctionnalités.</li>
          </ul>
          <p>Demandez une estimation sur plusieurs scénarios de volume et faites préciser ce qui relève de la garantie, de la maintenance et des évolutions facturables.</p>
        </section>

        <section>
          <h2>5. Les cinq questions à inclure dans votre cahier des charges</h2>
          <ul>
            <li>Quels événements déclenchent le traitement et quelles tâches restent humaines ?</li>
            <li>Quelles sources de données sont utilisées et quels droits sont nécessaires ?</li>
            <li>Quelles opérations l'agent peut-il réaliser seul, préparer ou seulement suggérer ?</li>
            <li>Comment les erreurs, les exceptions, les traces et les corrections sont-elles traitées ?</li>
            <li>Quels livrables sont remis : code ou configuration, documentation, tests, formation et transfert ?</li>
          </ul>
          <p>Pour la sécurité d'un système d'IA générative, l'ANSSI publie un guide destiné notamment aux entreprises et administrations. La CNIL propose également des fiches concernant le développement des systèmes d'IA et les données personnelles. Leur applicabilité dépend du projet et du traitement réalisé.</p>
          <p className={styles.sourceLinks}>
            Sources : <a href="https://messervices.cyber.gouv.fr/guides/recommandations-de-securite-pour-un-systeme-dia-generative" target="_blank" rel="noopener noreferrer">Recommandations de l'ANSSI</a> · <a href="https://www.cnil.fr/fr/les-fiches-pratiques-ia" target="_blank" rel="noopener noreferrer">Fiches pratiques CNIL</a>
          </p>
        </section>

        <section className={styles.faq}>
          <h2>Questions fréquentes</h2>
          {questions.map(([question,answer]) => (
            <details key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </section>
      </article>

      <section className={styles.bottom}>
        <div>
          <h2>Votre besoin mérite un chiffrage adapté.</h2>
          <p>AUTONOMIA BUILD : automatisations, agents et applications IA métier, avec accompagnement des équipes.</p>
        </div>
        <Link href="/start">Décrire mon projet IA →</Link>
      </section>
    </main>
  );
}