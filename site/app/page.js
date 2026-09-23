import Link from "next/link";
import NeedBriefQuestionnaire from "@/components/NeedBriefQuestionnaire";
import SolutionFinder from "@/components/SolutionFinder";
import AutonomiaMark from "@/components/AutonomiaMark";
import { academyTrainings } from "@/content/academy-trainings";
import { problemSolutions } from "@/content/problem-solutions";
import ProblemLink from "@/components/ProblemLink";

const homeProblemSlugs = [
  "automatiser-comptes-rendus-reunion",
  "assistant-documentaire-ia-rag",
  "qualification-automatique-leads",
  "trier-router-emails-ia",
  "automatiser-reporting",
  "reponse-appel-offres-ia"
];

const homeProblems = homeProblemSlugs
  .map((slug) => problemSolutions.find((item) => item.slug === slug))
  .filter(Boolean);

const expertRoles = [
  { label: "AI Project Manager", slug: "ai-project-manager" },
  { label: "GenAI Engineer", slug: "genai-engineer" },
  { label: "LLM Engineer", slug: "llm-engineer" },
  { label: "RAG Engineer", slug: "rag-engineer" },
  { label: "AI Agent Engineer", slug: "ai-agent-engineer" },
  { label: "Data Scientist", slug: "data-scientist" },
  { label: "ML Engineer", slug: "ml-engineer" },
  { label: "MLOps / LLMOps", slug: "mlops-llmops-engineer" },
  { label: "AI Product Manager", slug: "ai-product-manager" },
  { label: "AI Governance", slug: "ai-governance" },
  { label: "Automatisation IA", slug: "automation-engineer" }
];

export default function Home() {
  return (
    <main>
      <section className="homeHero homeHeroClean homeHeroDiagnostic" id="top">
        <div className="heroCopy">
          <p className="eyebrow">AUTONOMIA — AI EXECUTION PARTNER</p>
          <h1>
            Construire l’IA utile.
            <span>Transmettre les compétences.</span>
          </h1>
          <p className="heroText">
            Décrivez votre besoin en langage naturel. Autonomia vous oriente vers les métiers IA pertinents,
            les consultants disponibles et les formations Academy adaptées.
          </p>

          <div className="heroActions">
            <Link className="primaryButton" href="/experts">Voir les experts IA</Link>
            <Link className="secondaryButton" href="/academy">Voir les formations IA</Link>
          </div>
        </div>

        <aside className="heroDiagnostic" aria-label="Diagnostic IA Autonomia">
          <SolutionFinder />
        </aside>
      </section>

      <section className="twoDoors homeCoreOffers">
        <Link href="/experts" className="door doorExperts">
          <div className="doorTop">
            <span>01</span>
            <p>AUTONOMIA EXPERTS</p>
          </div>
          <h2>Construire et déployer.</h2>
          <p>
            Besoin de compétences pour cadrer, construire, intégrer ou industrialiser un projet IA ?
            Nous traduisons le besoin en rôles, puis en profils mobilisables.
          </p>
          <div className="doorFooter">
            <span>Explorer les experts IA</span>
            <b>↗</b>
          </div>
        </Link>

        <Link href="/academy" className="door doorAcademy">
          <div className="doorTop">
            <span>02</span>
            <p>AUTONOMIA ACADEMY</p>
          </div>
          <h2>Former et rendre autonome.</h2>
          <p>
            Besoin d’accélérer l’adoption de l’IA ? Nous construisons des parcours par usage, métier,
            outil et niveau, de l’initiation à l’expertise.
          </p>
          <div className="doorFooter">
            <span>Explorer les formations IA</span>
            <b>↗</b>
          </div>
        </Link>
      </section>

      <section className="homeProblemStrip">
        <div className="sectionHeading">
          <p className="sectionIndex">03 — PROBLÈMES PRÉCIS</p>
          <div>
            <h2>Vous savez déjà ce que vous voulez arrêter de faire à la main ?</h2>
            <p>
              Partez directement de la tâche : compte rendu, documents, leads, e-mails, reporting ou appels d’offres.
              Chaque page contient une démo manipulable et un cadrage orienté prototype.
            </p>
          </div>
        </div>

        <div className="homeProblemGrid">
          {homeProblems.map((item, index) => (
            <ProblemLink
              href={"/solutions-ia/" + item.slug}
              problemSlug={item.slug}
              problemCluster={item.cluster}
              surface="home_problem_strip"
              key={item.slug}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <small>{item.cluster}</small>
              <strong>{item.title}</strong>
              <b>Tester ↗</b>
            </ProblemLink>
          ))}
        </div>

        <ProblemLink className="secondaryButton" href="/solutions-ia" surface="home_problem_strip_all">
          Voir toutes les solutions par problème
        </ProblemLink>
      </section>

      <section className="homeDiagnosticIntro" id="diagnostic-ia">
        <p className="sectionIndex">04 — FICHE BESOIN</p>
        <div>
          <p className="auditKicker">VOUS VOULEZ NOUS TRANSMETTRE PLUS DE CONTEXTE ?</p>
          <h2>Structurez votre besoin avant l’échange.</h2>
          <p>
            En trois volets, vous nous indiquez où se situe le besoin, ce qui vous ralentit et le résultat recherché.
            Vous obtenez une fiche besoin structurée avant de nous l’envoyer.
          </p>
        </div>
      </section>

      <NeedBriefQuestionnaire />

      <section className="roleSection homeRoleDirectory">
        <div className="sectionHeading">
          <p className="sectionIndex">05 — MÉTIERS IA</p>
          <div>
            <h2>Vous savez déjà quel profil vous cherchez ?</h2>
            <p>
              Chaque métier dispose d’une fiche détaillée : responsabilités, livrables, questions de cadrage,
              compétences, métiers voisins et profils consultants disponibles.
            </p>
          </div>
        </div>

        <div className="roleMarquee">
          {expertRoles.map((role, index) => (
            <Link href={"/metiers-ia/" + role.slug} key={role.slug} className="roleChip">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{role.label}</strong>
              <b aria-hidden="true">↗</b>
            </Link>
          ))}
        </div>
      </section>

      <section className="academySection homeAcademyDirectory">
        <div className="sectionHeading">
          <p className="sectionIndex">06 — FORMATIONS IA</p>
          <div>
            <h2>Vous savez déjà ce que vos équipes doivent apprendre ?</h2>
            <p>
              Parcourez les programmes Autonomia Academy. Chaque formation présente objectifs, public,
              prérequis, programme détaillé, niveaux, tarifs et fiche PDF.
            </p>
          </div>
        </div>

        <div className="topicGrid">
          {academyTrainings.map((training, index) => (
            <Link href={"/formation-ia/" + training.slug} key={training.slug}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{training.homeTitle}</strong>
              <b>↗</b>
            </Link>
          ))}
        </div>
      </section>

      <section className="homeMethod homeMethodCompact" id="methode">
        <div className="methodIntro">
          <p className="sectionIndex">07 — COMMENT NOUS TRAVAILLONS</p>
          <h2>Besoin → exécution → transfert.</h2>
          <p>
            Nous ne partons ni d’un catalogue, ni d’un outil, ni d’un CV.
            Nous partons du résultat que l’organisation doit obtenir.
          </p>
        </div>

        <ol className="homeMethodSteps">
          <li>
            <span>01</span>
            <div><strong>Cadrer</strong><p>Comprendre le processus, les contraintes et le résultat attendu.</p></div>
          </li>
          <li>
            <span>02</span>
            <div><strong>Activer</strong><p>Mobiliser les bons experts, construire ou automatiser.</p></div>
          </li>
          <li>
            <span>03</span>
            <div><strong>Transférer</strong><p>Former, documenter et rendre l’usage durable dans l’organisation.</p></div>
          </li>
        </ol>
      </section>

      <section className="territoryHomePromo homeTerritoryCompact">
        <div>
          <p className="sectionIndex">08 — TERRITOIRES</p>
          <span className="territoryHomeKicker">COMMUNAUTÉS DE COMMUNES · AGGLOMÉRATIONS</span>
          <h2>Des programmes IA adaptés aux collectivités et aux entreprises du territoire.</h2>
          <Link className="secondaryButton" href="/territoires">Découvrir Autonomia Territoires</Link>
        </div>
        <div className="territoryHomeTracks">
          <span><b>01</b>Agents</span>
          <span><b>02</b>Processus internes</span>
          <span><b>03</b>TPE / PME locales</span>
        </div>
      </section>

      <footer className="siteFooter">
        <div className="brand footerBrand">
          <span className="brandMark" aria-hidden="true"><AutonomiaMark size={38} inverse /></span>
          <span>AUTONOMIA</span>
        </div>
        <p>La force d’exécution IA.</p>
        <nav aria-label="Liens de pied de page">
          <Link href="/experts">Experts</Link>
          <Link href="/academy">Academy</Link>
          <Link href="/territoires">Territoires</Link>
          <Link href="/cas-usage-ia">Cas d’usage</Link>
          <Link href="/observatoire-ia">Observatoire</Link>
          <Link href="/a-propos">À propos</Link>
          <Link href="/methodologie/politique-editoriale">Politique éditoriale</Link>
        </nav>
      </footer>
    </main>
  );
}
