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
      <section className="homeHeroV10 homeHeroMinimalV13" id="top">
        <div className="homeHeroMinimalInnerV13">
          <p className="eyebrow">PARTENAIRE OPÉRATIONNEL DE L’ADOPTION IA</p>

          <h1>
            Accélérer l’adoption de l’IA.
            <span>Transformer les usages en performance.</span>
          </h1>

          <p className="homeHeroMinimalLeadV13">
            Autonomia accompagne les organisations de bout en bout : trouver les bonnes compétences,
            construire les solutions IA utiles et former les équipes pour les intégrer réellement dans leur travail.
          </p>

          <div className="homeHeroMinimalStartV13">
            <HomeStartEmail origin="home_hero" compact />
          </div>

          <nav className="homeHeroMinimalPillarsV13" aria-label="Les trois piliers Autonomia">
            <Link href="/experts"><span>01</span><b>TROUVER</b><small>Experts IA</small></Link>
            <i>→</i>
            <Link href="/solutions-ia"><span>02</span><b>CONSTRUIRE</b><small>Solutions IA</small></Link>
            <i>→</i>
            <Link href="/academy"><span>03</span><b>FORMER</b><small>Adoption & compétences</small></Link>
          </nav>
        </div>
      </section>

      <section className="homeExecutionChainV12" id="experts-academy">
        <div className="homeExecutionChainIntroV12">
          <p className="sectionIndex">01 — TROUVER · 02 — CONSTRUIRE · 03 — FORMER</p>
          <div>
            <h2>Une chaîne d’exécution complète.</h2>
            <p><strong>Les bons experts.</strong> Les bonnes solutions IA. Des équipes capables de les utiliser.</p>
          </div>
        </div>

        <div className="homeExecutionRailV12">
          <article className="executionPillarV12 experts">
            <div className="executionPillarHeadV12">
              <span>01</span>
              <div><small>TROUVER</small><b>AUTONOMIA EXPERTS</b></div>
            </div>
            <h3>Les bonnes compétences IA, au bon moment, pour le bon besoin.</h3>
            <p>Nous trouvons et mobilisons les profils capables de cadrer, construire, intégrer et piloter vos projets IA.</p>
            <div className="executionStickerCloudV12" aria-hidden="true">
              <span>AI Engineers</span><span>Data Scientists</span><span>RAG</span><span>Agents IA</span><span>AI Product</span><span>GEO / AEO</span>
            </div>
            <Link href="/experts" className="executionPillarCtaV12">Trouver un expert IA →</Link>
          </article>

          <div className="executionConnectorV12" aria-hidden="true"><span>→</span></div>

          <article className="executionPillarV12 build">
            <div className="executionPillarHeadV12">
              <span>02</span>
              <div><small>CONSTRUIRE</small><b>AUTONOMIA BUILD</b></div>
            </div>
            <h3>Du problème métier à la solution IA réellement utilisable.</h3>
            <p>Nous concevons et construisons les agents, automatisations, workflows, assistants et outils IA qui transforment vos processus.</p>
            <div className="executionBuildFlowV12" aria-hidden="true">
              <span>Problème</span><i>→</i><span>Workflow</span><i>→</i><span>IA</span><i>→</i><span>Usage</span>
            </div>
            <div className="executionStickerCloudV12">
              <span>Agents IA</span><span>RAG</span><span>Automatisation</span><span>Reporting</span><span>Mini-apps</span><span>Outils internes</span>
            </div>
            <div className="executionBuildLinksV12">
              <Link href="/solutions-ia" className="executionPillarCtaV12">Construire une solution IA →</Link>
              <Link href="/cas-usage-ia">Voir les cas d’usage</Link>
              <Link href="/observatoire-ia">Voir les démonstrateurs</Link>
            </div>
          </article>

          <div className="executionConnectorV12" aria-hidden="true"><span>→</span></div>

          <article className="executionPillarV12 academy">
            <div className="executionPillarHeadV12">
              <span>03</span>
              <div><small>FORMER</small><b>AUTONOMIA ACADEMY</b></div>
            </div>
            <h3>Former les équipes pour que l’IA devienne réellement utilisable au quotidien.</h3>
            <p>Des parcours reliés aux métiers, aux outils, aux agents IA, aux automatisations et aux workflows réels de l’organisation.</p>
            <div className="executionStickerCloudV12" aria-hidden="true">
              <span>Cas d’usage métier</span><span>Agents IA</span><span>Automatisation</span><span>Adoption</span><span>Intra</span><span>Inter</span>
            </div>
            <Link href="/academy" className="executionPillarCtaV12">Voir les Formations IA →</Link>
          </article>
        </div>

        <div className="homeExecutionPathV12" aria-label="Chaîne Autonomia">
          <span><b>BESOIN MÉTIER</b><small>Un problème réel à résoudre</small></span>
          <i>→</i>
          <span><b>EXPERTS</b><small>Les bonnes compétences</small></span>
          <i>→</i>
          <span><b>BUILD</b><small>La solution construite</small></span>
          <i>→</i>
          <span><b>ACADEMY</b><small>L’adoption et l’autonomie</small></span>
        </div>
      </section>

      <section className="homeProblemStrip homeProblemStripV10" id="problems">
        <div className="sectionHeading">
          <p className="sectionIndex">03 — PROBLÈMES PRÉCIS</p>
          <div>
            <h2>Vous savez déjà ce que vous voulez arrêter de faire à la main ?</h2>
            <p>
              AUTONOMIA BUILD part directement de la tâche. Chaque page montre le flux, les points de contrôle
              et les briques nécessaires pour passer du problème à une solution réellement actionnable.
            </p>
          </div>
        </div>

        <div className="homeProblemSpotlight">
          <div>
            <small>CAS D’USAGE PHARE</small>
            <h3>Automatiser les comptes rendus sans perdre les décisions.</h3>
            <p>Notes ou transcript → résumé → décisions → actions → responsables → échéances → relances.</p>
            <ProblemLink href="/solutions-ia/automatiser-comptes-rendus-reunion" problemSlug="automatiser-comptes-rendus-reunion" problemCluster="Réunions & gestion de projet" surface="home_problem_spotlight">
              Construire ce cas d’usage →
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
          <h2>Vous avez le problème, mais pas encore le bon expert, la bonne solution ou la bonne formation ?</h2>
          <p>Décrivez le besoin en langage naturel. Autonomia rapproche la demande des trois leviers : EXPERTS, BUILD et ACADEMY.</p>
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
          <h2>Besoin → Trouver → Construire → Former.</h2>
          <p>
            Nous partons du résultat que l’organisation doit obtenir, puis nous activons les compétences,
            la construction et la montée en autonomie nécessaires pour y arriver.
          </p>
        </div>

        <ol className="homeMethodSteps homeMethodStepsV12">
          <li><span>01</span><div><strong>Cadrer</strong><p>Comprendre le problème métier, les contraintes et le résultat attendu.</p></div></li>
          <li><span>02</span><div><strong>Trouver</strong><p>Mobiliser les bons experts IA selon le besoin.</p></div></li>
          <li><span>03</span><div><strong>Construire</strong><p>Concevoir l’agent, l’automatisation, le workflow ou l’outil utile.</p></div></li>
          <li><span>04</span><div><strong>Former</strong><p>Transférer les méthodes et rendre l’usage durable dans l’organisation.</p></div></li>
        </ol>
      </section>

      <section className="territoryHomePromo homeTerritoryCompact homeTerritoryV10">
        <div>
          <p className="sectionIndex">09 — TERRITOIRES</p>
          <span className="territoryHomeKicker">COMMUNAUTÉS DE COMMUNES · AGGLOMÉRATIONS</span>
          <h2>Experts, Build et Formations IA adaptés aux collectivités et aux entreprises du territoire.</h2>
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
          <Link href="/solutions-ia">Build</Link>
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
