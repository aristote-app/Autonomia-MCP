import Link from "next/link";
import HomeLeadSwitch from "@/components/HomeLeadSwitch";

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
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Autonomia",
    description:
      "Partenaire d’exécution IA pour les entreprises : experts IA et formation professionnelle IA.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://autonomia.fr"
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <section className="homeHero" id="top">
        <div className="heroCopy">
          <p className="eyebrow">AI EXECUTION PARTNER</p>
          <h1>
            L’IA ne manque pas
            <br />
            de promesses.
            <span>Elle manque d’exécution.</span>
          </h1>
          <p className="heroText">
            Autonomia apporte aux entreprises les experts pour construire
            et les compétences pour déployer.
          </p>

          <div className="heroActions">
            <Link className="primaryButton" href="/expert-ia">Trouver un expert IA</Link>
            <Link className="secondaryButton" href="/formation-ia-entreprise">Former mes équipes</Link>
          </div>
        </div>

        <div className="executionGrid" aria-label="Système d’exécution Autonomia">
          <div className="gridHeader">
            <span>AUTONOMIA / EXECUTION GRID</span>
            <span>01—05</span>
          </div>
          <div className="gridFlow">
            <div><small>01</small><strong>AMBITION</strong><span>Besoin business</span></div>
            <div><small>02</small><strong>EXPERTS</strong><span>Compétences externes</span></div>
            <div><small>03</small><strong>BUILD</strong><span>Construction / delivery</span></div>
            <div><small>04</small><strong>ACADEMY</strong><span>Compétences internes</span></div>
            <div><small>05</small><strong>ADOPTION</strong><span>Capacité durable</span></div>
          </div>
          <div className="gridPulse" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        </div>
      </section>

      <section className="marketProblem">
        <p className="sectionIndex">01 — LE CONSTAT</p>
        <div>
          <h2>
            Votre entreprise n’a pas besoin d’une nouvelle présentation sur l’IA.
            <span>Elle a besoin des bonnes compétences au bon moment.</span>
          </h2>
          <p>
            Entre l’idée et le déploiement, les projets se bloquent sur des rôles absents,
            des expertises trop rares, des équipes insuffisamment formées ou une adoption
            qui reste superficielle. Autonomia agit précisément à cet endroit.
          </p>
        </div>
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
              Les parcours sont conçus autour des publics, des usages et des règles de l’organisation,
              avec les mentions Qualiopi publiées uniquement après vérification de l’entité certifiée.
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

      <section className="librarySection">
        <div className="sectionHeading">
          <p className="sectionIndex">05 — BIBLIOTHÈQUE</p>
          <div>
            <h2>400 façons concrètes de passer de “l’IA pourrait…” à “voilà comment”.</h2>
            <p>
              200 scénarios montrent ce que l’entreprise peut automatiser ou augmenter avec l’IA.
              200 scénarios montrent ce que les équipes peuvent apprendre à faire elles-mêmes.
              Chaque page publiée doit expliquer le workflow, les choix techniques, les limites,
              les contrôles et les compétences nécessaires.
            </p>
          </div>
        </div>

        <div className="libraryDoors">
          <Link href="/cas-usage-ia" className="libraryDoor">
            <span>200</span>
            <div>
              <p>AUTONOMIA / SCÉNARIOS IA</p>
              <h3>Ce que l’IA peut réellement faire dans votre entreprise.</h3>
            </div>
            <b>↗</b>
          </Link>
          <Link href="/formation-ia/cas-usage" className="libraryDoor signal">
            <span>200</span>
            <div>
              <p>AUTONOMIA ACADEMY / SCÉNARIOS</p>
              <h3>Ce que vos équipes peuvent apprendre à faire avec l’IA.</h3>
            </div>
            <b>↗</b>
          </Link>
        </div>
      </section>

      <section className="whySection">
        <p className="sectionIndex">06 — POURQUOI AUTONOMIA</p>
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
            <h3>Un même cerveau commercial.</h3>
            <p>Les leads, l’attribution et le parcours commercial sont conçus pour remonter dans Autonomia-MCP.</p>
          </article>
        </div>
      </section>

      <section className="proofSection">
        <div>
          <p className="sectionIndex">07 — PREUVES</p>
          <h2>Une architecture prête pour les preuves réelles.</h2>
        </div>
        <div className="proofPlaceholders">
          <div><span>QUALIOPI</span><p>Entité et périmètre à reprendre exactement avant publication.</p></div>
          <div><span>EXPERTS</span><p>Volume et expertises à afficher uniquement sur données vérifiées.</p></div>
          <div><span>RÉFÉRENCES</span><p>Logos et cas clients seulement avec autorisation.</p></div>
          <div><span>RÉSULTATS</span><p>Chiffres et impacts uniquement quand ils sont sourcés.</p></div>
        </div>
      </section>

      <section className="faqSection homeFaq" id="faq">
        <p className="sectionIndex">08 — QUESTIONS</p>
        <div>
          <h2>Ce qu’Autonomia est — et n’est pas.</h2>
          <div className="faqList">
            <details>
              <summary>Autonomia est-il un cabinet de recrutement IA ?</summary>
              <p>Le positionnement est plus large : compréhension du besoin, identification des compétences, sélection et staffing pour des missions IA.</p>
            </details>
            <details>
              <summary>Autonomia est-il un organisme de formation ?</summary>
              <p>Academy porte l’offre de montée en compétences. Les informations Qualiopi seront publiées uniquement avec les mentions exactes de l’entité certifiée.</p>
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
        <div>
          <span>Experts</span>
          <span>Academy</span>
          <span>Mentions légales — avant publication</span>
          <span>Confidentialité — avant publication</span>
        </div>
      </footer>
    </main>
  );
}
