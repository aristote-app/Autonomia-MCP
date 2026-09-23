import Link from "next/link";
import HomeLeadSwitch from "@/components/HomeLeadSwitch";
import AutonomiaScan from "@/components/AutonomiaScan";
import QualiopiProof from "@/components/QualiopiProof";
import LiveJobSignals from "@/components/LiveJobSignals";
import HomeUseCaseLab from "@/components/HomeUseCaseLab";
import {
  publishedExecutionArticles,
  publishedTrainingArticles
} from "@/content/published-articles";

const expertRoles = [
  "AI Project Manager",
  "GenAI Engineer",
  "LLM Engineer",
  "RAG Engineer",
  "AI Agent Engineer",
  "Data Scientist",
  "ML Engineer",
  "MLOps / LLMOps",
  "AI Product Manager",
  "AI Governance",
  "Automatisation"
];

const trainingTopics = [
  "IA générative",
  "ChatGPT en entreprise",
  "Microsoft Copilot",
  "Prompt engineering",
  "Agents IA",
  "Automatisation",
  "IA pour managers",
  "Fonctions métier",
  "Gouvernance IA",
  "AI Act",
  "Adoption",
  "Sur mesure"
];

export default function Home() {
  const latestGuides = [
    ...publishedExecutionArticles.slice(-2).reverse().map((article) => ({ ...article, family: "execution" })),
    ...publishedTrainingArticles.slice(-2).reverse().map((article) => ({ ...article, family: "training" }))
  ];

  return (
    <main>

      <section className="homeHero" id="top">
        <div className="heroCopy">
          <p className="eyebrow">AUTONOMIA — AI EXECUTION PARTNER</p>
          <h1>
            De vos irritants quotidiens
            <span>à des usages IA réellement déployés.</span>
          </h1>
          <p className="heroText">
            Vous perdez du temps à rechercher, recopier, trier, relancer, consolider ou produire manuellement.
            Autonomia part de votre travail réel pour identifier où l’IA peut être utile, construire les bons outils
            et transmettre les compétences à vos équipes.
          </p>

          <div className="heroActions">
            <Link className="primaryButton" href="/#cas-usage-test">Voir ce que l’IA peut simplifier</Link>
            <Link className="secondaryButton" href="/#audit-ia">Demander l’audit IA offert</Link>
          </div>
        </div>

        <div className="executionGrid" aria-label="De l’irritant à l’autonomie">
          <div className="gridHeader">
            <span>VOTRE QUOTIDIEN → UNE CAPACITÉ DURABLE</span>
            <span>01—05</span>
          </div>
          <div className="gridFlow">
            <div><small>01</small><strong>IRRITANTS</strong><span>Ce qui vous ralentit vraiment</span></div>
            <div><small>02</small><strong>PRIORISER</strong><span>Les cas d’usage qui valent la peine</span></div>
            <div><small>03</small><strong>CONSTRUIRE</strong><span>Automatisations, assistants, agents</span></div>
            <div><small>04</small><strong>TRANSMETTRE</strong><span>Méthodes et compétences internes</span></div>
            <div><small>05</small><strong>AUTONOMIE</strong><span>Des usages intégrés au travail réel</span></div>
          </div>
          <div className="gridPulse" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        </div>
      </section>



      <section className="audienceRail" aria-label="Publics Autonomia">
        <span>CONÇU POUR</span>
        <strong>Direction</strong>
        <strong>DSI / CTO</strong>
        <strong>Data / IA</strong>
        <strong>RH / L&D</strong>
        <strong>Directions métier</strong>
      </section>

      <section className="marketProblem">
        <p className="sectionIndex">01 — LE PROBLÈME</p>
        <div>
          <h2>
            Qu’est-ce qui vous fait perdre du temps aujourd’hui ?
            <span>Nous commençons par là.</span>
          </h2>
          <ul className="painBulletList">
            <li>Des informations dispersées entre e-mails, fichiers, CRM, Drive ou outils métier.</li>
            <li>Des données recopiées plusieurs fois et des tâches administratives répétitives.</li>
            <li>Des reportings, synthèses, comptes rendus ou documents encore produits à la main.</li>
            <li>Des équipes qui utilisent l’IA chacune à leur manière, sans méthode commune.</li>
            <li>Des idées d’automatisation qui restent au stade de l’idée faute de temps ou d’expertise.</li>
          </ul>
          <p className="problemClosing">
            Nous ne commençons pas par un outil ni par un catalogue. Nous partons du travail réel,
            de ce qui vous ralentit et du résultat que vous voulez atteindre.
          </p>
        </div>
      </section>

      <HomeUseCaseLab />

      <section className="auditOffer" id="audit-ia">
        <div className="auditOfferIntro">
          <p className="sectionIndex">03 — AUDIT IA OFFERT</p>
          <div>
            <p className="auditKicker">AVANT DE CONSTRUIRE, COMPRENDRE.</p>
            <h2>Nous auditons votre organisation pour identifier où l’IA peut réellement vous aider.</h2>
            <p>
              L’audit part de vos équipes, de vos processus, de vos outils et de vos irritants.
              L’objectif : faire émerger les cas d’usage pertinents, comprendre ce qu’il faudrait construire
              et distinguer ce qui relève de l’automatisation, de l’expertise ou de la montée en compétences.
            </p>
          </div>
        </div>

        <div className="auditGrid">
          <article>
            <span>01</span>
            <h3>Observer le travail réel</h3>
            <p>Tâches répétitives, points de friction, recherches, doubles saisies, délais et dépendances.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Cartographier l’existant</h3>
            <p>Outils, données, documents, flux, accès, règles métier et validations humaines.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Prioriser les cas d’usage</h3>
            <p>Distinguer les idées séduisantes des usages réellement utiles, faisables et suffisamment maîtrisables.</p>
          </article>
          <article>
            <span>04</span>
            <h3>Définir quoi construire</h3>
            <p>Automatisation, assistant, agent, recherche documentaire, intégration ou parcours Academy.</p>
          </article>
        </div>

        <div className="auditBeforeAfter">
          <div>
            <small>POINT A</small>
            <strong>« Nous savons que l’IA peut nous aider, mais nous ne savons pas par où commencer. »</strong>
          </div>
          <span aria-hidden="true">→</span>
          <div>
            <small>POINT B</small>
            <strong>Des cas d’usage priorisés et une première vision claire de ce qu’il faut construire.</strong>
          </div>
        </div>

        <Link className="primaryButton auditCta" href="/#contact">Demander mon audit IA offert</Link>
      </section>

      <section className="scanSection" id="scan">
        <div className="scanSectionIntro">
          <p className="sectionIndex">04 — PREMIÈRE ORIENTATION</p>
          <div>
            <h2>Vous voulez commencer tout de suite ? Donnez-nous trois éléments.</h2>
            <p>
              Autonomia Scan prépare une première lecture du blocage, des compétences à mobiliser
              et des prochaines questions à traiter pendant l’audit.
            </p>
          </div>
        </div>
        <AutonomiaScan />
      </section>

      <section className="twoDoors">
        <Link href="/experts" className="door doorExperts">
          <div className="doorTop">
            <span>01</span>
            <p>AUTONOMIA EXPERTS</p>
          </div>
          <h2>Ajoutez la bonne compétence IA au bon moment.</h2>
          <p>
            Compréhension du besoin → identification des compétences → sélection des profils → staffing.
          </p>
          <div className="doorFooter">
            <span>Explorer Experts</span>
            <b>↗</b>
          </div>
        </Link>

        <Link href="/academy" className="door doorAcademy">
          <div className="doorTop">
            <span>02</span>
            <p>AUTONOMIA ACADEMY</p>
          </div>
          <h2>Faites monter toute votre organisation en puissance sur l’IA.</h2>
          <p>
            Formation entreprise → cas d’usage → pratiques réutilisables → adoption.
          </p>
          <div className="doorFooter">
            <span>Explorer Academy</span>
            <b>↗</b>
          </div>
        </Link>
      </section>

      <section className="territoryHomePromo">
        <div>
          <p className="sectionIndex">02 — TERRITOIRES</p>
          <span className="territoryHomeKicker">COMMUNAUTÉS DE COMMUNES · COMMUNAUTÉS D’AGGLOMÉRATION</span>
          <h2>Faire de l’IA un outil concret pour les agents et les entreprises du territoire.</h2>
          <p>
            Formation des agents, automatisation de processus internes et programmes d’accélération IA
            pour les TPE/PME locales : Autonomia transforme un enjeu territorial en programme exécutable.
          </p>
          <Link className="primaryButton" href="/territoires">Découvrir Autonomia Territoires</Link>
        </div>
        <div className="territoryHomeTracks">
          <span><b>01</b>Agents</span>
          <span><b>02</b>Academy collectivités</span>
          <span><b>03</b>Entreprises du territoire</span>
        </div>
      </section>

      <section className="homeMethod" id="methode">
        <div className="methodIntro">
          <p className="sectionIndex">02 — LA MÉTHODE</p>
          <h2>Partir du travail à accomplir. Puis assembler les compétences.</h2>
          <p>
            Autonomia ne commence ni par une CVthèque ni par un catalogue.
            Nous commençons par ce que l’entreprise doit réellement réussir.
          </p>
        </div>

        <ol className="homeMethodSteps">
          <li>
            <span>01</span>
            <div><strong>Comprendre</strong><p>Objectif, contexte, contraintes, maturité, organisation.</p></div>
          </li>
          <li>
            <span>02</span>
            <div><strong>Traduire</strong><p>Rôles, compétences, niveau de séniorité ou apprentissages requis.</p></div>
          </li>
          <li>
            <span>03</span>
            <div><strong>Activer</strong><p>Staffing expert, formation des équipes ou combinaison des deux.</p></div>
          </li>
          <li>
            <span>04</span>
            <div><strong>Mesurer</strong><p>Suivre le besoin jusqu’au résultat commercial et opérationnel disponible.</p></div>
          </li>
        </ol>
      </section>

      <section className="roleSection">
        <div className="sectionHeading">
          <p className="sectionIndex">03 — EXPERTS</p>
          <div>
            <h2>Une couverture pensée par compétences.</h2>
            <p>
              Les intitulés ne sont qu’un point de départ. Le rôle est défini par la mission,
              l’autonomie attendue et l’environnement du projet.
            </p>
          </div>
        </div>

        <div className="roleMarquee">
          {expertRoles.map((role, index) => (
            <Link href="/expert-ia" key={role} className="roleChip">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{role}</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="academySection">
        <div className="sectionHeading">
          <p className="sectionIndex">04 — ACADEMY</p>
          <div>
            <h2>Former pour que l’IA devienne une capacité de l’entreprise.</h2>
            <p>
              Les parcours sont conçus autour des publics, des usages, des outils
              et des règles propres à l’organisation.
            </p>
          </div>
        </div>

        <div className="topicGrid">
          {trainingTopics.map((topic, index) => (
            <Link href="/academy" key={topic}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{topic}</strong>
              <b>↗</b>
            </Link>
          ))}
        </div>
      </section>

      <section className="homeMarketSignals">
        <LiveJobSignals />
      </section>

      <section className="intelligenceSection">
        <div className="sectionHeading">
          <p className="sectionIndex">05 — INTELLIGENCE AUTONOMIA</p>
          <div>
            <h2>Des méthodes et des données originales — pas seulement des articles.</h2>
            <p>
              Autonomia publie ses propres cadres d’exécution, sa méthode de transfert de compétences
              et un observatoire de la demande IA pour rendre les décisions plus concrètes et plus vérifiables.
            </p>
          </div>
        </div>

        <div className="intelligenceGrid">
          <Link href="/observatoire-ia" className="intelligenceCard">
            <small>OBSERVATOIRE</small>
            <h3>Les rôles, outils et compétences IA observés dans les besoins des entreprises.</h3>
            <span>Explorer les signaux →</span>
          </Link>
          <Link href="/methodologie/execution-matrix" className="intelligenceCard">
            <small>MÉTHODE / EXECUTION</small>
            <h3>Processus → interprétation → action → contrôle.</h3>
            <span>Voir la matrice →</span>
          </Link>
          <Link href="/methodologie/learning-transfer" className="intelligenceCard">
            <small>MÉTHODE / ACADEMY</small>
            <h3>Tâche → méthode → garde-fous → transfert.</h3>
            <span>Voir la matrice →</span>
          </Link>
        </div>
      </section>

      <section className="librarySection">
        <div className="sectionHeading">
          <p className="sectionIndex">06 — BIBLIOTHÈQUE</p>
          <div>
            <h2>Des cas d’usage qui expliquent comment passer de l’idée à l’exécution.</h2>
            <p>
              La bibliothèque Autonomia documente des scénarios d’exécution et de montée en compétences :
              workflow, choix techniques, limites, contrôles et compétences nécessaires.
            </p>
          </div>
        </div>

        <div className="libraryDoors">
          <Link href="/cas-usage-ia" className="libraryDoor">
            <span>IA</span>
            <div>
              <p>AUTONOMIA / SCÉNARIOS IA</p>
              <h3>Ce que l’IA peut réellement faire dans votre entreprise.</h3>
            </div>
            <b>↗</b>
          </Link>
          <Link href="/formation-ia/cas-usage" className="libraryDoor signal">
            <span>ACA</span>
            <div>
              <p>AUTONOMIA ACADEMY / SCÉNARIOS</p>
              <h3>Ce que vos équipes peuvent apprendre à faire avec l’IA.</h3>
            </div>
            <b>↗</b>
          </Link>
        </div>
      </section>

      <section className="latestGuidesSection">
        <div className="sectionHeading">
          <p className="sectionIndex">07 — GUIDES PUBLIÉS</p>
          <div>
            <h2>Des guides longs, sourcés et reliés aux besoins réels.</h2>
            <p>
              Le backlog contient 400 intentions, mais seuls les guides qui passent les contrôles éditoriaux
              deviennent des pages longues indexables.
            </p>
          </div>
        </div>

        <div className="latestGuidesGrid">
          {latestGuides.map((article) => (
            <Link
              key={article.slug}
              href={article.family === "training"
                ? `/formation-ia/cas-usage/${article.slug}`
                : `/cas-usage-ia/${article.slug}`}
              className="latestGuideCard"
            >
              <small>{article.family === "training" ? "ACADEMY" : "EXECUTION"} · {article.cluster}</small>
              <h3>{article.title}</h3>
              <p>{article.summary}</p>
              <span>Lire le guide →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="whySection">
        <p className="sectionIndex">08 — POURQUOI AUTONOMIA</p>
        <div className="whyGrid">
          <article>
            <span>01</span>
            <h3>Le besoin avant le profil.</h3>
            <p>On ne pousse pas un CV vers un problème. On traduit le problème en compétences.</p>
          </article>
          <article>
            <span>02</span>
            <h3>L’exécution externe et interne.</h3>
            <p>Experts pour avancer maintenant. Academy pour rendre l’organisation plus autonome.</p>
          </article>
          <article>
            <span>03</span>
            <h3>La preuve avant la promesse.</h3>
            <p>Aucune référence, certification, statistique ou performance n’est affichée sans vérification.</p>
          </article>
          <article>
            <span>04</span>
            <h3>Une prochaine action claire.</h3>
            <p>Le Scan transforme un objectif flou en première orientation exploitable avant le cadrage détaillé.</p>
          </article>
        </div>
      </section>

      <section className="proofSection">
        <div>
          <p className="sectionIndex">09 — STANDARD D’EXÉCUTION</p>
          <h2>Une méthode conçue pour rester vérifiable.</h2>
        </div>
        <div className="proofGrid">
          <div><span>BESOIN</span><p>Le point de départ est reformulé avant de choisir une solution ou un profil.</p></div>
          <div><span>COMPÉTENCES</span><p>Les rôles sont décrits par les compétences et le niveau d’autonomie réellement nécessaires.</p></div>
          <div><span>CONTEXTE</span><p>Le diagnostic et l’attribution du lead restent attachés au besoin transmis.</p></div>
          <div><span>PREUVES</span><p>Références, certifications et résultats ne sont publiés que lorsqu’ils sont vérifiés.</p></div>
        </div>
      </section>

      <QualiopiProof />

      <section className="faqSection homeFaq" id="faq">
        <p className="sectionIndex">10 — QUESTIONS</p>
        <div>
          <h2>Ce qu’Autonomia est — et n’est pas.</h2>
          <div className="faqList">
            <details>
              <summary>Autonomia est-il un cabinet de recrutement IA ?</summary>
              <p>Le positionnement est plus large : compréhension du besoin, identification des compétences, sélection et staffing pour des missions IA.</p>
            </details>
            <details>
              <summary>À quoi sert Autonomia Academy ?</summary>
              <p>Academy structure la montée en compétences IA autour des publics, des usages métier et du niveau de maturité de l’organisation.</p>
            </details>
            <details>
              <summary>Peut-on combiner expert externe et formation interne ?</summary>
              <p>Oui. C’est même l’un des intérêts du modèle : accélérer un projet avec une expertise ciblée tout en transférant des compétences aux équipes.</p>
            </details>
            <details>
              <summary>Et si nous ne savons pas encore de quel profil nous avons besoin ?</summary>
              <p>Le besoin peut partir d’un objectif ou d’un problème. Le rôle d’Autonomia est précisément de le traduire en compétences.</p>
            </details>
          </div>
        </div>
      </section>

      <section className="contactSection" id="contact">
        <div className="contactCopy">
          <p className="eyebrow">PASSER À L’EXÉCUTION</p>
          <h2>Quel est le prochain blocage IA que votre entreprise doit lever ?</h2>
          <p>
            Trois étapes courtes. Pas de cahier des charges de quatorze questions.
          </p>
        </div>
        <HomeLeadSwitch />
      </section>

      <footer className="siteFooter">
        <div className="brand footerBrand">
          <span className="brandMark">A</span>
          <span>AUTONOMIA</span>
        </div>
        <p>La force d’exécution IA.</p>
        <nav aria-label="Liens de pied de page">
          <Link href="/experts">Experts</Link>
          <Link href="/academy">Academy</Link>
          <Link href="/territoires">Territoires</Link>
          <Link href="/cas-usage-ia">Cas d’usage</Link>
          <Link href="/formation-ia/cas-usage">Formations</Link>
          <Link href="/observatoire-ia">Observatoire</Link>
          <Link href="/a-propos">À propos</Link>
          <Link href="/methodologie/politique-editoriale">Politique éditoriale</Link>
        </nav>
      </footer>
    </main>
  );
}
