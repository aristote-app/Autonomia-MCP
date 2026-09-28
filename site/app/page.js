import Link from "next/link";
import NeedBriefQuestionnaire from "@/components/NeedBriefQuestionnaire";
import SolutionFinder from "@/components/SolutionFinder";
import HomeStartEmail from "@/components/HomeStartEmail";
import AutonomiaMark from "@/components/AutonomiaMark";
import { academyTrainings } from "@/content/academy-trainings";
import { problemSolutions } from "@/content/problem-solutions";
import ProblemLink from "@/components/ProblemLink";

const homeProblemSlugs = [
  "automatiser-comptes-rendus-reunion",
  "assistant-documentaire-ia-rag",
  "automatiser-reporting",
  "qualification-automatique-leads",
  "trier-router-emails-ia",
  "controle-factures-ia",
  "reponse-appel-offres-ia",
  "assistant-service-client-ia",
  "assistant-rh-interne-ia"
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
    <main className="homeV10">
      <section className="homeHeroV10" id="top">
        <div className="homeHeroV10Copy">
          <p className="eyebrow">AUTONOMIA — AI EXECUTION PARTNER</p>
          <h1>
            Construire l’IA utile.
            <span>Transmettre les compétences.</span>
          </h1>
          <p className="homeHeroV10Lead">
            Autonomia aide les organisations à partir d’un problème réel de travail, à mobiliser les bons experts IA,
            puis à transmettre les méthodes et les usages avec des Formations IA reliées aux tâches concrètes.
          </p>

          <HomeStartEmail origin="home_hero" />

          <div className="homeHeroV10Links">
            <Link href="/experts">Explorer AUTONOMIA EXPERTS</Link>
            <Link href="/academy">Explorer les Formations IA</Link>
            <Link href="/solutions-ia">Voir les problèmes précis</Link>
          </div>

          <div className="homeHeroV10Meta" aria-label="Publics Autonomia">
            <span>PME / ETI / grands comptes</span>
            <span>Collectivités &amp; territoires</span>
            <span>Experts IA + Academy</span>
          </div>
        </div>

        <aside className="homeHeroSceneV10" aria-label="Exemple de parcours Autonomia">
          <div className="homeSceneTop">
            <div>
              <small>START — EXEMPLE DE PARCOURS</small>
              <strong>Décrivez un vrai problème. Nous structurons la bonne réponse.</strong>
            </div>
            <span>PRESQUE PRÊT À INTÉGRER</span>
          </div>

          <div className="homeScenePrompt">
            <small>EXEMPLE DE BESOIN ENTRANT</small>
            <p>“Nous voulons automatiser les comptes rendus, construire un assistant documentaire et former les managers à l’utiliser.”</p>
          </div>

          <div className="homeSceneRoutes">
            <article>
              <small>AUTONOMIA EXPERTS</small>
              <strong>Construire.</strong>
              <p>AI Project Manager · RAG Engineer · AI Agent Engineer · Automation.</p>
            </article>
            <article>
              <small>AUTONOMIA ACADEMY</small>
              <strong>Transmettre.</strong>
              <p>Formation ChatGPT · Copilot · Managers · Agents IA.</p>
            </article>
          </div>

          <div className="homeSceneSteps">
            <span><b>01</b>Clarifier</span>
            <span><b>02</b>Exécuter</span>
            <span><b>03</b>Transférer</span>
          </div>
        </aside>

        <div className="homeHeroMatrix">
          <article><small>EXPERTS IA</small><strong>Construire et déployer</strong><p>Mobiliser les bons profils selon le besoin réel.</p></article>
          <article><small>FORMATIONS IA</small><strong>Former et rendre autonome</strong><p>Former sur les vrais outils, tâches et niveaux.</p></article>
          <article><small>CAS D’USAGE</small><strong>Partir d’un problème précis</strong><p>RAG, reporting, leads, support, dossiers, réunions.</p></article>
          <article><small>START</small><strong>Qualifier avant l’échange</strong><p>E-mail direct puis parcours progressif.</p></article>
        </div>
      </section>

      <section className="twoDoors homeCoreOffers homeCoreOffersV10" id="experts-academy">
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
          <div className="doorStickerCloud" aria-hidden="true">
            <span>GenAI</span><span>RAG</span><span>Agents IA</span><span>LLM</span><span>MLOps</span><span>Data</span><span>Automation</span>
          </div>
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
          <div className="doorStickerCloud" aria-hidden="true">
            <span>Managers</span><span>ChatGPT</span><span>Copilot</span><span>AI Act</span><span>Agents IA</span><span>Prompt</span><span>No-code</span>
          </div>
          <div className="doorFooter">
            <span>Explorer les Formations IA</span>
            <b>↗</b>
          </div>
        </Link>
      </section>

      <section className="homeProblemStrip homeProblemStripV10" id="problems">
        <div className="sectionHeading">
          <p className="sectionIndex">03 — PROBLÈMES PRÉCIS</p>
          <div>
            <h2>Vous savez déjà ce que vous voulez arrêter de faire à la main ?</h2>
            <p>
              Partez directement de la tâche. Chaque page montre le flux, les points de contrôle et les briques
              nécessaires pour passer du problème à une réponse réellement actionnable.
            </p>
          </div>
        </div>

        <div className="homeProblemSpotlight">
          <div>
            <small>CAS D’USAGE PHARE</small>
            <h3>Automatiser les comptes rendus sans perdre les décisions.</h3>
            <p>Notes ou transcript → résumé → décisions → actions → responsables → échéances → relances.</p>
            <ProblemLink href="/solutions-ia/automatiser-comptes-rendus-reunion" problemSlug="automatiser-comptes-rendus-reunion" problemCluster="Réunions & gestion de projet" surface="home_problem_spotlight">
              Tester le scénario →
            </ProblemLink>
          </div>
          <div className="homeProblemFlow" aria-hidden="true">
            <span><small>ENTRÉE</small><b>Notes / transcript</b></span>
            <i>→</i>
            <span><small>IA + RÈGLES</small><b>Structure & contrôle</b></span>
            <i>→</i>
            <span><small>SORTIE</small><b>Actions exploitables</b></span>
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

      <section className="homeSolutionMatch" id="solution-finder">
        <div className="homeSolutionMatchIntro">
          <p className="sectionIndex">04 — AI MATCH</p>
          <h2>Vous avez le problème, mais pas encore le bon rôle ou la bonne formation ?</h2>
          <p>Décrivez le besoin en langage naturel. Autonomia rapproche la demande des métiers IA et des Formations IA disponibles dans le catalogue.</p>
        </div>
        <SolutionFinder />
      </section>

      <section className="homeDiagnosticIntro" id="diagnostic-ia">
        <p className="sectionIndex">05 — FICHE BESOIN</p>
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
          <p className="sectionIndex">06 — MÉTIERS IA</p>
          <div>
            <h2>Vous savez déjà quel profil vous cherchez ?</h2>
            <p>
              Toutes les portes d’entrée métiers restent accessibles : responsabilités, livrables, compétences,
              métiers voisins et profils consultants disponibles.
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
          <p className="sectionIndex">07 — FORMATIONS IA</p>
          <div>
            <h2>Vous savez déjà ce que vos équipes doivent apprendre ?</h2>
            <p>
              Toutes les Formations IA restent reliées depuis la Home pour conserver le maillage interne,
              tout en donnant une vraie identité visuelle à AUTONOMIA ACADEMY.
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

      <section className="homeMethod homeMethodCompact homeMethodV10" id="methode">
        <div className="methodIntro">
          <p className="sectionIndex">08 — COMMENT NOUS TRAVAILLONS</p>
          <h2>Besoin → exécution → transfert.</h2>
          <p>
            Nous ne partons ni d’un catalogue, ni d’un outil, ni d’un CV.
            Nous partons du résultat que l’organisation doit obtenir.
          </p>
        </div>

        <ol className="homeMethodSteps">
          <li><span>01</span><div><strong>Cadrer</strong><p>Comprendre le processus, les contraintes et le résultat attendu.</p></div></li>
          <li><span>02</span><div><strong>Activer</strong><p>Mobiliser les bons experts, construire ou automatiser.</p></div></li>
          <li><span>03</span><div><strong>Transférer</strong><p>Former, documenter et rendre l’usage durable dans l’organisation.</p></div></li>
        </ol>
      </section>

      <section className="territoryHomePromo homeTerritoryCompact homeTerritoryV10">
        <div>
          <p className="sectionIndex">09 — TERRITOIRES</p>
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

      <section className="homeFinalStart">
        <div>
          <p className="eyebrow">PRÊT À PARTIR D’UN VRAI PROBLÈME ?</p>
          <h2>Un e-mail. Puis on structure le reste.</h2>
        </div>
        <HomeStartEmail origin="home_bottom" compact />
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
