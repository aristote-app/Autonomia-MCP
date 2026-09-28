import Link from "next/link";
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
  "controle-factures-ia"
];

const homeProblems = homeProblemSlugs
  .map((slug) => problemSolutions.find((item) => item.slug === slug))
  .filter(Boolean);

const expertLinks = [
  { label: "AUTONOMIA EXPERTS", href: "/experts" },
  { label: "Consultant IA", href: "/consultant-ia" },
  { label: "Freelance IA", href: "/freelance-ia" },
  { label: "Expert IA", href: "/expert-ia" },
  { label: "Consultant GenAI", href: "/consultant-genai" },
  { label: "Consultant RAG", href: "/consultant-rag" },
  { label: "Consultant Agent IA", href: "/consultant-agent-ia" },
  { label: "AI Project Manager", href: "/ai-project-manager" },
  { label: "GenAI Engineer", href: "/metiers-ia/genai-engineer" },
  { label: "LLM Engineer", href: "/metiers-ia/llm-engineer" },
  { label: "RAG Engineer", href: "/metiers-ia/rag-engineer" },
  { label: "AI Agent Engineer", href: "/metiers-ia/ai-agent-engineer" },
  { label: "Data Scientist", href: "/metiers-ia/data-scientist" },
  { label: "ML Engineer", href: "/metiers-ia/ml-engineer" },
  { label: "MLOps / LLMOps", href: "/metiers-ia/mlops-llmops-engineer" },
  { label: "AI Product Manager", href: "/metiers-ia/ai-product-manager" },
  { label: "AI Governance", href: "/metiers-ia/ai-governance" },
  { label: "Automatisation IA", href: "/metiers-ia/automation-engineer" }
];

const academyCoreLinks = [
  { label: "AUTONOMIA ACADEMY", href: "/academy" },
  { label: "Formation IA en entreprise", href: "/formation-ia-entreprise" },
  { label: "Formation ChatGPT entreprise", href: "/formation-chatgpt-entreprise" },
  { label: "Formation Microsoft Copilot", href: "/formation-copilot" },
  { label: "Formation IA générative", href: "/formation-ia-generative" },
  { label: "Formation AI Act", href: "/formation-ai-act" },
  { label: "Formation Agents IA", href: "/formation-agents-ia" },
  { label: "Formation Prompt Engineering", href: "/formation-prompt-engineering" }
];

export default function Home() {
  return (
    <main className="homeV11">
      <section className="homeHeroV11" id="top">
        <div className="homeHeroV11Copy">
          <p className="eyebrow">AUTONOMIA — AI EXECUTION PARTNER</p>
          <h1>Construire l’IA utile.<span>Transmettre les compétences.</span></h1>
          <p>
            Partez d’un problème réel. Autonomia mobilise les bons experts IA,
            construit la réponse utile et rend les équipes capables de l’utiliser.
          </p>

          <HomeStartEmail origin="home_hero_v11" />

          <div className="homeHeroV11Links">
            <Link href="/experts">Je cherche un expert IA →</Link>
            <Link href="/academy">Je cherche une Formation IA →</Link>
            <Link href="/solutions-ia">Je pars d’un problème concret →</Link>
          </div>
        </div>

        <aside className="homeHeroV11Choice" aria-label="Choisir un point d’entrée Autonomia">
          <small>3 PORTES D’ENTRÉE</small>
          <Link href="/experts">
            <span>01</span>
            <div><b>EXPERTS</b><strong>Construire / déployer</strong></div>
            <i>↗</i>
          </Link>
          <Link href="/academy">
            <span>02</span>
            <div><b>ACADEMY</b><strong>Former / rendre autonome</strong></div>
            <i>↗</i>
          </Link>
          <Link href="/solutions-ia">
            <span>03</span>
            <div><b>PROBLÈMES</b><strong>Partir d’une tâche réelle</strong></div>
            <i>↗</i>
          </Link>
        </aside>
      </section>

      <section className="homeOffersV11" id="experts-academy">
        <Link href="/experts" className="homeOfferV11 experts">
          <div className="homeOfferV11Top"><span>01</span><b>AUTONOMIA EXPERTS</b></div>
          <h2>Construire et déployer.</h2>
          <p>Staffing, cadrage, RAG, GenAI, Agents IA, automatisation, AI Project Management.</p>
          <div className="homeOfferStickers" aria-hidden="true">
            <span>RAG</span><span>GenAI</span><span>Agents IA</span><span>AI Project</span><span>Automation</span>
          </div>
          <strong className="homeOfferV11Cta">Explorer les experts IA ↗</strong>
        </Link>

        <Link href="/academy" className="homeOfferV11 academy">
          <div className="homeOfferV11Top"><span>02</span><b>AUTONOMIA ACADEMY</b></div>
          <h2>Former et rendre autonome.</h2>
          <p>Formations IA reliées aux métiers, aux outils et aux usages réellement attendus.</p>
          <div className="homeOfferStickers" aria-hidden="true">
            <span>ChatGPT</span><span>Copilot</span><span>Managers</span><span>AI Act</span><span>Prompt</span>
          </div>
          <strong className="homeOfferV11Cta">Explorer les Formations IA ↗</strong>
        </Link>
      </section>

      <section className="homeProblemsV11" id="problems">
        <div className="homeSectionHeadV11">
          <p className="sectionIndex">03 — PROBLÈMES PRÉCIS</p>
          <div>
            <h2>Qu’est-ce que vous voulez arrêter de faire à la main ?</h2>
            <p>Six cas pour comprendre immédiatement ce qu’AUTONOMIA peut transformer. Le catalogue complet reste accessible en un clic.</p>
          </div>
        </div>

        <div className="homeProblemsGridV11">
          {homeProblems.map((item, index) => (
            <ProblemLink
              href={"/solutions-ia/" + item.slug}
              problemSlug={item.slug}
              problemCluster={item.cluster}
              surface="home_v11_problem"
              key={item.slug}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <small>{item.cluster}</small>
              <strong>{item.title}</strong>
              <b>Voir →</b>
            </ProblemLink>
          ))}
        </div>

        <ProblemLink className="homeTextLinkV11" href="/solutions-ia" surface="home_v11_all_problems">
          Voir tous les cas d’usage IA →
        </ProblemLink>
      </section>

      <section className="homeMatchV11" id="solution-finder">
        <div className="homeMatchIntroV11">
          <p className="sectionIndex">04 — AI MATCH</p>
          <h2>Vous avez le problème.<br />On trouve la bonne réponse.</h2>
          <p>Décrivez votre besoin en une phrase. Le moteur rapproche la demande des experts IA et des Formations IA du catalogue.</p>
        </div>
        <SolutionFinder />
      </section>

      <section className="homeMethodTerritoryV11" id="methode">
        <article className="homeMethodV11">
          <p className="sectionIndex">05 — COMMENT NOUS TRAVAILLONS</p>
          <h2>Besoin → exécution → transfert.</h2>
          <div className="homeMethodStepsV11">
            <span><b>01</b><strong>Cadrer</strong><small>Le problème, les contraintes, le résultat attendu.</small></span>
            <span><b>02</b><strong>Activer</strong><small>Les bons experts, outils et workflows.</small></span>
            <span><b>03</b><strong>Transférer</strong><small>Former, documenter, rendre l’usage durable.</small></span>
          </div>
        </article>

        <article className="homeTerritoryTeaserV11">
          <p className="sectionIndex">TERRITOIRES</p>
          <h3>Collectivités & entreprises du territoire.</h3>
          <p>Programmes IA pour les agents, les processus internes et les TPE / PME locales.</p>
          <Link href="/territoires">Découvrir Autonomia Territoires →</Link>
        </article>
      </section>

      <footer className="siteFooter homeFooterV11">
        <div className="homeFooterV11Top">
          <div>
            <div className="brand footerBrand">
              <span className="brandMark" aria-hidden="true"><AutonomiaMark size={38} inverse /></span>
              <span>AUTONOMIA</span>
            </div>
            <p>Construire l’IA utile. Transmettre les compétences.</p>
          </div>

          <nav aria-label="Liens principaux">
            <Link href="/experts">Experts</Link>
            <Link href="/academy">Academy</Link>
            <Link href="/solutions-ia">Cas d’usage</Link>
            <Link href="/observatoire-ia">Observatoire</Link>
            <Link href="/territoires">Territoires</Link>
            <Link href="/start">Commencer</Link>
          </nav>
        </div>

        <div className="homeFooterIndexV11">
          <details>
            <summary>Tous les métiers & experts IA <span>+</span></summary>
            <div className="homeFooterLinksV11">
              {expertLinks.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
            </div>
          </details>

          <details>
            <summary>Toutes les Formations IA <span>+</span></summary>
            <div className="homeFooterLinksV11">
              {academyCoreLinks.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
              {academyTrainings.map((training) => (
                <Link href={"/formation-ia/" + training.slug} key={training.slug}>{training.homeTitle}</Link>
              ))}
            </div>
          </details>
        </div>

        <div className="homeFooterLegalV11">
          <span>© AUTONOMIA</span>
          <Link href="/a-propos">À propos</Link>
          <Link href="/methodologie/politique-editoriale">Politique éditoriale</Link>
        </div>
      </footer>
    </main>
  );
}
