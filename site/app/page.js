import Link from "next/link";
import SolutionFinder from "@/components/SolutionFinder";
import HomeStartEmail from "@/components/HomeStartEmail";
import { academyTrainings } from "@/content/academy-trainings";

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
            <span className="homeHeroPrimaryLineV15">Accélérer l’adoption de l’IA.</span>
            <span>Transformer les usages en performance.</span>
          </h1>

          <div className="homeHeroMinimalBottomV14">
            <p className="homeHeroMinimalLeadV13">
              Autonomia accompagne les organisations de bout en bout : trouver les bonnes compétences,
              construire les solutions IA utiles et former les équipes pour les intégrer réellement dans leur travail.
            </p>

            <div className="homeHeroMinimalStartV13">
              <HomeStartEmail origin="home_hero" compact />
            </div>
          </div>


        </div>
      </section>

      <section className="homeExecutionChainV12" id="experts-academy">
        <div className="homeExecutionRailV12">
          <article className="executionPillarV12 experts">
            <div className="executionPillarHeadV12">
              <span>01</span>
              <div><small>TROUVER</small><b>AUTONOMIA EXPERTS</b></div>
            </div>
            <h3>Les bonnes compétences IA, au bon moment, pour le bon besoin.</h3>
            <p>Nous trouvons et mobilisons les profils capables de cadrer, construire, intégrer et piloter vos projets IA.</p>
            <div className="executionStickerCloudV12 executionStickerCloudRichV25" aria-hidden="true">
              <span>AI Engineers</span><span>Data Scientists</span><span>Automation Experts</span><span>AI Project Managers</span><span>RAG</span><span>Agents IA</span><span>AI Product</span><span>GEO / AEO</span><span>MLOps / LLMOps</span><span>Data Engineers</span><span>AI Governance</span>
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
            <div className="executionStickerCloudV12 executionStickerCloudRichV25">
              <span>Agents IA</span><span>RAG</span><span>Automatisation</span><span>Workflows</span><span>Assistants métier</span><span>Reporting</span><span>Traitement e-mails</span><span>Qualification leads</span><span>Documents</span><span>Mini-apps</span><span>Outils internes</span><span>Intégrations</span>
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
            <div className="executionStickerCloudV12 executionStickerCloudRichV25" aria-hidden="true">
              <span>Cas d’usage métier</span><span>ChatGPT & Copilot</span><span>Agents IA</span><span>Automatisation</span><span>Prompting</span><span>Managers</span><span>AI Act</span><span>Adoption</span><span>Ateliers métier</span><span>Intra</span><span>Inter</span>
            </div>
            <Link href="/academy" className="executionPillarCtaV12">Voir les Formations IA →</Link>
          </article>
        </div>


      </section>

      <section className="referenceSection referenceSectionHome" aria-label="Références des équipes Autonomia">
        <div className="referenceIntro referenceIntroCompact">
          <p className="sectionIndex">NOS RÉFÉRENCES</p>
          <div>
            <h2>L’expérience derrière AUTONOMIA.</h2>
            <p>
              Entreprises, collectivités, écoles et universités : des expériences acquises par les dirigeants
              et structures qui portent aujourd’hui AUTONOMIA.
            </p>
          </div>
        </div>

        <div className="referenceGridPremium">
          <div className="referenceGridGroup">
            <small>ENTREPRISES & MARQUES</small>
            <div className="referenceGrid">
              {[
                { type:"logo", name:"Air France Industries", src:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Air%20France%20Logo.svg" },
                { type:"word", name:"BNP PARIBAS" },
                { type:"logo", name:"Symrise", src:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Symrise%20wordmark%20logo.svg" },
                { type:"word", name:"KRYS" },
                { type:"logo", name:"WESCO", src:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Wesco%20International%20logo.svg" },
                { type:"logo", name:"Westcon", src:"https://commons.wikimedia.org/wiki/Special:Redirect/file/WESTCON%20GROUP%20LOGO.png" },
                { type:"word", name:"ATLAND" },
                { type:"word", name:"OZITEM" },
                { type:"logo", name:"Mercure", src:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Mercure%20Hotels%20Logo%20neu.svg" },
                { type:"logo", name:"Novotel", src:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Novotel%20logo%20%282016%29.svg" },
                { type:"logo", name:"Franprix", src:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Logo%20Franprix%20-%202015.svg" },
                { type:"word", name:"TILLI" }
              ].map((item) => item.type === "logo" ? (
                <span className="referencePremiumLogo" key={item.name} title={item.name}>
                  <img src={item.src} alt={item.name} loading="lazy" />
                </span>
              ) : (
                <span className={"referencePremiumWord referencePremiumWord-" + item.name.toLowerCase().replaceAll(" ","-")} key={item.name}>{item.name}</span>
              ))}
            </div>
          </div>

          <div className="referenceGridGroup">
            <small>COLLECTIVITÉS & INSTITUTIONS</small>
            <div className="referenceGrid referenceGridPublic">
              {[
                { name:"CNFPT", src:"https://www.cnfpt.fr/assets/images/logo.svg" },
                { name:"Région Auvergne-Rhône-Alpes", src:"https://www.auvergnerhonealpes.fr/themes/custom/aura_region_theme/logo.svg" },
                { name:"Département des Hauts-de-Seine", src:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Hauts-de-Seine%20%2892%29.svg" },
                { name:"Département de la Seine-Saint-Denis", src:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Logo_Seine_Saint_Denis.svg" },
                { name:"Département de l’Essonne", src:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Logo%20d%C3%A9partement%20Essonne%20version%20fond%20bleu%20horizontale%20%28LogoCD%202022%20horizontal%20bleu%20TA%29.png" },
                { name:"Département du Rhône", src:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Logo%20D%C3%A9partement%20Rh%C3%B4ne.svg" },
                { name:"Département de la Haute-Savoie", src:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Logo%20Haute%20Savoie%202015.svg" },
                { name:"Ville de Lyon", src:"https://www.polville.lyon.fr/file/188" },
                { name:"Ville de Versailles", src:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Logo%20Ville%20Versailles%20-%202012.svg" },
                { name:"Ville de Bobigny", src:"https://www.bobigny.fr/fileadmin/Minisites/principal/logo-blu.png" },
                { name:"Ville de Clichy", src:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Logo%20Clichy-la-Garenne.svg" },
                { name:"Roumois Seine", src:"https://www.roumoiseine.fr/wp-content/themes/roumois-seine/assets/images/logo-site.png" },
                { name:"Grand Dole", src:"https://www.grand-dole.fr/fileadmin/template/granddole/img/logo-grand-dole.png" },
                { name:"CCI Essonne", src:"https://www.essonne.cci.fr/themes/custom/cspw_theme/medias/Logo_CCI_Essonne.svg" }
              ].map((item) => (
                <span className={"referencePremiumLogo referencePremiumLogoPublic " + (item.name === "Roumois Seine" ? "referencePremiumLogoRoumois" : "")} key={item.name} title={item.name}>
                  <img src={item.src} alt={item.name} loading="lazy" />
                </span>
              ))}
            </div>
          </div>

          <div className="referenceGridGroup referenceGridSchools">
            <small>ÉCOLES & UNIVERSITÉS</small>
            <div className="referenceGrid referenceGridEducation">
              {[
                { name:"UPEC", src:"https://commons.wikimedia.org/wiki/Special:Redirect/file/UPEC-logo.svg" },
                { name:"EDC Paris Business School", src:"https://commons.wikimedia.org/wiki/Special:Redirect/file/EDC%20Paris%20Business%20School%20logo.svg" },
                { name:"Pigier", src:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Logo%20Pigier%20Wiki.jpg" },
                { name:"Efrei", src:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Efrei%20Logo%202026.svg" }
              ].map((item) => (
                <span className="referencePremiumLogo referencePremiumLogoSchool" key={item.name} title={item.name}>
                  <img src={item.src} alt={item.name} loading="lazy" />
                </span>
              ))}
              <span className="referencePremiumWord education escgFallback" title="ESCG Paris">ESCG</span>
            </div>
          </div>
        </div>

        <div className="referenceActions referenceActionsCompact">
          <Link className="secondaryButton" href="/a-propos">Découvrir l’expérience du collectif →</Link>
        </div>
      </section>

      <section className="homeSolutionMatch" id="solution-finder">
        <div className="homeSolutionMatchIntro">
          <h2>Vous avez le problème, mais pas encore le bon expert, la bonne solution ou la bonne formation ?</h2>
          <p>Décrivez le besoin en langage naturel. Autonomia rapproche la demande des trois leviers : EXPERTS, BUILD et ACADEMY.</p>
        </div>
        <SolutionFinder />
      </section>

      <section className="roleSection homeRoleDirectory">
        <div className="sectionHeading">
          <div className="homeRoleIntroV20">
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
          <div className="homeAcademyIntroV21">
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





      <section className="territoryHomePromo homeTerritoryCompact homeTerritoryV10">
        <div>
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

    </main>
  );
}
