import Link from "next/link";
import { notFound } from "next/navigation";
import { aiRoles, getAiRole, getAiRoleStaticParams } from "@/content/ai-roles";

export function generateStaticParams() {
  return getAiRoleStaticParams();
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const role = getAiRole(slug);
  if (!role) return {};
  return {
    title: role.title + " : métier, missions, compétences et cas d’usage",
    description: role.dek,
    alternates: { canonical: "/metiers-ia/" + role.slug },
    openGraph: {
      title: role.title + " — Guide métier IA | Autonomia",
      description: role.dek,
      url: "/metiers-ia/" + role.slug,
      type: "article"
    }
  };
}

function SourceList({ sources }) {
  return (
    <div className="roleSources">
      {sources.map(([label, url]) => (
        <a key={url} href={url} target="_blank" rel="noreferrer">
          <span>OFFRE / SIGNAL MARCHÉ</span>
          <strong>{label}</strong>
          <b aria-hidden="true">↗</b>
        </a>
      ))}
    </div>
  );
}

function RoleCrossLinks({ currentSlug }) {
  const others = aiRoles.filter((role) => role.slug !== currentSlug);
  return (
    <div className="roleCrossLinks">
      {others.map((role, index) => (
        <Link key={role.slug} href={"/metiers-ia/" + role.slug}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <strong>{role.title}</strong>
          <b>↗</b>
        </Link>
      ))}
    </div>
  );
}

export default async function AiRolePage({ params }) {
  const { slug } = await params;
  const role = getAiRole(slug);
  if (!role) notFound();

  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://build-autonomia.com";
  const url = base + "/metiers-ia/" + role.slug;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": url + "#article",
        headline: role.title + " : métier, missions, compétences et cas d’usage",
        description: role.dek,
        inLanguage: "fr-FR",
        mainEntityOfPage: url,
        author: { "@id": base + "#organization" },
        publisher: { "@id": base + "#organization" },
        about: {
          "@type": "Occupation",
          name: role.title,
          alternateName: role.frenchTitle,
          description: role.dek
        }
      },
      {
        "@type": "FAQPage",
        "@id": url + "#faq",
        mainEntity: role.faq.map(([question, answer]) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer }
        }))
      }
    ]
  };

  return (
    <main className="aiRolePage">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="roleHero">
        <div className="roleHeroIndex">
          <span>AUTONOMIA EXPERTS</span>
          <strong>MÉTIER IA</strong>
        </div>
        <div className="roleHeroCopy">
          <p className="eyebrow">{role.frenchTitle}</p>
          <h1>{role.title}</h1>
          <p className="roleDek">{role.dek}</p>
          <div className="roleHeroActions">
            <Link className="primaryButton" href="/#fiche-besoin">Décrire mon besoin</Link>
            <Link className="secondaryButton" href="/experts">Voir Autonomia Experts</Link>
          </div>
        </div>
      </section>

      <nav className="roleToc" aria-label="Sommaire de la page">
        <a href="#definition">Le métier</a>
        <a href="#marche">Le marché</a>
        <a href="#missions">Missions</a>
        <a href="#cycle">Cycle de travail</a>
        <a href="#cas">Cas concrets</a>
        <a href="#competences">Compétences</a>
        <a href="#faq">FAQ</a>
      </nav>

      <article className="roleArticle">
        <section className="roleSectionLong" id="definition">
          <p className="sectionIndex">01 — COMPRENDRE LE MÉTIER</p>
          <div className="roleReading">
            <h2>À quoi sert réellement un {role.title} dans une entreprise ?</h2>
            <p className="roleLead">{role.angle}</p>
            <p>
              Derrière un intitulé de poste, l’enjeu est toujours de comprendre le travail que la personne devra
              produire. Dans un projet IA, une même étiquette peut recouvrir des réalités très différentes selon
              le secteur, la maturité de l’organisation, la stack, la criticité des données ou le stade du projet.
              Autonomia lit donc le rôle comme une combinaison de responsabilités, de décisions et de livrables,
              et non comme une simple liste de technologies.
            </p>
            <p>
              Pour ce métier, la question utile n’est pas seulement « connaît-il tel framework ? ». Il faut
              regarder ce que le profil sait cadrer, construire, mesurer, expliquer et maintenir. Un bon niveau
              d’expertise se voit dans la manière de traiter les cas ambigus : information incomplète, contrainte
              de sécurité, qualité insuffisante, utilisateur qui contourne le processus, modèle qui se comporte
              différemment en production ou dépendance externe qui change. Ce sont précisément ces situations qui
              distinguent un profil capable de faire une démonstration d’un profil capable de tenir une mission.
            </p>
            <p>
              Le rôle doit également être replacé dans une équipe. Un projet IA sérieux mélange souvent produit,
              projet, data, software, infrastructure, sécurité, juridique et métiers. Le {role.title} doit savoir
              où commence sa responsabilité, où elle s’arrête et quels arbitrages doivent être confiés aux rôles
              voisins. Cette capacité à travailler dans un système collectif est aussi importante que la maîtrise
              technique ou méthodologique.
            </p>
          </div>
        </section>

        <section className="roleMarketSection" id="marche">
          <div className="roleMarketIntro">
            <p className="sectionIndex">02 — CE QUE MONTRE LE MARCHÉ</p>
            <h2>Les offres d’emploi donnent une image beaucoup plus concrète du métier.</h2>
            <p>
              Cette page est structurée à partir de signaux observables dans des offres et missions publiées en
              2026. Nous n’utilisons pas les annonces comme une vérité absolue : les intitulés varient d’une
              entreprise à l’autre. En revanche, elles permettent d’identifier les tâches, outils et attentes qui
              reviennent dans le travail réellement demandé.
            </p>
          </div>
          <div className="roleMarketSignals">
            {role.market.map((item, index) => (
              <article key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{item}</p>
              </article>
            ))}
          </div>
          <SourceList sources={role.sources} />
        </section>

        <section className="roleResponsibilities" id="missions">
          <p className="sectionIndex">03 — MISSIONS</p>
          <div className="roleReading">
            <h2>Ce que le {role.title} produit concrètement.</h2>
            <p>
              Une fiche de poste utile doit décrire des verbes d’action et des résultats observables. Voici les
              responsabilités qui structurent le plus souvent ce rôle lorsqu’il intervient sur un projet
              d’entreprise, du cadrage jusqu’au run.
            </p>
          </div>
          <ol>
            {role.responsibilities.map((item, index) => (
              <li key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{item}</p>
              </li>
            ))}
          </ol>

          <div className="roleDeliverables">
            <div>
              <p className="roleMicroTitle">LIVRABLES TYPIQUES</p>
              <p>
                Les livrables donnent une meilleure idée du niveau d’autonomie attendu. Selon la mission, un
                {role.title} peut être responsable directement de certains de ces éléments ou les produire avec
                d’autres membres de l’équipe.
              </p>
            </div>
            <div className="rolePills">
              {role.deliverables.map((item) => <span key={item}>{item}</span>)}
            </div>
          </div>
        </section>

        <section className="roleLifecycle" id="cycle">
          <div className="roleLifecycleIntro">
            <p className="sectionIndex">04 — DU CADRAGE AU RUN</p>
            <h2>Comment ce rôle intervient au fil d’un projet.</h2>
            <p>
              La valeur d’un profil change selon l’étape du projet. Un excellent spécialiste mobilisé trop tôt
              ou trop tard peut être sous-utilisé. Le bon staffing consiste donc à relier compétence et moment
              d’intervention.
            </p>
          </div>
          <div className="roleLifecycleGrid">
            {role.lifecycle.map(([title, text], index) => (
              <article key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
          <div className="roleDeepDive">
            <h3>Pourquoi cette lecture par étapes est importante</h3>
            <p>
              Une entreprise peut croire qu’elle manque d’un {role.title} alors que le blocage réel se trouve
              ailleurs. Si les données ne sont pas disponibles, si le sponsor n’a pas arbitré le périmètre, si
              l’équipe ne sait pas définir la qualité ou si la sécurité interdit l’accès nécessaire, ajouter une
              personne supplémentaire ne résout pas automatiquement le problème. La première responsabilité du
              staffing est donc de vérifier que le rôle demandé correspond bien au goulot d’étranglement.
            </p>
            <p>
              À l’inverse, certaines situations montrent très clairement qu’un spécialiste manque : décisions
              techniques prises sans évaluation, systèmes impossibles à opérer, absence de propriétaire produit,
              règles de gouvernance non définies ou workflow manuel qui mobilise un temps disproportionné. Le
              bon profil apporte alors non seulement de la capacité, mais aussi une méthode de travail et des
              critères de décision qui restent après la mission.
            </p>
          </div>
        </section>

        <section className="roleCases" id="cas">
          <div className="roleCasesIntro">
            <p className="sectionIndex">05 — CAS APPLICATIFS</p>
            <h2>Trois situations où le métier devient immédiatement concret.</h2>
            <p>
              Les cas ci-dessous ne sont pas des promesses de résultat. Ils servent à montrer le type de problème,
              de décision et de livrable qu’un {role.title} peut prendre en charge lorsqu’il est mobilisé au bon
              endroit dans l’organisation.
            </p>
          </div>
          <div className="roleCaseGrid">
            {role.cases.map((item, index) => (
              <article key={item.title}>
                <span>CAS {String(index + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
                <dl>
                  <div><dt>Contexte</dt><dd>{item.context}</dd></div>
                  <div><dt>Intervention</dt><dd>{item.action}</dd></div>
                  <div><dt>Ce que cela change</dt><dd>{item.result}</dd></div>
                </dl>
              </article>
            ))}
          </div>
          <div className="roleCaseAnalysis">
            <h3>Ce que ces cas ont en commun</h3>
            <p>
              Dans les trois situations, le métier n’est pas défini par une technologie mais par la transformation
              d’un problème flou en système de décisions explicites. Le profil doit comprendre les contraintes
              réelles, rendre les choix vérifiables et produire quelque chose que l’organisation peut reprendre.
              C’est cette logique que nous utilisons chez Autonomia pour qualifier une mission : quel est le point
              A, quel point B est recherché, quelles compétences manquent et quelles preuves permettront de savoir
              que le travail avance dans la bonne direction.
            </p>
          </div>
        </section>

        <section className="roleSkills" id="competences">
          <div className="roleSkillsIntro">
            <p className="sectionIndex">06 — COMPÉTENCES & ENVIRONNEMENT</p>
            <h2>La stack compte. Le jugement professionnel compte davantage.</h2>
            <p>
              Les outils changent vite. Nous les utilisons comme signaux de contexte, pas comme substitut à
              l’expérience. Un profil senior sait généralement transférer ses principes d’un framework à l’autre
              parce qu’il comprend les mécanismes sous-jacents.
            </p>
          </div>
          <div className="roleStack">
            {role.stack.map((item) => <span key={item}>{item}</span>)}
          </div>

          <div className="roleBoundary">
            <p className="roleMicroTitle">FRONTIÈRE AVEC LES MÉTIERS VOISINS</p>
            <h3>Un intitulé ne suffit pas pour staffer correctement.</h3>
            <p>{role.boundaries}</p>
            <p>
              C’est pourquoi un brief Autonomia ne se limite pas à « nous cherchons un {role.title} ». Nous
              regardons ce que la personne devra décider seule, ce qu’elle devra construire, qui seront ses
              interlocuteurs, quelles contraintes existent déjà et quel niveau de transfert est attendu. Deux
              missions portant le même intitulé peuvent ainsi nécessiter des profils très différents.
            </p>
          </div>
        </section>

        <section className="roleQuestions">
          <div>
            <p className="sectionIndex">07 — QUESTIONS DE CADRAGE</p>
            <h2>Les questions à poser avant de chercher un profil.</h2>
            <p>
              Une bonne recherche commence par un meilleur brief. Ces questions permettent de révéler les
              compétences réellement nécessaires et d’éviter de sur-spécifier une stack alors que le besoin
              n’est pas encore clair.
            </p>
          </div>
          <ol>
            {role.questions.map((question, index) => (
              <li key={question}><span>{String(index + 1).padStart(2, "0")}</span><strong>{question}</strong></li>
            ))}
          </ol>
        </section>

        <section className="roleStaffing">
          <p className="sectionIndex">08 — STAFFING AUTONOMIA</p>
          <div className="roleReading">
            <h2>Quand chercher ce profil — et quand chercher autre chose.</h2>
            <p>
              Le réflexe classique consiste à partir d’un intitulé. Nous préférons partir du blocage. Si le besoin
              est encore flou, une courte phase de cadrage peut éviter plusieurs semaines de sourcing sur le mauvais
              rôle. Si le rôle est clair, le brief doit préciser niveau d’autonomie, contexte technique, parties
              prenantes, livrables attendus et contraintes de disponibilité.
            </p>
            <p>
              Le niveau de séniorité ne doit pas être résumé en années d’expérience. Sur des métiers récents comme
              {role.title}, la profondeur vient souvent de la capacité à avoir déjà rencontré plusieurs types
              d’échecs : données insuffisantes, architecture surdimensionnée, qualité non mesurée, intégration
              fragile, adoption faible, coûts qui dérivent ou responsabilités mal définies. Un profil expérimenté
              reconnaît ces signaux tôt et sait réduire le risque avant qu’il devienne un incident.
            </p>
            <p>
              Enfin, le besoin peut être temporaire. Une expertise pointue peut être mobilisée quelques semaines
              pour cadrer ou débloquer un chantier puis transférée à l’équipe interne. Dans d’autres cas, le rôle
              doit devenir permanent car il porte un produit ou une plateforme durable. Le bon dispositif dépend
              donc autant de la trajectoire de l’organisation que de la compétence recherchée aujourd’hui.
            </p>
            <Link className="primaryButton" href="/#fiche-besoin">
              Décrire mon besoin de {role.title}
            </Link>
          </div>
        </section>

        <section className="roleFaq" id="faq">
          <p className="sectionIndex">09 — FAQ</p>
          <div>
            <h2>Questions fréquentes sur le métier de {role.title}.</h2>
            <div className="faqList">
              {role.faq.map(([question, answer]) => (
                <details key={question}>
                  <summary>{question}</summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="roleSourcesMethod">
          <p className="sectionIndex">10 — MÉTHODE ÉDITORIALE</p>
          <div className="roleReading">
            <h2>Pourquoi nous nous appuyons sur les offres d’emploi.</h2>
            <p>
              Les métiers IA évoluent rapidement et les intitulés ne sont pas normalisés. Pour éviter des pages
              purement théoriques, nous confrontons la description du rôle à des offres et missions récentes.
              Nous regardons les responsabilités récurrentes, les stacks réellement demandées, les livrables et
              les interfaces avec les autres fonctions. Les exemples sont ensuite reformulés : nous ne reproduisons
              pas les annonces et nous ne présentons pas une entreprise ou une offre particulière comme une norme.
            </p>
            <p>
              Cette méthode a une autre utilité : distinguer l’effet de mode de la demande opérationnelle. Quand
              plusieurs offres différentes convergent vers évaluation, observabilité, industrialisation,
              gouvernance ou orchestration, cela signale une compétence réellement utilisée dans les équipes. À
              l’inverse, un mot-clé très visible mais rarement relié à un livrable concret doit être traité avec
              prudence.
            </p>
            <SourceList sources={role.sources} />
          </div>
        </section>

        <section className="roleExplore">
          <div>
            <p className="sectionIndex">11 — MÉTIERS VOISINS</p>
            <h2>Explorer les autres compétences IA.</h2>
            <p>Un projet mobilise rarement un seul rôle. Comparez les frontières avant de figer votre brief.</p>
          </div>
          <RoleCrossLinks currentSlug={role.slug} />
        </section>
      </article>
    </main>
  );
}

export const dynamicParams = false;
